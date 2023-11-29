//201935292 염승현
var db=require('./db'); 
var sanitizeHtml=require('sanitize-html');
const currentDate = new Date();
function authIsOwner(req,res){
    if(req.session.is_logined){
        return true;
    }
    else{
        return false
    }
}
function logindUI(req,res){
    if(req.session.is_logined){
        return 'yes';
    }
    else{
        return 'no';
    }
}
function morcUI(req,res){
    if(req.session.class==1){
        return 'menuForManager.ejs'
    }
    else{
        return 'menuForCustomer.ejs'
    }
  }
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
  }
function buttonUI(req,res){
   var button= `<button class="btn btn-sm btn-outline-warning me-2" type="button" onclick="location.href='/purchase/cart/u'">장바구니</button>`;
   if(authIsOwner(req,res)){button=`<button class="btn btn-sm btn-outline-warning me-2" type="button" onclick="location.href='/purchase/cart/u'">장바구니</button>
   <button class="btn btn-sm btn-outline-warning me-2" type="button" onclick="location.href='/purchase/u'">구매내역</button>`;}
   return button;
}
module.exports={
      home:(req,res)=>{
        ck=req.params.uv
        var sql1=`select*from boardtype;`
        var sql2=`select*from code_tbl where main_id='0000';`
        db.query(sql1+sql2,(err,subIds)=>{
            db.query('SELECT *  FROM purchase JOIN merchandise ON purchase.mer_id = merchandise.mer_id ',(err,purchase)=>{
        context={
            ck:ck,
            button:buttonUI(req,res),
           lg:authStatusUI(req,res),
            boardtypes:subIds[0],
            subIds:subIds[1],
            menu:morcUI(req,res),
            who:req.session.name,
            id:req.session.loginid,
            body:'purchase.ejs',
            logined:logindUI(req,res),
            class1:req.session.class,
            purchase:purchase,
            cor:'s',
           };
           req.app.render('home',context,(err,html)=>{
               res.end(html);
      }) }) }) 


},
purchase_process:(req,res)=>{
    var post=req.body;
    sanitizedId=sanitizeHtml(post.purchase_id)
    db.query('UPDATE purchase SET cancel=? WHERE purchase_id=?',['Y',sanitizedId],
   (error,result)=>{
      res.redirect(`/purchase/u`) 
     res.end();
   })
},
usercreate_process:(req,res)=>{
    var post=req.body;
    sanitizedId=sanitizeHtml(post.mer_id)
    sanitizedprice=sanitizeHtml(post.price)
    sanitizedqty=sanitizeHtml(post.qty)
    db.query(`
    INSERT INTO purchase (mer_id,price,qty,point,total,date,loginid)   
     VALUES(?,?,?,?,?,?,?)`,
    [ sanitizedId,sanitizedprice,sanitizedqty,0.5,sanitizedqty*sanitizedprice,currentDate,req.session.loginid],(error,code)=>{
      if(error){
        throw error;
      }
     res.redirect(`/purchase/u`) 
     res.end();
    });
},
cart:(req,res)=>{
    ck=req.params.uv
    var sql1=`select*from boardtype;`
    var sql2=`select*from code_tbl where main_id='0000';`
    db.query(sql1+sql2,(err,subIds)=>{
        db.query('SELECT *  FROM cart JOIN merchandise ON cart.mer_id = merchandise.mer_id ',(err,cart)=>{
        context={
            ck:ck,
            button:buttonUI(req,res),
           lg:authStatusUI(req,res),
            boardtypes:subIds[0],
            subIds:subIds[1],
            menu:morcUI(req,res),
            who:req.session.name,
            id:req.session.loginid,
            body:'cart.ejs',
            logined:logindUI(req,res),
            class1:req.session.class,
           cart:cart,
            cor:'s',
           };
           req.app.render('home',context,(err,html)=>{
               res.end(html);
           }) }) })
},
buy_process:(req,res)=>{
    var post=req.body;
    sanitizedId=sanitizeHtml(post.mer_id)
    sanitizedcId=sanitizeHtml(post.cart_id)
    sanitizedprice=sanitizeHtml(post.price)
    sanitizedqty=sanitizeHtml(post.qty)
    db.query(`
    INSERT INTO purchase (mer_id,price,qty,point,total,date,loginid)   
     VALUES(?,?,?,?,?,?,?)`,
    [ sanitizedId,sanitizedprice,sanitizedqty,0.5,sanitizedqty*sanitizedprice,currentDate,req.session.loginid],(error,code)=>{
     
       db.query('DELETE FROM cart WHERE cart_id=?',[sanitizedcId],(error,result)=>{
        if(error){
          throw error;
        }
        res.redirect(`/purchase/u`)
        res.end();
      });  });
  
},
cart_process:(req,res)=>{
    var post=req.body;
    sanitizedId=sanitizeHtml(post.mer_id)
    db.query(`
    INSERT INTO cart (mer_id,date,loginid)   
     VALUES(?,?,?)`,
    [ sanitizedId,currentDate,req.session.loginid],(error,code)=>{
        res.redirect(`/purchase/cart/u`)
        res.end();
    })
},
cartupdate:(req,res)=>{
    var sql1=`select*from boardtype;`
    var sql2=`select*from code_tbl where main_id='0000';`
    id=req.params.cartId
    db.query(sql1+sql2,(err,subIds)=>{
        db.query('SELECT *  FROM cart where cart_id=? ',[id],(err,cart)=>{
        context={
            button:buttonUI(req,res),
           lg:authStatusUI(req,res),
            boardtypes:subIds[0],
            subIds:subIds[1],
            menu:morcUI(req,res),
            who:req.session.name,
            id:req.session.loginid,
            body:'cartCRU.ejs',
            logined:logindUI(req,res),
            class1:req.session.class,
            cart:cart,
            ic:'u',
            cor:'s',
           };
           req.app.render('home',context,(err,html)=>{
               res.end(html);

    }) })})
},
cartupdate_process:(req,res)=>{
    var post=req.body;
    sanitizeddate=sanitizeHtml(post.date)
    sanitizedloginid=sanitizeHtml(post.loginid)
    sanitizedid=sanitizeHtml(post.cart_id)
    db.query(`
    UPDATE cart SET date=?,loginid=? WHERE cart_id=?`,[sanitizeddate,sanitizedloginid,sanitizedid],(error,code)=>{
        res.redirect(`/purchase/cart/v`)
        res.end();
    })
},
purchaseupdate:(req,res)=>{
    var sql1=`select*from boardtype;`
    var sql2=`select*from code_tbl where main_id='0000';`
    id=req.params.purchaseId
    db.query(sql1+sql2,(err,subIds)=>{
        db.query('SELECT *  FROM purchase where purchase_id=? ',[id],(err,purchase)=>{
        context={
            button:buttonUI(req,res),
           lg:authStatusUI(req,res),
            boardtypes:subIds[0],
            subIds:subIds[1],
            menu:morcUI(req,res),
            who:req.session.name,
            id:req.session.loginid,
            body:'purchaseCRU.ejs',
            logined:logindUI(req,res),
            class1:req.session.class,
            purchase:purchase,
            ic:'u',
            cor:'s',
           };
           req.app.render('home',context,(err,html)=>{
               res.end(html);

    }) })})
},
purchaseupdate_process:(req,res)=>{
    var post=req.body;
    sanitizeddate=sanitizeHtml(post.date)
    sanitizedcancel=sanitizeHtml(post.cancel)
    sanitizedqty=sanitizeHtml(post.qty)
    sanitizedtotal=sanitizeHtml(post.total)
    sanitizedid=sanitizeHtml(post.purchase_id)
    db.query(`
    UPDATE purchase SET date=?,qty=?,cancel=?,total=? WHERE purchase_id=?`,[sanitizeddate,sanitizedqty,sanitizedcancel,sanitizedtotal,sanitizedid],(error,code)=>{
        res.redirect(`/purchase/v`)
        res.end();
    })
},
cartdelete_process:(req,res)=>{
    id=req.params.cartId;
      
    db.query('DELETE FROM cart WHERE cart_id=?',[id],(error,result)=>{
      if(error){
        throw error;
      }
      res.redirect(`/purchase/cart/v`) 
      res.end();
    });
},
purchasedelete_process:(req,res)=>{
    id=req.params.purchaseId;
      
    db.query('DELETE FROM purchase WHERE purchase_id=?',[id],(error,result)=>{
      if(error){
        throw error;
      }
      res.redirect(`/purchase/v`) 
      res.end();
    });

},
cartcreate:(req,res)=>{
    var sql1=`select*from boardtype;`
    var sql2=`select*from code_tbl where main_id='0000';`
    db.query(sql1+sql2,(err,subIds)=>{
        context={
            button:buttonUI(req,res),
           lg:authStatusUI(req,res),
            boardtypes:subIds[0],
            subIds:subIds[1],
            menu:morcUI(req,res),
            who:req.session.name,
            id:req.session.loginid,
            body:'cartCRU.ejs',
            logined:logindUI(req,res),
            class1:req.session.class,
            ic:'c',
            cor:'s',
           };
           req.app.render('home',context,(err,html)=>{
               res.end(html);

    }) })
},
cartcreate_process:(req,res)=>{
    var post=req.body;
    sanitizeddate=sanitizeHtml(post.date)
    sanitizedloginid=sanitizeHtml(post.loginid)
    sanitizedId=sanitizeHtml(post.mer_id)
    db.query(`
    INSERT INTO cart (mer_id,date,loginid)   
     VALUES(?,?,?)`,
    [ sanitizedId,sanitizeddate,sanitizedloginid],(error,code)=>{
        res.redirect(`/purchase/cart/u`)
        res.end();
    })
},
purchasecreate:(req,res)=>{
    var sql1=`select*from boardtype;`
    var sql2=`select*from code_tbl where main_id='0000';`
    db.query(sql1+sql2,(err,subIds)=>{
        context={
            button:buttonUI(req,res),
           lg:authStatusUI(req,res),
            boardtypes:subIds[0],
            subIds:subIds[1],
            menu:morcUI(req,res),
            who:req.session.name,
            id:req.session.loginid,
            body:'purchaseCRU.ejs',
            logined:logindUI(req,res),
            class1:req.session.class,
            ic:'c',
            cor:'s',
           };
           req.app.render('home',context,(err,html)=>{
               res.end(html);

    }) })
},
purchasecreate_process:(req,res)=>{
    var post=req.body;
    sanitizeddate=sanitizeHtml(post.date)
    sanitizedloginid=sanitizeHtml(post.loginid)
    sanitizedId=sanitizeHtml(post.mer_id)
    sanitizedqty=sanitizeHtml(post.qty)
    sanitizedtotal=sanitizeHtml(post.total)
    sanitizedcancel=sanitizeHtml(post.cancel)
    db.query(`
    INSERT INTO purchase (mer_id,date,loginid,qty,total,cancel)   
     VALUES(?,?,?,?,?,?)`,
    [ sanitizedId,sanitizeddate,sanitizedloginid,sanitizedqty,sanitizedtotal,sanitizedcancel],(error,code)=>{
        res.redirect(`/purchase/u`)
        res.end();
    })
},
}

