const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

var db = admin.database();
var ref = db.ref("/");


exports.encode = functions.https.onRequest((request, response) => {
    let urlToShort = request.query.url;

    var newUrl = ref.push();
    
    var shortenUrl = newUrl.key.substring(newUrl.key.length-5);

    newUrl.set({
      url: urlToShort,
      encoded: shortenUrl
    });
    
    response.send(shortenUrl);
});

exports.decode = functions.https.onRequest((request, response) => {
    let encoded = request.query.encoded;
    
    ref.orderByChild("encoded").equalTo(encoded).on("child_added", function(querySnapshot){
    
        response.redirect(301, querySnapshot.toJSON().url);
    });
});