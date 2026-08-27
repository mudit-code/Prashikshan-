const pool = require("../config/db");

// Get all State Admins
exports.getStateAdmins = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT r.id, r.email, sa.first_name, sa.last_name, sa.state, sa.status, r.create_time
       FROM state_admin sa
       JOIN register r ON sa.id = r.id
       ORDER BY r.create_time DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching state admins:", error);
    res.status(500).json({ error: "Failed to fetch state admins" });
  }
};

// Update State Admin Status
exports.updateStateAdminStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['pending', 'approved', 'rejected'].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  try {
    const result = await pool.query(
      "UPDATE state_admin SET status = $1 WHERE id = $2 RETURNING *",
      [status, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "State admin not found" });
    }

    res.json({ message: `State admin status updated to ${status}`, data: result.rows[0] });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ error: "Failed to update status" });
  }
};

// Get System Stats
exports.getSystemStats = async (req, res) => {
  try {
    const studentsCount = await pool.query("SELECT COUNT(*) FROM students");
    const employersCount = await pool.query("SELECT COUNT(*) FROM employer");
    const collegesCount = await pool.query("SELECT COUNT(*) FROM college");
    const stateAdminsCount = await pool.query("SELECT COUNT(*) FROM state_admin");

    res.json({
      students: parseInt(studentsCount.rows[0].count),
      employers: parseInt(employersCount.rows[0].count),
      colleges: parseInt(collegesCount.rows[0].count),
      stateAdmins: parseInt(stateAdminsCount.rows[0].count)
    });
  } catch (error) {
    console.error("Error fetching system stats:", error);
    res.status(500).json({ error: "Failed to fetch system stats" });
  }
};

// Get All Students
exports.getStudents = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT r.id, r.email, s.first_name, s.last_name, s.college_name, s.status, r.create_time
       FROM students s
       JOIN register r ON s.id = r.id
       ORDER BY r.create_time DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ error: "Failed to fetch students" });
  }
};

// Get All Employers
exports.getEmployers = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT r.id, r.email, e.first_name, e.last_name, e.company_name, r.create_time
       FROM employer e
       JOIN register r ON e.id = r.id
       ORDER BY r.create_time DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching employers:", error);
    res.status(500).json({ error: "Failed to fetch employers" });
  }
};

// Get All Colleges
exports.getColleges = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT c.id, c.college_name, c.branch, c.location
       FROM college c
       ORDER BY c.id DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching colleges:", error);
    res.status(500).json({ error: "Failed to fetch colleges" });
  }
};
