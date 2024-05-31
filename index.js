const express = require("express");

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
app.get("/",(req,res)=>{
    res.render("index.ejs");
})
const port = process.env.PORT || 34000;
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