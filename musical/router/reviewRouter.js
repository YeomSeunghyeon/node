
const express=require('express');
var router=express.Router()

var review=require('../lib/review');

router.get('/page/:pageId',(req,res)=>{
    review.page(req,res);
});
router.get('/create/:pageId',(req,res)=>{
    review.create(req,res);
});
router.post('/create_process',(req,res)=>{
    review.create_process(req,res);
});
router.get('/update/:pageId/:reviewId',(req,res)=>{
    review.update(req,res);
});
router.post('/update_process',(req,res)=>{
    review.update_process(req,res);
});
router.get('/delete/:pageId/:reviewId',(req,res)=>{
    review.delete_process(req,res);
});
module.exports=router;