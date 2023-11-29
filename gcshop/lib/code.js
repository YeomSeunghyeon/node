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
}
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
  view:(req,res)=>{
    var sql1=`select*from boardtype;`
       var sql2=`select*from code_tbl where main_id='0000';`
        db.query(sql1+sql2,(err,subIds)=>{
    db.query('SELECT * FROM code_tbl',(error,codes)=>{
  var isOwner=authIsOwner(req,res);
  var login=authStatusUI(req,res);
  var button=buttonUI(req,res);
  
 var context={
  boardtypes:subIds[0],
  subIds:subIds[1],
    cou:req.params.vu,
    codes:codes,
    button:button,
    lg:login,
    menu:'menuForManager.ejs',
    who:req.session.name,
    body:'code.ejs',
    logined:'YES'

 }
 res.app.render('home',context,(err,html)=>{
    res.end(html) })
}) })
},
 create:(req,res)=>{
    var login=authStatusUI(req,res);
  var button=buttonUI(req,res);
  var sql1=`select*from boardtype;`
        var sql2=`select*from code_tbl where main_id='0000';`
        db.query(sql1+sql2,(err,subIds)=>{
     context={
      boardtypes:subIds[0],
      subIds:subIds[1],
        ic:'i',
        button:button,
        lg:login,
        menu:'menuForManager.ejs',
        who:req.session.name,
        body:'codeCU.ejs',
        logined:'YES'
     };
     res.app.render('home',context,(err,html)=>{
        res.end(html) }) })
 },
 create_process:(req,res)=>{
    var post=req.body;
    sanitizedMainId=sanitizeHtml(post.main_id)
    sanitizedSubId=sanitizeHtml(post.sub_id)
    sanitizedMainName=sanitizeHtml(post.main_name)
    sanitizedSubName=sanitizeHtml(post.sub_name)
    sanitizedStart=sanitizeHtml(post.start)
    sanitizedEnd=sanitizeHtml(post.end)
    db.query(`
    INSERT INTO code_tbl (main_id,main_name,sub_id,sub_name,start,end)   
     VALUES(?,?,?,?,?,?)`,
    [sanitizedMainId,sanitizedMainName,sanitizedSubId,sanitizedSubName,sanitizedStart,sanitizedEnd],(error,code)=>{
      if(error){
        throw error;
      }
     res.redirect(`/code/view/v`) 
     res.end();
    });
 },
 update:(req,res)=>{
   mid=req.params.main;
   sid=req.params.sub;
   var sql1=`select*from boardtype;`
        var sql2=`select*from code_tbl where main_id='0000';`
        db.query(sql1+sql2,(err,subIds)=>{
   db.query(`SELECT *FROM code_tbl WHERE main_id=? AND sub_id=?`,[mid,sid],(err,code)=>{
   context={
    boardtypes:subIds[0],
    subIds:subIds[1],
      mid:mid,
      sid:sid,
      mn:code[0].main_name,
      sn:code[0].sub_name,
      st:code[0].start,
      en:code[0].end,
      ic:'c',
      menu:'menuForManager.ejs',
      who:req.session.name,
      body:'codeCU.ejs',
      logined:'YES'
   };
   res.app.render('home',context,(err,html)=>{
      res.end(html) })
   })})
 },
 update_process:(req,res)=>{
   var post=req.body;
   sanitizedMainId=sanitizeHtml(post.main_id)
   sanitizedSubId=sanitizeHtml(post.sub_id)
   sanitizedMainName=sanitizeHtml(post.main_name)
   sanitizedSubName=sanitizeHtml(post.sub_name)
   sanitizedStart=sanitizeHtml(post.start)
   sanitizedEnd=sanitizeHtml(post.end)
   db.query('UPDATE code_tbl SET main_name=?,sub_name=?,start=?,end=? WHERE main_id=? AND sub_id=?',
   [sanitizedMainName,sanitizedSubName,sanitizedStart,sanitizedEnd, sanitizedMainId,sanitizedSubId],(error,result)=>{
      res.redirect(`/code/view/u`) 
     res.end();
   })
},
delete_process:(req,res)=>{
   mid=req.params.main;
   sid=req.params.sub;
   db.query('DELETE FROM code_tbl WHERE main_id=? AND sub_id=?',[mid,sid],(error,result)=>{
     if(error){
       throw error;
     }
     res.redirect(`/code/view/u`) 
     res.end();
   });
 }
}