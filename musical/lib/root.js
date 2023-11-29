var db=require('./db');
var qs=require('querystring');
var sanitizeHtml=require('sanitize-html');


module.exports={
    home:(req,res)=>{
      db.query('select*from title',(err,title)=>{
     
        var context={
            title:title,
        }
        req.app.render('home',context,(err,html)=>{
            res.end(html);
        }); })
    },

}