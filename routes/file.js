const express = require('express');
const multer = require('multer');
const File = require('../models/File');
const path = require('path');
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage });

router.get('/dashboard', async (req, res) => {
  const files = await File.find({ userId: req.session.userId });
  res.render('dashboard', { files });
});

router.post('/upload', upload.array('files', 20), async (req, res) => {
  const files = req.files;
  const fileDocs = files.map(file => ({
    userId: req.session.userId,
    fileName: file.originalname,
    filePath: '/uploads/' + file.filename,
    fileType: file.mimetype
  }));
  await File.insertMany(fileDocs);
  res.sendStatus(200); // for AJAX
});

router.post('/delete/:id', async (req, res) => {
  await File.findByIdAndDelete(req.params.id);
  res.redirect('/dashboard');
});

module.exports = router;
