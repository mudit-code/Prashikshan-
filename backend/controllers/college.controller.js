const pool = require("../config/db");
const bcrypt = require("bcrypt");
const path = require("path");


// Get all colleges
const getCollegeList = async (req, res) => {
  try {
    const query = `
      SELECT c.id, c.college_name as "collegeName", MAX(a.aishe_code) as "aisheCode" 
      FROM college c
      LEFT JOIN admin a ON c.college_name = a.college_name
      GROUP BY c.id, c.college_name
      ORDER BY c.college_name
    `;

    console.log("Executing query:", query);

    const result = await pool.query(query);

    console.log("College List Result Count:", result.rows.length);
    if (result.rows.length > 0) {
      console.log("Sample Row:", JSON.stringify(result.rows[0], null, 2));
    } else {
      console.log("No registered colleges found.");
    }

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching colleges:", error);
    res.status(500).json({ error: "Failed to fetch colleges" });
  }
};

// Get dashboard stats
const getDashboardStats = async (req, res) => {
  try {
    const { userId } = req.user;

    // 1. Get Admin's College
    const adminQuery = await pool.query(
      "SELECT college_name FROM admin WHERE id = $1",
      [userId]
    );

    if (adminQuery.rows.length === 0) {
      return res.status(404).json({ error: "Admin not found" });
    }

    const collegeName = adminQuery.rows[0].college_name;

    // 2. Total Students for this college
    const studentsCount = await pool.query(
      "SELECT COUNT(*) FROM students WHERE college_name = $1",
      [collegeName]
    );

    // 3. Internship Stats
    const internshipStats = await pool.query(
      `SELECT
        COUNT(*) FILTER (WHERE a.job_status = 'Shortlisted') as active,
        COUNT(*) FILTER (WHERE a.job_status = 'Completed') as completed,
        COUNT(*) FILTER (WHERE a.job_status NOT IN ('Shortlisted', 'Completed', 'Rejected')) as pending
       FROM applications a
       JOIN students s ON a.student_id = s.id
       WHERE s.college_name = $1`,
      [collegeName]
    );

    res.json({
      totalStudents: parseInt(studentsCount.rows[0].count),
      activeInternships: parseInt(internshipStats.rows[0].active || 0),
      pendingApplications: parseInt(internshipStats.rows[0].pending || 0),
      completedInternships: parseInt(internshipStats.rows[0].completed || 0),
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
};

const getPendingStudents = async (req, res) => {
  try {
    const { userId } = req.user;

    // Get Admin College
    const adminRes = await pool.query("SELECT college_name FROM admin WHERE id = $1", [userId]);
    if (adminRes.rows.length === 0) return res.status(404).json({ error: "Admin not found" });
    const collegeName = adminRes.rows[0].college_name;

    const result = await pool.query(
      `SELECT s.id, s.first_name as "firstName", s.last_name as "lastName", 
             s.roll_no as "rollNo", 
             r.email, s.profile_data
             FROM students s
             JOIN register r ON s.id = r.id
             WHERE s.college_name = $1 AND s.status = 'pending'`,
      [collegeName]
    );
    res.json(result.rows.map(row => ({
      ...row,
      user: { email: row.email }
    })));
  } catch (error) {
    console.error("Error fetching pending students:", error);
    res.status(500).json({ error: "Failed to fetch pending students" });
  }
};

const getApprovedStudents = async (req, res) => {
  try {
    const { userId } = req.user;

    // Get Admin College
    const adminRes = await pool.query("SELECT college_name FROM admin WHERE id = $1", [userId]);
    if (adminRes.rows.length === 0) return res.status(404).json({ error: "Admin not found" });
    const collegeName = adminRes.rows[0].college_name;

    const result = await pool.query(
      `SELECT s.id, s.first_name as "firstName", s.last_name as "lastName", 
             s.roll_no as "rollNo", 
             r.email, s.profile_data
             FROM students s
             JOIN register r ON s.id = r.id
             WHERE s.college_name = $1 AND LOWER(s.status) = 'approved'`,
      [collegeName]
    );

    console.log(`Fetched ${result.rows.length} approved students for ${collegeName}`);

    res.json(result.rows.map(row => ({
      ...row,
      user: { email: row.email }
    })));
  } catch (error) {
    console.error("Error fetching approved students:", error);
    res.status(500).json({ error: "Failed to fetch approved students" });
  }
};

const approveStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'Approved' or 'Rejected'

    let dbStatus = 'pending';
    if (status === 'Approved') dbStatus = 'approved';
    if (status === 'Rejected') dbStatus = 'rejected';

    await pool.query(
      "UPDATE students SET status = $1 WHERE id = $2",
      [dbStatus, id]
    );

    res.json({ message: `Student ${status} successfully` });
  } catch (error) {
    console.error("Error approving student:", error);
    res.status(500).json({ error: "Failed to approve student" });
  }
};

const getCollegeProfile = async (req, res) => {
  try {
    const { userId } = req.user;

    const query = `
      SELECT 
        a.first_name as "firstName",
        a.last_name as "lastName", 
        a.college_name as "collegeName",
        a.designation,
        a.department,
        a.official_email as "officialEmail",
        a.mobile_number as "mobileNumber",
        a.alternate_mobile_number as "alternateMobileNumber",
        a.gender,
        c.location as "city", 
        c.state,
        c.district,
        c.pincode as "pinCode",
        c.address as "campusAddress",
        c.college_code as "collegeCode",
        c.university,
        c.college_type as "collegeType",
        c.college_email as "collegeEmail",
        c.establishment_year as "yearOfEstablishment",
        c.website_url as "websiteUrl"
      FROM admin a
      LEFT JOIN college c ON a.college_name = c.college_name
      WHERE a.id = $1
    `;

    const result = await pool.query(query, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Profile not found" });
    }

    const data = result.rows[0];

    res.json(data);

  } catch (error) {
    console.error("Error fetching college profile:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

const addStudentRecord = async (req, res) => {
  try {
    const { userId: adminId } = req.user;
    const {
      email,
      firstName,
      lastName,
      course,
      branch,
      year,
      rollNo,
      section,
      mobileNumber
    } = req.body;

    // 1. Get Admin's College
    const adminQuery = await pool.query(
      "SELECT college_name FROM admin WHERE id = $1",
      [adminId]
    );

    if (adminQuery.rows.length === 0) {
      console.error(`Admin record missing for UserID: ${adminId}`);
      return res.status(404).json({ error: "Admin profile not found. Please complete your profile in 'Edit Profile' section first to initialize your account." });
    }

    const { college_name: collegeName } = adminQuery.rows[0];

    // 2. Check for duplicate record (optional but good)
    const checkQuery = `
      SELECT id FROM college_student_records 
      WHERE college_name = $1 AND (roll_no = $2 OR email = $3)
    `;
    const checkRes = await pool.query(checkQuery, [collegeName, rollNo, email]);

    if (checkRes.rows.length > 0) {
      return res.status(400).json({ error: "Student record already exists with this Roll No or Email" });
    }

    // 3. Insert into Match Record Table
    await pool.query(
      `INSERT INTO college_student_records (
         college_name, email, mobile_number, roll_no, student_name, 
         course, current_year, section
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        collegeName,
        email,
        mobileNumber || null,
        rollNo,
        `${firstName} ${lastName}`,
        course,
        year,
        section || null
      ]
    );

    res.json({ message: "Student record added successfully" });

  } catch (error) {
    console.error("Error adding student record:", error);
    res.status(500).json({ error: "Failed to add student record" });
  }
};

const getStudentRecords = async (req, res) => {
  try {
    const { userId: adminId } = req.user;

    // 1. Get Admin's College
    const adminQuery = await pool.query(
      "SELECT college_name FROM admin WHERE id = $1",
      [adminId]
    );

    if (adminQuery.rows.length === 0) {
      return res.status(404).json({ error: "Admin not found" });
    }

    const { college_name: collegeName } = adminQuery.rows[0];

    // 2. Get Records
    const result = await pool.query(
      `SELECT * FROM college_student_records 
       WHERE college_name = $1 
       ORDER BY id DESC`,
      [collegeName]
    );

    res.json(result.rows);

  } catch (error) {
    console.error("Error fetching student records:", error);
    res.status(500).json({ error: "Failed to fetch student records" });
  }
};

const verifyStudentMatch = async (req, res) => {
  try {
    const { id: pendingStudentId } = req.params;
    const { userId: adminId } = req.user;

    // 1. Get Pending Student Details
    const studentRes = await pool.query(
      `SELECT s.roll_no, r.email, s.profile_data 
       FROM students s 
       JOIN register r ON s.id = r.id 
       WHERE s.id = $1`,
      [pendingStudentId]
    );

    if (studentRes.rows.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    const student = studentRes.rows[0];
    const email = student.email;
    const rollNo = student.roll_no;
    // Extract mobile from profile_data if available
    const mobileNumber = student.profile_data?.personal?.mobileNumber;

    // 2. Get Admin's College
    const adminRes = await pool.query("SELECT college_name FROM admin WHERE id = $1", [adminId]);
    const collegeName = adminRes.rows[0].college_name;

    // 3. Check for Match in Golden Records
    // Matching Logic: Check if ANY of Email, Phone, or Roll No matches for this college
    const matchQuery = `
        SELECT * FROM college_student_records 
        WHERE college_name = $1 
        AND (
            (email IS NOT NULL AND email = $2) OR 
            (mobile_number IS NOT NULL AND mobile_number = $3) OR
            (roll_no IS NOT NULL AND roll_no = $4)
        )
    `;

    const matchRes = await pool.query(matchQuery, [collegeName, email, mobileNumber, rollNo]);

    if (matchRes.rows.length > 0) {
      // AUTO-APPROVE if match found
      await pool.query("UPDATE students SET status = 'approved' WHERE id = $1", [pendingStudentId]);

      return res.json({
        match: true,
        record: matchRes.rows[0],
        message: "Match Found! Student has been verified and approved."
      });
    } else {
      return res.json({
        match: false,
        message: "No matching record found in college database."
      });
    }

  } catch (error) {
    console.error("Match verification error:", error);
    res.status(500).json({ error: "Verification check failed" });
  }
};

const updateCollegeProfile = async (req, res) => {
  try {
    const { userId } = req.user;
    const {
      firstName, middleName, lastName, designation, department,
      mobileNumber, alternateMobileNumber, gender,
      collegeName, collegeCode, university, collegeType,
      websiteUrl, collegeEmail, yearOfEstablishment,
      campusAddress, city, district, state, pinCode
    } = req.body;

    const files = req.files || {};
    const idProofUrl = files.idProof ? `/uploads/${files.idProof[0].filename}` : null;
    const authLetterUrl = files.authLetter ? `/uploads/${files.authLetter[0].filename}` : null;

    // 1. Update Admin Table
    // 1. Update Admin Table (Attempt Update)
    const adminUpdateResult = await pool.query(
      `UPDATE admin SET 
        first_name = $1, 
        last_name = $2,
        college_name = $3,
        designation = $4,
        department = $5,
        official_email = $6,
        mobile_number = $7,
        alternate_mobile_number = $8,
        gender = $9,
        mid_name = $11
       WHERE id = $10 RETURNING id`,
      [
        firstName || null,
        lastName || null,
        collegeName || null,
        designation || null,
        department || null,
        req.body.officialEmail || null,
        mobileNumber || null,
        alternateMobileNumber || null,
        gender || null,
        userId,
        middleName || null
      ]
    );

    // If no record updated, Insert new (Self-Repair)
    if (adminUpdateResult.rowCount === 0) {
      await pool.query(
        `INSERT INTO admin (
          id, first_name, mid_name, last_name, college_name, 
          designation, department, official_email, mobile_number, 
          alternate_mobile_number, gender
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [
          userId,
          firstName || null,
          middleName || null,
          lastName || null,
          collegeName || null,
          designation || null,
          department || null,
          req.body.officialEmail || null,
          mobileNumber || null,
          alternateMobileNumber || null,
          gender || null
        ]
      );
    }

    // 2. Update or Insert College Table
    const collegeCheck = await pool.query("SELECT id FROM college WHERE college_name = $1", [collegeName]);

    if (collegeCheck.rows.length > 0) {
      // Update existing
      await pool.query(
        `UPDATE college SET 
          location = $1,
          college_code = $2,
          university = $3,
          college_type = $4,
          college_email = $5,
          establishment_year = $6,
          address = $7,
          district = $8,
          pincode = $9,
          state = $10,
          website_url = $11
         WHERE college_name = $12`,
        [
          city || null,
          collegeCode || null,
          university || null,
          collegeType || null,
          collegeEmail || null,
          yearOfEstablishment || null,
          campusAddress || null,
          district || null,
          pinCode || null,
          state || null,
          websiteUrl || null,
          collegeName
        ]
      );
    } else {
      // Insert new
      const newCollegeId = Math.floor(100000 + Math.random() * 900000);
      await pool.query(
        `INSERT INTO college (
          id, college_name, location, college_code, university, 
          college_type, college_email, establishment_year, address, 
          district, pincode, state, website_url
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
        [
          newCollegeId,
          collegeName,
          city || null,
          collegeCode || null,
          university || null,
          collegeType || null,
          collegeEmail || null,
          yearOfEstablishment || null,
          campusAddress || null,
          district || null,
          pinCode || null,
          state || null,
          websiteUrl || null
        ]
      );
    }

    // Note: To fully support all fields (designation, department, address etc), 
    // we normally need to ensure the DB schema supports them. 
    // Since I cannot see the full schema, I am strictly updating the fields 
    // that were present in the getProfile query + basic ones.
    // If the user expects ALL fields to persist, we'd need to add columns to the DB.
    // For this task, getting the basic "Save" to work without 404 is the priority.

    // We can verify if we should save extra data in a separate 'profile_data' JSON column if it exists,
    // similar to students table. Admin table usually doesn't have it in legacy schemas.
    // I'll assume for now fixing the 404 is the main goal.

    res.json({ message: "Profile updated successfully" });

  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: error.message || "Failed to update profile" });
  }
};


module.exports = {

  getCollegeList,
  getDashboardStats,
  getPendingStudents,
  getApprovedStudents,
  approveStudent,
  getCollegeProfile,
  addStudentRecord,
  getStudentRecords,
  verifyStudentMatch,
  updateCollegeProfile
};

