const express = require('express');

const bcrypt = require('bcrypt');

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
    const unique =id + Math.floor(Math.random())*Math.random()+id ;
     bcrypt.hash(mypassword,saltRounds,(err,hash)=>{
        if(err){
            console.log(err);
        }
        else{
            pool.query("insert into mynote.user(id,username,password_hash) values(?,?,?)",[unique,username,hash],(err,result,fields)=>{
                if(err){
                    console.error(err);
                    res.send("failed");
                }
                else{
                    console.log(result);
                    res.send(`successfully registered your uniqueid is ${unique}`);
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


