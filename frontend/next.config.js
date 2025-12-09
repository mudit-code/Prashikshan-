/** @type {import('next').NextConfig} */
const withPWA = require("@ducanh2912/next-pwa").default({
    // ... PWA configuration remains the same ...
});

const nextConfig = {
    reactStrictMode: true,
    // --- 🔑 ADD THIS FOR STATIC DEPLOYMENT ---
    output: 'export', 
    // ----------------------------------------
    devIndicators: {
        buildActivity: false,
    },
};

module.exports = withPWA(nextConfig);