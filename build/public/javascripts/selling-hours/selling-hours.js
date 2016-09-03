'use strict';

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

$(function () {
    storesArray = JSON.parse(JSON.stringify(storeObj));
    budgetArray = JSON.parse(JSON.stringify(budgetObj));
    console.log(hourObj);
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

    store.change(function (event) {
        //Get the selected user from from the drop down
        store = $('#store').val();

        //console.log(store);

        filteredBudgetArray = budgetArray.filter(function (bud) {
            return bud.store_id == store;
        });
        filteredHoursArray = hourObj.filter(function (hour) {
            return hour.store_id == store;
        });
        filteredUserArray = userObj.filter(function (user) {
            return user.store_id == store;
        });
        filteredStoresArray = storeObj.filter(function (st) {
            return st.store_id == store;
        });

        //console.debug(filteredBudgetArray);
        //console.debug(filteredHoursArray);
        //console.debug(filteredStoresArray);
        displayUsers();
        displayBudgets();
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
            displayEmployeeHours(filteredUserArray, filteredHoursArray, aDate);
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
            displayEmployeeHours(filteredUserArray, filteredHoursArray, moment().startOf('isoWeek'));
        }
        $('#hiddenDate').val($('#dateRange').val());
    });
    //Trigger the drop down change function to load the HTML
    store.trigger('change');
});
//Retrieve hours from array and display them in the appropriate row
function displayEmployeeHours(userObj, hourObj, date) {
    var totalHours = 0,
        sundayHours = 0,
        mondayHours = 0,
        tuesdayHours = 0,
        wednesdayHours = 0,
        thursdayHours = 0,
        fridayHours = 0,
        saturdayHours = 0;
    var totalStoreHours = 0;
    for (var user in userObj) {
        for (var hour in hourObj) {
            if (moment(date).day("Sunday").format('YYYY-MM-DD') == hourObj[hour].date.substring(0, 10) && userObj[user].t_number == hourObj[hour].team_member) {
                $('#SundayHours' + userObj[user].t_number + '').editable({
                    type: 'text',
                    pk: 1,
                    url: '/users/selling-hours',
                    name: userObj[user].t_number + ',' + hourObj[hour].store_id + ',' + moment(date).day("Sunday").format('YYYY-MM-DD'),
                    value: hourObj[hour].selling_hours,
                    send: 'always',
                    success: function success(response, newValue) {
                        var info = JSON.parse(response);
                        var hours, totalHours, totalWeekHours;
                        if (parseInt($('#SundayHours' + info.name.split(',')[0] + '').text()) > parseInt(newValue)) {
                            hours = parseInt($('#TotalHours' + info.name.split(',')[0] + '').text()) - parseInt($('#SundayHours' + info.name.split(',')[0] + '').text() - parseInt(newValue));
                            totalHours = parseInt($('#TotalSundayHours').text()) - (parseInt($('#SundayHours' + info.name.split(',')[0] + '').text()) - parseInt(newValue));
                            totalWeekHours = parseInt($('#TotalWeekHours').text()) - (parseInt($('#SundayHours' + info.name.split(',')[0] + '').text()) - parseInt(newValue));
                        } else if (parseInt($('#SundayHours' + info.name.split(',')[0] + '').text()) < parseInt(newValue)) {
                            hours = parseInt($('#TotalHours' + info.name.split(',')[0] + '').text()) + (parseInt(newValue) - parseInt($('#SundayHours' + info.name.split(',')[0] + '').text()));
                            totalHours = parseInt($('#TotalSundayHours').text()) + (parseInt(newValue) - parseInt($('#SundayHours' + info.name.split(',')[0] + '').text()));
                            totalWeekHours = parseInt($('#TotalWeekHours').text()) + (parseInt(newValue) - parseInt($('#SundayHours' + info.name.split(',')[0] + '').text()));
                        } else {
                            hours = parseInt($('#TotalHours' + info.name.split(',')[0] + '').text()) + parseInt(newValue);
                            totalHours = parseInt($('#TotalSundayHours').text()) + parseInt(newValue);
                            totalWeekHours = parseInt($('#TotalWeekHours').text()) + parseInt(newValue);
                        }
                        //Get the t_number from the JSON which is the first index after the split
                        $('#TotalHours' + info.name.split(',')[0] + '').text(hours.toString());
                        $('#TotalSundayHours').text(totalHours.toString());
                        $('#TotalWeekHours').text(totalWeekHours);
                    }
                });
                totalHours += parseInt(hourObj[hour].selling_hours);
                sundayHours += parseInt(hourObj[hour].selling_hours);
            }

            if (moment(date).day("Monday").format('YYYY-MM-DD') == hourObj[hour].date.substring(0, 10) && userObj[user].t_number == hourObj[hour].team_member) {
                $('#MondayHours' + userObj[user].t_number + '').editable({
                    type: 'text',
                    pk: 1,
                    url: '/users/selling-hours',
                    name: userObj[user].t_number + ',' + hourObj[hour].store_id + ',' + moment(date).day("Monday").format('YYYY-MM-DD'),
                    value: hourObj[hour].selling_hours,
                    send: 'always',
                    success: function success(response, newValue) {
                        var info = JSON.parse(response);
                        var hours, totalHours, totalWeekHours;
                        if (parseInt($('#MondayHours' + info.name.split(',')[0] + '').text()) > parseInt(newValue)) {
                            hours = parseInt($('#TotalHours' + info.name.split(',')[0] + '').text()) - parseInt($('#MondayHours' + info.name.split(',')[0] + '').text() - parseInt(newValue));
                            totalHours = parseInt($('#TotalMondayHours').text()) - (parseInt($('#MondayHours' + info.name.split(',')[0] + '').text()) - parseInt(newValue));
                            totalWeekHours = parseInt($('#TotalWeekHours').text()) - (parseInt($('#MondayHours' + info.name.split(',')[0] + '').text()) - parseInt(newValue));
                        } else if (parseInt($('#MondayHours' + info.name.split(',')[0] + '').text()) < parseInt(newValue)) {
                            hours = parseInt($('#TotalHours' + info.name.split(',')[0] + '').text()) + (parseInt(newValue) - parseInt($('#MondayHours' + info.name.split(',')[0] + '').text()));
                            totalHours = parseInt($('#TotalMondayHours').text()) + (parseInt(newValue) - parseInt($('#MondayHours' + info.name.split(',')[0] + '').text()));
                            totalWeekHours = parseInt($('#TotalWeekHours').text()) + (parseInt(newValue) - parseInt($('#MondayHours' + info.name.split(',')[0] + '').text()));
                        } else {
                            hours = parseInt($('#TotalHours' + info.name.split(',')[0] + '').text()) + parseInt(newValue);
                            totalHours = parseInt($('#TotalMondayHours').text()) + parseInt(newValue);
                            totalWeekHours = parseInt($('#TotalWeekHours').text()) + parseInt(newValue);
                        }
                        //Get the t_number from the JSON which is the first index after the split
                        $('#TotalHours' + info.name.split(',')[0] + '').text(hours.toString());
                        $('#TotalMondayHours').text(totalHours.toString());
                        $('#TotalWeekHours').text(totalWeekHours);
                    }
                });
                totalHours += parseInt(hourObj[hour].selling_hours);
                mondayHours += parseInt(hourObj[hour].selling_hours);
            }
            if (moment(date).day("Tuesday").format('YYYY-MM-DD') == hourObj[hour].date.substring(0, 10) && userObj[user].t_number == hourObj[hour].team_member) {
                $('#TuesdayHours' + userObj[user].t_number + '').editable({
                    type: 'text',
                    pk: 1,
                    url: '/users/selling-hours',
                    name: userObj[user].t_number + ',' + hourObj[hour].store_id + ',' + moment(date).day("Tuesday").format('YYYY-MM-DD'),
                    value: hourObj[hour].selling_hours,
                    send: 'always',
                    success: function success(response, newValue) {
                        var info = JSON.parse(response);
                        var hours, totalHours, totalWeekHours;
                        if (parseInt($('#TuesdayHours' + info.name.split(',')[0] + '').text()) > parseInt(newValue)) {
                            hours = parseInt($('#TotalHours' + info.name.split(',')[0] + '').text()) - parseInt($('#TuesdayHours' + info.name.split(',')[0] + '').text() - parseInt(newValue));
                            totalHours = parseInt($('#TotalTuesdayHours').text()) - (parseInt($('#TuesdayHours' + info.name.split(',')[0] + '').text()) - parseInt(newValue));
                            totalWeekHours = parseInt($('#TotalWeekHours').text()) - (parseInt($('#TuesdayHours' + info.name.split(',')[0] + '').text()) - parseInt(newValue));
                        } else if (parseInt($('#TuesdayHours' + info.name.split(',')[0] + '').text()) < parseInt(newValue)) {
                            hours = parseInt($('#TotalHours' + info.name.split(',')[0] + '').text()) + (parseInt(newValue) - parseInt($('#TuesdayHours' + info.name.split(',')[0] + '').text()));
                            totalHours = parseInt($('#TotalTuesdayHours').text()) + (parseInt(newValue) - parseInt($('#TuesdayHours' + info.name.split(',')[0] + '').text()));
                            totalWeekHours = parseInt($('#TotalWeekHours').text()) + (parseInt(newValue) - parseInt($('#TuesdayHours' + info.name.split(',')[0] + '').text()));
                        } else {
                            hours = parseInt($('#TotalHours' + info.name.split(',')[0] + '').text()) + parseInt(newValue);
                            totalHours = parseInt($('#TotalTuesdayHours').text()) + parseInt(newValue);
                            totalWeekHours = parseInt($('#TotalWeekHours').text()) + parseInt(newValue);
                        }
                        //Get the t_number from the JSON which is the first index after the split
                        $('#TotalHours' + info.name.split(',')[0] + '').text(hours.toString());
                        $('#TotalTuesdayHours').text(totalHours.toString());
                        $('#TotalWeekHours').text(totalWeekHours);
                    }
                });
                totalHours += parseInt(hourObj[hour].selling_hours);
                tuesdayHours += parseInt(hourObj[hour].selling_hours);
            }
            if (moment(date).day("Wednesday").format('YYYY-MM-DD') == hourObj[hour].date.substring(0, 10) && userObj[user].t_number == hourObj[hour].team_member) {
                $('#WednesdayHours' + userObj[user].t_number + '').editable({
                    type: 'text',
                    pk: 1,
                    url: '/users/selling-hours',
                    name: userObj[user].t_number + ',' + hourObj[hour].store_id + ',' + moment(date).day("Wednesday").format('YYYY-MM-DD'),
                    value: hourObj[hour].selling_hours,
                    send: 'always',
                    success: function success(response, newValue) {
                        var info = JSON.parse(response);
                        var hours, totalHours, totalWeekHours;
                        if (parseInt($('#WednesdayHours' + info.name.split(',')[0] + '').text()) > parseInt(newValue)) {
                            hours = parseInt($('#TotalHours' + info.name.split(',')[0] + '').text()) - parseInt($('#WednesdayHours' + info.name.split(',')[0] + '').text() - parseInt(newValue));
                            totalHours = parseInt($('#TotalWednesdayHours').text()) - (parseInt($('#WednesdayHours' + info.name.split(',')[0] + '').text()) - parseInt(newValue));
                            totalWeekHours = parseInt($('#TotalWeekHours').text()) - (parseInt($('#WednesdayHours' + info.name.split(',')[0] + '').text()) - parseInt(newValue));
                        } else if (parseInt($('#WednesdayHours' + info.name.split(',')[0] + '').text()) < parseInt(newValue)) {
                            hours = parseInt($('#TotalHours' + info.name.split(',')[0] + '').text()) + (parseInt(newValue) - parseInt($('#WednesdayHours' + info.name.split(',')[0] + '').text()));
                            totalHours = parseInt($('#TotalWednesdayHours').text()) + (parseInt(newValue) - parseInt($('#WednesdayHours' + info.name.split(',')[0] + '').text()));
                            totalWeekHours = parseInt($('#TotalWeekHours').text()) + (parseInt(newValue) - parseInt($('#WednesdayHours' + info.name.split(',')[0] + '').text()));
                        } else {
                            hours = parseInt($('#TotalHours' + info.name.split(',')[0] + '').text()) + parseInt(newValue);
                            totalHours = parseInt($('#TotalWednesdayHours').text()) + parseInt(newValue);
                            totalWeekHours = parseInt($('#TotalWeekHours').text()) + parseInt(newValue);
                        }
                        //Get the t_number from the JSON which is the first index after the split
                        $('#TotalHours' + info.name.split(',')[0] + '').text(hours.toString());
                        $('#TotalWednesdayHours').text(totalHours.toString());
                        $('#TotalWeekHours').text(totalWeekHours);
                    }

                });
                totalHours += parseInt(hourObj[hour].selling_hours);
                wednesdayHours += parseInt(hourObj[hour].selling_hours);
            }
            if (moment(date).day("Thursday").format('YYYY-MM-DD') == hourObj[hour].date.substring(0, 10) && userObj[user].t_number == hourObj[hour].team_member) {
                $('#ThursdayHours' + userObj[user].t_number + '').editable({
                    type: 'text',
                    pk: 1,
                    url: '/users/selling-hours',
                    name: userObj[user].t_number + ',' + hourObj[hour].store_id + ',' + moment(date).day("Thursday").format('YYYY-MM-DD'),
                    value: hourObj[hour].selling_hours,
                    send: 'always',
                    success: function success(response, newValue) {
                        var info = JSON.parse(response);
                        var hours, totalHours, totalWeekHours;
                        if (parseInt($('#ThursdayHours' + info.name.split(',')[0] + '').text()) > parseInt(newValue)) {
                            hours = parseInt($('#TotalHours' + info.name.split(',')[0] + '').text()) - parseInt($('#ThursdayHours' + info.name.split(',')[0] + '').text() - parseInt(newValue));
                            totalHours = parseInt($('#TotalThursdayHours').text()) - (parseInt($('#ThursdayHours' + info.name.split(',')[0] + '').text()) - parseInt(newValue));
                            totalWeekHours = parseInt($('#TotalWeekHours').text()) - (parseInt($('#ThursdayHours' + info.name.split(',')[0] + '').text()) - parseInt(newValue));
                        } else if (parseInt($('#ThursdayHours' + info.name.split(',')[0] + '').text()) < parseInt(newValue)) {
                            hours = parseInt($('#TotalHours' + info.name.split(',')[0] + '').text()) + (parseInt(newValue) - parseInt($('#ThursdayHours' + info.name.split(',')[0] + '').text()));
                            totalHours = parseInt($('#TotalThursdayHours').text()) + (parseInt(newValue) - parseInt($('#ThursdayHours' + info.name.split(',')[0] + '').text()));
                            totalWeekHours = parseInt($('#TotalWeekHours').text()) + (parseInt(newValue) - parseInt($('#ThursdayHours' + info.name.split(',')[0] + '').text()));
                        } else {
                            hours = parseInt($('#TotalHours' + info.name.split(',')[0] + '').text()) + parseInt(newValue);
                            totalHours = parseInt($('#TotalThursdayHours').text()) + parseInt(newValue);
                            totalWeekHours = parseInt($('#TotalWeekHours').text()) + parseInt(newValue);
                        }
                        //Get the t_number from the JSON which is the first index after the split
                        $('#TotalHours' + info.name.split(',')[0] + '').text(hours.toString());
                        $('#TotalThursdayHours').text(totalHours.toString());
                        $('#TotalWeekHours').text(totalWeekHours);
                    }
                });
                totalHours += parseInt(hourObj[hour].selling_hours);
                thursdayHours += parseInt(hourObj[hour].selling_hours);
            }
            if (moment(date).day("Friday").format('YYYY-MM-DD') == hourObj[hour].date.substring(0, 10) && userObj[user].t_number == hourObj[hour].team_member) {
                $('#FridayHours' + userObj[user].t_number + '').editable({
                    type: 'text',
                    pk: 1,
                    url: '/users/selling-hours',
                    name: userObj[user].t_number + ',' + hourObj[hour].store_id + ',' + moment(date).day("Friday").format('YYYY-MM-DD'),
                    value: hourObj[hour].selling_hours,
                    send: 'always',
                    success: function success(response, newValue) {
                        var info = JSON.parse(response);
                        var hours, totalHours, totalWeekHours;
                        if (parseInt($('#FridayHours' + info.name.split(',')[0] + '').text()) > parseInt(newValue)) {
                            hours = parseInt($('#TotalHours' + info.name.split(',')[0] + '').text()) - parseInt($('#FridayHours' + info.name.split(',')[0] + '').text() - parseInt(newValue));
                            totalHours = parseInt($('#TotalFridayHours').text()) - (parseInt($('#FridayHours' + info.name.split(',')[0] + '').text()) - parseInt(newValue));
                            totalWeekHours = parseInt($('#TotalWeekHours').text()) - (parseInt($('#FridayHours' + info.name.split(',')[0] + '').text()) - parseInt(newValue));
                        } else if (parseInt($('#FridayHours' + info.name.split(',')[0] + '').text()) < parseInt(newValue)) {
                            hours = parseInt($('#TotalHours' + info.name.split(',')[0] + '').text()) + (parseInt(newValue) - parseInt($('#FridayHours' + info.name.split(',')[0] + '').text()));
                            totalHours = parseInt($('#TotalFridayHours').text()) + (parseInt(newValue) - parseInt($('#FridayHours' + info.name.split(',')[0] + '').text()));
                            totalWeekHours = parseInt($('#TotalWeekHours').text()) + (parseInt(newValue) - parseInt($('#FridayHours' + info.name.split(',')[0] + '').text()));
                        } else {
                            hours = parseInt($('#TotalHours' + info.name.split(',')[0] + '').text()) + parseInt(newValue);
                            totalHours = parseInt($('#TotalFridayHours').text()) + parseInt(newValue);
                            totalWeekHours = parseInt($('#TotalWeekHours').text()) + parseInt(newValue);
                        }
                        //Get the t_number from the JSON which is the first index after the split
                        $('#TotalHours' + info.name.split(',')[0] + '').text(hours.toString());
                        $('#TotalFridayHours').text(totalHours.toString());
                        $('#TotalWeekHours').text(totalWeekHours);
                    }

                });
                totalHours += parseInt(hourObj[hour].selling_hours);
                fridayHours += parseInt(hourObj[hour].selling_hours);
            }
            if (moment(date).day("Saturday").format('YYYY-MM-DD') == hourObj[hour].date.substring(0, 10) && userObj[user].t_number == hourObj[hour].team_member) {
                $('#SaturdayHours' + userObj[user].t_number + '').editable({
                    type: 'text',
                    pk: 1,
                    url: '/users/selling-hours',
                    name: userObj[user].t_number + ',' + hourObj[hour].store_id + ',' + moment(date).day("Saturday").format('YYYY-MM-DD'),
                    value: hourObj[hour].selling_hours,
                    send: 'always',
                    success: function success(response, newValue) {
                        var info = JSON.parse(response);
                        var hours, totalHours, totalWeekHours;
                        if (parseInt($('#SaturdayHours' + info.name.split(',')[0] + '').text()) > parseInt(newValue)) {
                            hours = parseInt($('#TotalHours' + info.name.split(',')[0] + '').text()) - parseInt($('#SaturdayHours' + info.name.split(',')[0] + '').text() - parseInt(newValue));
                            totalHours = parseInt($('#TotalSaturdayHours').text()) - (parseInt($('#SaturdayHours' + info.name.split(',')[0] + '').text()) - parseInt(newValue));
                            totalWeekHours = parseInt($('#TotalWeekHours').text()) - (parseInt($('#SaturdayHours' + info.name.split(',')[0] + '').text()) - parseInt(newValue));
                        } else if (parseInt($('#SaturdayHours' + info.name.split(',')[0] + '').text()) < parseInt(newValue)) {
                            hours = parseInt($('#TotalHours' + info.name.split(',')[0] + '').text()) + (parseInt(newValue) - parseInt($('#SaturdayHours' + info.name.split(',')[0] + '').text()));
                            totalHours = parseInt($('#TotalSaturdayHours').text()) + (parseInt(newValue) - parseInt($('#SaturdayHours' + info.name.split(',')[0] + '').text()));
                            totalWeekHours = parseInt($('#TotalWeekHours').text()) + (parseInt(newValue) - parseInt($('#SaturdayHours' + info.name.split(',')[0] + '').text()));
                        } else {
                            hours = parseInt($('#TotalHours' + info.name.split(',')[0] + '').text()) + parseInt(newValue);
                            totalHours = parseInt($('#TotalSaturdayHours').text()) + parseInt(newValue);
                            totalWeekHours = parseInt($('#TotalWeekHours').text()) + parseInt(newValue);
                        }
                        //Get the t_number from the JSON which is the first index after the split
                        $('#TotalHours' + info.name.split(',')[0] + '').text(hours.toString());
                        $('#TotalSaturdayHours').text(totalHours.toString());
                        $('#TotalWeekHours').text(totalWeekHours);
                    }
                });
                totalHours += parseInt(hourObj[hour].selling_hours);
                saturdayHours += parseInt(hourObj[hour].selling_hours);
            }
        } //end for loop for hours
        //Set text for hours on each day of the week
        $('#TotalSundayHours').text(sundayHours);
        $('#TotalMondayHours').text(mondayHours);
        $('#TotalTuesdayHours').text(tuesdayHours);
        $('#TotalWednesdayHours').text(wednesdayHours);
        $('#TotalThursdayHours').text(thursdayHours);
        $('#TotalFridayHours').text(fridayHours);
        $('#TotalSaturdayHours').text(saturdayHours);
        //Total hours, add em up
        $('#TotalHours' + userObj[user].t_number + '').text(totalHours);
        $('#TotalWeekHours').text(sundayHours + mondayHours + tuesdayHours + wednesdayHours + thursdayHours + fridayHours + saturdayHours);
        totalHours = 0;
        $('#SundayHours' + userObj[user].t_number + '').editable({
            type: 'text',
            pk: 1,
            url: '/users/selling-hours',
            name: userObj[user].t_number + ',' + userObj[user].store_id + ',' + moment(date).day("Sunday").format('YYYY-MM-DD'),
            value: '   ',
            emptytext: '   ',
            send: 'always',
            success: function success(response, newValue) {
                var info = JSON.parse(response);
                var hours, totalHours, totalWeekHours;
                if (parseInt($('#SundayHours' + info.name.split(',')[0] + '').text()) > parseInt(newValue)) {
                    hours = parseInt($('#TotalHours' + info.name.split(',')[0] + '').text()) - parseInt($('#SundayHours' + info.name.split(',')[0] + '').text() - parseInt(newValue));
                    totalHours = parseInt($('#TotalSundayHours').text()) - (parseInt($('#SundayHours' + info.name.split(',')[0] + '').text()) - parseInt(newValue));
                    totalWeekHours = parseInt($('#TotalWeekHours').text()) - (parseInt($('#SundayHours' + info.name.split(',')[0] + '').text()) - parseInt(newValue));
                } else if (parseInt($('#SundayHours' + info.name.split(',')[0] + '').text()) < parseInt(newValue)) {
                    hours = parseInt($('#TotalHours' + info.name.split(',')[0] + '').text()) + (parseInt(newValue) - parseInt($('#SundayHours' + info.name.split(',')[0] + '').text()));
                    totalHours = parseInt($('#TotalSundayHours').text()) + (parseInt(newValue) - parseInt($('#SundayHours' + info.name.split(',')[0] + '').text()));
                    totalWeekHours = parseInt($('#TotalWeekHours').text()) + (parseInt(newValue) - parseInt($('#SundayHours' + info.name.split(',')[0] + '').text()));
                } else {
                    hours = parseInt($('#TotalHours' + info.name.split(',')[0] + '').text()) + parseInt(newValue);
                    totalHours = parseInt($('#TotalSundayHours').text()) + parseInt(newValue);
                    totalWeekHours = parseInt($('#TotalWeekHours').text()) + parseInt(newValue);
                }
                //Get the t_number from the JSON which is the first index after the split
                $('#TotalHours' + info.name.split(',')[0] + '').text(hours.toString());
                $('#TotalSundayHours').text(totalHours.toString());
                $('#TotalWeekHours').text(totalWeekHours);
            }
        });

        $('#MondayHours' + userObj[user].t_number + '').editable({
            type: 'text',
            pk: 1,
            url: '/users/selling-hours',
            name: userObj[user].t_number + ',' + userObj[user].store_id + ',' + moment(date).day("Monday").format('YYYY-MM-DD'),
            value: '   ',
            emptytext: '   ',
            send: 'always',
            success: function success(response, newValue) {
                var info = JSON.parse(response);
                var hours, totalHours, totalWeekHours;
                if (parseInt($('#MondayHours' + info.name.split(',')[0] + '').text()) > parseInt(newValue)) {
                    hours = parseInt($('#TotalHours' + info.name.split(',')[0] + '').text()) - parseInt($('#MondayHours' + info.name.split(',')[0] + '').text() - parseInt(newValue));
                    totalHours = parseInt($('#TotalMondayHours').text()) - (parseInt($('#MondayHours' + info.name.split(',')[0] + '').text()) - parseInt(newValue));
                    totalWeekHours = parseInt($('#TotalWeekHours').text()) - (parseInt($('#MondayHours' + info.name.split(',')[0] + '').text()) - parseInt(newValue));
                } else if (parseInt($('#MondayHours' + info.name.split(',')[0] + '').text()) < parseInt(newValue)) {
                    hours = parseInt($('#TotalHours' + info.name.split(',')[0] + '').text()) + (parseInt(newValue) - parseInt($('#MondayHours' + info.name.split(',')[0] + '').text()));
                    totalHours = parseInt($('#TotalMondayHours').text()) + (parseInt(newValue) - parseInt($('#MondayHours' + info.name.split(',')[0] + '').text()));
                    totalWeekHours = parseInt($('#TotalWeekHours').text()) + (parseInt(newValue) - parseInt($('#MondayHours' + info.name.split(',')[0] + '').text()));
                } else {
                    hours = parseInt($('#TotalHours' + info.name.split(',')[0] + '').text()) + parseInt(newValue);
                    totalHours = parseInt($('#TotalMondayHours').text()) + parseInt(newValue);
                    totalWeekHours = parseInt($('#TotalWeekHours').text()) + parseInt(newValue);
                }
                //Get the t_number from the JSON which is the first index after the split
                $('#TotalHours' + info.name.split(',')[0] + '').text(hours.toString());
                $('#TotalMondayHours').text(totalHours.toString());
                $('#TotalWeekHours').text(totalWeekHours);
            }
        });

        $('#TuesdayHours' + userObj[user].t_number + '').editable({
            type: 'text',
            pk: 1,
            url: '/users/selling-hours',
            name: userObj[user].t_number + ',' + userObj[user].store_id + ',' + moment(date).day("Tuesday").format('YYYY-MM-DD'),
            value: '   ',
            emptytext: '   ',
            send: 'always',
            success: function success(response, newValue) {
                var info = JSON.parse(response);
                var hours, totalHours, totalWeekHours;
                if (parseInt($('#TuesdayHours' + info.name.split(',')[0] + '').text()) > parseInt(newValue)) {
                    hours = parseInt($('#TotalHours' + info.name.split(',')[0] + '').text()) - parseInt($('#TuesdayHours' + info.name.split(',')[0] + '').text() - parseInt(newValue));
                    totalHours = parseInt($('#TotalTuesdayHours').text()) - (parseInt($('#TuesdayHours' + info.name.split(',')[0] + '').text()) - parseInt(newValue));
                    totalWeekHours = parseInt($('#TotalWeekHours').text()) - (parseInt($('#TuesdayHours' + info.name.split(',')[0] + '').text()) - parseInt(newValue));
                } else if (parseInt($('#TuesdayHours' + info.name.split(',')[0] + '').text()) < parseInt(newValue)) {
                    hours = parseInt($('#TotalHours' + info.name.split(',')[0] + '').text()) + (parseInt(newValue) - parseInt($('#TuesdayHours' + info.name.split(',')[0] + '').text()));
                    totalHours = parseInt($('#TotalTuesdayHours').text()) + (parseInt(newValue) - parseInt($('#TuesdayHours' + info.name.split(',')[0] + '').text()));
                    totalWeekHours = parseInt($('#TotalWeekHours').text()) + (parseInt(newValue) - parseInt($('#TuesdayHours' + info.name.split(',')[0] + '').text()));
                } else {
                    hours = parseInt($('#TotalHours' + info.name.split(',')[0] + '').text()) + parseInt(newValue);
                    totalHours = parseInt($('#TotalTuesdayHours').text()) + parseInt(newValue);
                    totalWeekHours = parseInt($('#TotalWeekHours').text()) + parseInt(newValue);
                }
                //Get the t_number from the JSON which is the first index after the split
                $('#TotalHours' + info.name.split(',')[0] + '').text(hours.toString());
                $('#TotalTuesdayHours').text(totalHours.toString());
                $('#TotalWeekHours').text(totalWeekHours);
            }
        });
        $('#WednesdayHours' + userObj[user].t_number + '').editable({
            type: 'text',
            pk: 1,
            url: '/users/selling-hours',
            name: userObj[user].t_number + ',' + userObj[user].store_id + ',' + moment(date).day("Wednesday").format('YYYY-MM-DD'),
            value: '   ',
            emptytext: '   ',
            send: 'always',
            success: function success(response, newValue) {
                var info = JSON.parse(response);
                var hours, totalHours, totalWeekHours;
                if (parseInt($('#WednesdayHours' + info.name.split(',')[0] + '').text()) > parseInt(newValue)) {
                    hours = parseInt($('#TotalHours' + info.name.split(',')[0] + '').text()) - parseInt($('#WednesdayHours' + info.name.split(',')[0] + '').text() - parseInt(newValue));
                    totalHours = parseInt($('#TotalWednesdayHours').text()) - (parseInt($('#WednesdayHours' + info.name.split(',')[0] + '').text()) - parseInt(newValue));
                    totalWeekHours = parseInt($('#TotalWeekHours').text()) - (parseInt($('#WednesdayHours' + info.name.split(',')[0] + '').text()) - parseInt(newValue));
                } else if (parseInt($('#WednesdayHours' + info.name.split(',')[0] + '').text()) < parseInt(newValue)) {
                    hours = parseInt($('#TotalHours' + info.name.split(',')[0] + '').text()) + (parseInt(newValue) - parseInt($('#WednesdayHours' + info.name.split(',')[0] + '').text()));
                    totalHours = parseInt($('#TotalWednesdayHours').text()) + (parseInt(newValue) - parseInt($('#WednesdayHours' + info.name.split(',')[0] + '').text()));
                    totalWeekHours = parseInt($('#TotalWeekHours').text()) + (parseInt(newValue) - parseInt($('#WednesdayHours' + info.name.split(',')[0] + '').text()));
                } else {
                    hours = parseInt($('#TotalHours' + info.name.split(',')[0] + '').text()) + parseInt(newValue);
                    totalHours = parseInt($('#TotalWednesdayHours').text()) + parseInt(newValue);
                    totalWeekHours = parseInt($('#TotalWeekHours').text()) + parseInt(newValue);
                }
                //Get the t_number from the JSON which is the first index after the split
                $('#TotalHours' + info.name.split(',')[0] + '').text(hours.toString());
                $('#TotalWednesdayHours').text(totalHours.toString());
                $('#TotalWeekHours').text(totalWeekHours);
            }
        });

        $('#ThursdayHours' + userObj[user].t_number + '').editable({
            type: 'text',
            pk: 1,
            url: '/users/selling-hours',
            name: userObj[user].t_number + ',' + userObj[user].store_id + ',' + moment(date).day("Thursday").format('YYYY-MM-DD'),
            value: '   ',
            emptytext: '   ',
            send: 'always',
            success: function success(response, newValue) {
                var info = JSON.parse(response);
                var hours, totalHours, totalWeekHours;
                if (parseInt($('#ThursdayHours' + info.name.split(',')[0] + '').text()) > parseInt(newValue)) {
                    hours = parseInt($('#TotalHours' + info.name.split(',')[0] + '').text()) - parseInt($('#ThursdayHours' + info.name.split(',')[0] + '').text() - parseInt(newValue));
                    totalHours = parseInt($('#TotalThursdayHours').text()) - (parseInt($('#ThursdayHours' + info.name.split(',')[0] + '').text()) - parseInt(newValue));
                    totalWeekHours = parseInt($('#TotalWeekHours').text()) - (parseInt($('#ThursdayHours' + info.name.split(',')[0] + '').text()) - parseInt(newValue));
                } else if (parseInt($('#ThursdayHours' + info.name.split(',')[0] + '').text()) < parseInt(newValue)) {
                    hours = parseInt($('#TotalHours' + info.name.split(',')[0] + '').text()) + (parseInt(newValue) - parseInt($('#ThursdayHours' + info.name.split(',')[0] + '').text()));
                    totalHours = parseInt($('#TotalThursdayHours').text()) + (parseInt(newValue) - parseInt($('#ThursdayHours' + info.name.split(',')[0] + '').text()));
                    totalWeekHours = parseInt($('#TotalWeekHours').text()) + (parseInt(newValue) - parseInt($('#ThursdayHours' + info.name.split(',')[0] + '').text()));
                } else {
                    hours = parseInt($('#TotalHours' + info.name.split(',')[0] + '').text()) + parseInt(newValue);
                    totalHours = parseInt($('#TotalThursdayHours').text()) + parseInt(newValue);
                    totalWeekHours = parseInt($('#TotalWeekHours').text()) + parseInt(newValue);
                }
                //Get the t_number from the JSON which is the first index after the split
                $('#TotalHours' + info.name.split(',')[0] + '').text(hours.toString());
                $('#TotalThursdayHours').text(totalHours.toString());
                $('#TotalWeekHours').text(totalWeekHours);
            }

        });

        // console.log(userObj[user].t_number + ',' +userObj[user].store_id + ',' +moment(date).day("Friday").format('YYYY-MM-DD'));

        $('#FridayHours' + userObj[user].t_number + '').editable({
            type: 'text',
            pk: 1,
            url: '/users/selling-hours',
            name: userObj[user].t_number + ',' + userObj[user].store_id + ',' + moment(date).day("Friday").format('YYYY-MM-DD'),
            value: '   ',
            emptytext: '   ',
            send: 'always',
            success: function success(response, newValue) {
                var info = JSON.parse(response);
                var hours, totalHours, totalWeekHours;
                if (parseInt($('#FridayHours' + info.name.split(',')[0] + '').text()) > parseInt(newValue)) {
                    hours = parseInt($('#TotalHours' + info.name.split(',')[0] + '').text()) - parseInt($('#FridayHours' + info.name.split(',')[0] + '').text() - parseInt(newValue));
                    totalHours = parseInt($('#TotalFridayHours').text()) - (parseInt($('#FridayHours' + info.name.split(',')[0] + '').text()) - parseInt(newValue));
                    totalWeekHours = parseInt($('#TotalWeekHours').text()) - (parseInt($('#FridayHours' + info.name.split(',')[0] + '').text()) - parseInt(newValue));
                } else if (parseInt($('#FridayHours' + info.name.split(',')[0] + '').text()) < parseInt(newValue)) {
                    hours = parseInt($('#TotalHours' + info.name.split(',')[0] + '').text()) + (parseInt(newValue) - parseInt($('#FridayHours' + info.name.split(',')[0] + '').text()));
                    totalHours = parseInt($('#TotalFridayHours').text()) + (parseInt(newValue) - parseInt($('#FridayHours' + info.name.split(',')[0] + '').text()));
                    totalWeekHours = parseInt($('#TotalWeekHours').text()) + (parseInt(newValue) - parseInt($('#FridayHours' + info.name.split(',')[0] + '').text()));
                } else {
                    hours = parseInt($('#TotalHours' + info.name.split(',')[0] + '').text()) + parseInt(newValue);
                    totalHours = parseInt($('#TotalFridayHours').text()) + parseInt(newValue);
                    totalWeekHours = parseInt($('#TotalWeekHours').text()) + parseInt(newValue);
                }
                //Get the t_number from the JSON which is the first index after the split
                $('#TotalHours' + info.name.split(',')[0] + '').text(hours.toString());
                $('#TotalFridayHours').text(totalHours.toString());
                $('#TotalWeekHours').text(totalWeekHours);
            }

        });

        $('#SaturdayHours' + userObj[user].t_number + '').editable({
            type: 'text',
            pk: 1,
            url: '/users/selling-hours',
            name: userObj[user].t_number + ',' + userObj[user].store_id + ',' + moment(date).day("Saturday").format('YYYY-MM-DD'),
            value: '   ',
            emptytext: '   ',
            send: 'always',
            success: function success(response, newValue) {
                var info = JSON.parse(response);
                var hours, totalHours, totalWeekHours;
                if (parseInt($('#SaturdayHours' + info.name.split(',')[0] + '').text()) > parseInt(newValue)) {
                    hours = parseInt($('#TotalHours' + info.name.split(',')[0] + '').text()) - parseInt($('#SaturdayHours' + info.name.split(',')[0] + '').text() - parseInt(newValue));
                    totalHours = parseInt($('#TotalSaturdayHours').text()) - (parseInt($('#SaturdayHours' + info.name.split(',')[0] + '').text()) - parseInt(newValue));
                    totalWeekHours = parseInt($('#TotalWeekHours').text()) - (parseInt($('#SaturdayHours' + info.name.split(',')[0] + '').text()) - parseInt(newValue));
                } else if (parseInt($('#SaturdayHours' + info.name.split(',')[0] + '').text()) < parseInt(newValue)) {
                    hours = parseInt($('#TotalHours' + info.name.split(',')[0] + '').text()) + (parseInt(newValue) - parseInt($('#SaturdayHours' + info.name.split(',')[0] + '').text()));
                    totalHours = parseInt($('#TotalSaturdayHours').text()) + (parseInt(newValue) - parseInt($('#SaturdayHours' + info.name.split(',')[0] + '').text()));
                    totalWeekHours = parseInt($('#TotalWeekHours').text()) + (parseInt(newValue) - parseInt($('#SaturdayHours' + info.name.split(',')[0] + '').text()));
                } else {
                    hours = parseInt($('#TotalHours' + info.name.split(',')[0] + '').text()) + parseInt(newValue);
                    totalHours = parseInt($('#TotalSaturdayHours').text()) + parseInt(newValue);
                    totalWeekHours = parseInt($('#TotalWeekHours').text()) + parseInt(newValue);
                }
                //Get the t_number from the JSON which is the first index after the split
                $('#TotalHours' + info.name.split(',')[0] + '').text(hours.toString());
                $('#TotalSaturdayHours').text(totalHours.toString());
                $('#TotalWeekHours').text(totalWeekHours);
            }
        });
    }
}

