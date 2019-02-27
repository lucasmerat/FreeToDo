let google = require('googleapis');
let privatekey = require("./privatekey.json");
// configure a JWT auth client
let jwtClient = new google.auth.JWT(
       privatekey.client_email,
       null,
       privatekey.private_key,
       ['https://www.googleapis.com/auth/calendar']);
//authenticate request
jwtClient.authorize(function (err, tokens) {
 if (err) {
   console.log(err);
   return;
 } else {
   console.log("Successfully connected!");
 }
});

let calendar = google.calendar('v3');
calendar.events.list({
   auth: jwtClient,
   calendarId: 'primary'//whatever
}, function (err, response) {

});