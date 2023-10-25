const express=require('express');
const authController = require('../controllers/auth');
const { route } = require('./pages');

const router=express.Router();

router.post('/register', authController.register)
router.post('/login', authController.login)
router.get('/logout', authController.logout)
router.post('/survey',authController.survey)
router.get('/charts',authController.charts)
router.get('/SepChart',authController.charts)
module.exports= router;