//Get the current dates for the week
function getDaysOfTheWeek(date) {
    var monday, tuesday, wednesday, thursday, friday, saturday, sunday;

    sunday = moment(date).day("Sunday").format('MMMM-DD');
    monday = moment(date).day("Monday").format('MMMM-DD');
    tuesday = moment(date).day("Tuesday").format('MMMM-DD');
    wednesday = moment(date).day("Wednesday").format('MMMM-DD');
    thursday = moment(date).day("Thursday").format('MMMM-DD');
    friday = moment(date).day("Friday").format('MMMM-DD');
    saturday = moment(date).day("Saturday").format('MMMM-DD');

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

    if (filteredBudgetArray[0] != undefined) {
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
        name: 'CTs' + ',' + moment().format("YYYY-MM-DD") + ',' + filteredStoresArray[0].store_id,
        value: CTs,
        params: function params(_params) {
            //params already contain `name`, `value` and `pk`
            _params.name = 'CTs' + ',' + moment().format("YYYY-MM-DD") + ',' + filteredStoresArray[0].store_id;
            return _params;
        },
        emptytext: '&nbsp;',
        send: 'always',
        success: function success(response, newValue) {
            if (response.status == 'error') return response.msg; //msg will be shown in editable form
            var info = JSON.parse(response);
            $('#BDCC').html((8 / 100 * info.value).toFixed(2));
            $('#BDSBS').html((7 / 100 * info.value).toFixed(2));
            $('#BDTB').html((7 / 100 * info.value).toFixed(2));

            if (filteredBudgetArray[0] != undefined) filteredBudgetArray[0].CTs = info.value;
        }

    });
    $('#Rev').editable({
        type: 'text',
        pk: 1,
        url: '/users/selling-hours/budgets',
        name: 'revenue' + ',' + moment().format("YYYY-MM-DD") + ',' + filteredStoresArray[0].store_id,
        value: revenue,
        params: function params(_params2) {
            //params already contain `name`, `value` and `pk`
            _params2.name = 'revenue' + ',' + moment().format("YYYY-MM-DD") + ',' + filteredStoresArray[0].store_id;
            return _params2;
        },
        emptytext: '&nbsp;',
        send: 'always',
        success: function success(response, newValue) {
            if (response.status == 'error') return response.msg; //msg will be shown in editable form

            var info = JSON.parse(response);
            if (filteredBudgetArray[0] != undefined) filteredBudgetArray[0].revenue = info.value;
        }
    });
    $('#AOTM').editable({
        type: 'text',
        pk: 1,
        url: '/users/selling-hours/budgets',
        name: 'aotm' + ',' + moment().format("YYYY-MM-DD") + ',' + filteredStoresArray[0].store_id,
        value: aotm,
        params: function params(_params3) {
            //params already contain `name`, `value` and `pk`
            _params3.name = 'aotm' + ',' + moment().format("YYYY-MM-DD") + ',' + filteredStoresArray[0].store_id;
            return _params3;
        },
        emptytext: '&nbsp;',
        send: 'always',
        success: function success(response, newValue) {
            if (response.status == 'error') return response.msg; //msg will be shown in editable form

            var info = JSON.parse(response);
            if (filteredBudgetArray[0] != undefined) filteredBudgetArray[0].aotm = info.value;
        }
    });

    $('#LS').editable({
        type: 'text',
        pk: 1,
        url: '/users/selling-hours/budgets',
        name: 'ls' + ',' + moment().format("YYYY-MM-DD") + ',' + filteredStoresArray[0].store_id,
        value: ls,
        params: function params(_params4) {
            //params already contain `name`, `value` and `pk`
            _params4.name = 'ls' + ',' + moment().format("YYYY-MM-DD") + ',' + filteredStoresArray[0].store_id;
            return _params4;
        },
        emptytext: '&nbsp;',
        send: 'always',
        success: function success(response, newValue) {
            if (response.status == 'error') return response.msg; //msg will be shown in editable form

            var info = JSON.parse(response);
            if (filteredBudgetArray[0] != undefined) filteredBudgetArray[0].ls = info.value;
        }
    });

    if (filteredBudgetArray[0] != undefined) {
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

function populateDeleteModal() {
    $('#editModal').modal('show');
}

function displayUsers() {
    var hoursTable = "";

    hoursTable += '\n                <tr>\n                    <td></td>\n                    <th id="Sunday"></th>\n                    <th id="Monday"></th>\n                    <th id="Tuesday"></th>\n                    <th id="Wednesday"></th>\n                    <th id="Thursday"></th>\n                    <th id="Friday"></th>\n                    <th id="Saturday"></th>\n                    <th></th>\n                </tr>';

    for (var userIndex in filteredUserArray) {
        hoursTable += '<tr>\n                        <td>' + filteredUserArray[userIndex].first_name + '  ' + filteredUserArray[userIndex].last_name + '</td>\n                        <td id="SundayHours' + filteredUserArray[userIndex].t_number + '"></td>\n                        <td id="MondayHours' + filteredUserArray[userIndex].t_number + '"></td>\n                        <td id="TuesdayHours' + filteredUserArray[userIndex].t_number + '"></td>\n                        <td id="WednesdayHours' + filteredUserArray[userIndex].t_number + '"></td>\n                        <td id="ThursdayHours' + filteredUserArray[userIndex].t_number + '"></td>\n                        <td id="FridayHours' + filteredUserArray[userIndex].t_number + '"></td>\n                        <td id="SaturdayHours' + filteredUserArray[userIndex].t_number + '"></td>\n                        <td id="TotalHours' + filteredUserArray[userIndex].t_number + '"></td>\n                      <tr>';
    }
    hoursTable += '\n                <tr>\n                    <td>Total Actual</td>\n                    <td id="TotalSundayHours"></td>\n                    <td id="TotalMondayHours"></td>\n                    <td id="TotalTuesdayHours"></td>\n                    <td id="TotalWednesdayHours"></td>\n                    <td id="TotalThursdayHours"></td>\n                    <td id="TotalFridayHours"></td>\n                    <td id="TotalSaturdayHours"></td>\n                    <td id="TotalWeekHours"></td>\n                </tr>';

    $('#hoursTable').html(hoursTable);
    getDaysOfTheWeek();
    if (aDate != '') displayEmployeeHours(filteredUserArray, filteredHoursArray, aDate);else displayEmployeeHours(filteredUserArray, filteredHoursArray, moment().startOf('isoWeek'));
}

function applyFilter() {
    document.getElementById("updateWeekForm").submit();
}

//# sourceMappingURL=selling-hours.js.map