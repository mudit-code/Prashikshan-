const pool = require("../config/db");

// GET /profile
exports.getProfile = async (req, res) => {
  try {
    const { userId } = req.user; // from authMiddleware

    const query = `
      SELECT s.*, r.email 
      FROM students s
      JOIN register r ON s.id = r.id
      WHERE s.id = $1
    `;

    const result = await pool.query(query, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Student profile not found" });
    }

    // Map response to match frontend expectations
    const row = result.rows[0];
    res.json({
      id: row.id,
      firstName: row.first_name,
      lastName: row.last_name,
      collegeName: row.college_name,
      collegeId: row.college_id,
      email: row.email,
      approvalStatus: row.status ? row.status.charAt(0).toUpperCase() + row.status.slice(1) : null, // Map status to visible approvalStatus
      profile: row.profile_data // Return full profile data if needed
    });

  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// GET /applications/summary/:studentId
exports.getApplicationSummary = async (req, res) => {
  const { studentId } = req.params;

  if (!studentId) {
    return res.status(400).json({ error: "studentId is required" });
  }

  try {
    const query = `
      SELECT 
        COUNT(*) FILTER (WHERE student_id = $1) AS total_applications,
        COUNT(*) FILTER (WHERE student_id = $1 AND job_status = 'Shortlisted') AS active_internships,
        COUNT(*) FILTER (WHERE student_id = $1 AND job_status IN ('Completed', 'Rejected')) AS completed_internships
      FROM applications;
    `;

    const result = await pool.query(query, [studentId]);

    const row = result.rows[0];

    return res.status(200).json({
      total_applications: Number(row.total_applications),
      active_internships: Number(row.active_internships),
      completed_internships: Number(row.completed_internships)
    });

  } catch (err) {
    console.error("Error fetching summary:", err);
    return res.status(500).json({ error: "Failed to fetch summary" });
  }
};




// GET /jobs/eligible/:studentId
exports.getEligibleJobs = async (req, res) => {
  const { studentId } = req.params;

  if (!studentId) {
    return res.status(400).json({ error: "studentId is required" });
  }

  try {
    const query = `
      SELECT j.*
      FROM jobs j
      JOIN students s ON s.id = $1
      WHERE 
          s.college_id = ANY(j.college_ids)
          OR 0 = ANY(j.college_ids)
      ORDER BY j.id DESC;
    `;

    const result = await pool.query(query, [studentId]);

    return res.status(200).json({
      count: result.rows.length,
      jobs: result.rows
    });

  } catch (err) {
    console.error("Error fetching eligible jobs:", err);
    return res.status(500).json({ error: "Failed to fetch eligible jobs" });
  }
};




// GET /applications/details/:studentId
exports.getStudentApplicationsWithJobs = async (req, res) => {
  const { studentId } = req.params;

  if (!studentId) {
    return res.status(400).json({ error: "studentId is required" });
  }

  try {
    const query = `
      SELECT 
        a.id AS application_id,
        a.job_status,
        a.college_id,
        a.job_id,

        -- Job fields
        j.company_name,
        j.internship_title,
        j.work_mode,
        j.location_city,
        j.duration,
        j.stipend_type,
        j.amount,
        j.short_description,
        j.eligibility_criteria,
        j.key_skills,
        j.date_of_begining,
        j.fill_by

      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      WHERE a.student_id = $1
      ORDER BY a.id DESC;
    `;

    const result = await pool.query(query, [studentId]);

    return res.status(200).json({
      count: result.rows.length,
      applications: result.rows
    });

  } catch (err) {
    console.error("Error fetching applications with jobs:", err);
    return res.status(500).json({ error: "Failed to fetch application details" });
  }
};

// Link College (Student Side)
exports.linkCollege = async (req, res) => {
  console.log("Link College Request Body:", req.body);
  console.log("Link College File:", req.file);

  try {
    const { userId } = req.user;
    const { collegeId, rollNo, course, branch, year, section, collegeEmail } = req.body;

    // Check if file is uploaded
    if (!req.file) {
      return res.status(400).json({ error: "College ID Card is required" });
    }

    const idCardUrl = `/uploads/${req.file.filename}`;

    // Get College Name from ID
    const collegeRes = await pool.query("SELECT college_name FROM college WHERE id = $1", [collegeId]);
    if (collegeRes.rows.length === 0) {
      return res.status(404).json({ error: "College not found" });
    }
    const collegeName = collegeRes.rows[0].college_name;

    // Construct profile data
    const profileData = {
      course,
      branch,
      year,
      section,
      collegeEmail,
      idCardUrl
    };

    // Update Student Record
    await pool.query(
      `UPDATE students 
       SET college_id = $1, 
           college_name = $2, 
           roll_no = $3, 
           status = 'pending',
           profile_data = $4
       WHERE id = $5`,
      [collegeId, collegeName, rollNo, profileData, userId]
    );

    res.json({ message: "Verification request submitted successfully" });

  } catch (err) {
    console.error("Link College Error:", err);
    res.status(500).json({ error: "Failed to submit verification request" });
  }
};
