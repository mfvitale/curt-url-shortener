const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

var db = admin.database();
var ref = db.ref("/");


exports.encode = functions.https.onRequest((request, response) => {
    let urlToShort = request.query.url;

    var insterted = ref.push(urlToShort);
    
    response.send(insterted.key.substring(insterted.key.length-5));
});

exports.decode = functions.https.onRequest((request, response) => {
    let encoded = request.query.encoded;

    ref.orderByKey().on("value", function(querySnapshot){
        response.send(querySnapshot);
    });
});