const functions = require('firebase-functions');
const app = require('express')();
const admin = require('firebase-admin');


admin.initializeApp(functions.config().firebase);

var db = admin.database();
var ref = db.ref("/");


app.get('/encode', (req, res) => {  
    let urlToShort = req.query.url;
    
    var newUrl = ref.push();
    
    var shortenUrl = newUrl.key.substring(newUrl.key.length-5);

    newUrl.set({
        url: urlToShort,
        encoded: shortenUrl
    });
    
    res.send(shortenUrl);
});


app.get('/decode/:shorten', (req, res) => {  
    let encoded = req.params.shorten;

    ref.orderByChild("encoded").equalTo(encoded).on("child_added", function(querySnapshot){
        
        res.redirect(301, querySnapshot.toJSON().url);
    });
});

exports.curt = functions.https.onRequest(app);