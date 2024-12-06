const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const { default: Web3 } = require('web3');
const crypto = require('crypto');
const authMiddleware = require('./authMiddleWare');


const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5 
});

router.post('/signup', async (req, res) => {
  const { name, email, password, ethereumAddress } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    user = await User.findOne({ ethereumAddress });
    if (user) {
      return res.status(400).json({ message: 'Ethereum address already used' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ name, email, password: hashedPassword, ethereumAddress, nonce: Math.floor(Math.random() * 1000000)});
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });

    res.status(201).json({ token, user });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', loginLimiter, async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error('Error comparing password:', err);
        return res.status(500).json({ message: 'Server error' });
      }

      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
      res.json({ token, user });
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/request-nonce', async (req, res) => {
  const { ethAddress } = req.body;

  try {
    let user = await User.findOne({ ethereumAddress: ethAddress });
    if (!user) {
      return res.status(400).json({ message: 'No account associated with this Ethereum address. Please register first.' });
    }
    user.nonce = crypto.randomInt(1000000);
    await user.save();
  

    res.json({ nonce: user.nonce.toString()});
  } catch (error) {
    console.error('Error generating nonce:', error);
    res.status(500).json({ message: 'Server error during nonce generation' });
  }
});

router.post('/login-metamask', async (req, res) => {
  const { ethAddress, signature } = req.body;

  try {
    const user = await User.findOne({ ethereumAddress: ethAddress });
    if (!user) {
      return res.status(400).json({ message: 'No user found with this Ethereum address.' });
    }
    const message = `Please sign this message to log in: ${user.nonce}`;

    const web3 = new Web3();
    const recoveredAddress = web3.eth.accounts.recover(message, signature);
    if (recoveredAddress.toLowerCase() !== ethAddress.toLowerCase()) {
      return res.status(401).json({ message: 'Invalid signature' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });

    user.nonce = crypto.randomInt(1000000);
    await user.save();

    res.json({ token, user });
  } catch (error) {
    console.error('MetaMask login error:', error);
    res.status(500).json({ message: 'Server error during Metamask login' });
  }
});

router.get('/profile', authMiddleware, async (req, res) => {
  try {
    console.log(authMiddleware);
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.json(user);
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.post('/logout', (req, res) => {
  res.status(200).json({ message: 'Logged out successfully' });
});

module.exports = router;
