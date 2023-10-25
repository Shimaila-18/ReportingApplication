const express=require('express');
const mysql= require('mysql');
const dotenv=require('dotenv');
const path=require('path');
const exp = require('constants');
const cookieParser= require('cookie-parser');

dotenv.config({path : './.env'});

const app=express();  //start the server

const port =5001;

const db=mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DATABASE_PORT
});

const publicDirectory = path.join(__dirname,'./public' );
app.use(express.static(publicDirectory));

//parse url encoded bodies  as sent by html
app.use(express.urlencoded({ extended: false}));
//parse json bodies
app.use(express.json());
app.use(cookieParser());

//templating engine
app.set('view engine' , 'hbs');

db.connect((error) =>{
  if(error) console.log(error)
  else console.log("Mysql connected...")
})

//define routes
app.use('/', require('./routes/pages'));
app.use('/auth' , require('./routes/auth'));


app.listen(port, () =>{
   console.log(`Listening on port ${port} successfully`)
});