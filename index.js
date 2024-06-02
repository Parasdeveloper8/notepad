const express = require("express");

const bcrypt = require('bcrypt');

const app = express();

const ejs = require("ejs");

const {createPool} = require("mysql2");

app.set("view engine","ejs");

app.set("views","./views");

app.use(express.static(__dirname + '/public'));
//relative mean
const pool = createPool({
    host:"localhost",
    user:"root",
    password:"8890Aaaa@",
    database:"MYnote",
    connectionLimit:30
});
app.use(express.urlencoded({extended:false}));

const saltRounds = 10;

app.get("/",(req,res)=>{
    res.render("index.ejs");
})


app.post("/regis",(req,res)=>{
    const mypassword = req.body.password;
    const username = req.body.username;
    const id = req.body.id;
     bcrypt.hash(mypassword,saltRounds,(err,hash)=>{
        if(err){
            console.log(err);
        }
        else{
            pool.query("insert into MYnote.users(id,username,password_hash) values(?,?,?)",[id,username,hash],(err,result,fields)=>{
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
      pool.query("insert into MYnote.Note(personalnote) value(?)",[text],(err,result,fields)=>{
        if(err){
            res.render("error.ejs");
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
app.get("/savednotesapi",(req,res)=>{
    pool.query("select * from MYnote.Note",(err,result,fields)=>{
        if(err){
           res.send(err);
        }
        else{
           const dt= JSON.stringify(result);
            res.render("endres",{data:dt});
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
    const pass2 = req.body.password2;
    const usern = req.body.username2;
    pool.query("SELECT * FROM MYnote.users WHERE password_hash = ? AND username = ?",[pass2,usern],(err,result,fields)=>{
        if(err){
            res.send("failed");
            console.error(err);
        }
        else {
            console.log(result);
                res.send("logged in successfully");
        }
    })
});