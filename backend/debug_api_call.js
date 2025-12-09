const axios = require("axios");

const run = async () => {
    try {
        const loginRes = await axios.post("http://localhost:5000/auth/login", {
            email: "college@test.com",
            password: "123456"
        });

        const token = loginRes.data.accessToken;
        console.log("Got token.");

        const statsRes = await axios.get("http://localhost:5000/api/college/stats", {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log("Stats Response:", JSON.stringify(statsRes.data, null, 2));

    } catch (err) {
        if (err.response) {
            console.error("API Error:", err.response.status, err.response.data);
        } else {
            console.error("Error:", err.message);
        }
    }
};

run();
