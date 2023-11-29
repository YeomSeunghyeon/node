//201935292 염승현
const express=require('express');
var router=express.Router()
var shop=require('../lib/shop');

router.get('/shop/:category',(req,res)=>{
    shop.home(req,res);
});
router.get('/',(req,res)=>{
    shop.home(req,res);
});
router.post('/shop/search',(req,res)=>{
    shop.search(req,res);
});
router.get('/shop/detail/:merId/:uv',(req,res)=>{
    shop.detail(req,res);
});
router.get('/shop/anal/customer',(req,res)=>{
    shop.customeranal(req,res);
});
router.get('/shop/anal/brand',(req,res)=>{
    shop.brandanal(req,res);
})

module.exports=router;