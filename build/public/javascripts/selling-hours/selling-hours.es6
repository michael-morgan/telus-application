var storesArray;
var budgetArray;
var filteredBudgetArray;
var filteredUserArray;
var filteredHoursArray;
var filteredStoresArray;
var teamMember;
var store;

var startDate;
var endDate;

$(() => {
    storesArray = JSON.parse(JSON.stringify(storeObj));
    budgetArray = JSON.parse(JSON.stringify(budgetObj));

    //displayEmployeeHours();

    //console.debug(storesArray);
    //console.debug(userObj);
    //console.debug(hourObj);
    //console.debug(budgetObj);
    //Hide the delete message until a transaction has been removed
    $('#deleteMessage').hide();

    //Fade out success message after 5 seconds
    $('#successMessage').fadeOut(5000);

    var store = $("#store");

    store.change((event) => {
        //Get the selected user from from the drop down
        store = $('#store').val();

        //console.log(store);

        filteredBudgetArray = budgetArray.filter((bud) => bud.store_id == store);
        filteredHoursArray = hourObj.filter((hour) => hour.store_id == store);
        filteredUserArray = userObj.filter((user) => user.store_id == store);
        filteredStoresArray = storeObj.filter((st) => st.store_id == store);

        //console.debug(filteredBudgetArray);
        //console.debug(filteredHoursArray);
        //console.debug(filteredStoresArray);

        displayUsers();
        getDaysOfTheWeek();
        displayBudgets();
        displayEmployeeHours(filteredUserArray, filteredHoursArray);
    });

    $('#dateRange').daterangepicker({
        "showWeekNumbers": true,
        "singleDatePicker": true,
        "startDate": startDate = moment().startOf('day'),
        "opens": "center",

    }, function(start, end, label) {
        console.log("New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')");
        startDate = start;
        endDate = end;

        applyFilter();//
    });

    //Trigger the drop down change function to load the HTML
    store.trigger('change');
});
//Retrieve hours from array and display them in the appropriate row
function displayEmployeeHours(userObj, hourObj) {
    var totalHours = 0, sundayHours = 0, mondayHours = 0, tuesdayHours = 0, wednesdayHours = 0, thursdayHours = 0, fridayHours = 0, saturdayHours = 0;
    var totalStoreHours = 0;
    for(var user in userObj) {
        for (var hour in hourObj) {
            if (moment().startOf('isoWeek').subtract(1,'day').format('YYYY-MM-DD') == hourObj[hour].date.substring(0, 10)
                && userObj[user].t_number == hourObj[hour].team_member) {
                $('#SundayHours' + userObj[user].t_number + '').editable({
                    type: 'text',
                    pk: 1,
                    url: '/users/selling-hours',
                    name: userObj[user].t_number + ',' + hourObj[hour].store_id + ',' + hourObj[hour].date.substring(0, 10),
                    value: hourObj[hour].selling_hours,
                    send: 'always',
                    success: function (response, newValue) {
                        var info = JSON.parse(response);
                        var hours,totalHours,totalWeekHours;
                        if(parseInt($('#SundayHours'+ info.name.split(',')[0] + '').text()) > parseInt(newValue)) {
                            hours  = parseInt($('#TotalHours'+ info.name.split(',')[0] + '').text()) - (parseInt($('#SundayHours'+ info.name.split(',')[0] + '').text()-parseInt(newValue)));
                            totalHours  = parseInt($('#TotalSundayHours').text()) - (parseInt($('#SundayHours'+ info.name.split(',')[0] + '').text())-parseInt(newValue));
                            totalWeekHours  = parseInt($('#TotalWeekHours').text()) - (parseInt($('#SundayHours'+ info.name.split(',')[0] + '').text())-parseInt(newValue));
                        }
                        else if(parseInt($('#SundayHours'+ info.name.split(',')[0] + '').text()) < parseInt(newValue)) {
                            hours  = parseInt($('#TotalHours'+ info.name.split(',')[0] + '').text()) + (parseInt(newValue) - parseInt($('#SundayHours'+ info.name.split(',')[0] + '').text()));
                            totalHours  = parseInt($('#TotalSundayHours').text()) + (parseInt(newValue) - parseInt($('#SundayHours'+ info.name.split(',')[0] + '').text()));
                            totalWeekHours  = parseInt($('#TotalWeekHours').text()) + (parseInt(newValue) - parseInt($('#SundayHours'+ info.name.split(',')[0] + '').text()));
                        }
                        else {
                            hours = parseInt($('#TotalHours'+ info.name.split(',')[0] + '').text()) + (parseInt(newValue));
                            totalHours = parseInt($('#TotalSundayHours').text()) + (parseInt(newValue));
                            totalWeekHours = parseInt($('#TotalWeekHours').text()) + (parseInt(newValue));
                        }
                        //Get the t_number from the JSON which is the first index after the split
                        $('#TotalHours'+ info.name.split(',')[0] + '').text(hours.toString());
                        $('#TotalSundayHours').text(totalHours.toString());
                        $('#TotalWeekHours').text(totalWeekHours);
                    }
                });
                totalHours += parseInt(hourObj[hour].selling_hours);
                sundayHours += parseInt(hourObj[hour].selling_hours);
            }
            if (moment().startOf('isoWeek').format('YYYY-MM-DD') == hourObj[hour].date.substring(0, 10)
                && userObj[user].t_number == hourObj[hour].team_member) {
                $('#MondayHours' + userObj[user].t_number + '').editable({
                    type: 'text',
                    pk: 1,
                    url: '/users/selling-hours',
                    name: userObj[user].t_number + ',' + hourObj[hour].store_id + ',' + hourObj[hour].date.substring(0, 10),
                    value: hourObj[hour].selling_hours,
                    send: 'always',
                    success: function (response, newValue) {
                        var info = JSON.parse(response);
                        var hours,totalHours,totalWeekHours;
                        if(parseInt($('#MondayHours'+ info.name.split(',')[0] + '').text()) > parseInt(newValue)) {
                            hours  = parseInt($('#TotalHours'+ info.name.split(',')[0] + '').text()) - (parseInt($('#MondayHours'+ info.name.split(',')[0] + '').text()-parseInt(newValue)));
                            totalHours  = parseInt($('#TotalMondayHours').text()) - (parseInt($('#MondayHours'+ info.name.split(',')[0] + '').text())-parseInt(newValue));
                            totalWeekHours  = parseInt($('#TotalWeekHours').text()) - (parseInt($('#MondayHours'+ info.name.split(',')[0] + '').text())-parseInt(newValue));
                        }
                        else if(parseInt($('#MondayHours'+ info.name.split(',')[0] + '').text()) < parseInt(newValue)) {
                            hours  = parseInt($('#TotalHours'+ info.name.split(',')[0] + '').text()) + (parseInt(newValue) - parseInt($('#MondayHours'+ info.name.split(',')[0] + '').text()));
                            totalHours  = parseInt($('#TotalMondayHours').text()) + (parseInt(newValue) - parseInt($('#MondayHours'+ info.name.split(',')[0] + '').text()));
                            totalWeekHours  = parseInt($('#TotalWeekHours').text()) + (parseInt(newValue) - parseInt($('#MondayHours'+ info.name.split(',')[0] + '').text()));
                        }
                        else {
                            hours = parseInt($('#TotalHours'+ info.name.split(',')[0] + '').text()) + (parseInt(newValue));
                            totalHours = parseInt($('#TotalMondayHours').text()) + (parseInt(newValue));
                            totalWeekHours = parseInt($('#TotalWeekHours').text()) + (parseInt(newValue));
                        }
                        //Get the t_number from the JSON which is the first index after the split
                        $('#TotalHours'+ info.name.split(',')[0] + '').text(hours.toString());
                        $('#TotalMondayHours').text(totalHours.toString());
                        $('#TotalWeekHours').text(totalWeekHours);
                    }
                });
                totalHours += parseInt(hourObj[hour].selling_hours);
                mondayHours += parseInt(hourObj[hour].selling_hours);

            }
            if (moment().startOf('isoWeek').add(1,'day').format('YYYY-MM-DD') == hourObj[hour].date.substring(0, 10)
                && userObj[user].t_number == hourObj[hour].team_member) {
                $('#TuesdayHours' + userObj[user].t_number + '').editable({
                    type: 'text',
                    pk: 1,
                    url: '/users/selling-hours',
                    name:  userObj[user].t_number + ',' + hourObj[hour].store_id + ',' + hourObj[hour].date.substring(0, 10),
                    value: hourObj[hour].selling_hours,
                    send: 'always',
                    success: function (response, newValue) {
                        var info = JSON.parse(response);
                        var hours,totalHours,totalWeekHours;
                        if(parseInt($('#TuesdayHours'+ info.name.split(',')[0] + '').text()) > parseInt(newValue)) {
                            hours  = parseInt($('#TotalHours'+ info.name.split(',')[0] + '').text()) - (parseInt($('#TuesdayHours'+ info.name.split(',')[0] + '').text()-parseInt(newValue)));
                            totalHours  = parseInt($('#TotalTuesdayHours').text()) - (parseInt($('#TuesdayHours'+ info.name.split(',')[0] + '').text())-parseInt(newValue));
                            totalWeekHours  = parseInt($('#TotalWeekHours').text()) - (parseInt($('#TuesdayHours'+ info.name.split(',')[0] + '').text())-parseInt(newValue));
                        }
                        else if(parseInt($('#TuesdayHours'+ info.name.split(',')[0] + '').text()) < parseInt(newValue)) {
                            hours  = parseInt($('#TotalHours'+ info.name.split(',')[0] + '').text()) + (parseInt(newValue) - parseInt($('#TuesdayHours'+ info.name.split(',')[0] + '').text()));
                            totalHours  = parseInt($('#TotalTuesdayHours').text()) + (parseInt(newValue) - parseInt($('#TuesdayHours'+ info.name.split(',')[0] + '').text()));
                            totalWeekHours  = parseInt($('#TotalWeekHours').text()) + (parseInt(newValue) - parseInt($('#TuesdayHours'+ info.name.split(',')[0] + '').text()));
                        }
                        else {
                            hours = parseInt($('#TotalHours'+ info.name.split(',')[0] + '').text()) + (parseInt(newValue));
                            totalHours = parseInt($('#TotalTuesdayHours').text()) + (parseInt(newValue));
                            totalWeekHours = parseInt($('#TotalWeekHours').text()) + (parseInt(newValue));
                        }
                        //Get the t_number from the JSON which is the first index after the split
                        $('#TotalHours'+ info.name.split(',')[0] + '').text(hours.toString());
                        $('#TotalTuesdayHours').text(totalHours.toString());
                        $('#TotalWeekHours').text(totalWeekHours);
                    }
                });
                totalHours += parseInt(hourObj[hour].selling_hours);
                tuesdayHours += parseInt(hourObj[hour].selling_hours);

            }
            if (moment().startOf('isoWeek').add(2,'day').format('YYYY-MM-DD') == hourObj[hour].date.substring(0, 10)

                && userObj[user].t_number == hourObj[hour].team_member)
            {
                $('#WednesdayHours'+userObj[user].t_number+'').editable({
                    type: 'text',
                    pk: 1,
                    url: '/users/selling-hours',
                    name: userObj[user].t_number+','+hourObj[hour].store_id + ','+hourObj[hour].date.substring(0, 10),
                    value: hourObj[hour].selling_hours,
                    send: 'always',
                    success: function(response, newValue) {
                        var info = JSON.parse(response);
                        var hours,totalHours,totalWeekHours;
                        if(parseInt($('#WednesdayHours'+ info.name.split(',')[0] + '').text()) > parseInt(newValue)) {
                            hours  = parseInt($('#TotalHours'+ info.name.split(',')[0] + '').text()) - (parseInt($('#WednesdayHours'+ info.name.split(',')[0] + '').text()-parseInt(newValue)));
                            totalHours  = parseInt($('#TotalWednesdayHours').text()) - (parseInt($('#WednesdayHours'+ info.name.split(',')[0] + '').text())-parseInt(newValue));
                            totalWeekHours  = parseInt($('#TotalWeekHours').text()) - (parseInt($('#WednesdayHours'+ info.name.split(',')[0] + '').text())-parseInt(newValue));
                        }
                        else if(parseInt($('#WednesdayHours'+ info.name.split(',')[0] + '').text()) < parseInt(newValue)) {
                            hours  = parseInt($('#TotalHours'+ info.name.split(',')[0] + '').text()) + (parseInt(newValue) - parseInt($('#WednesdayHours'+ info.name.split(',')[0] + '').text()));
                            totalHours  = parseInt($('#TotalWednesdayHours').text()) + (parseInt(newValue) - parseInt($('#WednesdayHours'+ info.name.split(',')[0] + '').text()));
                            totalWeekHours  = parseInt($('#TotalWeekHours').text()) + (parseInt(newValue) - parseInt($('#WednesdayHours'+ info.name.split(',')[0] + '').text()));
                        }
                        else {
                            hours = parseInt($('#TotalHours'+ info.name.split(',')[0] + '').text()) + (parseInt(newValue));
                            totalHours = parseInt($('#TotalWednesdayHours').text()) + (parseInt(newValue));
                            totalWeekHours = parseInt($('#TotalWeekHours').text()) + (parseInt(newValue));
                        }
                        //Get the t_number from the JSON which is the first index after the split
                        $('#TotalHours'+ info.name.split(',')[0] + '').text(hours.toString());
                        $('#TotalWednesdayHours').text(totalHours.toString());
                        $('#TotalWeekHours').text(totalWeekHours);
                    }

                });
                totalHours += parseInt(hourObj[hour].selling_hours);
                wednesdayHours += parseInt(hourObj[hour].selling_hours);

            }
            if (moment().startOf('isoWeek').add(3,'day').format('YYYY-MM-DD') == hourObj[hour].date.substring(0, 10)
                && userObj[user].t_number == hourObj[hour].team_member) {
                $('#ThursdayHours' + userObj[user].t_number + '').editable({
                    type: 'text',
                    pk: 1,
                    url: '/users/selling-hours',
                    name: userObj[user].t_number + ',' + hourObj[hour].store_id + ',' + hourObj[hour].date.substring(0, 10),
                    value: hourObj[hour].selling_hours,
                    send: 'always',
                    success: function (response, newValue) {
                        var info = JSON.parse(response);
                        var hours,totalHours,totalWeekHours;
                        if(parseInt($('#ThursdayHours'+ info.name.split(',')[0] + '').text()) > parseInt(newValue)) {
                            hours  = parseInt($('#TotalHours'+ info.name.split(',')[0] + '').text()) - (parseInt($('#ThursdayHours'+ info.name.split(',')[0] + '').text()-parseInt(newValue)));
                            totalHours  = parseInt($('#TotalThursdayHours').text()) - (parseInt($('#ThursdayHours'+ info.name.split(',')[0] + '').text())-parseInt(newValue));
                            totalWeekHours  = parseInt($('#TotalWeekHours').text()) - (parseInt($('#ThursdayHours'+ info.name.split(',')[0] + '').text())-parseInt(newValue));
                        }
                        else if(parseInt($('#ThursdayHours'+ info.name.split(',')[0] + '').text()) < parseInt(newValue)) {
                            hours  = parseInt($('#TotalHours'+ info.name.split(',')[0] + '').text()) + (parseInt(newValue) - parseInt($('#ThursdayHours'+ info.name.split(',')[0] + '').text()));
                            totalHours  = parseInt($('#TotalThursdayHours').text()) + (parseInt(newValue) - parseInt($('#ThursdayHours'+ info.name.split(',')[0] + '').text()));
                            totalWeekHours  = parseInt($('#TotalWeekHours').text()) + (parseInt(newValue) - parseInt($('#ThursdayHours'+ info.name.split(',')[0] + '').text()));
                        }
                        else {
                            hours = parseInt($('#TotalHours'+ info.name.split(',')[0] + '').text()) + (parseInt(newValue));
                            totalHours = parseInt($('#TotalThursdayHours').text()) + (parseInt(newValue));
                            totalWeekHours = parseInt($('#TotalWeekHours').text()) + (parseInt(newValue));
                        }
                        //Get the t_number from the JSON which is the first index after the split
                        $('#TotalHours'+ info.name.split(',')[0] + '').text(hours.toString());
                        $('#TotalThursdayHours').text(totalHours.toString());
                        $('#TotalWeekHours').text(totalWeekHours);
                    }
                });
                totalHours += parseInt(hourObj[hour].selling_hours);
                thursdayHours += parseInt(hourObj[hour].selling_hours);

            }
            if (moment().startOf('isoWeek').add(4,'day').format('YYYY-MM-DD') == hourObj[hour].date.substring(0, 10)
                && userObj[user].t_number == hourObj[hour].team_member) {
                $('#FridayHours' + userObj[user].t_number + '').editable({
                    type: 'text',
                    pk: 1,
                    url: '/users/selling-hours',
                    name: userObj[user].t_number + ',' + hourObj[hour].store_id + ',' + hourObj[hour].date.substring(0, 10),
                    value: hourObj[hour].selling_hours,
                    send: 'always',
                    success: function (response, newValue) {
                        var info = JSON.parse(response);
                        var hours,totalHours,totalWeekHours;
                        if(parseInt($('#FridayHours'+ info.name.split(',')[0] + '').text()) > parseInt(newValue))
                        {
                            hours  = parseInt($('#TotalHours'+ info.name.split(',')[0] + '').text()) - (parseInt($('#FridayHours'+ info.name.split(',')[0] + '').text()-parseInt(newValue)));
                            totalHours  = parseInt($('#TotalFridayHours').text()) - (parseInt($('#FridayHours'+ info.name.split(',')[0] + '').text())-parseInt(newValue));
                            totalWeekHours  = parseInt($('#TotalWeekHours').text()) - (parseInt($('#FridayHours'+ info.name.split(',')[0] + '').text())-parseInt(newValue));
                        }
                        else if(parseInt($('#FridayHours'+ info.name.split(',')[0] + '').text()) < parseInt(newValue))
                        {
                            hours  = parseInt($('#TotalHours'+ info.name.split(',')[0] + '').text()) + (parseInt(newValue) - parseInt($('#FridayHours'+ info.name.split(',')[0] + '').text()));
                            totalHours  = parseInt($('#TotalFridayHours').text()) + (parseInt(newValue) - parseInt($('#FridayHours'+ info.name.split(',')[0] + '').text()));
                            totalWeekHours  = parseInt($('#TotalWeekHours').text()) + (parseInt(newValue) - parseInt($('#FridayHours'+ info.name.split(',')[0] + '').text()));
                        }
                        else
                        {
                            hours = parseInt($('#TotalHours'+ info.name.split(',')[0] + '').text()) + (parseInt(newValue));
                            totalHours = parseInt($('#TotalFridayHours').text()) + (parseInt(newValue));
                            totalWeekHours = parseInt($('#TotalWeekHours').text()) + (parseInt(newValue));
                        }
                        //Get the t_number from the JSON which is the first index after the split
                        $('#TotalHours'+ info.name.split(',')[0] + '').text(hours.toString());
                        $('#TotalFridayHours').text(totalHours.toString());
                        $('#TotalWeekHours').text(totalWeekHours);
                    }

                });
                totalHours += parseInt(hourObj[hour].selling_hours);
                fridayHours += parseInt(hourObj[hour].selling_hours);

            }
            if (moment().startOf('isoWeek').add(5,'day').format('YYYY-MM-DD') == hourObj[hour].date.substring(0, 10)
                && userObj[user].t_number == hourObj[hour].team_member) {
                $('#SaturdayHours' + userObj[user].t_number + '').editable({
                    type: 'text',
                    pk: 1,
                    url: '/users/selling-hours',
                    name: userObj[user].t_number + ',' + hourObj[hour].store_id + ',' + hourObj[hour].date.substring(0, 10),
                    value: hourObj[hour].selling_hours,
                    send: 'always',
                    success: function (response, newValue) {
                        var info = JSON.parse(response);
                        var hours,totalHours,totalWeekHours;
                        if(parseInt($('#SaturdayHours'+ info.name.split(',')[0] + '').text()) > parseInt(newValue)) {
                            hours  = parseInt($('#TotalHours'+ info.name.split(',')[0] + '').text()) - (parseInt($('#SaturdayHours'+ info.name.split(',')[0] + '').text()-parseInt(newValue)));
                            totalHours  = parseInt($('#TotalSaturdayHours').text()) - (parseInt($('#SaturdayHours'+ info.name.split(',')[0] + '').text())-parseInt(newValue));
                            totalWeekHours  = parseInt($('#TotalWeekHours').text()) - (parseInt($('#SaturdayHours'+ info.name.split(',')[0] + '').text())-parseInt(newValue));
                        }
                        else if(parseInt($('#SaturdayHours'+ info.name.split(',')[0] + '').text()) < parseInt(newValue)) {
                            hours  = parseInt($('#TotalHours'+ info.name.split(',')[0] + '').text()) + (parseInt(newValue) - parseInt($('#SaturdayHours'+ info.name.split(',')[0] + '').text()));
                            totalHours  = parseInt($('#TotalSaturdayHours').text()) + (parseInt(newValue) - parseInt($('#SaturdayHours'+ info.name.split(',')[0] + '').text()));
                            totalWeekHours  = parseInt($('#TotalWeekHours').text()) + (parseInt(newValue) - parseInt($('#SaturdayHours'+ info.name.split(',')[0] + '').text()));
                        }
                        else {
                            hours = parseInt($('#TotalHours'+ info.name.split(',')[0] + '').text()) + (parseInt(newValue));
                            totalHours = parseInt($('#TotalSaturdayHours').text()) + (parseInt(newValue));
                            totalWeekHours = parseInt($('#TotalWeekHours').text()) + (parseInt(newValue));
                        }
                        //Get the t_number from the JSON which is the first index after the split
                        $('#TotalHours'+ info.name.split(',')[0] + '').text(hours.toString());
                        $('#TotalSaturdayHours').text(totalHours.toString());
                        $('#TotalWeekHours').text(totalWeekHours);
                    }
                });
                totalHours += parseInt(hourObj[hour].selling_hours);
                saturdayHours += parseInt(hourObj[hour].selling_hours);
            }
        }//end for loop for hours
        $('#TotalSundayHours').text(sundayHours);
        $('#TotalMondayHours').text(mondayHours);
        $('#TotalTuesdayHours').text(tuesdayHours);
        $('#TotalWednesdayHours').text(wednesdayHours);
        $('#TotalThursdayHours').text(thursdayHours);
        $('#TotalFridayHours').text(fridayHours);
        $('#TotalSaturdayHours').text(saturdayHours);
        $('#TotalHours'+ userObj[user].t_number + '').text(totalHours);
        $('#TotalWeekHours').text(sundayHours+mondayHours+tuesdayHours+wednesdayHours+thursdayHours+fridayHours+saturdayHours);
        totalHours = 0;
        $('#SundayHours' + userObj[user].t_number + '').editable({
            type: 'text',
            pk: 1,
            url: '/users/selling-hours',
            name: userObj[user].t_number + ',' +userObj[user].store_id + ',' + moment().startOf('isoWeek').subtract(1,'day').format('YYYY-MM-DD'),
            value:'   ',
            emptytext:'   ',
            send: 'always',
            success: function (response, newValue) {
                var info = JSON.parse(response);
                var hours,totalHours,totalWeekHours;
                if(parseInt($('#SundayHours'+ info.name.split(',')[0] + '').text()) > parseInt(newValue)) {
                    hours  = parseInt($('#TotalHours'+ info.name.split(',')[0] + '').text()) - (parseInt($('#SundayHours'+ info.name.split(',')[0] + '').text()-parseInt(newValue)));
                    totalHours  = parseInt($('#TotalSundayHours').text()) - (parseInt($('#SundayHours'+ info.name.split(',')[0] + '').text())-parseInt(newValue));
                    totalWeekHours  = parseInt($('#TotalWeekHours').text()) - (parseInt($('#SundayHours'+ info.name.split(',')[0] + '').text())-parseInt(newValue));
                }
                else if(parseInt($('#SundayHours'+ info.name.split(',')[0] + '').text()) < parseInt(newValue)) {
                    hours  = parseInt($('#TotalHours'+ info.name.split(',')[0] + '').text()) + (parseInt(newValue) - parseInt($('#SundayHours'+ info.name.split(',')[0] + '').text()));
                    totalHours  = parseInt($('#TotalSundayHours').text()) + (parseInt(newValue) - parseInt($('#SundayHours'+ info.name.split(',')[0] + '').text()));
                    totalWeekHours  = parseInt($('#TotalWeekHours').text()) + (parseInt(newValue) - parseInt($('#SundayHours'+ info.name.split(',')[0] + '').text()));
                }
                else {
                    hours = parseInt($('#TotalHours'+ info.name.split(',')[0] + '').text()) + (parseInt(newValue));
                    totalHours = parseInt($('#TotalSundayHours').text()) + (parseInt(newValue));
                    totalWeekHours = parseInt($('#TotalWeekHours').text()) + (parseInt(newValue));
                }
                //Get the t_number from the JSON which is the first index after the split
                $('#TotalHours'+ info.name.split(',')[0] + '').text(hours.toString());
                $('#TotalSundayHours').text(totalHours.toString());
                $('#TotalWeekHours').text(totalWeekHours);
            }
        });

        $('#MondayHours' + userObj[user].t_number + '').editable({
            type: 'text',
            pk: 1,
            url: '/users/selling-hours',
            name: userObj[user].t_number + ',' +userObj[user].store_id + ',' + moment().startOf('isoWeek').format('YYYY-MM-DD'),
            value:'   ',
            emptytext:'   ',
            send: 'always',
            success: function (response, newValue) {
                var info = JSON.parse(response);
                var hours,totalHours,totalWeekHours;
                if(parseInt($('#MondayHours'+ info.name.split(',')[0] + '').text()) > parseInt(newValue)) {
                    hours  = parseInt($('#TotalHours'+ info.name.split(',')[0] + '').text()) - (parseInt($('#MondayHours'+ info.name.split(',')[0] + '').text()-parseInt(newValue)));
                    totalHours  = parseInt($('#TotalMondayHours').text()) - (parseInt($('#MondayHours'+ info.name.split(',')[0] + '').text())-parseInt(newValue));
                    totalWeekHours  = parseInt($('#TotalWeekHours').text()) - (parseInt($('#MondayHours'+ info.name.split(',')[0] + '').text())-parseInt(newValue));
                }
                else if(parseInt($('#MondayHours'+ info.name.split(',')[0] + '').text()) < parseInt(newValue)) {
                    hours  = parseInt($('#TotalHours'+ info.name.split(',')[0] + '').text()) + (parseInt(newValue) - parseInt($('#MondayHours'+ info.name.split(',')[0] + '').text()));
                    totalHours  = parseInt($('#TotalMondayHours').text()) + (parseInt(newValue) - parseInt($('#MondayHours'+ info.name.split(',')[0] + '').text()));
                    totalWeekHours  = parseInt($('#TotalWeekHours').text()) + (parseInt(newValue) - parseInt($('#MondayHours'+ info.name.split(',')[0] + '').text()));
                }
                else {
                    hours = parseInt($('#TotalHours'+ info.name.split(',')[0] + '').text()) + (parseInt(newValue));
                    totalHours = parseInt($('#TotalMondayHours').text()) + (parseInt(newValue));
                    totalWeekHours = parseInt($('#TotalWeekHours').text()) + (parseInt(newValue));
                }
                //Get the t_number from the JSON which is the first index after the split
                $('#TotalHours'+ info.name.split(',')[0] + '').text(hours.toString());
                $('#TotalMondayHours').text(totalHours.toString());
                $('#TotalWeekHours').text(totalWeekHours);
            }
        });


        $('#TuesdayHours' + userObj[user].t_number + '').editable({
            type: 'text',
            pk: 1,
            url: '/users/selling-hours',
            name: userObj[user].t_number + ',' +userObj[user].store_id + ',' + moment().startOf('isoWeek').add(1,'day').format('YYYY-MM-DD'),
            value:'   ',
            emptytext:'   ',
            send: 'always',
            success: function (response, newValue) {
                var info = JSON.parse(response);
                var hours,totalHours,totalWeekHours;
                if(parseInt($('#TuesdayHours'+ info.name.split(',')[0] + '').text()) > parseInt(newValue)) {
                    hours  = parseInt($('#TotalHours'+ info.name.split(',')[0] + '').text()) - (parseInt($('#TuesdayHours'+ info.name.split(',')[0] + '').text()-parseInt(newValue)));
                    totalHours  = parseInt($('#TotalTuesdayHours').text()) - (parseInt($('#TuesdayHours'+ info.name.split(',')[0] + '').text())-parseInt(newValue));
                    totalWeekHours  = parseInt($('#TotalWeekHours').text()) - (parseInt($('#TuesdayHours'+ info.name.split(',')[0] + '').text())-parseInt(newValue));
                }
                else if(parseInt($('#TuesdayHours'+ info.name.split(',')[0] + '').text()) < parseInt(newValue)) {
                    hours  = parseInt($('#TotalHours'+ info.name.split(',')[0] + '').text()) + (parseInt(newValue) - parseInt($('#TuesdayHours'+ info.name.split(',')[0] + '').text()));
                    totalHours  = parseInt($('#TotalTuesdayHours').text()) + (parseInt(newValue) - parseInt($('#TuesdayHours'+ info.name.split(',')[0] + '').text()));
                    totalWeekHours  = parseInt($('#TotalWeekHours').text()) + (parseInt(newValue) - parseInt($('#TuesdayHours'+ info.name.split(',')[0] + '').text()));
                }
                else {
                    hours = parseInt($('#TotalHours'+ info.name.split(',')[0] + '').text()) + (parseInt(newValue));
                    totalHours = parseInt($('#TotalTuesdayHours').text()) + (parseInt(newValue));
                    totalWeekHours = parseInt($('#TotalWeekHours').text()) + (parseInt(newValue));
                }
                //Get the t_number from the JSON which is the first index after the split
                $('#TotalHours'+ info.name.split(',')[0] + '').text(hours.toString());
                $('#TotalTuesdayHours').text(totalHours.toString());
                $('#TotalWeekHours').text(totalWeekHours);
            }
        });
        $('#WednesdayHours'+userObj[user].t_number+'').editable({
            type: 'text',
            pk: 1,
            url: '/users/selling-hours',
            name: userObj[user].t_number + ',' +userObj[user].store_id + ',' + moment().startOf('isoWeek').add(2,'day').format('YYYY-MM-DD'),
            value:'   ',
            emptytext:'   ',
            send: 'always',
            success: function(response, newValue) {
                var info = JSON.parse(response);
                var hours,totalHours,totalWeekHours;
                if(parseInt($('#WednesdayHours'+ info.name.split(',')[0] + '').text()) > parseInt(newValue)) {
                    hours  = parseInt($('#TotalHours'+ info.name.split(',')[0] + '').text()) - (parseInt($('#WednesdayHours'+ info.name.split(',')[0] + '').text()-parseInt(newValue)));
                    totalHours  = parseInt($('#TotalWednesdayHours').text()) - (parseInt($('#WednesdayHours'+ info.name.split(',')[0] + '').text())-parseInt(newValue));
                    totalWeekHours  = parseInt($('#TotalWeekHours').text()) - (parseInt($('#WednesdayHours'+ info.name.split(',')[0] + '').text())-parseInt(newValue));
                }
                else if(parseInt($('#WednesdayHours'+ info.name.split(',')[0] + '').text()) < parseInt(newValue)) {
                    hours  = parseInt($('#TotalHours'+ info.name.split(',')[0] + '').text()) + (parseInt(newValue) - parseInt($('#WednesdayHours'+ info.name.split(',')[0] + '').text()));
                    totalHours  = parseInt($('#TotalWednesdayHours').text()) + (parseInt(newValue) - parseInt($('#WednesdayHours'+ info.name.split(',')[0] + '').text()));
                    totalWeekHours  = parseInt($('#TotalWeekHours').text()) + (parseInt(newValue) - parseInt($('#WednesdayHours'+ info.name.split(',')[0] + '').text()));
                }
                else {
                    hours = parseInt($('#TotalHours'+ info.name.split(',')[0] + '').text()) + (parseInt(newValue));
                    totalHours = parseInt($('#TotalWednesdayHours').text()) + (parseInt(newValue));
                    totalWeekHours = parseInt($('#TotalWeekHours').text()) + (parseInt(newValue));
                }
                //Get the t_number from the JSON which is the first index after the split
                $('#TotalHours'+ info.name.split(',')[0] + '').text(hours.toString());
                $('#TotalWednesdayHours').text(totalHours.toString());
                $('#TotalWeekHours').text(totalWeekHours);
            }
        });


        $('#ThursdayHours' + userObj[user].t_number + '').editable({
            type: 'text',
            pk: 1,
            url: '/users/selling-hours',
            name: userObj[user].t_number + ',' +userObj[user].store_id + ',' +moment().startOf('isoWeek').add(3,'day').format('YYYY-MM-DD'),
            value:'   ',
            emptytext:'   ',
            send: 'always',
            success: function (response, newValue) {
                var info = JSON.parse(response);
                var hours,totalHours,totalWeekHours;
                if(parseInt($('#ThursdayHours'+ info.name.split(',')[0] + '').text()) > parseInt(newValue)) {
                    hours  = parseInt($('#TotalHours'+ info.name.split(',')[0] + '').text()) - (parseInt($('#ThursdayHours'+ info.name.split(',')[0] + '').text()-parseInt(newValue)));
                    totalHours  = parseInt($('#TotalThursdayHours').text()) - (parseInt($('#ThursdayHours'+ info.name.split(',')[0] + '').text())-parseInt(newValue));
                    totalWeekHours  = parseInt($('#TotalWeekHours').text()) - (parseInt($('#ThursdayHours'+ info.name.split(',')[0] + '').text())-parseInt(newValue));
                }
                else if(parseInt($('#ThursdayHours'+ info.name.split(',')[0] + '').text()) < parseInt(newValue)) {
                    hours  = parseInt($('#TotalHours'+ info.name.split(',')[0] + '').text()) + (parseInt(newValue) - parseInt($('#ThursdayHours'+ info.name.split(',')[0] + '').text()));
                    totalHours  = parseInt($('#TotalThursdayHours').text()) + (parseInt(newValue) - parseInt($('#ThursdayHours'+ info.name.split(',')[0] + '').text()));
                    totalWeekHours  = parseInt($('#TotalWeekHours').text()) + (parseInt(newValue) - parseInt($('#ThursdayHours'+ info.name.split(',')[0] + '').text()));
                }
                else {
                    hours = parseInt($('#TotalHours'+ info.name.split(',')[0] + '').text()) + (parseInt(newValue));
                    totalHours = parseInt($('#TotalThursdayHours').text()) + (parseInt(newValue));
                    totalWeekHours = parseInt($('#TotalWeekHours').text()) + (parseInt(newValue));
                }
                //Get the t_number from the JSON which is the first index after the split
                $('#TotalHours'+ info.name.split(',')[0] + '').text(hours.toString());
                $('#TotalThursdayHours').text(totalHours.toString());
                $('#TotalWeekHours').text(totalWeekHours);
            }

        });


        $('#FridayHours' + userObj[user].t_number + '').editable({
            type: 'text',
            pk: 1,
            url: '/users/selling-hours',
            name: userObj[user].t_number + ',' +userObj[user].store_id + ',' + moment().startOf('isoWeek').add(4,'day').format('YYYY-MM-DD'),
            value:'   ',
            emptytext:'   ',
            send: 'always',
            success: function (response, newValue) {
                var info = JSON.parse(response);
                var hours,totalHours,totalWeekHours;
                if(parseInt($('#FridayHours'+ info.name.split(',')[0] + '').text()) > parseInt(newValue)) {
                    hours  = parseInt($('#TotalHours'+ info.name.split(',')[0] + '').text()) - (parseInt($('#FridayHours'+ info.name.split(',')[0] + '').text()-parseInt(newValue)));
                    totalHours  = parseInt($('#TotalFridayHours').text()) - (parseInt($('#FridayHours'+ info.name.split(',')[0] + '').text())-parseInt(newValue));
                    totalWeekHours  = parseInt($('#TotalWeekHours').text()) - (parseInt($('#FridayHours'+ info.name.split(',')[0] + '').text())-parseInt(newValue));
                }
                else if(parseInt($('#FridayHours'+ info.name.split(',')[0] + '').text()) < parseInt(newValue)) {
                    hours  = parseInt($('#TotalHours'+ info.name.split(',')[0] + '').text()) + (parseInt(newValue) - parseInt($('#FridayHours'+ info.name.split(',')[0] + '').text()));
                    totalHours  = parseInt($('#TotalFridayHours').text()) + (parseInt(newValue) - parseInt($('#FridayHours'+ info.name.split(',')[0] + '').text()));
                    totalWeekHours  = parseInt($('#TotalWeekHours').text()) + (parseInt(newValue) - parseInt($('#FridayHours'+ info.name.split(',')[0] + '').text()));
                }
                else {
                    hours = parseInt($('#TotalHours'+ info.name.split(',')[0] + '').text()) + (parseInt(newValue));
                    totalHours = parseInt($('#TotalFridayHours').text()) + (parseInt(newValue));
                    totalWeekHours = parseInt($('#TotalWeekHours').text()) + (parseInt(newValue));
                }
                //Get the t_number from the JSON which is the first index after the split
                $('#TotalHours'+ info.name.split(',')[0] + '').text(hours.toString());
                $('#TotalFridayHours').text(totalHours.toString());
                $('#TotalWeekHours').text(totalWeekHours);
            }
        });


        $('#SaturdayHours' + userObj[user].t_number + '').editable({
            type: 'text',
            pk: 1,
            url: '/users/selling-hours',
            name: userObj[user].t_number + ',' +userObj[user].store_id + ',' +moment().startOf('isoWeek').add(5,'day').format('YYYY-MM-DD'),
            value:'   ',
            emptytext:'   ',
            send: 'always',
            success: function (response, newValue) {
                var info = JSON.parse(response);
                var hours,totalHours,totalWeekHours;
                if(parseInt($('#SaturdayHours'+ info.name.split(',')[0] + '').text()) > parseInt(newValue)) {
                    hours  = parseInt($('#TotalHours'+ info.name.split(',')[0] + '').text()) - (parseInt($('#SaturdayHours'+ info.name.split(',')[0] + '').text()-parseInt(newValue)));
                    totalHours  = parseInt($('#TotalSaturdayHours').text()) - (parseInt($('#SaturdayHours'+ info.name.split(',')[0] + '').text())-parseInt(newValue));
                    totalWeekHours  = parseInt($('#TotalWeekHours').text()) - (parseInt($('#SaturdayHours'+ info.name.split(',')[0] + '').text())-parseInt(newValue));
                }
                else if(parseInt($('#SaturdayHours'+ info.name.split(',')[0] + '').text()) < parseInt(newValue)) {
                    hours  = parseInt($('#TotalHours'+ info.name.split(',')[0] + '').text()) + (parseInt(newValue) - parseInt($('#SaturdayHours'+ info.name.split(',')[0] + '').text()));
                    totalHours  = parseInt($('#TotalSaturdayHours').text()) + (parseInt(newValue) - parseInt($('#SaturdayHours'+ info.name.split(',')[0] + '').text()));
                    totalWeekHours  = parseInt($('#TotalWeekHours').text()) + (parseInt(newValue) - parseInt($('#SaturdayHours'+ info.name.split(',')[0] + '').text()));
                }
                else {
                    hours = parseInt($('#TotalHours'+ info.name.split(',')[0] + '').text()) + (parseInt(newValue));
                    totalHours = parseInt($('#TotalSaturdayHours').text()) + (parseInt(newValue));
                    totalWeekHours = parseInt($('#TotalWeekHours').text()) + (parseInt(newValue));
                }
                //Get the t_number from the JSON which is the first index after the split
                $('#TotalHours'+ info.name.split(',')[0] + '').text(hours.toString());
                $('#TotalSaturdayHours').text(totalHours.toString());
                $('#TotalWeekHours').text(totalWeekHours);
            }
        });
    }
}


