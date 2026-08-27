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
