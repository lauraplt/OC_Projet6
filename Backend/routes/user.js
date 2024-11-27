const express = require('express');
const router = express.Router();
const userCtrl = require('../controller/user');
const auth = require('../middleware/auth');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

router.get('/profile', auth, (req, res) => {
    res.json({ message: "Profil accessible", userId: req.auth.userId });
});

module.exports = router;