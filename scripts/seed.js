require('dotenv').config();
const connectDB = require('../config/db');
const User = require('../models/User');
const Expense = require('../models/Expense');
const Profile = require('../models/Profile');
const Budget = require('../models/Budget');
const bcrypt = require('bcrypt');

const users = [
  { username: 'TestUser1', email: 'test@example.com', password: 'password123' },
  // INPUT_REQUIRED {Add other user objects here if needed}
];

const expenses = [
  { amount: 20.99, category: 'Food', date: new Date('2023-04-01'), receipt: 'example_receipt_data' },
  { amount: 99.99, category: 'Electronics', date: new Date('2023-04-03'), receipt: 'example_receipt_data' }
  // INPUT_REQUIRED {Add other expense objects here if needed}
];

const budgets = [
  { category: 'Food', limit: 300, notificationThreshold: 0.8 },
  { category: 'Electronics', limit: 500, notificationThreshold: 0.8 }
  // INPUT_REQUIRED {Add other budget objects here if needed}
];

async function createUsersWithHashedPasswords(users) {
  for (const user of users) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
  return User.insertMany(users);
}

async function createExpensesForUser(expenses, userId) {
  const userExpenses = expenses.map(expense => ({ ...expense, user: userId }));
  return Expense.insertMany(userExpenses);
}

async function createBudgetsForUser(budgets, userId) {
  const userBudgets = budgets.map(budget => ({ ...budget, user: userId }));
  return Budget.insertMany(userBudgets);
}

async function seedDatabase() {
  try {
    connectDB();

    await User.deleteMany({});
    await Expense.deleteMany({});
    await Budget.deleteMany({});
    await Profile.deleteMany({});

    const createdUsers = await createUsersWithHashedPasswords(users);
    if (createdUsers.length > 0) {
      const userId = createdUsers[0]._id;
      await createExpensesForUser(expenses, userId);
      await createBudgetsForUser(budgets, userId);
    }

    console.log('Database seeded!');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
