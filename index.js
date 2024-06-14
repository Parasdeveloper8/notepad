const express = require('express');

const bcrypt = require('bcrypt');

//const nodemailer = require('nodemailer');
/*const transport = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:"parasprajapat8th@gmail.com",
        pass:'8890Aaaa@'
    }
});
const mailOptions = {
    from:'parasprajapat8th@gmail.com',
    to:'pehooverma703@gmail.com',
    subject:'blank',
    text:'blank'
}
transport.sendMail(mailOptions,(error,info)=>{
    if(error){
        console.error(error);
    }
    else{
        console.log("ok");
    }
})*/
const app = express();

const ejs = require("ejs");

const {createPool} = require("mysql2");
const { error } = require("console");

app.set("view engine","ejs");

app.set("views","./views");

app.use(express.static(__dirname + '/public'));
//relative mean
const pool = createPool({
    host:"localhost",
    user:"root",
    password:"8890Aaaa@",
    database:"mynote",
    connectionLimit:30
});
app.use(express.urlencoded({extended:false}));

const saltRounds = 10;
let username2;
let id;
app.get("/",(req,res)=>{
    res.render("index.ejs");
})
app.post("/regis",(req,res)=>{
    const mypassword = req.body.password;
    const username = req.body.username;
    id = req.body.sid;
     bcrypt.hash(mypassword,saltRounds,(err,hash)=>{
        if(err){
            console.log(err);
        }
        else{
            pool.query("insert into mynote.user(id,username,password_hash) values(?,?,?)",[id,username,hash],(err,result,fields)=>{
                if(err){
                    console.error(err);
                    res.send("failed");
                }
                else{
                    console.log(result);
                    res.send("successfull");
                }
            });
        }
    });})

const port = process.env.PORT || 5500;
app.post("/saveNote",(req,res)=>{
      const text = req.body.notes;
      const userid= req.body.noteid;
      const random = Math.floor(Math.random()*1000);
      const saveTime = new Date(); 
      const date = saveTime.getDate(); 
      const month = saveTime.getMonth() + 1;
      const year = saveTime.getFullYear();
      const hour = saveTime.getHours();
      const minute = saveTime.getMinutes();
      const second = saveTime.getSeconds(); 
      const millisecond = saveTime.getMilliseconds();
      const nd = `${year}-${month}-${date} ${hour}:${minute}:${second}.${millisecond}`; 

      pool.query("insert into mynote.notes(id,userId,text,time) value(?,?,?,?)",[random,userid,text,nd],(err,result,fields)=>{
        if(err){
            res.render("error.ejs");
            console.log(err);
        }
        else{
            res.render("pass.ejs");
            console.log(JSON.stringify(result));
            console.log(typeof result);
        }
      })
      
})
app.listen(port,()=>{
    console.log(`server started at ${port} ${Date.now()}`);
})
app.post("/savednotesapi",(req,res)=>{
    const gid = req.body.getdatabyid;
    pool.query("select text from MYnote.notes where userId = ?",[gid],(err,result,fields)=>{
        if(err){
           res.send(err);
        }
        else{
            res.render("endres",{data:result});
        }
    })
})
app.get("/getyour",(req,res)=>{
    res.render("savednotes");
})
app.get("/user",(req,res)=>{
    res.render("userp");
})
app.get("/reg",(req,res)=>{
    res.render("register");
})
app.get("/log",(req,res)=>{
    res.render("login");
})

app.post("/login",(req,res)=>{
    const password2 = req.body.password2;
    username2 = req.body.username2;

    pool.query("SELECT * FROM mynote.user WHERE username = ?", [username2], (err, result, fields) => {
        if (err) {
            console.error(err);
            return res.send("Failed to query database");
        }

        if (result.length !== 1) {
            // User not found
            return res.send("User not found");
            console.log(result);
        }

        const storedHash = result[0].password_hash;
        bcrypt.compare(password2, storedHash, (err, match) => {
            if (err) {
                console.error(err);
                res.send("Failed to compare passwords");
            }

            if (match) {
                res.render("username",{usern:username2}); 
            } else {
                res.send("Incorrect password");
            }
        });
    });
});



