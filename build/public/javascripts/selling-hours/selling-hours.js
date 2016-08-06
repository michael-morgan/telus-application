'use strict';

var storesArray;
var filteredArray;
var teamMember;
var store;

var startDate;
var endDate;

$(function () {
    storesArray = JSON.parse(JSON.stringify(storeObj));
    getDaysOfTheWeek();

    console.debug(storesArray);
    console.debug(userObj);
    //console.debug(hourObj);
    //Hide the delete message until a transaction has been removed
    $('#deleteMessage').hide();

    //Fade out success message after 5 seconds
    $('#successMessage').fadeOut(5000);

    var store = $("#store");

    store.change(function (event) {
        //Get the selected user from from the drop down
        teamMember = $('#store');

        applyFilter();
    });

    $('#dateRange').daterangepicker({
        "showWeekNumbers": true,
        "showCustomRangeLabel": false,
        "alwaysShowCalendars": true,
        "startDate": startDate = moment().startOf('day'),
        "endDate": endDate = moment().add(7, 'days'),
        "opens": "center",
        locale: {
            format: "MMMM D, YYYY"
        }
    }, function (start, end, label) {
        console.log("New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')");
        startDate = start;
        endDate = end;

        applyFilter(); //

        //Render the transactions and edit the HTML based on team member drop down
        renderTransactions(teamMember.val(), userObj, storeObj[0].privileged, filteredArray);
    });

    //Trigger the drop down change function to load the HTML
    store.trigger('change');
});

//Get the current dates for the week
function getDaysOfTheWeek() {
    var today, todayNumber, mondayNumber, tuesdayNumber, wednesdayNumber, thursdayNumber, fridayNumber, saturdayNumber, sundayNumber, monday, tuesday, wednesday, thursday, friday, saturday, sunday;
    today = new Date();
    todayNumber = today.getDay();
    mondayNumber = 1 - todayNumber;
    tuesdayNumber = 2 - todayNumber;
    wednesdayNumber = 3 - todayNumber;
    thursdayNumber = 4 - todayNumber;
    fridayNumber = 5 - todayNumber;
    saturdayNumber = 6 - todayNumber;
    sundayNumber = 7 - todayNumber;

    monday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + mondayNumber);
    tuesday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + tuesdayNumber);
    wednesday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + wednesdayNumber);
    thursday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + thursdayNumber);
    friday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + fridayNumber);
    saturday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + saturdayNumber);
    sunday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - sundayNumber);

    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    $('#Sunday').text(monthNames[sunday.getMonth()] + ' ' + sunday.getDate());
    $('#Monday').text(monthNames[monday.getMonth()] + ' ' + monday.getDate());
    $('#Tuesday').text(monthNames[tuesday.getMonth()] + ' ' + tuesday.getDate());
    $('#Wednesday').text(monthNames[wednesday.getMonth()] + ' ' + wednesday.getDate());
    $('#Thursday').text(monthNames[thursday.getMonth()] + ' ' + thursday.getDate());
    $('#Friday').text(monthNames[friday.getMonth()] + ' ' + friday.getDate());
    $('#Saturday').text(monthNames[saturday.getMonth()] + ' ' + saturday.getDate());
}
function applyFilter() {}

//# sourceMappingURL=selling-hours.js.map