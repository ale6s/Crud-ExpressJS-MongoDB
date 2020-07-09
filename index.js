const express = require('express');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mongo = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
const assert = require("assert");
const url = "mongodb://localhost:27017/user_info";
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");


app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");
app.enable("view cache");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//using public as the defualt folder. without this style will not be aplyed 
app.use(express.static(__dirname + '/public/'));

const port = process.env.port || 5000;
http.listen(port, () => {
    console.log(`server running in ${port}`);
})
///config ************************************************************************



//routing to index
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
  });
//routing to about page
app.get('/about', (req, res) => {
    res.sendFile(__dirname + '/public/about.html');
});
//routing to contact page
app.get('/contact', (req, res) => {
    res.sendFile(__dirname + '/public/contact.html');
});
//routing to drag page
app.get('/drag', (req, res) => {
    res.sendFile(__dirname + '/public/drag.html');
});
//routing to ajax page
app.get('/ajax', (req, res) => {
    res.sendFile(__dirname + '/public/ajax.html');
});

app.get('/chat', (req, res) => {
    res.sendFile(__dirname + '/public/chat.html');
    io.on('connection', (socket) => {
        console.log("A user is connected!");
    
        socket.on("disconect.", () =>{
            console.log("A user has left the chat room");
        });
    
        socket.on("my chat", (msg) => {
            console.log(msg);
            io.emit("my chat", msg);
        })
    
    });
});



//routing to crud page

//display function
app.get("/api/users", (req, res) => {
    mongo.connect(url, { useNewUrlParser: true }, function (err, database) {
      const db = database.db("user_info");
      db.collection("users")
        .find()
        .toArray((err, result) => {
          if (err) {
            throw err;
          }
          console.log(result.length + " documents retrieved.");
          //console.log(result);
          //res.json(result);
          res.render("users", { data: result, layout: false });
          database.close();
        });
    });
  });
  
  //add function
  app.post("/api/users", (req, res) => {
    var user = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
    };
    mongo.connect(url, { useNewUrlParser: true }, (err, database) => {
      const db = database.db("user_info");
      db.collection("users").insertOne(user, (err, result) => {
        if (err) {
          throw err;
        }
        console.log("Document inserted successfully.");
        //res.json(result);
        res.redirect("/api/users");
        database.close();
      });
    });
  });
  
  //update functioon
  app.post('/api/users/update', function(req, res) { mongo.connect(url, function(err, db) {
    var user = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
    };
    var id = req.body.id;
    mongo.connect(url, { useNewUrlParser: true }, (err, database) => {
      const db = database.db("user_info");
      db.collection("users").updateOne({"_id": ObjectID(id)}, {$set: user} , (err, result) => {
        if (err) {
          throw err;
        }
        console.log("Document inserted successfully.");
        //res.json(result);
        res.redirect("/api/users");
        database.close();
      });
    });
  }); 
  });
  
  
  
  //delete function
  app.post('/api/users/delete', function(req, res) { mongo.connect(url, function(err, db) {
    var id = req.body.id;
    mongo.connect(url, { useNewUrlParser: true }, (err, database) => {
      const db = database.db("user_info");
      db.collection("users").deleteOne({"_id": ObjectID(id)}, (err, result) => {
        if (err) {
          throw err;
        }
        console.log("Document inserted successfully.");
        //res.json(result);
        res.redirect("/api/users");
        database.close();
      });
    });
  }); 
  });
















