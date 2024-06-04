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
            pool.query("insert into MYnote.users(username,password_hash,id) values(?,?,?)",[username,hash,id],(err,result,fields)=>{
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
      pool.query("insert into MYnote.Note(personalnote,id) value(?,?)",[text,id],(err,result,fields)=>{
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
    const password2 = req.body.password2;
    username2 = req.body.username2;

    pool.query("SELECT * FROM MYnote.users WHERE username = ?", [username2], (err, result, fields) => {
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
