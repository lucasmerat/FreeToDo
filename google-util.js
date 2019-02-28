const {google} = require('googleapis');
const express = require("express");

const app = express();

app.set('view engine', 'ejs');

// app.get('/', function(req,res){
//     res.render({url});
// });

app.listen(3000);


const googleConfig = {
  clientId: '26822503413-ladr99bfvg408ec73jpa5tdhecgboehe.apps.googleusercontent.com', // e.g. asdfghjkljhgfdsghjk.apps.googleusercontent.com
  clientSecret: 'RqS2u0u-cfWCQsuEv9upyRFS', // e.g. _ASDFA%DFASDFASDFASD#FAD-
  redirect: 'http://localhost:3000' // this must match your google api settings
};

/**
 * Create the google auth object which gives us access to talk to google's apis.
 */
function createConnection() {
  return new google.auth.OAuth2(
    googleConfig.clientId,
    googleConfig.clientSecret,
    googleConfig.redirect
  );
}

const defaultScope = [
    'https://www.googleapis.com/auth/calendar'
  ];

function getConnectionUrl(auth) {
return auth.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent', // access type and approval prompt will force a new refresh token to be made each time signs in
    scope: defaultScope
});
}

function urlGoogle() {
    const auth = createConnection(); // this is from previous step
    const url = getConnectionUrl(auth);
    return url;
}

let url = urlGoogle();
console.log(url)

app.get('/', function(req,res){
    res.render("index",{url})
})