const pool = require("../config/db");
const bcrypt = require("bcrypt");
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt')

exports.registerUser = async (req, res) => {
  const {
    email,
    password,
    firstname,
    middleName,
    lastname,
    roleId,
    collegeName,
    collegeId,
    aisheCode,
    collegeWebsite,
    companyName,
    companyWebsite,
    state, // Add state for State Admin
    gstNumber // Add GST Number for Employer
  } = req.body;

  console.log("Incoming Registration Payload:", req.body);

  try {
    // 1. Check if email exists
    const emailCheck = await pool.query(
      "SELECT id FROM register WHERE email = $1",
      [email]
    );

    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Generate RANDOM UNIQUE ID
    function generateRandomId() {
      return Math.floor(100000000 + Math.random() * 900000000); // 9-digit number
    }

    let userId;

    // Ensure ID does not collide with existing records
    while (true) {
      const tempId = generateRandomId();
      const check = await pool.query("SELECT id FROM register WHERE id = $1", [tempId]);

      if (check.rows.length === 0) {
        userId = tempId;
        break;
      }
    }

    console.log("Generated Unique User ID:", userId);

    // 4. Insert into register table
    await pool.query(
      `INSERT INTO register (id, email, password, role, create_time)
       VALUES ($1, $2, $3, $4, NOW())`,
      [userId, email, hashedPassword, roleId]
    );

    // 5. Insert into specific role table
    switch (Number(roleId)) {
      case 1: // Student
        await pool.query(
          `
          INSERT INTO students (id, first_name, mid_name, last_name, college_name, college_id)
          VALUES ($1, $2, $3, $4, $5, $6)
        `,
          [userId, firstname, middleName, lastname, collegeName, collegeId]
        );
        break;

      case 2: // Faculty
        await pool.query(
          `
          INSERT INTO faculty (id, first_name, mid_name, last_name, college_name)
          VALUES ($1, $2, $3, $4, $5)
        `,
          [userId, firstname, middleName, lastname, collegeName]
        );
        break;

      case 3: // Admin
        await pool.query(
          `
          INSERT INTO admin (id, first_name, mid_name, last_name, college_name, aishe_code, college_website)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `,
          [
            userId,
            firstname,
            middleName,
            lastname,
            collegeName,
            aisheCode,
            collegeWebsite,
          ]
        );
        break;

      case 4: // Employer
        await pool.query(
          `
          INSERT INTO employer (id, company_name, gst_number)
          VALUES ($1, $2, $3)
        `,
          [userId, companyName, gstNumber]
        );
        break;

      case 5: // State Admin
        await pool.query(
          `
          INSERT INTO state_admin (id, first_name, mid_name, last_name, state)
          VALUES ($1, $2, $3, $4, $5)
        `,
          [userId, firstname, middleName, lastname, state]
        );
        break;

      default:
        return res.status(400).json({ error: "Invalid roleId provided" });
    }

    // 6. Generate Tokens (Auto-Login)
    const roleNames = {
      1: "Student",
      2: "Faculty",
      3: "Admin",
      4: "Employer",
      5: "State Admin"
    };
    const roleName = roleNames[Number(roleId)] || "User";

    const accessToken = generateAccessToken({ userId, role: roleName });
    const refreshToken = generateRefreshToken({ userId, role: roleName });

    await pool.query(
      `INSERT INTO token (token_id, accesstoken, refreshtoken, created_at)
       VALUES ($1, $2, $3, NOW())`,
      [userId, accessToken, refreshToken]
    );

    res.cookie("token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    return res.json({
      message: "Registration successful",
      userId,
      roleName,
      accessToken,
      refreshToken
    });

  } catch (err) {
    console.error("REGISTRATION ERROR:", err);
    return res.status(500).json({ error: "Server error during registration" });
  }
};


