const express = require("express");
const app = express();
const port = process.env.PORT || 8000;
const hbs = require("hbs");
const mysql = require("./connection").con


app.use(express.urlencoded());
app.use(express.json());



app.set("view engine","hbs");
app.set("views","./view");



// configuration
app.get('/',(req,res)=>{
    res.render("index")
})
app.get('/add',(req,res)=>{
    res.render("add");
})
app.get('/search',(req,res)=>{
    res.render("search");
})
app.get('/delete',(req,res)=>{
    res.render("delete");
})
app.get('/view',(req,res)=>{
    // res.render("view");
    let qry = "select * from test";

    mysql.query(qry,(err,results)=>{
        if(err) throw err;
        else{
            res.render("view",{data: results});
        }
    })
})
app.get('/update',(req,res)=>{
    res.render("update");
})
app.get('/search',(req,res)=>{
    res.render("search");
})


app.get("/addstudent",(req,res)=>{

    const {name,date,tempr,humidity}=req.query

    // Sanitization XSS..
    let qry = "select * from test where date=?";
    mysql.query(qry,[date],(err,results)=>{
        if(err){
            throw err;
        }else{
            if(results.length > 0){
                res.render("add",{checkmesg: true})
            }
            else{
                //insert querry
                let qry2 = "insert into test values(?,?,?,?)"
                mysql.query(qry2,[name,date,tempr,humidity],(err,results)=>{
                    if(results.affectedRows>0){
                        res.render("add",{mesg: true});
                    }
                })
            }
        }
    });
})


// app.post("/searchstudent",(req,res)=>{
//     res.send(req.body);
// })

app.get("/searchstudent",(req,res)=>{
    // res.send(req.query)
    // fetch data from form
    const {date} = req.query;
    let qry = "select * from test where date=?";
    mysql.query(qry,[date],(err,results)=>{
        if(err) throw err;
        else{
            if(results.length>0){
                res.render("search",{mesg1:true, masg2: false})
            }else{
                res.render("search",{mesg1:false, masg2: true})

            }
        }
    })
})

app.get("/updatesearch",(req,res)=>{
    const {date} = req.query;
    let qry = "select * from test where date=?";
    mysql.query(qry,[date],(err,results)=>{
        if(err) throw err;
        else{
            if(results.length>0){
                res.render("update",{mesg1:true, masg2: false, data:results})
            }else{
                res.render("update",{mesg1:false, masg2: true})
            }
        }
    })
})



app.get('/updatestudent',(req,res)=>{
    // fetch data
    const {phone,name,gender}=req.query;
    let qry = "update test set username=?, gender=? where phoneno=?";
    mysql.query(qry,[name,gender,phone],(err,results)=>{
        if(err) throw err;
        else{
            if(results.affectedRows>0){
                res.render("update",{umesg:true})
            }
        }
    })
})

app.get('/removestudent',(req,res)=>{
    // fetch data
    const {date} = req.query;
    let qry = "delete from test where date=?";
    mysql.query(qry,[date],(err,results)=>{
        if(err) throw err;
        else{
            if(results.affectedRows>0){
                res.render("delete",{mesg1:true, masg2: false})
            }else{
                res.render("delete",{mesg1:false, masg2: true})

            }
        }
    })
})





app.listen(port,(err)=>{
    if(err){
        console.log(err);
    }else{
        console.log("Server is running on port number "+port);
    }
})