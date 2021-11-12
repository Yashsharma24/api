const mysql = require('mysql');
const express=require('express');
const bodyparser=require('body-parser');


var Cryptr = require('cryptr');
cryptr = new Cryptr('myTotalySecretKey');



 


const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'applore'
});


let p;
connection.connect((err,db)=>{
  if(!err){
    p=db;
  }
  else{
    console.log(("error come"));
    
  }
})

const app=express();  

app.post('/register',bodyparser.json(), (req,res,next)=>{
    var encryptedString = cryptr.encrypt(req.body.password);
      var users={
          "name":req.body.name,
          "email":req.body.email,         
          "password":encryptedString,
      }
      connection.query('INSERT INTO user_register SET ?',users, function (error, results, fields) {
        if(error)throw error;
        if (error) {
          res.json({
              status:false,
              message:'there are some error with query'
          })
        }else{
            res.json({
              status:true,
              data:results,
              message:'user registered sucessfully'
          })
        }
      });
     })


     app.post('/Addorder' ,bodyparser.json() ,(req,res,next)=>{
     
        // res.send(req.body.name);
         var params=req.body;
           console.log(req.body.name);
           connection.query("INSERT INTO product  SET ?",params, function (err, result) {
             if (err) throw err;
             
             res.send({message:"records are  inserted succesfully: " ,error:"false"});
             if(result.affectedRows==0){
               res.send({message:"data not found"});
              }
             // console.log((res.message));
           })
           });
         
     
 app.post('/login',bodyparser.json(), (req,res,next)=>{
   
 

      var password =req.body.password;
     
     
      connection.query('SELECT * FROM user_register WHERE email = ? ',[req.body.email], function (error, results, fields) {
        console.log(results[0].password);
        if (error) {
            res.json({
              status:false,
              message:'there are some error with query'
              })
        }
       
        else{
         
          if(results.length >0){
          
     const decryptedString = cryptr.decrypt(results[0].password);
              if(password==decryptedString){
                  res.json({
                      status:true,
                      message:'successfully authenticated'
                  })
              }else{
                  res.json({
                    status:false,
                    message:"Email and password does not match"
                   });
              }
            
          }
          else{
            res.json({
                status:false,    
              message:"Email does not exits"
            });
          }
        }
      });
     })



     app.put('/update',bodyparser.json(),(req,res,next)=>{
        //res.send(req.body.id);
         var params=req.body;
        // var result=[0];
           connection.query("UPDATE product  SET ? WHERE id=? ",[params,req.body.id], function (err, result) {
             if (err) throw err;
             connection.query("SELECT * FROM product WHERE id=? ",[req.body.id],function(err,data){
             //console.log("1 record updated");
             res.send({message:" records are updated successfully: ",error:"false","data":data[0]});
             })
         });
       })

 
       app.post('/view.json' ,bodyparser.json() ,(req,res,next)=>{
 
        //res.send(req.body.id);
        var params=req.body;
          connection.query("SELECT * FROM caegory WHERE id=? ",[req.body.id], function (err, data,fields) {
            
            if (err) throw err;
           // console.log(data);
             res.send({message:"data fetch sucuessfully",error:"false","data":data[0]});
             if(err){
               res.send({message:"data not found"});
             }
           //  console.log((res.message));
          });
         
          });


       app.post('/deleteData' ,bodyparser.json() ,(req,res,next)=>{
    
        // res.send(req.body.id);
         var params=req.body.id;
           //console.log(req.body.name);
           connection.query("DELETE FROM product WHERE id =?",[req.body.id], function (err, result) {
             if (err) throw err;
             
             console.log("Number of records deleted: " + result.affectedRows);
             if(result.affectedRows==0){
               res.send({message:"data not found",error:"true"});
             }
             else
             res.send({message:"data deleted succesfully",error:"false"});
           });
         });

         
app.listen(4300, () => console.log(`Example app listening on port 4300!`))