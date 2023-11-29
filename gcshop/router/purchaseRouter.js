//201935292 염승현
const express=require('express');
var router=express.Router()
var purchase=require('../lib/purchase');

router.get('/:uv',(req,res)=>{
    purchase.home(req,res);
});
router.post('/purchase_process',(req,res)=>{
    purchase.purchase_process(req,res);
});
router.post('/usercreate_process',(req,res)=>{
    purchase.usercreate_process(req,res);
});
router.get('/cart/:uv',(req,res)=>{
    purchase.cart(req,res);
});
router.post('/buy_process',(req,res)=>{
    purchase.buy_process(req,res);
});
router.post('/cart_process',(req,res)=>{
    purchase.cart_process(req,res);
});
router.get('/cartupdate/:cartId',(req,res)=>{
    purchase.cartupdate(req,res);
});
router.post('/cartupdate_process',(req,res)=>{
    purchase.cartupdate_process(req,res);
});
router.get('/purchaseupdate/:purchaseId',(req,res)=>{
    purchase.purchaseupdate(req,res);
});
router.post('/purchaseupdate_process',(req,res)=>{
    purchase.purchaseupdate_process(req,res);
});
router.post('/cartdelete/:cartId',(req,res)=>{
    purchase.cartdelete_process(req,res);
});
router.post('/purchasedelete/:purchaseId',(req,res)=>{
    purchase.purchasedelete_process(req,res);
});
router.get('/cartcreate/c',(req,res)=>{
    purchase.cartcreate(req,res);
})

router.post('/cartcreate_process',(req,res)=>{
    purchase.cartcreate_process(req,res);
});
router.get('/purchasecreate/c',(req,res)=>{
    purchase.purchasecreate(req,res);
})

router.post('/purchasecreate_process',(req,res)=>{
    purchase.purchasecreate_process(req,res);
});

module.exports=router;