//Get the current dates for the week
function getDaysOfTheWeek() {
    var monday,tuesday,wednesday,thursday,friday,saturday, sunday;

    sunday = moment().startOf('isoWeek').subtract(1,'day').format('MMMM-DD');
    monday = moment().startOf('isoWeek').format('MMMM-DD');
    tuesday = moment().startOf('isoWeek').add(1,'day').format('MMMM-DD');
    wednesday = moment().startOf('isoWeek').add(2,'day').format('MMMM-DD');
    thursday = moment().startOf('isoWeek').add(3,'day').format('MMMM-DD');
    friday = moment().startOf('isoWeek').add(4,'day').format('MMMM-DD');
    saturday = moment().startOf('isoWeek').add(5,'day').format('MMMM-DD');

    $('#Sunday').text(sunday);
    $('#Monday').text(monday);
    $('#Tuesday').text(tuesday);
    $('#Wednesday').text(wednesday);
    $('#Thursday').text(thursday);
    $('#Friday').text(friday);
    $('#Saturday').text(saturday);
}
$.fn.editable.defaults.mode = 'inline';



function displayBudgets() {
    var CTs = '';
    var revenue = '';
    var aotm = '';
    var ls = '';

    if(filteredBudgetArray[0] != undefined){
        CTs = filteredBudgetArray[0].CTs;
        revenue = filteredBudgetArray[0].revenue;
        aotm = filteredBudgetArray[0].aotm;
        ls = filteredBudgetArray[0].ls;

        $('#BDCC').html((8 / 100 * filteredBudgetArray[0].CTs).toFixed(2));
        $('#BDSBS').html((7 / 100 * filteredBudgetArray[0].CTs).toFixed(2));
        $('#BDTB').html((7 / 100 * filteredBudgetArray[0].CTs).toFixed(2));
    }


    $('#CTs').editable({
        type: 'text',
        pk: 1,
        url: '/users/selling-hours/budgets',
        name: 'CTs' + ',' + moment().format("YYYY-MM-DD") + ',' +filteredStoresArray[0].store_id,
        value: CTs,
        params: function(params) {  //params already contain `name`, `value` and `pk`
            params.name = 'CTs' + ',' + moment().format("YYYY-MM-DD") + ',' +filteredStoresArray[0].store_id;
            return params;
        },
        emptytext:'&nbsp;',
        send: 'always',
        success: function (response, newValue) {
            if (response.status == 'error') return response.msg; //msg will be shown in editable form
            var info = JSON.parse(response);
            $('#BDCC').html((8 / 100 * info.value).toFixed(2));
            $('#BDSBS').html((7 / 100 * info.value).toFixed(2));
            $('#BDTB').html((7 / 100 * info.value).toFixed(2));

            if(filteredBudgetArray[0] != undefined)
                filteredBudgetArray[0].CTs = info.value;
        }

    });
    $('#Rev').editable({
        type: 'text',
        pk: 1,
        url: '/users/selling-hours/budgets',
        name: 'revenue' + ',' + moment().format("YYYY-MM-DD") + ',' +filteredStoresArray[0].store_id,
        value: revenue,
        params: function(params) {  //params already contain `name`, `value` and `pk`
            params.name = 'revenue' + ',' + moment().format("YYYY-MM-DD") + ',' +filteredStoresArray[0].store_id;
            return params;
        },
        emptytext:'&nbsp;',
        send: 'always',
        success: function (response, newValue) {
            if (response.status == 'error') return response.msg; //msg will be shown in editable form

            var info = JSON.parse(response);
            if(filteredBudgetArray[0] != undefined)
                filteredBudgetArray[0].revenue = info.value;
        }
    });
    $('#AOTM').editable({
        type: 'text',
        pk: 1,
        url: '/users/selling-hours/budgets',
        name: 'aotm' + ',' + moment().format("YYYY-MM-DD") + ',' +filteredStoresArray[0].store_id,
        value: aotm,
        params: function(params) {  //params already contain `name`, `value` and `pk`
            params.name = 'aotm' + ',' + moment().format("YYYY-MM-DD") + ',' +filteredStoresArray[0].store_id;
            return params;
        },
        emptytext:'&nbsp;',
        send: 'always',
        success: function (response, newValue) {
            if (response.status == 'error') return response.msg; //msg will be shown in editable form

            var info = JSON.parse(response);
            if(filteredBudgetArray[0] != undefined)
                filteredBudgetArray[0].aotm = info.value;
        }
    });

    $('#LS').editable({
        type: 'text',
        pk: 1,
        url: '/users/selling-hours/budgets',
        name: 'ls' + ',' + moment().format("YYYY-MM-DD") + ',' +filteredStoresArray[0].store_id,
        value: ls,
        params: function(params) {  //params already contain `name`, `value` and `pk`
            params.name = 'ls' + ',' + moment().format("YYYY-MM-DD") + ',' +filteredStoresArray[0].store_id;
            return params;
        },
        emptytext:'&nbsp;',
        send: 'always',
        success: function (response, newValue) {
            if (response.status == 'error') return response.msg; //msg will be shown in editable form

            var info = JSON.parse(response);
            if(filteredBudgetArray[0] != undefined)
                filteredBudgetArray[0].ls = info.value;
        }
    });

    


    if(filteredBudgetArray[0] != undefined) {
        $('#CTs').editable('setValue', CTs);
        $('#Rev').editable('setValue', revenue);
        $('#AOTM').editable('setValue', aotm);
        $('#LS').editable('setValue', ls);
    } else {
        $('#CTs').editable('setValue', null);
        $('#Rev').editable('setValue', null);
        $('#AOTM').editable('setValue', null);
        $('#LS').editable('setValue', null);

        $('#BDCC').html('');
        $('#BDSBS').html('');
        $('#BDTB').html('');
    }

};

