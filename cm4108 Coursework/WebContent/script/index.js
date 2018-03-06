//API FOR CALLENDAR
//https://fullcalendar.io/docs/

//API keys
var baseURL = "api";

// the document ready function
try {
	$(function() {
		init();
	});
} catch (e) {
	alert("*** jQuery not loaded. ***");
}

//
// Initialise page.
//
function init() {
	// Setting up Calendar
	$('#calendar').fullCalendar({
		// calendar properties
		// enable theme
		theme : true,
		// emphasizes business hours
		businessHours : true,
		// event dragging & resizing
		editable : false,
		// header
		header : {
			left : 'prev,next today',
			center : 'title',
			right : 'month,agendaWeek,agendaDay'
		},
		// Event click method
		eventClick : function(event, element) {
			appointmentClicked(event.id);
		},
	});

	// make add appointment dialog box
	$("#addAppointmentDialog").dialog({
		modal : true, // modal dialog to disable parent when dialog is active
		autoOpen : false, // set autoOpen to false, hidding dialog after
		// creation
		title : "Add Appointment", // set title of dialog box
		minWidth : 500,
		minHeight : 400,
	});

	// make edit appointment dialog box
	$("#editAppointmentDialog").dialog({
		modal : true, // modal dialog to disable parent when dialog is active
		autoOpen : false, // set autoOpen to false, hidding dialog after
		// creation
		title : "Edit Appointment", // set title of dialog box
		minWidth : 500,
		minHeight : 400,
	});

	// set click handler of Add City button
	$("#addAppointment").click(function() {
		if ($("#user").val()) {
			// clear appointment input
			$("#addAppointmentDescription").val("");
			$("#addAppointmentDate").val("");
			$("#addAppointmentStartTimeHour").val("");
			$("#addAppointmentStartTimeMinutes").val("");
			$("#addAppointmentDuration").val("");
			$("#addAppointmentDialog").dialog("open", true); // open dialog
			// box
		} else {
			alert("Owner is empty")
		}
	});

	// set click handler of Cancel button in Add and Edit Appointment dialog
	$(".cancelAppointment").click(function() {
		$(".appointmentDialog").dialog("close");
	});

	// set click handler of Save Appointment button in Add Appointment dialog
	$("#addSaveAppointment").click(
			function() {
				// Check all values have inputs
				if (!$("#addAppointmentDescription").val()
						| !$("#addAppointmentDate").val()
						| !$("#addAppointmentStartTimeHour").val()
						| !$("#addAppointmentStartTimeMinutes").val()
						| !$("#addAppointmentDuration").val()) {
					alert("Please fill in all boxes");
					// Check inputs are numeric in correct fields
				} else if (!$
						.isNumeric($("#addAppointmentStartTimeHour").val())
						| !$.isNumeric($("#addAppointmentStartTimeMinutes")
								.val())
						| !$.isNumeric($("#addAppointmentDuration").val())) {
					alert("Numeric input expected please change input")
				} else {
					// Add appointment if all inputs correct
					saveAppointment(); // save appointment to web service
					$("#addAppointmentDialog").dialog("close");
				}
			});

	// set click Save Appointment button in Edit Appointment dialog
	$("#editSaveAppointment").click(
			function() {
				// Check all values have inputs
				if (!$("#editAppointmentDescription").val()
						| !$("#editAppointmentDate").val()
						| !$("#editAppointmentStartTimeHour").val()
						| !$("#editAppointmentStartTimeMinutes").val()
						| !$("#editAppointmentDuration").val()) {
					alert("Please fill in all boxes");
					// Check inputs are numeric in correct fields
				} else if (!$.isNumeric($("#editAppointmentStartTimeHour")
						.val())
						| !$.isNumeric($("#editAppointmentStartTimeMinutes")
								.val())
						| !$.isNumeric($("#editAppointmentDuration").val())) {
					alert("Numeric input expected please change input")
				} else {
					// Update appointment if all inputs correct
					$("#appointments .selected").each(function() {
						updateAppointment($(this).attr("id"));
						$(this).remove();
					});
					$("#editAppointmentDialog").dialog("close");

				}
			});

	// set click handler of Delete Selected button
	$("#editDeleteAppointment").click(function() {
		$("#appointments .selected").each(function() {
			deleteAppointment($(this).attr("id"));
			$(this).remove();
		});
		$("#editAppointmentDialog").dialog("close");
	});

	// set click handler of Show Appointment(s) button
	$("#showAppointment").click(function() {
		if ($("#user").val()) {
			populateAppointments(); // populate list of appointments
		} else {
			alert("Owner is empty")
		}
	});

	// set click handle to popup datepicker
	$(".datePicker").click(function() {
		$(".datePicker").datepicker({
			dateFormat : "yy-mm-dd" // Format input
		});
	});

	// Save a appointment using the Appointment service, given its position
	function saveAppointment(description, date, startTime, duration) {
		var description = $("#addAppointmentDescription").val();
		var date = $("#addAppointmentDate").val();
		var startTimeHour = $("#addAppointmentStartTimeHour").val();
		var startTimeMin = $("#addAppointmentStartTimeMinutes").val();
		var duration = $("#addAppointmentDuration").val();
		var owner = $("#user").val();
		var dateTimeDATE = new Date(date + "T" + startTimeHour + ":"
				+ startTimeMin);
		var dateTime = dateTimeDATE.getTime();

		var url = baseURL + "/appointment"; // URL of web service
		var data = {
			"dateTime" : dateTime,
			"duration" : duration,
			"owner" : owner,
			"description" : description
		};

		// use jQuery shorthand Ajax POST function
		$.post(url, // URL of service
		data, // parameters of request
		function() // successful callback function
		{
			alert("Appointment saved");
			// Uncomment lines below to see if appointment is saved and what
			// details were saved
			// alert("Appointment saved: "+description+", duration:
			// "+duration+", dateTime: "+dateTime+", owner: "+owner);
		} // end callback function
		); // end post call
	} // end function

	// Retrieve all appointments from Appointment service and populate list
	function populateAppointments() {
		var user = $("#user").val(); // owner of appointments to retrieve
		var url = baseURL + "/appointment"; // URL of appointment service
		var toDate = $("#toDate").val(); // retrieve toDate input
		var fromDate = $("#fromDate").val(); // retrieve fromDate input
		var toDateDATE = new Date(toDate); // Creating Date object
		var fromDateDATE = new Date(fromDate);

		//Add a day of time to toDate so you can put to and from date the same and get that particular day
		//There is 86400000 miliseconds in a day
		toDateDATE.setTime(toDateDATE.getTime()+86399999);
		
		// use jQuery shorthand Ajax function to get JSON data
		$.getJSON(url, // URL of service
				function(appointments) // successful callback function
				{
					$("#appointments").empty(); // find appointment list and remove its children
					// alert("Above Loop");
					// Remove previous events from calendar
					$('#calendar').fullCalendar('removeEvents');
					var currentEventsArray = [];
					for ( var i in appointments) {
						var appointment = appointments[i]; // get 1 appointment from the JSON list
						var owner = appointment["owner"]; // get appointment owner from JSON data
						if (owner == user) {
							var id = appointment["id"]; // get appointment ID from JSON data
							var dateTime = appointment["dateTime"]; // get appointment dateTime from JSON data
							var description = appointment["description"]; // get appointment description from JSON data
							var duration = appointment["duration"]; // get appointment duration from JSON data Date variables
							var startDateTimeDATE = new Date(dateTime);
							var endDateTime = startDateTimeDATE.valueOf()
									+ (duration * 60000);
							var endDateTimeDATE = new Date(endDateTime);
							var startHours = ("0" + startDateTimeDATE
									.getHours()).slice(-2);
							var startMinutes = ("0" + (startDateTimeDATE
									.getMinutes())).slice(-2);
							var endHours = ("0" + endDateTimeDATE.getHours())
									.slice(-2);
							var endMinutes = ("0" + (endDateTimeDATE
									.getMinutes())).slice(-2);

							var dateTimeString = startDateTimeDATE
									.toDateString()
									+ " "
									+ startHours
									+ ":"
									+ startMinutes
									+ " - " + endHours + ":" + endMinutes;

							if (fromDateDATE < startDateTimeDATE
									&& fromDateDATE != ""
									&& toDateDATE > endDateTimeDATE
									&& toDateDATE != "") {
								// alert("id: "+id);
								// compose HTML of a list item using the appointment details.
								var htmlCode = "<li id='" + id + "'>"
										+ dateTimeString + " " + " "
										+ description + " " + owner + "</li>";
								$("#appointments").append(htmlCode); // add a child to the appointments list
								// Add to events to current array
								currentEventsArray.push({
									title : description,
									start : startDateTimeDATE.toString(),
									end : endDateTimeDATE.toString(),
									id : id,
									allDay : false
								// will make the time show
								});

							}
						}
					}

					// Add events to calendar
					$('#calendar').fullCalendar('addEventSource',
							currentEventsArray);
					// look for all list items (i.e. appointments), set their click handler
					$("#appointments li").click(function() {
						// Call the appointmentClicked(...) function.
						// The parameter is the ID of the appointment clicked.
						// See how we get the ID from the located li
						// element/tag.
						appointmentClicked($(this).attr("id"));
					} // end click handler function
					); // end click call
				} // end Ajax callback function
		); // end Ajax call
	} // end function

	// Clicking an appointment from the list of appointments will pop-up edit dialog
	function appointmentClicked(id) {
		$("#appointments li").removeClass("selected"); // remove all list items
		// from the class "selected, thus clearing previous selection,
		// Find the selected appointment (i.e. list item) and add the class "selected" to it.
		// This will highlight it according to the "selected" class.
		$("#" + id).addClass("selected");

		var url = baseURL + "/appointment/" + id; // URL of service, notice that ID is part of URL path

		// use jQuery shorthand Ajax function to get JSON data
		$.getJSON(url, // URL of service
		function(appointment) // successful callback function
		{
			var id = appointment["id"]; // get appointment ID from JSON data
			var dateTime = appointment["dateTime"]; // get appointment dateTime from JSON data
			var description = appointment["description"]; // get appointment description from JSON data
			var duration = appointment["duration"]; // get appointment duration from JSON data
			var owner = appointment["owner"]; // get appointment duration from JSON data

			var startDateTimeDATE = new Date(dateTime);
			var day = ("0" + startDateTimeDATE.getDate()).slice(-2);
			var month = ("0" + (startDateTimeDATE.getMonth() + 1)).slice(-2);
			var date = startDateTimeDATE.getFullYear() + "-" + (month) + "-"
					+ (day);
			var hours = ("0" + startDateTimeDATE.getHours()).slice(-2);
			var minutes = ("0" + (startDateTimeDATE.getMinutes())).slice(-2);

			// clear appointment input
			$("#editAppointmentDescription").val(description + "");
			$("#editAppointmentDate").val(date + "");
			$("#editAppointmentStartTimeHour").val(hours + "");
			$("#editAppointmentStartTimeMinutes").val(minutes + "");
			$("#editAppointmentDuration").val(duration + "");
			$("#editAppointmentDialog").dialog("open", true); // open dialog box
		});
	} // end function

	// Delete a appointment using the Appointment service, given its id
	function deleteAppointment(id) {
		var url = baseURL + "/appointment/" + id; // URL pattern of delete service
		var settings = {
			type : "DELETE"
		}; 
		// options to the $.ajax(...) function call
		$.ajax(url, settings);
	} // end function

	// Update a appointment using the Appointment service, given its id
	function updateAppointment(id) {
		var url = baseURL + "/appointment/" + id; // URL of service, notice that ID is part of URL path
		var description = $("#editAppointmentDescription").val();
		var date = $("#editAppointmentDate").val();
		var startTimeHour = $("#editAppointmentStartTimeHour").val();
		var startTimeMin = $("#editAppointmentStartTimeMinutes").val();
		var duration = $("#editAppointmentDuration").val();
		var owner = $("#user").val();
		var dateTimeDATE = new Date(date + "T" + startTimeHour + ":"
				+ startTimeMin);
		var dateTime = dateTimeDATE.getTime();

		var data = {
			"dateTime" : dateTime,
			"duration" : duration,
			"owner" : owner,
			"description" : description
		};

		// use jQuery shorthand Ajax POST function
		$.post(url, // URL of service
		data, // parameters of request
		function() // successful callback function
		{
			// alert("Appointment updated: "+description+", duration:
			// "+duration+", dateTime: "+dateTime+", owner: "+owner);
		} // end callback function
		); // end post call
		// Refreshing the appointments shown
		sleep(500);
		populateAppointments();
	} // end function

	// Sleep method
	function sleep(milliseconds) {
		var start = new Date().getTime();
		for (var i = 0; i < 1e7; i++) {
			if ((new Date().getTime() - start) > milliseconds) {
				break;
			}
		}
	}// end function

}
