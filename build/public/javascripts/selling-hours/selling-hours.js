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
    displayEmployeeHours();
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
//Retrieve hours from array and display them in the appropriate row
function displayEmployeeHours() {
    for (var user in userObj) {
        for (var hour in hourObj) {
            if (moment().startOf('day').format("YYYY-MM-DD") == hourObj[hour].date.substring(0, 10) && userObj[user].t_number == hourObj[hour].team_member) $('#SundayHours' + userObj[user].t_number + '').text(hourObj[hour].selling_hours).editable({
                type: 'text',
                pk: 1,
                url: '/users/selling-hours',
                name: hourObj[hour].selling_hours + ',' + userObj[user].t_number + ',' + hourObj[hour].store_id + ',' + hourObj[hour].date.substring(0, 10),
                t_number: userObj[user].t_number,
                sellinghours: hourObj[hour].selling_hours,
<<<<<<< HEAD
                store_id: hourObj[hour].store_id,
                value: hourObj[hour].selling_hours,
                send: 'always',
                success: function success(response, newValue) {
                    if (response.status == 'error') return response.msg; //msg will be shown in editable form
                }
            });
=======
                store_id: hourObj[hour].store_id
            });else {
                $('#SundayHours' + userObj[user].t_number + '').editable({
                    type: 'text',
                    url: '/users/selling-hours',
                    emptytext: '&nbsp;',
                    t_number: userObj[user].t_number,
                    store_id: hourObj[hour].store_id
                });
            }
>>>>>>> origin/build
            if (moment().add(1, 'days').format("YYYY-MM-DD") == hourObj[hour].date.substring(0, 10) && userObj[user].t_number == hourObj[hour].team_member) $('#MondayHours' + userObj[user].t_number + '').text(hourObj[hour].selling_hours).editable({
                type: 'text',
                pk: 1,
                url: '/users/selling-hours',
                name: hourObj[hour].selling_hours + ',' + userObj[user].t_number + ',' + hourObj[hour].store_id + ',' + hourObj[hour].date.substring(0, 10),
                t_number: userObj[user].t_number,
                sellinghours: hourObj[hour].selling_hours,
<<<<<<< HEAD
                value: hourObj[hour].selling_hours,
                store_id: hourObj[hour].store_id,
                send: 'always',
                success: function success(response, newValue) {
                    if (response.status == 'error') return response.msg; //msg will be shown in editable form
                }
            });
=======
                store_id: hourObj[hour].store_id
            });else {
                $('#MondayHours' + userObj[user].t_number + '').editable({
                    type: 'text',
                    url: '/users/selling-hours',
                    emptytext: '&nbsp;',
                    t_number: userObj[user].t_number,
                    store_id: hourObj[hour].store_id
                });
            }
>>>>>>> origin/build
            if (moment().add(2, 'days').format("YYYY-MM-DD") == hourObj[hour].date.substring(0, 10) && userObj[user].t_number == hourObj[hour].team_member) $('#TuesdayHours' + userObj[user].t_number + '').text(hourObj[hour].selling_hours).editable({
                type: 'text',
                pk: 1,
                url: '/users/selling-hours',
                name: hourObj[hour].selling_hours + ',' + userObj[user].t_number + ',' + hourObj[hour].store_id + ',' + hourObj[hour].date.substring(0, 10),
                t_number: userObj[user].t_number,
                sellinghours: hourObj[hour].selling_hours,
                value: hourObj[hour].selling_hours,
                store_id: hourObj[hour].store_id,
                send: 'always',
                success: function success(response, newValue) {
                    if (response.status == 'error') return response.msg; //msg will be shown in editable form
                }

            });else {
                $('#TuesdayHours' + userObj[user].t_number + '').editable({
                    type: 'text',
                    url: '/users/selling-hours',
                    emptytext: '&nbsp;',
                    t_number: userObj[user].t_number,
                    store_id: hourObj[hour].store_id
                });
            }
            if (moment().add(3, 'days').format("YYYY-MM-DD") == hourObj[hour].date.substring(0, 10) && userObj[user].t_number == hourObj[hour].team_member) $('#WednesdayHours' + userObj[user].t_number + '').text(hourObj[hour].selling_hours).editable({
                type: 'text',
                pk: 1,
                url: '/users/selling-hours',
                name: hourObj[hour].selling_hours + ',' + userObj[user].t_number + ',' + hourObj[hour].store_id + ',' + hourObj[hour].date.substring(0, 10),
                t_number: userObj[user].t_number,
                sellinghours: hourObj[hour].selling_hours,
                value: hourObj[hour].selling_hours,
                store_id: hourObj[hour].store_id,
                send: 'always',
                success: function success(response, newValue) {
                    if (response.status == 'error') return response.msg; //msg will be shown in editable form
                }

            });else {
                $('#WednesdayHours' + userObj[user].t_number + '').editable({
                    type: 'text',
                    url: '/users/selling-hours',
                    emptytext: '&nbsp;',
                    t_number: userObj[user].t_number,
                    store_id: hourObj[hour].store_id
                });
            }
            if (moment().add(4, 'days').format("YYYY-MM-DD") == hourObj[hour].date.substring(0, 10) && userObj[user].t_number == hourObj[hour].team_member) $('#ThursdayHours' + userObj[user].t_number + '').text(hourObj[hour].selling_hours).editable({
                type: 'text',
                pk: 1,
                url: '/users/selling-hours',
                name: hourObj[hour].selling_hours + ',' + userObj[user].t_number + ',' + hourObj[hour].store_id + ',' + hourObj[hour].date.substring(0, 10),
                t_number: userObj[user].t_number,
                sellinghours: hourObj[hour].selling_hours,
                value: hourObj[hour].selling_hours,
                store_id: hourObj[hour].store_id,
                send: 'always',
                success: function success(response, newValue) {
                    if (response.status == 'error') return response.msg; //msg will be shown in editable form
                }

            });else {
                $('#ThursdayHours' + userObj[user].t_number + '').editable({
                    type: 'text',
                    url: '/users/selling-hours',
                    emptytext: '&nbsp;',
                    t_number: userObj[user].t_number,
                    store_id: hourObj[hour].store_id
                });
            }
            if (moment().add(5, 'days').format("YYYY-MM-DD") == hourObj[hour].date.substring(0, 10) && userObj[user].t_number == hourObj[hour].team_member) $('#FridayHours' + userObj[user].t_number + '').text(hourObj[hour].selling_hours).editable({
                type: 'text',
                pk: 1,
                url: '/users/selling-hours',
                name: hourObj[hour].selling_hours + ',' + userObj[user].t_number + ',' + hourObj[hour].store_id + ',' + hourObj[hour].date.substring(0, 10),
                t_number: userObj[user].t_number,
                sellinghours: hourObj[hour].selling_hours,
                value: hourObj[hour].selling_hours,
                store_id: hourObj[hour].store_id,
                send: 'always',
                success: function success(response, newValue) {
                    if (response.status == 'error') return response.msg; //msg will be shown in editable form
                }

            });else {
                $('#FridayHours' + userObj[user].t_number + '').editable({
                    type: 'text',
                    url: '/users/selling-hours',
                    emptytext: '&nbsp;',
                    t_number: userObj[user].t_number,
                    store_id: hourObj[hour].store_id
                });
            }
            if (moment().add(6, 'days').format("YYYY-MM-DD") == hourObj[hour].date.substring(0, 10) && userObj[user].t_number == hourObj[hour].team_member) $('#SaturdayHours' + userObj[user].t_number + '').text(hourObj[hour].selling_hours).editable({
                type: 'text',
                pk: 1,
                url: '/users/selling-hours',
                name: hourObj[hour].selling_hours + ',' + userObj[user].t_number + ',' + hourObj[hour].store_id + ',' + hourObj[hour].date.substring(0, 10),
                t_number: userObj[user].t_number,
                sellinghours: hourObj[hour].selling_hours,
<<<<<<< HEAD
                value: hourObj[hour].selling_hours,
                store_id: hourObj[hour].store_id,
                send: 'always',
                success: function success(response, newValue) {
                    if (response.status == 'error') return response.msg; //msg will be shown in editable form
                }
            });
