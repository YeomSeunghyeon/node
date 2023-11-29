//201935292 염승현

var mysql=require('mysql');
var db=mysql.createConnection({
    host   :'localhost',
    user   :'nodejs',
    password:'nodejs',
    database:'webdb2023'
});
db.connect();
module.exports=db;