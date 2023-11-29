//201935292 염승현
var db=require('./db');
var qs=require('querystring');
var sanitizeHtml=require('sanitize-html');
function authIsOwner(req,res){
    if(req.session.is_logined){
        return true;
    }
    else{
        return false
    }
};
function authStatusUI(req,res){
    var login=`<li><a class="dropdown-item" href="/auth/login">로그인</a></li>`;
    if(authIsOwner(req,res)){login=`<li><a class="dropdown-item" href="/auth/logout_process">로그아웃</a></li>`;}
    return login;
  };
  function buttonUI(req,res){
    var button= `<button class="btn btn-sm btn-outline-warning me-2" type="button" onclick="location.href='/purchase/cart/u'">장바구니</button>`;
    if(authIsOwner(req,res)){button=`<button class="btn btn-sm btn-outline-warning me-2" type="button" onclick="location.href='/purchase/cart/u'">장바구니</button>
    <button class="btn btn-sm btn-outline-warning me-2" type="button" onclick="location.href='/purchase/u'">구매내역</button>`;}
    return button;}
module.exports={
    login:(req,res)=>{
        login=authStatusUI(req,res);
        var button=buttonUI(req,res);
        var sql1=`select*from boardtype;`
        var sql2=`select*from code_tbl where main_id='0000';`
        db.query(sql1+sql2,(err,subIds)=>{
        var context={
            boardtypes:subIds[0],
            subIds:subIds[1],
            lg:login,
            menu:'menuForCustomer.ejs',
            who: '손님',
            body: 'login.ejs',
            button:button,
            logined: 'NO'
        };
        req.app.render('home',context,(err,html)=>{
            res.end(html);
        }); })
    },
    login_process:(req,res)=>{
        var post=req.body;
        db.query('select count(*)as num from person where loginid=? and password=?',[post.id,post.pwd],(error,results)=>{
            if(results[0].num==1){
                db.query('select name,class from person where loginid=? and password=?',[post.id,post.pwd],(error,result)=>{
                    req.session.is_logined=true;
                    req.session.loginid=post.id
                    req.session.name=result[0].name
                    req.session.class=result[0].class
                    res.redirect('/');
                })
         
        }
        else{
            req.session.is_logined=false;
            req.session.name='손님';
            req.session.class='99';
            res.redirect('/');
        }
    })
    

    },
    logout_process:(req,res)=>{
        req.session.destroy((err)=>{
            res.redirect('/');
        })
    },
    signup:(req,res)=>{
        var sql1=`select*from boardtype;`
        var sql2=`select*from code_tbl where main_id='0000';`
        db.query(sql1+sql2,(err,subIds)=>{
        context={
            boardtypes:subIds[0],
            subIds:subIds[1],
            lg:authStatusUI(req,res),
            button:buttonUI(req,res),
            menu:'menuForCustomer.ejs',
            who:req.session.name,
            body:'signup.ejs',
            logined:'YES'
         };
         res.app.render('home',context,(err,html)=>{
            res.end(html) }) })
    },
    signup_process:(req,res)=>{
            var post=req.body;
            sanitizedLoginid=sanitizeHtml(post.loginid)
            sanitizedPassword=sanitizeHtml(post.password)
            sanitizedName=sanitizeHtml(post.name)
            sanitizedAddress=sanitizeHtml(post.address)
            sanitizedTel=sanitizeHtml(post.tel)
            sanitizedBirth=sanitizeHtml(post.birth)
            sanitizedClass=sanitizeHtml(post.class)
            db.query(`
            INSERT INTO person (loginid,password,name,address,tel,birth,class)   
             VALUES(?,?,?,?,?,?,?)`,
            [sanitizedLoginid,sanitizedPassword,sanitizedName,sanitizedAddress,sanitizedTel,sanitizedBirth,sanitizedClass],(error,code)=>{
              if(error){
                throw error;
              }
             res.redirect(`/`) 
             res.end();
            });
         },
    }