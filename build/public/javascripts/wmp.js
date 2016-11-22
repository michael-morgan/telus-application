'use strict';

var storesArray;
var usersArray;
var hoursArray;
var budgetObj;
var startDate;
var endDate;
var filteredUserArray;
var filteredStoresArray;
var filteredHoursArray;
var filteredBudgetArray;
var daysOfWeekArray = [];

$(function () {
    storesArray = JSON.parse(JSON.stringify(storeObj));
    usersArray = JSON.parse(JSON.stringify(userObj));
    hoursArray = JSON.parse(JSON.stringify(hourObj));
    budgetObj = JSON.parse(JSON.stringify(budgetObj));

    var store = $("#store");

    store.change(function (event) {
        //Get the selected user from from the drop down
        store = $('#store').val();

        filteredUserArray = userObj.filter(function (user) {
            return user.store_id == store;
        });
        filteredStoresArray = storeObj.filter(function (st) {
            return st.store_id == store;
        });
        filteredHoursArray = hourObj.filter(function (hour) {
            return hour.store_id == store;
        });
        filteredBudgetArray = budgetObj.filter(function (budget) {
            return budget.store_id == store;
        });

        displayUsers();

        if (aDate != '') {
            $('#dateRange').daterangepicker({
                "showWeekNumbers": true,
                "singleDatePicker": true,
                "opens": "center",
                "startDate": aDate,
                locale: {
                    format: 'YYYY-MM-DD'
                }
            }, function (start, end, label) {
                $('#dateRange').val(moment(start).format('YYYY-MM-DD'));
                $('#hiddenDate').val(moment(start).format('YYYY-MM-DD'));
                applyFilter();
            });
            getDaysOfTheWeek(aDate);
        } else {
            $('#dateRange').daterangepicker({
                "showWeekNumbers": true,
                "singleDatePicker": true,
                "opens": "center",
                locale: {
                    format: 'YYYY-MM-DD'
                }
            }, function (start, end, label) {
                $('#dateRange').val(moment(start).format('YYYY-MM-DD'));
                $('#hiddenDate').val(moment(start).format('YYYY-MM-DD'));
                applyFilter();
            });
            getDaysOfTheWeek(moment().startOf('isoWeek'));
        }
        $('#hiddenDate').val($('#dateRange').val());
        calculateHours();
    });
    //Trigger the drop down change function to load the HTML
    store.trigger('change');
});

function getDaysOfTheWeek(date) {
    var monday, tuesday, wednesday, thursday, friday, saturday, sunday;

    sunday = moment(date).day("Sunday").format('YYYY-MM-DD');
    monday = moment(date).day("Monday").format('YYYY-MM-DD');
    tuesday = moment(date).day("Tuesday").format('YYYY-MM-DD');
    wednesday = moment(date).day("Wednesday").format('YYYY-MM-DD');
    thursday = moment(date).day("Thursday").format('YYYY-MM-DD');
    friday = moment(date).day("Friday").format('YYYY-MM-DD');
    saturday = moment(date).day("Saturday").format('YYYY-MM-DD');

    daysOfWeekArray[daysOfWeekArray.length] = sunday;
    daysOfWeekArray[daysOfWeekArray.length] = monday;
    daysOfWeekArray[daysOfWeekArray.length] = tuesday;
    daysOfWeekArray[daysOfWeekArray.length] = wednesday;
    daysOfWeekArray[daysOfWeekArray.length] = thursday;
    daysOfWeekArray[daysOfWeekArray.length] = friday;
    daysOfWeekArray[daysOfWeekArray.length] = saturday;
}

function calculateHours() {
    var storeTotalHours = 0;

    for (var user in userObj) {
        var userTotalHours = 0;
        for (var day in daysOfWeekArray) {
            for (var hour in hourObj) {
                if (hourObj[hour].date.substring(0, 10) == daysOfWeekArray[day] && userObj[user].t_number == hourObj[hour].team_member && userObj[user].privileged != 5) {
                    userTotalHours += parseInt(hourObj[hour].selling_hours);
                    storeTotalHours += parseInt(hourObj[hour].selling_hours);
                }
            }
        }
        $('#totalHours_' + userObj[user].t_number).text(userTotalHours);
        $('#budget' + userObj[user].t_number).text(budgetObj[0].CTs);
    }

    //TODO this method broke when we combine the to tables, I think micheal made this method? Maybe he can help.
    var countTable1 = document.getElementById("countTable1");
    for (var i = 1, row; row = countTable1.rows[i]; i++) {
        var sellingHours = parseInt(row.cells[2].innerHTML);
        if (sellingHours != 0 && sellingHours < storeTotalHours) {
            row.cells[3].innerHTML = Math.round(sellingHours / storeTotalHours * 100) + '%';
        } else if (sellingHours == 0) {
            row.cells[3].innerHTML = '0%';
        }
    }
    $('#storeTotalHours').text(storeTotalHours);
    console.log(storeTotalHours);
}

function displayUsers() {
    var employeeList = "";

    for (var userIndex in filteredUserArray) {
        employeeList += '<tr>\n                            <td></td>\n                            <td>' + filteredUserArray[userIndex].first_name + '  ' + filteredUserArray[userIndex].last_name + '</td>\n                            <th>' + filteredUserArray[userIndex].totalHours + '</th>\n                            <th>' + filteredUserArray[userIndex].hoursPercent + '%</th>\n                         <tr>';
    }

    $('#employeeList').html(employeeList);
    //getDaysOfTheWeek();
    //if(aDate != '')
    //    displayEmployeeHours(filteredUserArray, filteredHoursArray, aDate);
    //else
    //    displayEmployeeHours(filteredUserArray, filteredHoursArray, moment().startOf('isoWeek'));
}

function applyFilter() {
    document.getElementById("updateWeekForm").submit();
}

/*$(document).ready(function(){
    fakewaffle.responsiveTabs(['md']);
    $('.footable').footable();
});*/

//# sourceMappingURL=wmp.js.map