const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const { generatePreview } = require('../controllers/emailController');
const { sendEmail } = require('../services/gmailService');
const User = require('../models/User');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// 👇 Middleware to check if user is authenticated
const requireAuth = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  return res.status(401).json({ error: 'Unauthorized' });
};

// 📤 Upload and parse CSV
router.post('/upload-csv', requireAuth, upload.single('csvfile'), (req, res) => {
  const results = [];
  const filePath = path.join(__dirname, '..', req.file.path);

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => {
      if (data['mail-id']) {
        results.push({
          email: data['mail-id'],
          tone: data['tone'] || 'friendly',
        });
      }
    })
    .on('end', () => {
      fs.unlinkSync(filePath);
      res.json({ users: results });
    })
    .on('error', () => {
      res.status(500).json({ error: 'Failed to parse CSV' });
    });
});

// ✉️ Generate preview email
router.post('/generate-preview', requireAuth, generatePreview);

// 📨 Send actual emails
router.post('/send', requireAuth, async (req, res) => {
  const { message, recipients } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (!user || !user.refreshToken) {
      return res.status(400).json({ error: 'No Gmail OAuth token found' });
    }

    const sendResults = [];
    for (const r of recipients) {
      const emailBody = `Hi,\n\n${message}\n\nRegards,\nMarketMaster`;
      console.log('Request body:', req.body);
    console.log('User from req:', req.user);
      //here add code to generate mail via hugging face api or openai(if ur rich) 
      //async sendEmail ( user,to,subject,message)
      //figure out how you can parseout  subject from the ai generated content
      const result = await sendEmail(user, r.email, "Your Message from MarketMaster", emailBody);
      sendResults.push({ email: r.email, messageId: result.messageId });
    }

    res.json({ success: true, results: sendResults });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send emails' });
  }
});

module.exports = router;
