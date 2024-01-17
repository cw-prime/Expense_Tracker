const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Welcome to Expense_Tracker');
});

router.get('/ping', (req, res) => {
    res.send('pong');
});

module.exports = router;
