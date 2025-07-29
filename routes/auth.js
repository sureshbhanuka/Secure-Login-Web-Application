const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');

const router = express.Router();

// Redirect root of auth to /login
router.get('/', (req, res) => {
  res.redirect('/login');
});

// Register page
router.get('/register', authController.getRegister);
router.post('/register',
  [
    body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long').trim(),
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    })
  ],
  authController.postRegister
);

// Login page
router.get('/login', authController.getLogin);
router.post('/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
    body('password').notEmpty().withMessage('Password is required').trim()
  ],
  authController.postLogin
);

// Dashboard (protected route)
router.get('/dashboard', authController.getDashboard);

// Logout
router.post('/logout', authController.logout);

module.exports = router;
