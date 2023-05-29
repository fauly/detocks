const express = require('express');
const router = express.Router();
const validation = require('../middleware/validation');
const Sphere = require('./models/sphere');

router.get('/spheres', async (req, res) => {
  try {
    const spheres = await Sphere.find();
    res.json(spheres);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/check-username', validation.usernameAvailable)



module.exports = router;
