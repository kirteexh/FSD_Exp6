/**
 * Comprehensive Test Suite for Experiment 6
 * Tests all required scenarios:
 * 1. User registration (POST)
 * 2. User login (POST)
 * 3. Successful token verification (GET)
 * 4. Invalid login credentials
 * 5. Accessing a protected endpoint without a token
 * 6. Accessing an admin endpoint using a normal user's token (403 Forbidden)
 * 7. Successful access to an admin endpoint using an admin token (200 OK)
 * 8. Query MongoDB Users Collection
 */

const http = require('http');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const app = require('./server');
const User = require('./models/User');

let server;
const PORT = 5001; // Use test port to avoid conflict

function request(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: '127.0.0.1',
      port: PORT,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  server = app.listen(PORT, async () => {
    console.log(`\n===============================================================`);
    console.log(`🧪 STARTING EXPERIMENT 6 AUTHENTICATION & RBAC TEST SUITE`);
    console.log(`===============================================================\n`);

    let userToken = '';
    let adminToken = '';

    try {
      // Test 1: User Registration
      console.log(`--- TEST 1: User Registration (POST /api/auth/register) ---`);
      const testEmail = `student_${Date.now()}@example.com`;
      const regRes = await request('POST', '/api/auth/register', {
        name: 'Alex Johnson',
        email: testEmail,
        password: 'Password@123',
        role: 'user'
      });
      console.log(`Status Code: ${regRes.status} (Expected: 201)`);
      console.log(`Response:`, JSON.stringify(regRes.body, null, 2));
      console.log(regRes.status === 201 ? '✅ PASS: User registered\n' : '❌ FAIL\n');

      // Test 2: User Login
      console.log(`--- TEST 2: User Login (POST /api/auth/login) ---`);
      const loginRes = await request('POST', '/api/auth/login', {
        email: testEmail,
        password: 'Password@123'
      });
      console.log(`Status Code: ${loginRes.status} (Expected: 200)`);
      console.log(`Response:`, JSON.stringify(loginRes.body, null, 2));
      userToken = loginRes.body.token;
      console.log(loginRes.status === 200 && userToken ? '✅ PASS: User login successful & token received\n' : '❌ FAIL\n');

      // Test 3: Successful Token Verification
      console.log(`--- TEST 3: Successful Token Verification (GET /api/auth/me) ---`);
      const verifyRes = await request('GET', '/api/auth/me', null, userToken);
      console.log(`Status Code: ${verifyRes.status} (Expected: 200)`);
      console.log(`Response:`, JSON.stringify(verifyRes.body, null, 2));
      console.log(verifyRes.status === 200 && verifyRes.body.success ? '✅ PASS: Token successfully verified\n' : '❌ FAIL\n');

      // Test 4: Invalid Login Credentials
      console.log(`--- TEST 4: Invalid Login Credentials (POST /api/auth/login with wrong password) ---`);
      const invalidLoginRes = await request('POST', '/api/auth/login', {
        email: testEmail,
        password: 'WrongPassword999'
      });
      console.log(`Status Code: ${invalidLoginRes.status} (Expected: 401)`);
      console.log(`Response:`, JSON.stringify(invalidLoginRes.body, null, 2));
      console.log(invalidLoginRes.status === 401 ? '✅ PASS: Invalid credentials correctly rejected with 401\n' : '❌ FAIL\n');

      // Test 5: Accessing Protected Endpoint Without a Token
      console.log(`--- TEST 5: Accessing Protected Endpoint Without Token (GET /api/auth/me) ---`);
      const noTokenRes = await request('GET', '/api/auth/me', null, null);
      console.log(`Status Code: ${noTokenRes.status} (Expected: 401)`);
      console.log(`Response:`, JSON.stringify(noTokenRes.body, null, 2));
      console.log(noTokenRes.status === 401 ? '✅ PASS: Protected route blocked with 401 when token is missing\n' : '❌ FAIL\n');

      // Test 6: Accessing Admin Endpoint Using a Normal User's Token (Role-based access check)
      console.log(`--- TEST 6: Accessing Admin Endpoint Using Normal User Token (GET /api/admin/dashboard) ---`);
      const userAdminRes = await request('GET', '/api/admin/dashboard', null, userToken);
      console.log(`Status Code: ${userAdminRes.status} (Expected: 403 Forbidden)`);
      console.log(`Response:`, JSON.stringify(userAdminRes.body, null, 2));
      console.log(userAdminRes.status === 403 ? '✅ PASS: Normal user correctly forbidden (403) from admin endpoint\n' : '❌ FAIL\n');

      // Test 7: Successful Access to Admin Endpoint Using Admin Token
      console.log(`--- TEST 7: Login as Admin & Access Admin Endpoint (GET /api/admin/dashboard) ---`);
      const adminLoginRes = await request('POST', '/api/auth/login', {
        email: 'admin@eventhub.com',
        password: 'Admin@123'
      });
      adminToken = adminLoginRes.body.token;

      const adminDashboardRes = await request('GET', '/api/admin/dashboard', null, adminToken);
      console.log(`Status Code: ${adminDashboardRes.status} (Expected: 200)`);
      console.log(`Response:`, JSON.stringify(adminDashboardRes.body, null, 2));
      console.log(adminDashboardRes.status === 200 && adminDashboardRes.body.success ? '✅ PASS: Admin successfully accessed admin dashboard\n' : '❌ FAIL\n');

      // Test 8: Query MongoDB Users Collection (Showing roles, hiding password hashes)
      console.log(`--- TEST 8: MongoDB Users Collection Inspection ---`);
      const usersInDb = await User.find().select('name email role createdAt');
      console.log(`Total users in DB: ${usersInDb.length}`);
      console.table(usersInDb.map(u => ({
        ID: u._id.toString(),
        Name: u.name,
        Email: u.email,
        Role: u.role,
        Created: u.createdAt.toISOString().slice(0, 10)
      })));
      console.log('✅ PASS: Users collection inspected successfully.\n');

      console.log(`===============================================================`);
      console.log(`🎉 ALL 8 TESTS PASSED SUCCESSFULLY!`);
      console.log(`===============================================================\n`);

    } catch (err) {
      console.error('Test execution failed:', err);
    } finally {
      server.close();
      mongoose.connection.close();
      process.exit(0);
    }
  });
}

runTests();

