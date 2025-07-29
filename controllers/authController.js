const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};

//  Wrap in an async function
async function testMySQLConnection() {
  try {
    const conn = await mysql.createConnection(dbConfig);
    await conn.execute('SELECT 1');
    await conn.end();
    console.log('✅ MySQL Connected!');
  } catch (err) {
    console.error('❌ MySQL Connection Failed:', err);
  }
}

// Call the function
testMySQLConnection();

// Render Register Page
exports.getRegister = (req, res) => {
  res.render('register', { title: 'Register', errors: [], oldInput: { email: '' } });
};




// Render Register Page
exports.postRegister = async (req, res) => {
  const errors = validationResult(req);
  const { email, password } = req.body;

  

  if (!errors.isEmpty()) {
    console.log('❌ Validation Errors:', errors.array());
    return res.status(422).render('register', {
      title: 'Register',
      errors: errors.array(),
      oldInput: { email }
    });
  }

  try {
    const conn = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to DB for registration');

    const [rows] = await conn.execute('SELECT id FROM users WHERE email = ?', [email]);
    console.log('🔍 Checked if email exists:', rows);

    if (rows.length > 0) {
      console.log('⚠️ Email already exists. Aborting registration.');
      await conn.end();
      return res.status(422).render('register', {
        title: 'Register',
        errors: [{ msg: 'Email already registered' }],
        oldInput: { email }
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    

    await conn.execute('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword]);
    console.log('✅ Inserted new user into database');

    await conn.end();
    req.session.successMessage = 'Registration successful! You can now log in.';
    res.redirect('/login');
  } catch (err) {
    console.error('🔥 Registration error:', err);
    res.status(500).send('Server error');
  }
};


// Render Login Page
exports.getLogin = (req, res) => {
  const successMessage = req.session.successMessage || null;
  delete req.session.successMessage;

  res.render('login', { title: 'Login', errors: [], oldInput: { email: '' }, successMessage });
};

// Handle Login POST
exports.postLogin = async (req, res) => {
  const errors = validationResult(req);
  const { email, password } = req.body;

  if (!errors.isEmpty()) {
    return res.status(422).render('login', {
      title: 'Login',
      errors: errors.array(),
      oldInput: { email }
    });
  }

  try {
    const conn = await mysql.createConnection(dbConfig);
    const [rows] = await conn.execute('SELECT * FROM users WHERE email = ?', [email]);

    if (rows.length === 0) {
      await conn.end();
      return res.status(401).render('login', {
        title: 'Login',
        errors: [{ msg: 'Invalid email or password' }],
        oldInput: { email }
      });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      await conn.end();
      return res.status(401).render('login', {
        title: 'Login',
        errors: [{ msg: 'Invalid email or password' }],
        oldInput: { email }
      });
    }

    // Login success: create session
    req.session.isLoggedIn = true;
    req.session.user = { id: user.id, email: user.email };
    await conn.end();
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Render Dashboard (protected)
exports.getDashboard = (req, res) => {
  if (!req.session.isLoggedIn) {
    return res.redirect('/login');
  }
  res.render('dashboard', { title: 'Dashboard', user: req.session.user });
};

// Logout user
exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) console.error(err);
    res.redirect('/login');
  });
};
