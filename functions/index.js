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
        encoded: shortenUrl,
        visit: 0
    });
    
    res.send(shortenUrl);
});


app.get('/decode/:shorten', (req, res) => {  
    let encoded = req.params.shorten;
   
    ref.orderByChild("encoded").equalTo(encoded).once("value").then(function(querySnapshot){
        if(querySnapshot.exists()){
            querySnapshot.forEach(function(result) {

                console.log(result.key);
                ref.child(result.key).once("value").then(function (snapshot) {
                    console.log(snapshot.val());

                    var element = snapshot.val();
                    
                    ref.child(result.key).update({"visit": ++element.visit});
                    
                    //TODO move redirect to front-end
                    res.redirect(301, element.url);
                });
            });
        } else {
            console.log("Not exist");

            res.send(404, "Url not found!")
        }
    });
});

exports.curt = functions.https.onRequest(app);