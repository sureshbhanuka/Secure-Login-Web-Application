# 🔐 Secure Login Web Application (Node.js + Express)

This is a secure login and registration system built using **Node.js**, **Express.js**, and **MySQL**, following OWASP best practices.

## 🌟 Features

✅ User Registration & Login  
✅ Password Hashing with `bcryptjs`  
✅ CSRF Protection with `csurf`  
✅ XSS Protection via `helmet`  
✅ Secure Cookie Management with `express-session`  
✅ Rate Limiting with `express-rate-limit`  
✅ Logging with `morgan`  
✅ Environment Variable Management with `dotenv`  
✅ Clean UI using EJS templating  
✅ Input Validation with `express-validator`

---

## 🛡️ OWASP Security Measures Implemented

- [x] **SQL Injection Prevention** – Using parameterized queries  
- [x] **XSS Protection** – Enabled via `helmet` and input sanitization  
- [x] **CSRF Protection** – Using `csurf` middleware  
- [x] **Rate Limiting** – Prevents brute-force attacks  
- [x] **Secure Cookies** – `httpOnly`, `secure`, and `sameSite` flags  
- [x] **Content Security Policy (CSP)** – Implemented with `helmet`  
- [x] **Environment Configuration** – Secrets and DB config via `.env` file  

---

## 📦 Tech Stack

- **Backend**: Node.js, Express.js  
- **Database**: MySQL  
- **Templating**: EJS  
- **Security**: Helmet, csurf, express-session, rate-limit  
- **Logging**: Morgan  

---

## 🛠️ Installation & Setup

```bash
# Clone the repository
git clone https://github.com/sureshbhanuka/Secure-Login-Web-Application.git
cd Secure-Login-Web-Application

# Install dependencies
npm install

# Setup .env file
cp .env.example .env
# Then fill in DB credentials and session secret

# Run the app
node app.js
