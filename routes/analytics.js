const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const { ensureAuthenticated } = require('../middleware/auth');

const groupByCategory = (expenses) => {
    return expenses.reduce((acc, expense) => {
        acc[expense.category] = acc[expense.category] || [];
        acc[expense.category].push(expense);
        return acc;
    }, {});
};

router.get('/summary-by-category', ensureAuthenticated, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id });
    const grouped = groupByCategory(expenses);
    const summary = Object.keys(grouped).map(category => ({
        category,
        total: grouped[category].reduce((sum, expense) => sum + expense.amount, 0)
    }));
    res.json(summary);
  } catch (err) {
    res.status(500).send({ msg: 'Server Error', error: err.message });
  }
});

router.get('/total-expenses', ensureAuthenticated, async (req, res) => {
    try {
        const total = await Expense.aggregate([
            { $match: { user: req.user.id } },
            { $group: { _id: null, total: { $sum: '\u0024amount' } } }
        ]);
        res.json({ total: total[0]?.total || 0 });
    } catch (err) {
        res.status(500).send({ msg: 'Server Error', error: err.message });
    }
});

module.exports = router;