function displayUsers() {
    var hoursTable = "";

    hoursTable += `
                <tr>
                    <td></td>
                    <th id="Sunday"></th>
                    <th id="Monday"></th>
                    <th id="Tuesday"></th>
                    <th id="Wednesday"></th>
                    <th id="Thursday"></th>
                    <th id="Friday"></th>
                    <th id="Saturday"></th>
                    <th></th>
                </tr>`;


    for(var userIndex in filteredUserArray){
        hoursTable += `<tr>
                        <td>${filteredUserArray[userIndex].first_name}  ${filteredUserArray[userIndex].last_name}</td>
                        <td id="SundayHours${filteredUserArray[userIndex].t_number}"></td>
                        <td id="MondayHours${filteredUserArray[userIndex].t_number}"></td>
                        <td id="TuesdayHours${filteredUserArray[userIndex].t_number}"></td>
                        <td id="WednesdayHours${filteredUserArray[userIndex].t_number}"></td>
                        <td id="ThursdayHours${filteredUserArray[userIndex].t_number}"></td>
                        <td id="FridayHours${filteredUserArray[userIndex].t_number}"></td>
                        <td id="SaturdayHours${filteredUserArray[userIndex].t_number}"></td>
                        <td id="TotalHours${filteredUserArray[userIndex].t_number}"></td>
                      <tr>`;
    }
    hoursTable += `
                <tr>
                    <td>Total Actual</td>
                    <td id="TotalSundayHours"></td>
                    <td id="TotalMondayHours"></td>
                    <td id="TotalTuesdayHours"></td>
                    <td id="TotalWednesdayHours"></td>
                    <td id="TotalThursdayHours"></td>
                    <td id="TotalFridayHours"></td>
                    <td id="TotalSaturdayHours"></td>
                    <td id="TotalWeekHours"></td>
                </tr>`;


    $(`#hoursTable`).html(hoursTable);
    getDaysOfTheWeek();
    displayEmployeeHours(filteredUserArray, filteredHoursArray);
}


function applyFilter() {}

