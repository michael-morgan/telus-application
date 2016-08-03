var storesArray;
var filteredArray;
var teamMember;
var store;

var startDate;
var endDate;

$(() => {
    storesArray = JSON.parse(JSON.stringify(storeObj));

    console.debug(storesArray);
    console.debug(userObj);

    //Hide the delete message until a transaction has been removed
    $('#deleteMessage').hide();

    //Fade out success message after 5 seconds
    $('#successMessage').fadeOut(5000);

    var store = $("#store");

    store.change((event) => {
        //Get the selected user from from the drop down
        teamMember = $('#store');

        applyFilter();

        //filteredArray = storeObj[0].transactions.filter(filterTeamMembers);

        //Render the transactions and edit the HTML based on team member drop down
        renderTransactions(teamMember.val(), userObj, storeObj[0].privileged, filteredArray);
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

function applyFilter() {
    filteredArray = JSON.parse(JSON.stringify(storesArray.filter(filterTNumber)));
    for (let storeIndex in filteredArray) {
        filteredArray[storeIndex].transactions = JSON.parse(JSON.stringify(storesArray[storesArray.findIndex(
            (store) => store.store_id == filteredArray[storeIndex].store_id
        )].transactions.filter(filterTNumber).filter(filterDate)));
    }
}


