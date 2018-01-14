const functions = require('firebase-functions');

const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const base = alphabet.length; // base is the length of the alphabet (62 in this case)

var urls = []

var id = -1;

exports.encode = functions.https.onRequest((request, response) => {
    let urlToShort = request.query.url;

    id +=1;

    urls[id] = {
        url: urlToShort,
        encoded: encode(id)
    } 
    
    response.send(urls[id]);
});

// utility function to convert base 10 integer to base 58 string
function encode(num){
    var encoded = '';
    while (encoded.length < 4){
      var remainder = num % base;
      num = Math.floor(num / base);
      encoded = alphabet[remainder].toString() + encoded;
    }
    return encoded;
  }

  // utility function to convert a base 58 string to base 10 integer
function decode(str){
    var decoded = 0;
    while (str){
      var index = alphabet.indexOf(str[0]);
      var power = str.length - 1;
      decoded += index * (Math.pow(base, power));
      str = str.substring(1);
    }
    return decoded;
  }