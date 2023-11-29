var db = require('./db');
const express = require('express');
var router = express.Router();
const formidable = require('formidable');

var sanitizeHtml=require('sanitize-html');

router.get('/page/:pageId', (req, res) => {
    id=req.params.pageId
   const hostName = req.headers.host;
    fetch(`http://${hostName}/api/getReviews/${id}`)
        .then(response => response.json())
        .then(data => {
          
            res.render('review', { title:data.title,reviews:data.reviews  });
        })  })
router.get('/create/:pageId', (req, res) => {
     id=req.params.pageId
     const hostName = req.headers.host;
         fetch(`http://${hostName}/api/getcreate/${id}`)
             .then(response => response.json())
              .then(data => {
                  
     res.render('create', { titleId:data.titles  });
          })  })
          router.post('/create_process', (req, res) => {
        
                var post = req.body
                var sanitizedauthor = sanitizeHtml(post.author);
                var sanitizedscore = sanitizeHtml(post.score);
                var sanitizeddescrpt = sanitizeHtml(post.descrpt);
                var sanitizedtitleid = sanitizeHtml(post.title_id);
        
                db.query(`INSERT INTO review(author, score, descrpt, title_id)   
                    VALUES (?, ?, ?, ?)`,
                    [sanitizedauthor, sanitizedscore,sanitizeddescrpt,sanitizedtitleid],
                    (error, review) => {
                        if (error) {
                            console.error(error);
                        }
                        res.redirect(`/review/page/${sanitizedtitleid}`);
                        res.end()
                        
                    });
            });
       
           

module.exports = router;
