const pool = require('../config/db');

const getProfile = async (req, res) => {
    try {
        const { userId } = req.user;

        const result = await pool.query(
            `SELECT company_name, gst_number, profile_data 
       FROM employer 
       WHERE id = $1`,
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Employer not found" });
        }

        const row = result.rows[0];
        // Merge main columns with profile_data for frontend convenience
        const profile = {
            ...row.profile_data,
            companyName: row.company_name,
            cinRegistration: row.gst_number || row.profile_data?.cinRegistration
        };

        res.json(profile);
    } catch (error) {
        console.error("Error fetching employer profile:", error);
        res.status(500).json({ error: "Failed to fetch profile" });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { userId } = req.user;
        const formData = req.body;

        // Handle Files
        const files = req.files || {};
        const filePaths = {};

        if (files.registrationProof) filePaths.registrationProof = files.registrationProof[0].path;
        if (files.authLetter) filePaths.authLetter = files.authLetter[0].path;
        if (files.companyLogo) filePaths.companyLogo = files.companyLogo[0].path;

        // Fetch existing profile data to merge
        const oldRes = await pool.query("SELECT profile_data FROM employer WHERE id = $1", [userId]);
        const oldProfile = oldRes.rows[0]?.profile_data || {};

        // Merge new data
        const newProfileData = {
            ...oldProfile,
            ...formData,
            ...filePaths
        };

        // Update DB
        // We also update main columns if present in formData
        const companyName = formData.companyName || oldProfile.companyName;
        const gstNumber = formData.cinRegistration || oldProfile.cinRegistration;

        await pool.query(
            `UPDATE employer 
       SET company_name = COALESCE($2, company_name),
           gst_number = COALESCE($3, gst_number),
           profile_data = $4
       WHERE id = $1`,
            [userId, companyName, gstNumber, JSON.stringify(newProfileData)]
        );

        res.json({ message: "Profile updated successfully", profile: newProfileData });

    } catch (error) {
        console.error("Error updating employer profile:", error);
        res.status(500).json({ error: "Failed to update profile" });
    }
};

module.exports = {
    getProfile,
    updateProfile
};
