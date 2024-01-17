const express = require('express');
const { ensureAuthenticated } = require('../middleware/auth');
const router = express.Router();
const Expense = require('../models/Expense');
const { generatePDF } = require('../services/pdfService');
const { generateExcel } = require('../services/excelService');

router.get('/pdf', ensureAuthenticated, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).lean();
    const pdfDoc = generatePDF(expenses);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=expenses_${Date.now()}.pdf`);
    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (err) {
    res.status(500).send({ msg: 'Server Error', error: err.message });
  }
});

router.get('/excel', ensureAuthenticated, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).lean();
    const buffer = await generateExcel(expenses);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=expenses_${Date.now()}.xlsx`);
    res.send(buffer);
  } catch (err) {
    res.status(500).send({ msg: 'Server Error', error: err.message });
  }
});

module.exports = router;
