const pool = require("../config/db");

const ROLE_MAP = {
  1: "Student",
  2: "Faculty",
  3: "Admin",
  4: "Employer",
};

exports.getUserProfile = async (req, res) => {
  const { userId } = req.params;

  try {
    const regQuery = `SELECT id, email, role, create_time FROM register WHERE id = $1`;
    const regResult = await pool.query(regQuery, [userId]);

    if (regResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = regResult.rows[0];

    // 🔥 FIX: Convert role to number
    const roleId = Number(user.role);

    const roleName = ROLE_MAP[roleId];
    console.log("typeof role:", typeof roleId, "value:", roleId);

    if (!roleName) {
      return res.status(400).json({ error: "Invalid role ID in register table" });
    }

    let roleQuery = "";

    switch (roleId) {
      case 1:
        roleQuery = `SELECT * FROM students WHERE id = $1`;
        break;
      case 2:
        roleQuery = `SELECT * FROM faculty WHERE id = $1`;
        break;
      case 3:
        roleQuery = `SELECT * FROM admin WHERE id = $1`;
        break;
      case 4:
        roleQuery = `SELECT * FROM employer WHERE id = $1`;
        break;
      default:
        return res.status(400).json({ error: "Unknown role ID" });
    }

    const roleResult = await pool.query(roleQuery, [userId]);

    return res.status(200).json({
      basic: {
        id: user.id,
        email: user.email,
        role_id: roleId,
        role_name: roleName,
        create_time: user.create_time
      },
      profile: roleResult.rows[0] || {}
    });

  } catch (error) {
    console.error("Profile fetch error:", error);
    return res.status(500).json({ error: "Failed to fetch profile" });
  }
};
