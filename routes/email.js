const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const { generatePreview } = require('../controllers/emailController');

const router = express.Router();

// Set up multer for CSV uploads
const upload = multer({ dest: 'uploads/' });

router.post('/upload-csv', upload.single('csvfile'), (req, res) => {
  const results = [];
  const filePath = path.join(__dirname, '..', req.file.path);

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => {
      // Each row will be like { email: '...', preferred tone: '...' }
      results.push(data);
    })
    .on('end', () => {
      // Delete file after parsing
      fs.unlinkSync(filePath);
      res.json({ users: results });
    })
    .on('error', (err) => {
      res.status(500).json({ error: 'Failed to parse CSV' });
    });
});

router.post('/generate-preview', generatePreview);

module.exports = router;
