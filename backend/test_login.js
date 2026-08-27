// use native fetch

async function testLogin() {
  try {
    // We can use the built-in fetch in Node 18+
    const response = await globalThis.fetch('http://localhost:5000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'student@example.com', password: 'Password123!' })
    });
    const data = await response.json();
    console.log("Status:", response.status);
    console.log("Response:", data);
  } catch(e) {
    console.log("Error:", e.message);
  }
}
testLogin();
