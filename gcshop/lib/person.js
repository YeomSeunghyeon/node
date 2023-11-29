//201935292 염승현
var db=require('./db');
var qs=require('querystring');
var sanitizeHtml=require('sanitize-html');

    module.exports={
        view:(req,res)=>{
         var sql1=`select*from boardtype;`
        var sql2=`select*from code_tbl where main_id='0000';`
        db.query(sql1+sql2,(err,subIds)=>{
          db.query('SELECT * FROM person',(error,persons)=>{
      
        
       var context={
         boardtypes:subIds[0],
         subIds:subIds[1],
          cou:req.params.vu,
          persons:persons,
          menu:'menuForManager.ejs',
          who:req.session.name,
          body:'person.ejs',
          logined:'YES'
      
       }
       res.app.render('home',context,(err,html)=>{
          res.end(html) })
      }); })
      },
      create:(req,res)=>{
         var sql1=`select*from boardtype;`
        var sql2=`select*from code_tbl where main_id='0000';`
        db.query(sql1+sql2,(err,subIds)=>{
         context={
            boardtypes:subIds[0],
            subIds:subIds[1],
            ic:'i',
            menu:'menuForManager.ejs',
            who:req.session.name,
            body:'personUS.ejs',
            logined:'YES'
         };
         res.app.render('home',context,(err,html)=>{
            res.end(html) })})
     },
     create_process:(req,res)=>{
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
         res.redirect(`/person/view/v`) 
         res.end();
        });
     },
     update:(req,res)=>{
        mid=req.params.id;
        var sql1=`select*from boardtype;`
        var sql2=`select*from code_tbl where main_id='0000';`
        db.query(sql1+sql2,(err,subIds)=>{
        db.query(`SELECT *FROM person WHERE loginid=?`,[mid],(err,person)=>{
        context={
         boardtypes:subIds[0],
         subIds:subIds[1],
           person:person,
           ic:'c',
           menu:'menuForManager.ejs',
           who:req.session.name,
           body:'personUS.ejs',
           logined:'YES'
        };
        res.app.render('home',context,(err,html)=>{
           res.end(html) })})
        })
      },
      update_process:(req,res)=>{
        var post=req.body;
        sanitizedLoginid=sanitizeHtml(post.loginid)
        sanitizedPassword=sanitizeHtml(post.password)
        sanitizedName=sanitizeHtml(post.name)
        sanitizedAddress=sanitizeHtml(post.address)
        sanitizedTel=sanitizeHtml(post.tel)
        sanitizedBirth=sanitizeHtml(post.birth)
        sanitizedClass=sanitizeHtml(post.class)
        db.query('UPDATE person SET password=?,name=?,address=?,tel=?,birth=?,class=? WHERE loginid=? ',
        [sanitizedPassword,sanitizedName,sanitizedAddress,sanitizedTel,sanitizedBirth,sanitizedClass,sanitizedLoginid],(error,result)=>{
           res.redirect(`/person/view/u`) 
          res.end();
        })
     },
     delete_process:(req,res)=>{
        mid=req.params.id;
        db.query('DELETE FROM person WHERE loginid=?',[mid],(error,result)=>{
          if(error){
            throw error;
          }
          res.redirect(`/person/view/u`) 
          res.end();
        });
      }
    }