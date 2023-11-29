const express = require('express');
const app = express();
var qs=require('querystring');
var sanitizeHtml=require('sanitize-html');
app.set('views', __dirname + '/views');
app.set('view engine', 'html'); // 변경된 부분
app.engine('html', require('ejs').renderFile); // 변경된 부분
var db = require('./lib/db')
;
app.get('/api/getTitles', (req, res) => {
    db.query('SELECT * FROM title', (err, titles) => {
        if (err) throw err;
        res.json({ titles: titles });
    });
});
app.get('/api/getReviews/:pageId', (req, res) => {
    id=req.params.pageId
    db.query('SELECT * FROM review where title_id=?',[id],(err, reviews) => {
        db.query('select*from title where id=?',[id],(err,title)=>{
        if (err) throw err;
        res.json({reviews:reviews,title:title});
    })})
});
app.get('/api/getcreate/:pageId', (req, res) => {
    id=req.params.pageId
    db.query('SELECT * FROM title where id=?',[id] ,(err, titles) => {
        if (err) throw err;
        res.json({ titles: titles.id });
    });
});

// 사용자 정의 모듈
var root= require('./lib/root');
var review = require('./lib/review');

// 세션 모듈, 세션 DB 저장 모듈
var session = require('express-session');
var MySqlStore = require('express-mysql-session')(session);
var options = {
    host: 'localhost',
    user: 'nodejs',
    password: 'nodejs',
    database: 'webdb2023'
};
var sessionStore = new MySqlStore(options);

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: sessionStore
}));

// body 파서 모듈
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

// 라우터 호출
app.use('/', root);
app.use('/review', review);

// 정적 파일 폴더 지정
app.use(express.static('public'));

app.listen(3000, () => console.log('Example app listening on port 3000'));

