const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const Record = require('./models/Record');

// Load environment variables
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGODB_URI);

const users = [
  {
    username: 'admin',
    email: 'admin@finance.com',
    password: 'password123',
    role: 'Admin'
  },
  {
    username: 'analyst1',
    email: 'analyst1@finance.com',
    password: 'password123',
    role: 'Analyst'
  },
  {
    username: 'analyst2',
    email: 'analyst2@finance.com',
    password: 'password123',
    role: 'Analyst'
  },
  {
    username: 'viewer1',
    email: 'viewer1@finance.com',
    password: 'password123',
    role: 'Viewer'
  }
];

const categories = ['Salary', 'Freelance', 'Investments', 'Rent', 'Groceries', 'Utilities', 'Travel', 'Entertainment'];
const descriptions = ['Monthly payment', 'Project bonus', 'Dividend payout', 'Apartment lease', 'Weekly food', 'Electricity and water', 'Flight tickets', 'Movie night'];

const generateRecords = (userIds, numRecords = 30) => {
  const records = [];
  const today = new Date();
  
  for (let i = 0; i < numRecords; i++) {
    const isIncome = Math.random() > 0.6; // 40% income, 60% expense
    const categoryIndex = isIncome 
      ? Math.floor(Math.random() * 3) // First 3 are income categories
      : 3 + Math.floor(Math.random() * 5); // Rest are expense categories
      
    const date = new Date(today);
    date.setDate(date.getDate() - Math.floor(Math.random() * 60)); // Random date in last 60 days
    
    records.push({
      amount: isIncome ? (1000 + Math.floor(Math.random() * 4000)) : (20 + Math.floor(Math.random() * 400)), // Larger amounts for income
      type: isIncome ? 'income' : 'expense',
      category: categories[categoryIndex],
      date: date,
      notes: descriptions[categoryIndex],
      createdBy: userIds[Math.floor(Math.random() * userIds.length)] // Assign to a random user
    });
  }
  
  return records;
};

// Import Data
const importData = async () => {
  try {
    await User.deleteMany();
    await Record.deleteMany();
    console.log('Previous Data Destroyed...');

    // Hash passwords for dummy users
    const salt = await bcrypt.genSalt(10);
    const usersWithHashedPasswords = users.map(user => ({
      ...user,
      password: bcrypt.hashSync(user.password, salt)
    }));

    const createdUsers = await User.insertMany(usersWithHashedPasswords);
    
    // Get array of user IDs
    const userIds = createdUsers.map(user => user._id);
    
    // Generate and insert records based on these users
    const dummyRecords = generateRecords(userIds, 50);
    await Record.insertMany(dummyRecords);

    console.log('Dummy Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error with data import: ${error}`);
    process.exit(1);
  }
};

// Destroy Data
const destroyData = async () => {
  try {
    await User.deleteMany();
    await Record.deleteMany();

    console.log('Data Destroyed Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error destroying data: ${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
