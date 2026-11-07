const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/event_management_exp6';

async function displayUsers() {
  try {
    await mongoose.connect(MONGO_URI);
    const users = await User.find().select('name email role createdAt');
    console.log('\n=============================================================================');
    console.log('            MONGODB: "users" COLLECTION RECORDS (SENSITIVE DATA HIDDEN)      ');
    console.log('=============================================================================');
    console.table(
      users.map((u) => ({
        '_id': u._id.toString(),
        'Name': u.name,
        'Email': u.email,
        'Role': u.role,
        'Created At': u.createdAt.toISOString()
      }))
    );
    console.log('JSON Format for MongoDB Compass / Shell reference:');
    console.log(JSON.stringify(users, null, 2));
    console.log('=============================================================================\n');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

displayUsers();

