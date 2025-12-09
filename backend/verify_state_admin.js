const API_URL = 'http://localhost:5000'; // backend port

const verifyStateAdmin = async () => {
    const email = `stateadmin_${Date.now()}@example.com`;
    const password = 'Password@123';
    const roleId = 5;
    const state = 'Maharashtra';
    const first_name = 'Test';
    const last_name = 'Admin';

    try {
        // 1. Register
        console.log('Registering State Admin...');
        const registerResponse = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email,
                password,
                roleId, // 5 for State Admin
                firstname: first_name,
                lastname: last_name,
                state
            })
        });

        if (!registerResponse.ok) {
            const err = await registerResponse.text();
            throw new Error(`Registration failed: ${registerResponse.status} ${err}`);
        }

        const registerData = await registerResponse.json();
        console.log('Registration Response:', registerData);

        if (!registerData.userId) {
            throw new Error('Registration failed: No userId returned');
        }

        // 2. Login
        console.log('Logging in...');
        const loginResponse = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email,
                password
            })
        });

        if (!loginResponse.ok) {
            const err = await loginResponse.text();
            throw new Error(`Login failed: ${loginResponse.status} ${err}`);
        }

        const loginData = await loginResponse.json();
        console.log('Login Response:', loginData);

        if (loginData.roleName !== 'State Admin') {
            throw new Error(`Expected role 'State Admin', got '${loginData.roleName}'`);
        }

        if (loginData.profile.state !== state) {
            throw new Error(`Expected state '${state}', got '${loginData.profile.state}'`);
        }

        console.log('VERIFICATION SUCCESSFUL: State Admin registered and logged in correctly.');

    } catch (error) {
        console.error('VERIFICATION FAILED:', error.message);
    }
};

verifyStateAdmin();
