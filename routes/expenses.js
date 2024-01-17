const express = require('express');
const router = express.Router();
const multer = require('multer');
const sharp = require('sharp');
const Expense = require('../models/Expense');
const { ensureAuthenticated } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const { notifyOnApproachingBudget } = require('../middleware/notify');
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
}).single('receipt');
router.post('/add', ensureAuthenticated, [
    body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
    body('category').not().isEmpty().withMessage('Category is required'),
    body('date').isISO8601().toDate().withMessage('Date must be a valid date'),
  ], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    if (req.fileValidationError) {
      return res.status(400).json({ msg: req.fileValidationError });
    }
    if (!req.file) {
      return res.status(400).json({ msg: 'Please upload a file' });
    }
    sharp(req.file.buffer)
      .resize({ width: 200 })
      .toBuffer()
      .then(buffer => {
        const base64Image = buffer.toString('base64');
        const expense = new Expense({
          user: req.user.id,
          amount: req.body.amount,
          category: req.body.category,
          date: req.body.date,
          receipt: `data:image/png;base64,${base64Image}`
        });
        return expense.save();
      })
      .then(expense => {
        return notifyOnApproachingBudget(req.user.id, expense.category, expense.amount);
      })
      .then(notificationResult => {
        res.json({ msg: 'Expense added successfully', notification: notificationResult });
      })
      .catch(err => res.status(500).send({ msg: 'Server Error', error: err }));
  });

router.get('/list-by-category/:category', ensureAuthenticated, async (req, res) => {
  try {
    const { category } = req.params;
    let query = { user: req.user.id, category };

    if (req.query.tags) {
      query.tags = { $in: req.query.tags.split(',') };
    }

    const expenses = await Expense.find(query);
    res.json(expenses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.put('/add-tags/:id', ensureAuthenticated, [
  body('tags').isArray().withMessage('Tags must be an array')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params;
    const { tags } = req.body;

    const expense = await Expense.findById(id);

    if (!expense) {
      return res.status(404).json({ msg: 'Expense not found' });
    }
    if (expense.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    
    if (tags) {
      expense.tags = [...new Set([...expense.tags, ...tags])];
    }

    await expense.save();
    res.json({ msg: 'Tags added successfully', expense });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
