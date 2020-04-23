const express= require("express")
const expressLayouts  = require("express-ejs-layouts")
const flash = require('connect-flash')
const session = require('express-session')

const app = express()
const mongoose = require("mongoose")
const passport =require('passport')

// ejs
app.use(expressLayouts)
app.set('view engine', "ejs")

// passport config
require('./config/passport')(passport)
// db config
const db = require('./config/key').MongoURI
// CONNECT TO MONGO
mongoose.connect(db,{useNewUrlParser:true})
.then(()=>console.log(`MongoDB Connected ....`))
.catch(err => console.log(err))

// bodyparser
app.use(express.urlencoded({extended:false}))
// express session
app.use(session({
    secret:'secret',
    resave:true,
    saveUninitialized:true
}))
// passport middleware
app.use(passport.initialize())
app.use(passport.session()) 
// connect flash
app.use(flash())
// global vars
app.use((req,res,next)=> {
    res.locals.success_msg=req.flash('success msg')
    res.locals.error_msg = req.flash('error msg')
    res.locals.error = req.flash('error')
    next()
})


// routes
app.use("/", require("./routes/index"))
app.use("/users", require("./routes/users"))





const port = process.env.port || 5000
app.listen(port , console.log(`Server started on port ${port}`))