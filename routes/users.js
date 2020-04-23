const express = require("express")
const router = express.Router()
const bcrypt = require('bcryptjs')
const passport = require('passport')
// user module
const User = require('../models/User')
// login page
router.get("/login",(req,res)=> res.render("login"))
// register page
router.get("/register",(req,res)=> res.render("register"))
// register handle
router.post('/register',(req,res)=> {
    const{name,email,password,repassword}=req.body
    let errors =[]

    // check requied fields:
    if(!name || ! email || !password || ! repassword){
        errors.push({msg:"Please fill all the entries"})

    }
    if(password!=repassword){
        errors.push({msg:"password did not matched"})

    }
    if(password.length<6){
        errors.push({msg:"Password should be greater than 6"})

    }
    if(errors.length>0){
        res.render('register',{
            errors,name,password,repassword
        })

    }
    else{
// validation passed
User.findOne({email:email})
.then(user=>{
    if(user){
        errors.push({msg:"Email is already registered"})
        res.render('register',{
           errors,
           name,
           email,
           password, 
           repassword
        })

    }
    else{
        const newUser = new User({
            name,
            email,
            password
        })
        //  hash passwprd
        bcrypt.genSalt(10, (err,salt) =>
        bcrypt.hash(newUser.password,salt,(err,hash)=>{
            if(err) throw err
            newUser.password=hash
            newUser.save()
            .then(user => {
                req.flash('success_msg','You are registered now and can log in')
                res.redirect('/users/login')
            })
            .catch(err=> console.log(err))
        
        }))
    }
})
    }
    
})
// login handle
router.post('/login',(req,  res ,next)=>{
    passport.authenticate('local',{
        successRedirect : '/dashboard',
        failureRedirect:'/users/login',
        failureFlash:true
    })
    (req,res,next)
})
// logout handle 
router.get('/logout', (req , res) => {
    req.logout()
    req.flash('success_msg','You are logged out')
    res.redirect('/users/login')
})

module.exports = router;