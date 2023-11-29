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
        db.query('SELECT * FROM merchandise',(error,mers)=>{
      var isOwner=authIsOwner(req,res);
      var login=authStatusUI(req,res);
      var button=buttonUI(req,res);
      
     var context={
  
      boardtypes:subIds[0],
      subIds:subIds[1],
        cor:req.params.vu,
        mers:mers,
        button:button,
        lg:login,
        menu:'menuForManager.ejs',
        who:req.session.name,
        body:'merchandise.ejs',
        logined:'yes'
    
     }
     res.app.render('home',context,(err,html)=>{
        res.end(html) })
    });  })
    },
    create:(req,res)=>{
      var sql1=`select*from boardtype;`
      var sql2=`select*from code_tbl where main_id='0000';`
      db.query(sql1+sql2,(err,subIds)=>{
         var  context={
          boardtypes:subIds[0],
          subIds:subIds[1],
              ic:'i',
              menu:'menuForManager.ejs',
              who:req.session.name,
              body:'merchandiseCU.ejs',
              logined:'YES'
           };
           res.app.render('home',context,(err,html)=>{
              res.end(html) })})
            },
    create_process:(req,res,file)=>{
     var post=req.body;
    sanitizedCategory=sanitizeHtml(post.category)
    sanitizedName=sanitizeHtml(post.name)
    sanitizedPrice=sanitizeHtml(post.price)
    sanitizedStock=sanitizeHtml(post.stock)
    sanitizedBrand=sanitizeHtml(post.brand)
    sanitizedSupplier=sanitizeHtml(post.supplier)
    sanitizedImage=sanitizeHtml(post.image)
    sanitizedSaleYn=sanitizeHtml(post.sale_yn)
    sanitizedSalePrice=sanitizeHtml(post.sale_price)
    db.query(`
    INSERT INTO merchandise (category,name,price,stock,brand,supplier,image,sale_yn,sale_price)   
     VALUES(?,?,?,?,?,?,?,?,?)`,
    [sanitizedCategory,sanitizedName,sanitizedPrice,sanitizedStock,sanitizedBrand,sanitizedSupplier,
    sanitizedImage,sanitizedSaleYn,sanitizedSalePrice],(error,code)=>{
      if(error){
        throw error;
      }
     res.redirect(`/merchandise/view/v`) 
     res.end();
    });
    },
    update:(req,res)=>{
    mid=req.params.merId;
    var sql1=`select*from boardtype;`
        var sql2=`select*from code_tbl where main_id='0000';`
        db.query(sql1+sql2,(err,subIds)=>{
   db.query(`SELECT *FROM merchandise WHERE mer_id=?`,[mid],(err,mer)=>{
   context={
    boardtypes:subIds[0],
    subIds:subIds[1],
       ic:'c',
      mer:mer,
      menu:'menuForManager.ejs',
      who:req.session.name,
      body:'merchandiseCU.ejs',
      logined:'YES'
   };
   res.app.render('home',context,(err,html)=>{
      res.end(html) })})
   })
    },
    update_process:(req,res,file)=>{
        var post=req.body;
        sanitizedCategory=sanitizeHtml(post.category)
        sanitizedName=sanitizeHtml(post.name)
        sanitizedPrice=sanitizeHtml(post.price)
        sanitizedStock=sanitizeHtml(post.stock)
        sanitizedBrand=sanitizeHtml(post.brand)
        sanitizedSupplier=sanitizeHtml(post.supplier)
        sanitizedImage=sanitizeHtml(post.image)
        sanitizedSaleYn=sanitizeHtml(post.sale_yn)
        sanitizedSalePrice=sanitizeHtml(post.sale_price)
        sanitizedId=sanitizeHtml(post.mer_id)
        db.query('UPDATE merchandise SET category=?,name=?,price=?,stock=?,brand=?,supplier=?,image=?,sale_yn=?,sale_price=? WHERE mer_id=?',
        [sanitizedCategory, sanitizedName, sanitizedPrice,sanitizedStock, sanitizedBrand,sanitizedSupplier,sanitizedImage,sanitizedSaleYn, sanitizedSalePrice,sanitizedId]
        ,(err,result)=>{
            res.redirect(`/merchandise/view/u`) 
            res.end();
        })
    },
    delete_process:(req,res)=>{
        mid=req.params.merId;
      
        db.query('DELETE FROM merchandise WHERE mer_id=?',[mid],(error,result)=>{
          if(error){
            throw error;
          }
          res.redirect(`/merchandise/view/u`) 
          res.end();
        });
      }

}