=======
                store_id: hourObj[hour].store_id
            });else {
                $('#SaturdayHours' + userObj[user].t_number + '').editable({
                    type: 'text',
                    url: '/users/selling-hours',
                    emptytext: '&nbsp;',
                    t_number: userObj[user].t_number,
                    store_id: hourObj[hour].store_id
                });
            }
>>>>>>> origin/build
        }
    }
}
function updateUser() {
    $.post("/users/selling-hours", {
        t_member: tNumberInput.val(),
        store_id: firstNameInput.val(),
        selling_hours: lastNameInput.val()
    }).done(function (result) {
        var data = JSON.parse(result);
        populateRow('#userRow' + data.t_number, data);
    });
}

function populateRow(rowId, data) {
    $(rowId).html('\n        <td>' + data.t_number + '</td>\n        <td>' + data.first_name + '</td>\n        <td>' + data.last_name + '</td>\n        <td>' + data.email + '</td>\n        <td>' + privileges.find(function (privilege) {
        return privilege.value == data.title;
    }).name + '</td>\n        <td>\n            <a class="btn btn-primary" href="#" aria-label="Edit" onclick=\'populateEditModal("#userRow' + data.t_number + '")\'>\n                <i class="fa fa-pencil-square-o" aria-hidden="true"></i>\n            </a>\n        </td>\n        <td>\n            <input class="form-control" name=\'remove' + data.t_number + '\' type="checkbox">\n        </td>\n    ');
}
//Get the current dates for the week
function getDaysOfTheWeek() {
    var monday, tuesday, wednesday, thursday, friday, saturday, sunday;

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
$.fn.editable.defaults.mode = 'inline';
$(document).ready(function () {
    $('#CTs').editable({
        type: 'text',
        url: '',
        emptytext: '&nbsp;'
    });
    $('#Rev').editable({
        type: 'text',
        url: '',
        emptytext: '&nbsp;'
    });
    $('#AOTM').editable({
        type: 'text',
        url: '',
        emptytext: '&nbsp;'
    });
    $('#LS').editable({
        type: 'text',
        url: '',
        emptytext: '&nbsp;'
    });
    $('#CTCC').editable({
        type: 'text',
        url: '',
        emptytext: '&nbsp;'
    });
    $('#CTSBS').editable({
        type: 'text',
        url: '',
        emptytext: '&nbsp;'
    });
    $('#CTTB').editable({
        type: 'text',
        url: '',
        emptytext: '&nbsp;'
    });
    $('#BDCC').editable({
        type: 'text',
        url: '',
        emptytext: '&nbsp;'
    });
    $('#BDSBS').editable({
        type: 'text',
        url: '',
        emptytext: '&nbsp;'
    });
    $('#BDTB').editable({
        type: 'text',
        url: '',
        emptytext: '&nbsp;'
    });
});

function applyFilter() {}

//# sourceMappingURL=selling-hours.js.map