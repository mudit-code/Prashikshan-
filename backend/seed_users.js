// fetch is built-in in node 18+

const API_URL = 'http://localhost:5000/auth/register';

const accounts = [
  {
    roleName: "Student",
    payload: {
      email: "student@example.com",
      password: "Password123!",
      firstname: "Dummy",
      middleName: "",
      lastname: "Student",
      roleId: 1,
      collegeName: "Test College",
      collegeId: 1
    }
  },

  {
    roleName: "College Admin",
    payload: {
      email: "admin@example.com",
      password: "Password123!",
      firstname: "Dummy",
      middleName: "",
      lastname: "Admin",
      roleId: 3,
      collegeName: "Test College",
      aisheCode: "C-12345",
      collegeWebsite: "https://testcollege.edu"
    }
  },
  {
    roleName: "Employer",
    payload: {
      email: "employer@example.com",
      password: "Password123!",
      firstname: "Dummy",
      middleName: "",
      lastname: "Employer",
      roleId: 4,
      companyName: "Test Company Ltd",
      companyWebsite: "https://testcompany.com",
      gstNumber: "22AAAAA0000A1Z5"
    }
  },
  {
    roleName: "State Admin",
    payload: {
      email: "stateadmin@example.com",
      password: "Password123!",
      firstname: "Dummy",
      lastname: "StateAdmin",
      roleId: 5,
      state: "Maharashtra"
    }
  }
];

async function seed() {
  for (const acc of accounts) {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(acc.payload)
      });
      const data = await response.json();
      if (response.ok) {
        console.log(`✅ Successfully created ${acc.roleName}: ${acc.payload.email} / ${acc.payload.password}`);
      } else {
        console.log(`❌ Failed to create ${acc.roleName}:`, data.error || data);
      }
    } catch (e) {
      console.log(`❌ Request failed for ${acc.roleName}:`, e.message);
    }
  }
}

seed();
