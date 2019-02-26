// Client ID and API key from the Developer Console
let CLIENT_ID =
  "26822503413-ladr99bfvg408ec73jpa5tdhecgboehe.apps.googleusercontent.com";
let API_KEY = "AIzaSyBpArWGtpMF-RUiodjnwqk8lTmlSmJxrAQ";

// Array of API discovery doc URLs for APIs used by the quickstart
let DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"
];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
let SCOPES = "https://www.googleapis.com/auth/calendar";

let authorizeButton = document.getElementById("authorize_button");
let signoutButton = document.getElementById("signout_button");
let newEventBox = document.getElementById("new-event-box");
let newEventButton = document.getElementById("new_event");

// /**
//  *  On load, called to load the auth2 library and API client library.
//  */
function handleClientLoad() {
  gapi.load("client:auth2", initClient);
}

// /**
//  *  Initializes the API client library and sets up sign-in state
//  *  listeners.
//  */
function initClient() {
  gapi.client
    .init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES
    })
    .then(
      function() {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
      },
      function(error) {
        appendPre(JSON.stringify(error, null, 2));
      }
    );
}

// /**
//  *  Called when the signed in status changes, to update the UI
//  *  appropriately. After a sign-in, the API is called.
//  */
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    authorizeButton.style.display = "none";
    signoutButton.style.display = "block";
    newEventBox.style.display = "block";
    listUpcomingEvents();
  } else {
    authorizeButton.style.display = "block";
    signoutButton.style.display = "none";
    newEventBox.style.display = "none";
  }
}

// /**
//  *  Sign in the user upon button click.
//  */
function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

// /**
//  *  Sign out the user upon button click.
//  */
function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}

// /**
//  * Append a pre element to the body containing the given message
//  * as its text node. Used to display the results of the API call.
//  *
//  * @param {string} message Text to be placed in pre element.
//  */
function appendPre(message) {
  let pre = document.getElementById("content");
  let textContent = document.createTextNode(message + "\n");
  pre.appendChild(textContent);
}

// /**
//  * Print the summary and start datetime/date of the next ten events in
//  * the authorized user's calendar. If no events are found an
//  * appropriate message is printed.
//  */
function listUpcomingEvents() {
  //Pull busy results for this week

  gapi.client.calendar.events
    .list({
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      timeMax: sevenDays(),
      showDeleted: false,
      singleEvents: true,
      orderBy: "startTime"
    })
    .then(function(response) {
      let events = response.result.items;
      appendPre("Upcoming events:");

      if (events.length > 0) {
        for (i = 0; i < events.length; i++) {
          let event = events[i];
          let when = event.start.dateTime;
          if (!when) {
            when = event.start.date;
          }
          appendPre(event.summary + " (" + when + ")");
        }
      } else {
        appendPre("No upcoming events found.");
      }
    });
}

//
///// My work
//

$("#get-busy").on("click", queryTimes);

function queryTimes(){
    let min = moment().toISOString();
    let max = moment().add(12, 'h').toISOString()
    console.log(max)
    checkAvail(min,max);
}

function loopTimes(){

}

function checkAvail(min, max) {
  gapi.client.calendar.freebusy
    .query({
      timeMin: min,
      timeMax: max,
      items: [{ id: "primary" }]
    })
    .then(
      function(response) {
        console.log("hey");
        console.log(moment(response.result.calendars.primary.busy[0].start).format("dddd, MMMM Do YYYY, h:mm:ss a"));
        console.log(moment(response.result.calendars.primary.busy[0].end).format("dddd, MMMM Do YYYY, h:mm:ss a"));
      },
      function(err) {
          console.log(err.result.error.message)
        if (err.result.error.message === "The specified time range is empty.") {
          console.log(`${min} - ${max} is a free slot`);
        }
      }
    );
}

// function displayBusyTimes(){
//         gapi.client.calendar.freebusy
//         .query({
//           timeMin: new Date().toISOString(),
//           timeMax: new Date().toISOString(),
//           items: [{ id: "primary" }]
//         })
//         .then(function(response) {
//             console.log("hey")
//             console.log(response)
//             let busyTimes = response.result.calendars.primary.busy;
//             busyTimes.forEach(item => {
//                 $("#busy-times").append(`Start of busy slot: ${item.start} <br> End of busy slot: ${item.end} <br>`)
//             })},
//             function(err){
//                 if(err.result.error.message == "The specified time range is empty."){
//                     console.log("This slot is free")
//                 }
//             });
// }

//Here I am going to make a function that loops through hours or minutes based on duration - when it finds a query response of error it will make foundtime true and then create an event at that time

// function findTime() {
//     let foundTime = false;
//     while (foundTime === false){
//         if ()
//     }
//     gapi.client.calendar.freebusy
//         .query({
//           timeMin: new Date().toISOString(),
//           timeMax: sevenDays(),
//           items: [{ id: "primary" }]
//         })
// }

//returns the date of the end of this current week

function sevenDaysNoIso() {
    let date = moment().add(7,'d');
    return date;
}

function sevenDays() {
    let date = moment().add(7,'d');
    return date.toISOString();
  }

let event = {
  summary: "",
  location: "5107 Avenue G. Austin Texas",
  description: "A chance to hear more about Google's developer products.",
  start: {
    dateTime: ""
  },
  end: {
    dateTime: ""
  }
};

function createEvent(startDate, endDate) {
  let eventName = document.getElementById("name").value;
  event.summary = eventName;
  event.start.dateTime = startDate;
  event.end.dateTime = endDate;
  console.log(event);
  let request = gapi.client.calendar.events.insert({
    calendarId: "primary",
    resource: event
  });
  request.execute(function(event) {
    console.log(event);
    appendPre(
      `Event created: ${event.summary} on ${event.start.dateTime.substr(
        0,
        10
      )} at ${event.start.dateTime.substr(11, 8)}`
    );
  });
}

function getDates(){
    let dateEntered = document.getElementById("date").value;
    let duration = $("#duration option:selected").val();

    if (duration === "1" || duration === "2") {
        let startDate = moment(dateEntered).toISOString();
        let endDate = moment(dateEntered).add(1, 'h').toISOString();
        createEvent(startDate,endDate);
    } else if (duration === "30") {
        let startDate = moment(dateEntered).toISOString();
        let endDate = moment(dateEntered).add(30, 'm').toISOString();;
        createEvent(startDate,endDate);
    }
}

newEventButton.addEventListener("click", getDates);
$("#date").flatpickr({
  enableTime: true,
  altInput: true,
  time_24hr: false,
  altFormat: "F j, Y H:i",
  dateFormat: "Y-m-dTH:i:00"
});