exports.loginUser = async (req, res) => {
  console.log("i am being hit");
  const { email, password } = req.body;

  try {
    // Fetch user
    const userResult = await pool.query(
      "SELECT id, email, password, role FROM register WHERE email = $1",
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const user = userResult.rows[0];

    // Password check
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Role mapping (fixed)
    const roleNames = {
      1: "Student",
      2: "Faculty",
      3: "Admin",
      3: "Admin",
      4: "Employer",
      5: "State Admin"
    };

    const roleName = roleNames[user.role];

    // Generate tokens (fixed payload)
    const accessToken = generateAccessToken({
      userId: user.id,
      role: roleName
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      role: roleName
    });

    // Store tokens
    await pool.query(
      `INSERT INTO token (token_id, accesstoken, refreshtoken, created_at)
       VALUES ($1, $2, $3, NOW())`,
      [user.id, accessToken, refreshToken]
    );

    // Fetch role-specific profile
    let profile = {};
    switch (Number(user.role)) {
      case 1:
        profile = (await pool.query(
          "SELECT first_name, mid_name, last_name, college_name FROM students WHERE id = $1",
          [user.id]
        )).rows[0];
        break;

      case 2:
        profile = (await pool.query(
          "SELECT first_name, mid_name, last_name, college_name FROM faculty WHERE id = $1",
          [user.id]
        )).rows[0];
        break;

      case 3:
        profile = (await pool.query(
          `SELECT first_name, mid_name, last_name, college_name, aishe_code, college_website 
           FROM admin WHERE id = $1`,
          [user.id]
        )).rows[0];
        break;

      case 4:
        profile = (await pool.query(
          "SELECT company_name FROM employer WHERE id = $1",
          [user.id]
        )).rows[0];
        break;

      case 5:
        profile = (await pool.query(
          "SELECT first_name, mid_name, last_name, state FROM state_admin WHERE id = $1",
          [user.id]
        )).rows[0];
        break;
    }

    res.cookie("token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    })

    // SUCCESS RESPONSE - FIXED FORMAT
    return res.json({
      message: "Login successful",
      userId: user.id,
      roleName,
      profile,
      accessToken,
      refreshToken
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ error: "Server error during login" });
  }
};

exports.getMe = async (req, res) => {
  console.log("i am getme");
  try {
    const { userId } = req.user;

    const userResult = await pool.query(
      "SELECT id, email, role FROM register WHERE id = $1",
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = userResult.rows[0];

    const roleNames = {
      1: "student",
      2: "faculty",
      3: "admin",
      3: "admin",
      4: "employer",
      5: "State Admin",
    };

    // Fetch role-specific profile
    let profile = {};
    switch (Number(user.role)) {
      case 1:
        profile = (
          await pool.query(
            "SELECT first_name, mid_name, last_name, college_name FROM students WHERE id = $1",
            [user.id]
          )
        ).rows[0];
        break;

      case 2:
        profile = (
          await pool.query(
            "SELECT first_name, mid_name, last_name, college_name FROM faculty WHERE id = $1",
            [user.id]
          )
        ).rows[0];
        break;

      case 3:
        profile = (
          await pool.query(
            `SELECT first_name, mid_name, last_name, college_name, aishe_code, college_website 
           FROM admin WHERE id = $1`,
            [user.id]
          )
        ).rows[0];
        break;

      case 4:
        profile = (
          await pool.query("SELECT company_name FROM employer WHERE id = $1", [
            user.id,
          ])
        ).rows[0];
        break;

      case 5:
        profile = (
          await pool.query(
            "SELECT first_name, mid_name, last_name, state FROM state_admin WHERE id = $1",
            [user.id]
          )
        ).rows[0];
        break;
    }

    return res.json({
      id: user.id,
      email: user.email,
      role: {
        id: user.role,
        name: roleNames[user.role],
      },
      profile, // Include usage profile in response
    });
  } catch (err) {
    console.error("GET ME ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
};






exports.logoutUser = async (req, res) => {
  console.log("i am logout");
  try {
    const { userId } = req.user; // comes from authMiddleware

    // Delete user's tokens
    await pool.query(
      "DELETE FROM token WHERE token_id = $1",
      [userId]
    );

    return res.json({ message: "Logout successful" });

  } catch (err) {
    console.error("LOGOUT ERROR:", err);
    return res.status(500).json({ error: "Server error during logout" });
  }
};
