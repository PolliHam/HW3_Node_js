var express = require('express');
var cors = require('cors');

var app = express();
const MongoClient = require('mongodb').MongoClient;

var ODataServer = require('simple-odata-server');
var Adapter = require('simple-odata-server-mongodb');

var model = {
    namespace: "jsreport",
    entityTypes: {
        "AccountType": {
            "_id": {
                "type": "Edm.String",
                key: true
            },
            "name": {
                "type": "Edm.String"
            },
            "depositAmount": {
                "type": "Edm.Int32"
            },
            "typeUser": {
                "type": "Edm.String"
            },
            "pin": {
                "type": "Edm.Int32"
            },
            "dateCreate": {
                "type": "Edm.Date"
            } 
        }
    },
    

    entitySets: {
        "accounts": {
            entityType: "jsreport.AccountType"
        }
    }
};

const url = `mongodb+srv://user:1111@cluster0-gmvft.mongodb.net/test?retryWrites=true&w=majority`;

var odataServer = ODataServer(process.env.PORT || 3000).model(model);

app.listen(process.env.PORT, function(req , res){
    console.log("Server is working on port 3000");
});

app.use(cors());

app.use("/", function (req, res) {
    console.log(odataServer,req,res)
    odataServer.handle(req, res);
});


MongoClient.connect(url, function(err, db) {
    odataServer.adapter(Adapter(function(cb) { 
        cb(err, db.db('AccoutsDB')); 
    })); 
});