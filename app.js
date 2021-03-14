//jshint esversion:6

// Keep Secret safe
require('dotenv').config();
// Keeo Secret safe


const express = require("express");
const enforce = require('express-sslify');
const bodyParser = require("body-parser");

//News letter notes
const request= require("request");
const https= require("https")
//News letter notes

const ejs = require("ejs");


const app = express();
app.use(enforce.HTTPS({trustProtoHeader: true}));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.get("/", function(req,res){
    res.render("home")
});

app.post("/", function(req,res){
   const fullName=req.body.name;
   const email=req.body.email;


   //go to this area of the mailchimp.com than click on "show Properties"
   //https://mailchimp.com/developer/reference/lists/
   const data={
       members:[
           {
               email_address:email,
               status:"subscribed",

               //go to this area of the mailchimp.com, go audience manager than click on "manage contacts" last click on "Audience fields and [MERGE] TAGS"
            //https://us10.admin.mailchimp.com/lists/settings/merge-tags?id=321781
               merge_fields:{
                   FNAME:fullName
               }
           }
       ]
   };
   const jsonData=JSON.stringify(data)


   // Go to "https://mailchimp.com/developer/guides/get-started-with-mailchimp-api-3/" than scroll down until you see "Request body parameters" underneath that copy the link like this "https://usX.api.mailchimp.com/3.0/lists/"
   const url="https://us"+process.env.number+".api.mailchimp.com/3.0/lists/"+process.env.ID

    const option={
        method:"POST",
        auth:"Joey24:"+process.env.API
    }
    const request =https.request(url,option, function(response){
        if(response.statusCode===200){
            res.render("success")
        }else{
            res.render("failure")
        }
        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    })
    request.write(jsonData)
    request.end()
});

app.get("/success", function(req,res){
    res.render("success")
});
app.get("/failure", function(req,res){
    res.render("failure")
});

app.listen(process.env.PORT || 3000,function(){
    console.log("Server has started Successfully")
  });
