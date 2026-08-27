const pool = require("../config/db");
const bcrypt = require("bcrypt");
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt')
const { OAuth2Client } = require('google-auth-library');

// We will use a fallback client ID if none is provided, but frontend needs the real one to generate the token anyway.
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || 'dummy-client-id');

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
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (token_id) DO UPDATE 
       SET accesstoken = EXCLUDED.accesstoken, 
           refreshtoken = EXCLUDED.refreshtoken, 
           created_at = NOW()`,
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

    await pool.query(
      `INSERT INTO token (token_id, accesstoken, refreshtoken, created_at)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (token_id) DO UPDATE 
       SET accesstoken = EXCLUDED.accesstoken, 
           refreshtoken = EXCLUDED.refreshtoken, 
           created_at = NOW()`,
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

exports.googleAuth = async (req, res) => {
  const { token, roleId } = req.body;
  
  if (!token) {
    return res.status(400).json({ error: "Google token is required" });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID || 'dummy-client-id',
    });
    
    const payload = ticket.getPayload();
    const { sub, email, given_name, family_name, picture } = payload;
    
    // Check if user exists by sub
    let userResult = await pool.query(
      "SELECT id, email, role, auth_provider FROM register WHERE provider_id = $1",
      [sub]
    );

    let user;

    if (userResult.rows.length > 0) {
      // User exists with this Google account
      user = userResult.rows[0];
    } else {
      // Check if email exists with local auth
      const emailCheck = await pool.query(
        "SELECT id, auth_provider FROM register WHERE email = $1",
        [email]
      );

      if (emailCheck.rows.length > 0) {
        return res.status(400).json({ error: "This email is already registered using a password. Please log in manually." });
      }

      // If no roleId provided during creation, we can't create
      if (!roleId) {
        return res.status(400).json({ error: "Role is required for new Google signups" });
      }

      // Create new user
      function generateRandomId() {
        return Math.floor(100000000 + Math.random() * 900000000);
      }

      let newUserId;
      while (true) {
        const tempId = generateRandomId();
        const check = await pool.query("SELECT id FROM register WHERE id = $1", [tempId]);
        if (check.rows.length === 0) {
          newUserId = tempId;
          break;
        }
      }

      await pool.query(
        `INSERT INTO register (id, email, password, role, auth_provider, provider_id, profile_completed, create_time)
         VALUES ($1, $2, NULL, $3, 'google', $4, false, NOW())`,
        [newUserId, email, roleId, sub]
      );

      // Insert into role-specific tables with what we have
      const profileData = JSON.stringify({ avatar: picture });

      if (Number(roleId) === 1) { // Student
        await pool.query(
          `INSERT INTO students (id, first_name, last_name, profile_data)
           VALUES ($1, $2, $3, $4)`,
          [newUserId, given_name || '', family_name || '', profileData]
        );
      } else if (Number(roleId) === 4) { // Employer
        await pool.query(
          `INSERT INTO employer (id, first_name, last_name, profile_data)
           VALUES ($1, $2, $3, $4)`,
          [newUserId, given_name || '', family_name || '', profileData]
        );
      } else {
        return res.status(400).json({ error: "Invalid role for Google Auth" });
      }

      user = { id: newUserId, role: roleId, email };
    }

    // Role mapping
    const roleNames = {
      1: "Student",
      3: "Admin",
      4: "Employer",
      5: "State Admin"
    };

    const roleName = roleNames[Number(user.role)];

    const accessToken = generateAccessToken({ userId: user.id, role: roleName });
    const refreshToken = generateRefreshToken({ userId: user.id, role: roleName });

    await pool.query(
      `INSERT INTO token (token_id, accesstoken, refreshtoken, created_at)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (token_id) DO UPDATE 
       SET accesstoken = EXCLUDED.accesstoken, 
           refreshtoken = EXCLUDED.refreshtoken, 
           created_at = NOW()`,
      [user.id, accessToken, refreshToken]
    );

    // Fetch profile snippet
    let profile = {};
    if (Number(user.role) === 1) {
      profile = (await pool.query(
        "SELECT first_name, mid_name, last_name, college_name FROM students WHERE id = $1",
        [user.id]
      )).rows[0];
    } else if (Number(user.role) === 4) {
      profile = (await pool.query(
        "SELECT company_name FROM employer WHERE id = $1",
        [user.id]
      )).rows[0];
    }

    res.cookie("token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 15 * 60 * 1000,
    });

    return res.json({
      message: "Google Auth successful",
      userId: user.id,
      roleName,
      profile,
      accessToken,
      refreshToken
    });

  } catch (err) {
    console.error("GOOGLE AUTH ERROR:", err);
    return res.status(500).json({ error: "Server error during Google auth" });
  }
};
