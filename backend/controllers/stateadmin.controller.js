const pool = require("../config/db");

// Get System Stats for State Admin (MVP: returning overall stats for now, or filtered if possible)
exports.getDashboardStats = async (req, res) => {
  try {
    const studentsCount = await pool.query("SELECT COUNT(*) FROM students");
    const collegesCount = await pool.query("SELECT COUNT(*) FROM college");
    const internshipsCount = await pool.query("SELECT COUNT(*) FROM internships WHERE status = 'active'");

    res.json({
      students: parseInt(studentsCount.rows[0].count),
      colleges: parseInt(collegesCount.rows[0].count),
      activeInternships: parseInt(internshipsCount.rows[0].count)
    });
  } catch (error) {
    console.error("Error fetching state admin stats:", error);
    res.status(500).json({ error: "Failed to fetch stats" });
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
