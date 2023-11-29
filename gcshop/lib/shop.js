//201935292 염승현
var db=require('./db'); 
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
        category=req.params.category;
        var isOwner=authIsOwner(req,res);
        var login=authStatusUI(req,res);
        var button=buttonUI(req,res);
        var sql1=`select*from boardtype;`
        var sql2=`select*from code_tbl where main_id='0000';`
        var sql3=`select address,ROUND((count(*)/(select count(*)from person))*100,2)as rate
        from person group by address;`
        db.query(sql1+sql2,(err,subIds)=>{
            db.query(sql1+sql3,(err,results)=>{
        db.query('SELECT * FROM merchandise',(error,mers)=>{
            db.query('select*from boardtype',(err,boardtype)=>{
                db.query('select*from merchandise where category=?',[category],(err1,mer)=>{
           
        if(isOwner){
            
            if(req.session.class==='00'){
                var context={
                    mer:mer,
                    boardtypes:results[0],
                    percentage:results[1],
                    cor:category,
                    button:button,
                    mers:mers,
                    lg:login,
                    menu:'menuForMIS.ejs',
                    who:req.session.name,
                    body:'merchandise.ejs',
                    logined:'YES'
                };
            }
            else if(req.session.class==='01'){
                var context={
                    mer:mer,
                    boardtypes:subIds[0],
                    subIds:subIds[1],
                    cor:category,
                    mers:mers,
                    button:button,
                    lg:login,
                    menu:'menuForManager.ejs',
                    who:req.session.name,
                    body:'merchandise.ejs',
                    logined:'YES'
                };
            }
            else if(req.session.class==='02'){
                var context={
                    mer:mer,
                    boardtypes:boardtype,
                    cor:category,
                    button:button,
                    mers:mers,
                    lg:login,
                    menu:'menuForCustomer.ejs',
                    who:req.session.name,
                    body:'merchandise.ejs',
                    logined:'YES'
                };
            }
        }
        else
        {
           
            var context={
                mer:mer,
                boardtypes:boardtype,
                button:button,
                cor:category,
                lg:login,
                mers:mers,
                menu:'menuForCustomer.ejs',
                who:req.session.name,
                body:'merchandise.ejs',
                logined:'YES'
            };
        }
        req.app.render('home',context,(err,html)=>{
            res.end(html);
        }) })
    }) 
})})
});
    },
    search:(req,res)=>{
        var sql1=`select*from boardtype;`
        var sql2=`select*from code_tbl where main_id='0000';`

        var post=req.body;
        db.query(sql1+sql2,(err,subIds)=>{
            db.query(`select*from merchandise where name like '%${post.search}%' or brand like '%${post.search}%' or supplier like '%${post.search}%'`,(err,mers)=>{

        context={
         button:buttonUI(req,res),
        lg:authStatusUI(req,res),
         boardtypes:subIds[0],
         subIds:subIds[1],
         menu:morcUI(req,res),
         who:req.session.name,
         body:'merchandise.ejs',
         logined:logindUI(req,res),
         mers:mers,
         cor:'s',
        };
        req.app.render('home',context,(err,html)=>{
            res.end(html);
        }) })  })
    },

    detail:(req,res)=>{
        var sql1=`select*from boardtype;`
        var sql2=`select*from code_tbl where main_id='0000';`
        uv=req.params.uv;
      id=req.params.merId;
      db.query(sql1+sql2,(err,subIds)=>{
        db.query('select*from merchandise where mer_id=?',[id],(err,mer)=>{
      context={
        button:buttonUI(req,res),
       lg:authStatusUI(req,res),
        boardtypes:subIds[0],
        subIds:subIds[1],
        menu:morcUI(req,res),
        who:req.session.name,
        body:'merchandiseDetail.ejs',
        logined:logindUI(req,res),
        mer:mer,
        uv:uv,
       };
       req.app.render('home',context,(err,html)=>{
           res.end(html);
       }) }) })
    },
    customeranal:(req,res)=>{
        var isOwner=authIsOwner(req,res);
        if(isOwner){
            if(req.session.class=='00'){     
        var sql1=`select*from boardtype;`
        var sql2=`select address,ROUND((count(*)/(select count(*)from person))*100,2)as rate
        from person group by address;`
        db.query(sql1+sql2,(err,results)=>{
            var context={
                menu:'menuForMIS.ejs',
                body:'customerAnal.ejs',
                who:req.session.name,
                logined:'YES',
                boardtypes:results[0],
                percentage:results[1]
            };
            req.app.render('home',context,(err,html)=>{
                res.end(html);
            })
     }) } }
     else{
        var sql1=`select*from boardtype;`;
        var sql2=`select address,ROUND((count(*)/(select count(*)from person))*100,2)as rate
        from person group by address;`
        db.query(sql1+sql2,(err,results)=>{
            var context={
                menu:'menuForCustomer.ejs',
                body:'merchandise.ejs',
                who:'손님',
                logined:'NO',
                boardtypes:results[0],
              merchandise:results[1],
              vu:'v'
            };
            req.app.render('home',context,(err,html)=>{
                res.end(html);
            })
        })
     }
    },
    brandanal:(req,res)=>{
        var isOwner=authIsOwner(req,res);
        if(isOwner){
            if(req.session.class=='00'){     
        var sql1=`select*from boardtype;`
        var sql2=`select brand,ROUND((count(*)/(select count(*)from merchandise))*100,2)as rate
        from merchandise group by brand;`
        db.query(sql1+sql2,(err,results)=>{
            var context={
                menu:'menuForMIS.ejs',
                body:'brandAnal.ejs',
                who:req.session.name,
                logined:'YES',
                boardtypes:results[0],
                percentage:results[1]
            };
            req.app.render('home',context,(err,html)=>{
                res.end(html);
            })
     }) } }
     else{
        var sql1=`select*from boardtype;`;
        var sql2=`select brand,ROUND((count(*)/(select count(*)from merchandise))*100,2)as rate
        from merchandise group by brand;`
        db.query(sql1+sql2,(err,results)=>{
            var context={
                menu:'menuForCustomer.ejs',
                body:'merchandise.ejs',
                who:'손님',
                logined:'NO',
                boardtypes:results[0],
              merchandise:results[1],
              vu:'v'
            };
            req.app.render('home',context,(err,html)=>{
                res.end(html);
            })
        })
     }

    },

}