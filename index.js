require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
require('./config/passport')(passport);
const homeRoutes = require('./routes/home');
const userRoutes = require('./routes/users');
const profileRoutes = require('./routes/profile');
const expensesRoutes = require('./routes/expenses');
const budgetRoutes = require('./routes/budgets');
const analyticsRoutes = require('./routes/analytics');
const app = express();
const port = process.env.PORT || 3000;

connectDB();
const serveStatic = express.static('public');
app.use((req, res, next) => {
  serveStatic(req, res, (err) => {
    if (err) {
      console.error(`Error serving ${req.path} - ${err.message}`);
      res.status(500).send('Server Error');
    } else {
      next();
    }
  });
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET, 
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: { 
      secure: app.get('env') === 'production', 
      sameSite: true
    }
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use('/', homeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/expenses', expensesRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/analytics', analyticsRoutes);

const exportRoutes = require('./routes/export');
app.use('/api/export', exportRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
