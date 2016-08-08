var storesArray;
var filteredArray;
var teamMember;
var store;

var startDate;
var endDate;

$(() => {
    storesArray = JSON.parse(JSON.stringify(storeObj));
    getDaysOfTheWeek();
    displayEmployeeHours();
    console.debug(storesArray);
    console.debug(userObj);
    //console.debug(hourObj);
    //Hide the delete message until a transaction has been removed
    $('#deleteMessage').hide();

    //Fade out success message after 5 seconds
    $('#successMessage').fadeOut(5000);

    var store = $("#store");

    store.change((event) => {
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
    }, function(start, end, label) {
        console.log("New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')");
        startDate = start;
        endDate = end;

        applyFilter();//

        //Render the transactions and edit the HTML based on team member drop down
        renderTransactions(teamMember.val(), userObj, storeObj[0].privileged, filteredArray);
    });

    //Trigger the drop down change function to load the HTML
    store.trigger('change');
});
//Retrieve hours from array and display them in the appropriate row
function displayEmployeeHours()
{
    for(var user in userObj) {
        for (var hour in hourObj) {
            if (moment().startOf('day').format("YYYY-MM-DD") == hourObj[hour].date.substring(0, 10)
                && userObj[user].t_number == hourObj[hour].team_member)
                $('#SundayHours'+userObj[user].t_number+'').text(hourObj[hour].selling_hours);
            if (moment().add(1, 'days').format("YYYY-MM-DD") == hourObj[hour].date.substring(0, 10)
                && userObj[user].t_number == hourObj[hour].team_member)
                $('#MondayHours'+userObj[user].t_number+'').text(hourObj[hour].selling_hours);
            if (moment().add(2, 'days').format("YYYY-MM-DD") == hourObj[hour].date.substring(0, 10)
                && userObj[user].t_number == hourObj[hour].team_member)
                $('#TuesdayHours'+userObj[user].t_number+'').text(hourObj[hour].selling_hours);
            if (moment().add(3, 'days').format("YYYY-MM-DD") == hourObj[hour].date.substring(0, 10)
                && userObj[user].t_number == hourObj[hour].team_member)
                $('#WednesdayHours'+userObj[user].t_number+'').text(hourObj[hour].selling_hours);
            if (moment().add(4, 'days').format("YYYY-MM-DD") == hourObj[hour].date.substring(0, 10)
                && userObj[user].t_number == hourObj[hour].team_member)
                $('#ThursdayHours'+userObj[user].t_number+'').text(hourObj[hour].selling_hours);
            if (moment().add(5, 'days').format("YYYY-MM-DD") == hourObj[hour].date.substring(0, 10)
                && userObj[user].t_number == hourObj[hour].team_member)
                $('#FridayHours'+userObj[user].t_number+'').text(hourObj[hour].selling_hours);
            if (moment().add(6, 'days').format("YYYY-MM-DD") == hourObj[hour].date.substring(0, 10)
                && userObj[user].t_number == hourObj[hour].team_member)
                $('#SaturdayHours'+userObj[user].t_number+'').text(hourObj[hour].selling_hours);
        }
    }
}

//Get the current dates for the week
function getDaysOfTheWeek()
{
    var monday,tuesday,wednesday,thursday,friday,saturday, sunday;

    sunday = moment().startOf('day').format('MMMM-DD');
    monday = moment().add(1, 'days').format('MMMM-DD');
    tuesday = moment().add(2, 'days').format('MMMM-DD');
    wednesday = moment().add(3, 'days').format('MMMM-DD');
    thursday = moment().add(4, 'days').format('MMMM-DD');
    friday = moment().add(5, 'days').format('MMMM-DD');
    saturday = moment().add(6, 'days').format('MMMM-DD');

    $('#Sunday').text(sunday);
    $('#Monday').text(monday);
    $('#Tuesday').text(tuesday);
    $('#Wednesday').text(wednesday);
    $('#Thursday').text(thursday);
    $('#Friday').text(friday);
    $('#Saturday').text(saturday);
}
function applyFilter() {}


