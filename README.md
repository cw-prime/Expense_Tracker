# Expense_Tracker

## Overview

Expense_Tracker is a comprehensive web application designed to help users manage their daily expenses. It provides a user-friendly platform to register, track, and analyze personal expenditure.

### Features

- User registration with email verification
- Secure user login
- Encrypted passwords
- User profile management
- Expense tracking with receipt image uploads
- Expense categorization and tagging
- Budget management with notifications
- Spending analytics and reports
- Export functionality for expenses
- Intuitive UI with responsive design

### Technologies

- Node.js
- Express
- MongoDB/Mongoose
- bcrypt for password hashing
- jsonwebtoken for session management
- Passport for authentication
- cookie-parser, csurf, and helmet for security
- express-session for session management
- nodemailer for email delivery
- multer and sharp for image processing
- HTML, CSS3, Bootstrap for frontend
- Chart.js for data visualization
- pdfmake and SheetJS for exporting reports
- cors and body-parser for server setup
- dotenv for environment variable management
- PeeWee for database management
- Socket.io for real-time communication

## Project Structure

```
├── config
│   ├── db.js
│   └── passport.js
├── middleware
│   ├── auth.js
│   └── notify.js
├── models
│   ├── Budget.js
│   ├── Expense.js
│   ├── Profile.js
│   ├── Token.js
│   └── User.js
├── public
│   ├── css
│   │   ├── bootstrap.min.css
│   │   └── style.css
│   ├── js
│   │   ├── forgot-password.js
│   │   ├── login.js
│   │   └── reset-password.js
│   ├── forgot-password.html
│   ├── index.html
│   └── reset-password.html
├── routes
│   ├── budgets.js
│   ├── expenses.js
│   ├── home.js
│   ├── profile.js
│   └── users.js
├── .env
├── cookies.txt
├── index.js
├── package.json
└── pics
    └── receipt.jpg
```

## Installation

Before installation, make sure you have Node.js and MongoDB installed on your system.

1. Clone the repository to your local machine.
2. Install the needed dependencies by running `npm install`.
3. Create an `.env` file in the root of your project based on `.env.example`.
4. Run the application using `npm start` or `npm run dev` for development mode.

## Usage

To use Expense_Tracker, navigate to `http://localhost:{PORT}` in your browser, where `{PORT}` is the port number specified in your `.env` file (default 3000).

Register for a new account, and then log in to track your expenses, set budgets, and view reports.

## Contribution

Contributions to this project are welcome. Before contributing, please review the contribution guidelines.

## License

This project is open-sourced under the ISC license.