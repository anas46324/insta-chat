const express = require('express');
const { signup, signin, OAuth, googleSignup, logout, updateUser, checkAuth, authSignIn } = require('../controllers/auth.controller.js');
const protectRoute = require('../middleware/jwtHelper.js');

const router = express.Router();

  router.post('/signup', signup)

  router.post('/signin', signin);
  
  router.post('/authSignIn', authSignIn);

  router.get('/', OAuth);

  router.post('/logout', logout);

  router.post('/google-signup', googleSignup)

  router.put('/update-user', protectRoute, updateUser)

  router.get('/check', protectRoute, checkAuth)

module.exports = router;