//201935292 염승현
var db=require('./db');
var qs=require('querystring');
var sanitizeHtml=require('sanitize-html');

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
    typeview:(req,res)=>{
        var sql1=`select*from boardtype;`
        var sql2=`select*from code_tbl where main_id='0000';`
        db.query(sql1+sql2,(err,subIds)=>{
           db.query('select*from boardtype',(err,boardtype)=>{   
            var context={
            boardtypes:subIds[0],
            subIds:subIds[1],
            bd:boardtype,
            menu:'menuForManager.ejs',
            who:req.session.name,
            body:'boardtype.ejs',
            logined:'YES'
        
         }
         res.app.render('home',context,(err,html)=>{
            res.end(html) })
        }) })
    },
    typecreate:(req,res)=>{
        var sql1=`select*from boardtype;`
        var sql2=`select*from code_tbl where main_id='0000';`
        db.query(sql1+sql2,(err,subIds)=>{
            var context={
                boardtypes:subIds[0],
                subIds:subIds[1],
                menu:'menuForManager.ejs',
                who:req.session.name,
                body:'boardtypeCU.ejs',
                logined:'YES',
                cu:'C'
            }
            res.app.render('home',context,(err,html)=>{
                res.end(html) })
        })

    },
    typecreate_process:(req,res)=>{
        var post=req.body;
        sanitizetitle=sanitizeHtml(post.title);
        sanitizedescription=sanitizeHtml(post.description);
        sanitizenum=sanitizeHtml(post.numPerPage);
        sanitizewrite=sanitizeHtml(post.write_YN);
        sanitizere=sanitizeHtml(post.re_YN);
        db.query(`INSERT INTO boardtype (title,description,numPerPage,
            write_YN,re_YN)   
        VALUES(?,?,?,?,?)`,
       [sanitizetitle,sanitizedescription,sanitizenum,sanitizewrite,sanitizere],(error,board)=>{
        if(error){
            throw error;
          }
         res.redirect(`/board/type/view`) 
         res.end();
        });
    },
    typeupdate:(req,res)=>{
        var sql1=`select*from boardtype;`
        var sql2=`select*from code_tbl where main_id='0000';`
        id=req.params.typeId
        db.query(sql1+sql2,(err,subIds)=>{
            db.query('SELECT *FROM boardtype WHERE type_id=?',[id],(err,board)=>{
            var context={
                boardtype:board,
                boardtypes:subIds[0],
                subIds:subIds[1],
                menu:'menuForManager.ejs',
                who:req.session.name,
                body:'boardtypeCU.ejs',
                logined:'YES',
                cu:'U'
            }
            res.app.render('home',context,(err,html)=>{
                res.end(html) })
        })
    })
    },
    typeupdate_process:(req,res)=>{
        var post=req.body;
        sanitizetitle=sanitizeHtml(post.title);
        sanitizedescription=sanitizeHtml(post.description);
        sanitizenum=sanitizeHtml(post.numPerPage);
        sanitizewrite=sanitizeHtml(post.write_YN);
        sanitizere=sanitizeHtml(post.re_YN);
        sanitizeid=sanitizeHtml(post.type_id);
        db.query('UPDATE boardtype SET title=?,description=?,numPerPage=?,write_YN=?,re_YN=? WHERE type_id=? ',
        [sanitizetitle,sanitizedescription,sanitizenum,sanitizewrite,sanitizere,sanitizeid],(error,result)=>{
          res.redirect(`/board/type/view`) 
          res.end();
        })
    },
    typedelete_process:(req,res)=>{
        id=req.params.typeId
        db.query('DELETE FROM boardtype WHERE type_id=? ',[id],(error,result)=>{
            if(error){
              throw error;
            }
            res.redirect(`/board/type/view`) 
            res.end();
          });
        },
        view:(req,res)=>{
            
            var sntzedTypeId=sanitizeHtml(req.params.typeId);
             pNum=req.params.pNum;
            var sql1=`select*from boardtype;`
            var sql2=`select*from code_tbl where main_id='0000';`
            var sql3=`select*from boardtype where type_id =${sntzedTypeId};`
            var sql4=`select count(*) as total from board where type_id=${sntzedTypeId};`
            db.query(sql1+sql3+sql4,(error,results)=>{
                var numPerPage=results[1][0].numPerPage;
                var offs=(pNum-1)*numPerPage;
                var totalPages=Math.ceil(results[2][0].total/numPerPage);
                db.query(`select b.board_id as board_id,b.title as title,b.date as date,p.name as name 
                from board b inner join person p on b.loginid=p.loginid
                where b.type_id=? and b.p_id=? ORDER BY date desc,board_id desc LIMIT ? OFFSET ?`,
                [sntzedTypeId,0,numPerPage,offs],(err,boards)=>{
             db.query(sql1+sql2,(err,subIds)=>{
            db.query(`SELECT*FROM board WHERE type_id=?`,[sntzedTypeId],
            (error2,mix)=>{
                db.query(`select*from boardtype where type_id=?`,[sntzedTypeId],(err,boardtype)=>{
                 db.query(`SELECT*FROM person LEFT JOIN board ON person.loginid=board.loginid WHERE board.type_id=${sntzedTypeId}`,(error2,join)=>{


                var context={
                    totalPages:totalPages,
                    pNum:pNum,
                    btname:sntzedTypeId,  
                      boardtype:boardtype,
                      name:join, 
                      board:mix,
                      button:buttonUI(req,res),
                      lg:authStatusUI(req,res),
                       boardtypes:subIds[0],
                       subIds:subIds[1],
                        menu:morcUI(req,res),
                        who:req.session.name,
                        body:'board.ejs',
                        logined:'YES',
                        cu:'U',
                        class1:req.session.class
                    }
                    res.app.render('home',context,(err,html)=>{
                        res.end(html) })
                }
            )
        }) }) })  }) })
        },
        detail:(req,res)=>{
            id=req.params.boardId;
            pid=req.params.pNum;
            var sql1=`select*from boardtype;`
            var sql2=`select*from code_tbl where main_id='0000';`
            db.query(sql1+sql2,(err,subIds)=>{
                db.query('select*from board where board_id=?',[id],(error,board)=>{
                    db.query(`SELECT*FROM person LEFT JOIN board ON person.loginid=board.loginid WHERE board.board_id=${id}`,(error2,join)=>{         
                    
                        context={
                loginid:board[0].loginid,
                btname:board,
                nowid:req.session.loginid,
                who1:join[0].name,
                button:buttonUI(req,res),
                lg:authStatusUI(req,res),
                menu:morcUI(req,res),
                body:'boardCRU.ejs',
                boardtypes:subIds[0],
                subIds:subIds[1],
                who:req.session.name,
                logined:'YES',
                co:'i',
                class1:req.session.class
               

            }
            res.app.render('home',context,(err,html)=>{
                res.end(html) })
            }) }) }) 
        },
        create:(req,res)=>{
            id=req.params.typeId
            var sql1=`select*from boardtype;`
            var sql2=`select*from code_tbl where main_id='0000';`
            db.query(sql1+sql2,(err,subIds)=>{  
                var context={
                    loginid:req.session.loginid,
                    btname:id,            
                    button:buttonUI(req,res),
                    lg:authStatusUI(req,res),
                    boardtypes:subIds[0],
                    subIds:subIds[1],
                    who:req.session.name,
                    body:'boardCRU.ejs',
                    menu:morcUI(req,res),
                    logined:'YES',
                    co:'c'
                }
                res.app.render('home',context,(err,html)=>{
                    res.end(html) })
            }) 

        },
        create_process:(req,res)=>{
            var post=req.body;
            sanitizetid=sanitizeHtml(post.type_id);
            sanitizetitle=sanitizeHtml(post.title);
            sanitizelid=sanitizeHtml(post.loginid);
            sanitizecontent=sanitizeHtml(post.content);
            sanitizedate=sanitizeHtml(post.date);
            sanitizepwd=sanitizeHtml(post.password);
            db.query(`INSERT INTO board (type_id,p_id,loginid,password,title,content,date)   
            VALUES(?,?,?,?,?,?,?)`,
           [sanitizetid,1,sanitizelid,sanitizepwd,sanitizetitle,sanitizecontent,sanitizedate],(error,board)=>{
            if(error){
                throw error;
              }
             res.redirect(`/board/view/${sanitizetid}/1`) 
             res.end();
            });
        },
       update:(req,res)=>{
        id=req.params.typeId
        bid=req.params.boardId
        pid=req.params.pNum
        var sql1=`select*from boardtype;`
        var sql2=`select*from code_tbl where main_id='0000';`
        db.query(sql1+sql2,(err,subIds)=>{  
            db.query('select*from board where board_id=?',[bid],(err,board)=>{
                db.query(`SELECT*FROM person LEFT JOIN board ON person.loginid=board.loginid WHERE board.board_id=${bid}`,(error2,join)=>{
                var context={
                loginid:board[0].loginid,
                btname:board, 
                who1:join[0].name,           
                button:buttonUI(req,res),
                lg:authStatusUI(req,res),
                boardtypes:subIds[0],
                subIds:subIds[1],
                who:req.session.name,
                body:'boardCRU.ejs',
                menu:morcUI(req,res),
                logined:'YES',
                co:'u'
            }
            res.app.render('home',context,(err,html)=>{
                res.end(html) })
        }) }) })
       },
       update_process:(req,res)=>{
        var post=req.body;
        sanitizetid=sanitizeHtml(post.type_id);
        sanitizetbid=sanitizeHtml(post.board_id);
        sanitizetitle=sanitizeHtml(post.title);    
        sanitizecontent=sanitizeHtml(post.content);
        db.query('UPDATE board SET title=?,content=? WHERE board_id=? ',
        [sanitizetitle,sanitizecontent,sanitizetbid],(error,result)=>{
          res.redirect(`/board/view/${sanitizetid}/1`) 
          res.end();
        })
       },
       delete_process:(req,res)=>{
        id=req.params.typeId
        bid=req.params.boardId
        pid=req.params.pNum
        db.query('DELETE FROM board WHERE board_id=? ',[bid],(error,result)=>{
            if(error){
              throw error;
            }
            res.redirect(`/board/view/${id}/1`) 
            res.end();
          });
       },
    }