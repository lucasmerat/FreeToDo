
    // Client ID and API key from the Developer Console
    var CLIENT_ID =
      "26822503413-ladr99bfvg408ec73jpa5tdhecgboehe.apps.googleusercontent.com";
    var API_KEY = "AIzaSyBpArWGtpMF-RUiodjnwqk8lTmlSmJxrAQ";

    // Array of API discovery doc URLs for APIs used by the quickstart
    var DISCOVERY_DOCS = [
      "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"
    ];

    // Authorization scopes required by the API; multiple scopes can be
    // included, separated by spaces.
    var SCOPES = "https://www.googleapis.com/auth/calendar";

    var authorizeButton = document.getElementById("authorize_button");
    var signoutButton = document.getElementById("signout_button");
    var newEventBox = document.getElementById("new-event-box");
    var newEventButton = document.getElementById("new_event");

    /**
     *  On load, called to load the auth2 library and API client library.
     */
    function handleClientLoad() {
      gapi.load("client:auth2", initClient);
    }

    /**
     *  Initializes the API client library and sets up sign-in state
     *  listeners.
     */
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
            gapi.auth2
              .getAuthInstance()
              .isSignedIn.listen(updateSigninStatus);

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

    /**
     *  Called when the signed in status changes, to update the UI
     *  appropriately. After a sign-in, the API is called.
     */
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

    /**
     *  Sign in the user upon button click.
     */
    function handleAuthClick(event) {
      gapi.auth2.getAuthInstance().signIn();
    }

    /**
     *  Sign out the user upon button click.
     */
    function handleSignoutClick(event) {
      gapi.auth2.getAuthInstance().signOut();
    }

    /**
     * Append a pre element to the body containing the given message
     * as its text node. Used to display the results of the API call.
     *
     * @param {string} message Text to be placed in pre element.
     */
    function appendPre(message) {
      var pre = document.getElementById("content");
      var textContent = document.createTextNode(message + "\n");
      pre.appendChild(textContent);
    }

    /**
     * Print the summary and start datetime/date of the next ten events in
     * the authorized user's calendar. If no events are found an
     * appropriate message is printed.
     */
    function listUpcomingEvents() {
      gapi.client.calendar.events
        .list({
          calendarId: "primary",
          timeMin: new Date().toISOString(),
          showDeleted: false,
          singleEvents: true,
          maxResults: 10,
          orderBy: "startTime"
        })
        .then(function(response) {
          var events = response.result.items;
          appendPre("Upcoming events:");

          if (events.length > 0) {
            for (i = 0; i < events.length; i++) {
              var event = events[i];
              var when = event.start.dateTime;
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

    var event = {
      summary: "",
      location: "5107 Avenue G. Austin Texas",
      description: "A chance to hear more about Google's developer products.",
      start: {
        dateTime: "",
        timeZone: "America/New_York"
      },
      end: {
        dateTime: "",
        timeZone: "America/New_York"
      }
    };

    function createEvent(startDate, endDate) {
      let eventName = document.getElementById("name").value;
      event.summary = eventName;
      event.start.dateTime = startDate;
      event.end.dateTime = endDate;
      console.log(event)
      let request = gapi.client.calendar.events.insert({
        calendarId: "primary",
        resource: event
      });
      request.execute(function(event) {
        appendPre(`Event created: ${event.htmlLink}`);
      });
    }

    function getDates(){
        let startDate = document.getElementById("date").value;
        console.log(startDate)
        let startTime = Number(startDate.substr(11,2));
        let endTime = startTime + 1;
        let endDate = startDate.substr(0,11) + String(endTime) + startDate.substr(13, startDate.length);
        createEvent(startDate, endDate)
    }

    newEventButton.addEventListener("click", getDates);
    $("#date").flatpickr({
      enableTime: true,
      dateFormat: "Y-m-dTH:i:00-07:00"
    });