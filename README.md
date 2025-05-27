# MarketMaster 🚀  
AI-powered personalized marketing emails at scale.

## 🔧 Tech Stack
- **MERN** (MongoDB, Express, React, Node)
- **Gmail API** (OAuth + Email Sending)
- **HuggingFace** (AI email generation)

## ✨ Features
- Google and local authentication
- Personalized email generation
- CSV and input form support
- Gmail integration to send emails from the user's account

## 🧭 Project Structure
```
.
├── app.js  
├── config/  
│   └── passport.js  
├── controllers/  
│   ├── authController.js  
│   └── emailController.js  
├── middleware/  
│   └── authMiddleware.js  
├── models/  
│   └── User.js  
├── package.json  
├── package-lock.json  
├── protected/  
│   └── dashboard/  
│       └── index.html  
├── public/  
│   ├── landing/  
│   │   ├── index.html  
│   │   └── styles.css  
│   ├── login/  
│   │   ├── login.html  
│   │   ├── login.css  
│   │   └── loginScript.js  
│   └── signup/  
│       ├── signup.html  
│       ├── signup.css  
│       └── signup.js  
├── README.md  
├── routes/  
│   ├── auth.js  
│   └── email.js  
├── services/  
│   └── gmailService.js  
├── uploads/  
└── utils/  
    └── mailGenerator.js  
```

## 🚀 Getting Started

1. **Clone the repo**
   ```bash
   git clone https://github.com/your-username/marketMaster.git
   cd marketMaster
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup MongoDB** (local or Atlas)

4. **Get OAuth credentials**
   - Visit [Google Developer Console](https://console.developers.google.com/)
   - Create credentials for:
     - `GOOGLE_CLIENT_ID`
     - `GOOGLE_CLIENT_SECRET`
     - `GOOGLE_CALLBACK_URL`

5. **Create a `.env` file**
   ```
   MONGO_URI=
   JWT_SECRET=
   GOOGLE_CLIENT_ID=
   GOOGLE_CLIENT_SECRET=
   GOOGLE_CALLBACK_URL=
   SESSION_SECRET=
   ```

## 📂 API Endpoints

| Method | Endpoint                       | Description               |
|--------|--------------------------------|---------------------------|
| POST   | `/api/auth/login`              | Local user login          |
| POST   | `/api/auth/signup`             | Local user signup         |
| GET    | `/api/auth/google`             | Google OAuth login        |
| GET    | `/api/auth/google/callback`    | Handle Google callback    |
| GET    | `/api/auth/logout`             | Logout user               |
| POST   | `/api/email/upload-csv`        | Upload and parse CSV      |
| POST   | `/api/email/generate-preview`  | Generate email preview    |
| POST   | `/api/email/send`              | Send generated emails     |

## 🖥️ Frontend Structure

- `public/`
  - `login/` – Login page
  - `signup/` – Signup page
  - `landing/` – Landing page

- `protected/`
  - `dashboard/` – Authenticated user dashboard

## 🧠 Email Generation Flow

1. User inputs text + uploads CSV (or just text)
2. Server generates a preview using AI *(in progress)*
3. User approves → Gmail API sends personalized emails

## 📌 Notes

- Gmail integration requires token refresh handling.
- AI generation will be cached for preview efficiency *(in progress)*.
- **CSV format** should follow:
  ```
  mail-id,tone
  ```