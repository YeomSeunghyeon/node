//201935292 염승현
const express =require('express');
const app=express();

app.set('views',__dirname+'/views');
app.set('view engine','ejs');
//var author=require('./lib/author');
var db=require('./lib/db');
//var topic=require('./lib/topic');
var authorRouter=require('./router/authorRouter');
var rootRouter=require('./router/rootRouter');

app.use(express.static('public'));
var url=require('url');
var qs=require('querystring');
var path=require('path');
var cookie=require('cookie');

var session = require('express-session'); 
var bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));

var MySqlStore=require('express-mysql-session')(session);
var options={
   host:'localhost',
   user:'nodejs',
   password:'nodejs',
   database:'webdb2023'
};
var sessionStore=new MySqlStore(options);



app.use(session({
   secret : 'keyboard cat',
   resave : false,
   saveUninitialized : true,
   store:sessionStore
}));

app.use('/',rootRouter);
app.use('/author',authorRouter);
app.listen(3000,()=>console.log('Example app listening on port 3000')); 