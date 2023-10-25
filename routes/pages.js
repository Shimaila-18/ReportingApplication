const express=require('express');
const authController=require('../controllers/auth');
const router=express.Router();

router.get('/', authController.isLoggedIn, (req,res) => {
    res.render('index', {
        user: req.user
    });
});

router.get('/register',(req,res) =>{
    res.render('register')
});

router.get('/login',(req,res) =>{
    res.render('login')
});
router.get('/survey',(req,res)=>{
    res.render('survey')
})

router.get('/charts',(req,res)=>{
    res.render('charts')
})
router.get('/SepChart',(req,res)=>{
    res.render('SepChart')
})
router.get('/contact',(req,res)=>{
    res.render('contact')
})

router.get('/profile', authController.isLoggedIn , (req,res) =>{
  console.log(req.user);
    if(req.user){
        res.render('profile',{
            user: req.user
        });
    }else{                  //if not access to token redirect to login page
        res.redirect('/login');
    }
   
});

module.exports= router;