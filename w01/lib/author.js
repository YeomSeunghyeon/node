//201935292 염승현

var cookie=require('cookie');
const db=require('./db');
var qs=require('querystring');
var sanitizeHtml=require('sanitize-html');
function authIsOwner(req,res){
  /*var isOwner=false;
   var cookies={};
   if(req.headers.cookie)
   { cookies=cookie.parse(req.headers.cookie);}
   if(cookies.email==='bhwang99@gachon.ac.kr'&& cookies.password==='123456')
   {
     isOwner=true;
   }
   return isOwner*/
   if(req.session.is_logined){
     return true;
   }
   else{
     return false
   }
 }
function authStatusUI(req,res){
  var login='<a href="/login">login</a>';
  if(authIsOwner(req,res)){login='<a href="/logout_process">logout</a>'}
  return login;
}
module.exports={

  home:(req,res)=>{
    id=req.params.pageId;
    db.query('SELECT*FROM topic',(error,topics)=>{
    db.query('SELECT * FROM author',(error,authors)=>{
      var login=''
      login=authStatusUI(req,res)
    var i=0;
    var tag='<table border="1" style="border-collapse:collapse;">'
    while(i<authors.length){
      tag=tag+`<tr><td>${authors[i].name}</td><td>${authors[i].profile}</td><td>
      <a href="/author/update/${authors[i].id}">update</a></td><td><a href="/author/delete/${authors[i].id}"onclick='if(confirm("정말로 삭제하시겠습니까?")==false){return false}'>delete</a></td>`
      i +=1;
    }
    tag=tag+'</table>'
    var b=`<form action="/author/create_process" method="post">
    <p><input type="text" name="name" placeholder="name"></p>
    <p><input type="text" name="profile" placeholder="profile"></p>
    <p><input type="submit" value="생성"></p></form>`
       var context={lg:login,
        title:'Author list',list:topics,control:tag,body:b    };
         res.app.render('home',context,(err,html)=>{
          res.end(html) })
         
        }); });
          
  },

  create:(req,res)=>{

    db.query('SELECT*FROM author',(error,authors)=>{
      if(error){
        throw error;
      }
      var lists='<ol type="1">' ;
      var i=0;
      while(i<authors.length){
        lists=lists+`<li><a href=/page/${authors[i].id}>${authors[i].name}</a></li>`;
        i=i+1;
      }
      var login=''
      login=authStatusUI(req,res)
      var context={list:lists,lg:login,
                    control:`<a href="/create">create</a>`,
                    body:`<form action="/create_process" method="post">
                          <p><input type="text" name="name" placeholder="name"></P>
                          <p><textarea name="profile" placeholder="profile"></textarea></p>
                          <p><input type="submit"></p></form>`
      };
      req.app.render('home',context,(err,html)=>{
        res.end(html);
      });
                
  })
},
create_process:(req,res)=>{
  if(authIsOwner(req,res)===false){
    return  res.end(`<script type='text/javascript'>alert("Login required ~~~")
      <!--
      setTimeout("location.href='http://localhost:3000/'",1000);
      //-->
      </script>`)
    }

    var post=req.body;
    sanitizedMainId=sanitizeHtml(post.main_id)
    sanitizedSubId=sanitizeHtml(post.sub_id)
    sanitizedMainName=sanitizeHtml(post.main_name)
    sanitizedSubName=sanitizeHtml(post.sub_name)
    sanitizedStart=sanitizeHtml(post.start)
    sanitizedEnd=sanitizeHtml(post.end)
    db.query(`
    INSERT INTO code_tbl (main_id,sub_id,main_name,sub_name,start,end)   
     VALUES(?,?)`,
    [sanitizedName,sanitizedProfile],(error,result)=>{
      if(error){
        throw error;
      }
     res.redirect(`/author`) 
     res.end();
    });
},
update:(req,res)=>{
  if(authIsOwner(req,res)===false){
    res.end(`<script type='text/javascript'>alert("Login required ~~~")
    <!--
    setTimeout("location.href='http://localhost:3000/'",1000);
    //-->
    </script>`)
  }
  id=req.params.pageId;
    db.query('SELECT*FROM topic',(error,topics)=>{
    db.query('SELECT * FROM author',(error,authors)=>{
    db.query('SELECT*FROM author WHERE id=?',[id],(error,author)=>{

    var i=0;
    var tag='<table border="1" style="border-collapse:collapse;">'
    while(i<authors.length){
      tag=tag+`<tr><td>${authors[i].name}</td><td>${authors[i].profile}</td><td>
      <a href="/author/update/${authors[i].id}">update</a></td><td><a href="/author/delete">delete</a></td>`
      i +=1;
    }
    tag=tag+'</table>'
    var login=''
    login=authStatusUI(req,res)
    var b=`<form action="/author/update_process" method="post">
    <input type="hidden" name="id" value="${author[0].id}" >
    <p><input type="text" name="name" placeholder="name" value="${author[0].name}"></p>
    <p><input type="text" name="profile" placeholder="profile"value="${author[0].profile}"></p>
    <p><input type="submit" value="생성"></p></form>`
       var context={lg:login,
        title:'Author list',list:topics,control:tag,body:b    };
         res.app.render('home',context,(err,html)=>{
          res.end(html) })
         
        });
      });
          });
},
update_process:(req,res)=>{
 
    var post=req.body;
    sanitizedName=sanitizeHtml(post.name)
    sanitizedProfile=sanitizeHtml(post.profile)
    sanitizedId=sanitizeHtml(post.id)
    db.query('UPDATE author SET name=?,profile=? WHERE id=?',
    [sanitizedName,sanitizedProfile,sanitizedId],(error,result)=>{
      res.writeHead(302,{Location:`/author`});
      res.end();
    });

},
delete_process:(req,res)=>{
  if(authIsOwner(req,res)===false){
    return  res.end(`<script type='text/javascript'>alert("Login required ~~~")
      <!--
      setTimeout("location.href='http://localhost:3000/'",1000);
      //-->
      </script>`)
    }
  id=req.params.pageId;
  db.query('DELETE FROM author WHERE id=?',[id],(error,result)=>{
    if(error){
      throw error;
    }
    res.writeHead(302,{Location:`/author`});
    res.end();
  });
}
}