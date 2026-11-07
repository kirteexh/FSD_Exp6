const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Event = require('./models/Event');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/event_management_exp6';

const seedDatabase = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB.');

    // Clear existing collections
    await User.deleteMany();
    await Event.deleteMany();
    console.log('Cleared existing users and events.');

    // Create Admin User
    const adminUser = await User.create({
      name: 'System Administrator',
      email: 'admin@eventhub.com',
      password: 'Admin@123',
      role: 'admin'
    });
    console.log('Admin user created:', adminUser.email);

    // Create Regular User 1
    const regularUser1 = await User.create({
      name: 'John Doe',
      email: 'john@eventhub.com',
      password: 'User@123',
      role: 'user'
    });
    console.log('Regular user 1 created:', regularUser1.email);

    // Create Regular User 2
    const regularUser2 = await User.create({
      name: 'Sarah Connor',
      email: 'sarah@eventhub.com',
      password: 'User@123',
      role: 'user'
    });
    console.log('Regular user 2 created:', regularUser2.email);

    // Create Sample Events
    const events = [
      {
        title: 'National Web3 & AI Summit 2026',
        description: 'Annual gathering of industry leaders, developers, and researchers discussing future trends in AI and decentralized computing.',
        category: 'Conference',
        date: new Date('2026-12-15T09:30:00Z'),
        location: 'Auditorium Hall A, Tech Campus',
        capacity: 250,
        createdBy: adminUser._id
      },
      {
        title: 'MERN Stack & Cloud Security Workshop',
        description: 'Hands-on deep dive into JWT tokens, OAuth, RBAC authorization, and scalable Express backend architecture.',
        category: 'Workshop',
        date: new Date('2026-11-25T14:00:00Z'),
        location: 'Lab 402, Computer Engineering Dept',
        capacity: 60,
        createdBy: regularUser1._id
      },
      {
        title: 'Inter-College Hackathon: CodeGenesis',
        description: '36-hour continuous hackathon solving real-world civic, healthcare, and educational challenges.',
        category: 'Hackathon',
        date: new Date('2026-12-05T08:00:00Z'),
        location: 'Innovation Center Ground Floor',
        capacity: 150,
        createdBy: adminUser._id
      },
      {
        title: 'Global Tech Leadership Webinar',
        description: 'Interactive fireside chat with engineering VPs on building distributed engineering cultures.',
        category: 'Webinar',
        date: new Date('2026-11-30T18:00:00Z'),
        location: 'https://meet.google.com/exp-fsd6-auth',
        capacity: 500,
        createdBy: regularUser2._id
      }
    ];

    await Event.insertMany(events);
    console.log(`Seeded ${events.length} sample events.`);

    console.log('\n=============================================');
    console.log('DATABASE SEEDED SUCCESSFULLY!');
    console.log('=============================================');
    console.log('Demo Credentials for Testing:');
    console.log('---------------------------------------------');
    console.log('Admin Account:');
    console.log('  Email:    admin@eventhub.com');
    console.log('  Password: Admin@123');
    console.log('  Role:     admin');
    console.log('---------------------------------------------');
    console.log('User Account:');
    console.log('  Email:    john@eventhub.com');
    console.log('  Password: User@123');
    console.log('  Role:     user');
    console.log('=============================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();

