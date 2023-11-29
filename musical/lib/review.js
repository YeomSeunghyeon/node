var db=require('./db');
var qs=require('querystring');
var sanitizeHtml=require('sanitize-html');


module.exports={
    page:(req,res)=>{
      id=req.params.pageId;
      db.query('select *from title where id=?',[id],(err,title)=>{
       db.query('select*from review where title_id=?',[id],(err1,review)=>{      
        var context={
            title:title,
            review:review
        }
        req.app.render('review',context,(err,html)=>{
            res.end(html);
      }) }) })

    },
    create:(req,res)=>{
        id=req.params.pageId;
       var context={
        id:id,
        cu:'c'
       }

        req.app.render('create',context,(err,html)=>{
            res.end(html);
        })
    },
    create_process:(req,res)=>{
        var post=req.body;
        sanitizedauthor=sanitizeHtml(post.author)
        sanitizedscore=sanitizeHtml(post.score)
        sanitizeddescrpt=sanitizeHtml(post.descrpt)
        sanitizedtitleid=sanitizeHtml(post.title_id)
        db.query(`INSERT INTO review (author,score,descrpt,title_id)   
        VALUES(?,?,?,?)`,
        [sanitizedauthor,sanitizedscore,sanitizeddescrpt,sanitizedtitleid],(error,review)=>{
            if (error) {
                console.error(error);  
            }
         res.redirect(`/review/page/${sanitizedtitleid}`) 
         res.end();
        });
    },
    update:(req,res)=>{
        id=req.params.pageId;
        rid=req.params.reviewId;
        db.query('select*from review where id=?',[rid],(err,review)=>{

            var context={
                id:id,
                review:review,
                rid:rid,
                cu:'u'
            }
            req.app.render('create',context,(err,html)=>{
                res.end(html);
            })
        })

    },
    update_process:(req,res)=>{
        var post=req.body;
        sanitizedauthor=sanitizeHtml(post.author)
        sanitizedscore=sanitizeHtml(post.score)
        sanitizeddescrpt=sanitizeHtml(post.descrpt)
        sanitizedid=sanitizeHtml(post.id)
        sanitizedtitleid=sanitizeHtml(post.title_id)
        db.query(`UPDATE review SET author=?,score=?,descrpt=? WHERE id=?`,
        [sanitizedauthor,sanitizedscore,sanitizeddescrpt,sanitizedid],(error,review)=>{
            if (error) {
                console.error(error);  
            }
         res.redirect(`/review/page/${sanitizedtitleid}`) 
         res.end();
        });

    },
    delete_process:(req,res)=>{
        id=req.params.pageId;
        rid=req.params.reviewId;
        db.query('DELETE FROM review WHERE id=?',[rid],(error,result)=>{
            if(error){
              throw error;
            }
            res.redirect(`/review/page/${id}`) 
            res.end();
          });
    },

}