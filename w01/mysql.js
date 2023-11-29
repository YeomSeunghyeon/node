var mysql=require('mysql');
var connection=mysql.createConnection({
    host   :'localhost',
    user   :'nodejs',
    password:'nodejs',
    database:'webdb2023'
});

connection.connect();
connection.query('SELECT * from topic',(error,results,fields)=>{
    if(error){
        console.log(error);
    }
    console.log(results);
    console.log(fields);
});
connection.end();