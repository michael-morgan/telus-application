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
    console.debug(hourObj);
    console.debug(budgetObj);
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
function displayEmployeeHours() {
    var totalHours = 0;
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
                        var hours;
                        if(parseInt($('#SaturdayHours'+ info.name.split(',')[0] + '').text()) > parseInt(newValue))
                        {
                            hours  = parseInt($('#TotalHours'+ info.name.split(',')[0] + '').text()) - (parseInt($('#SaturdayHours'+ info.name.split(',')[0] + '').text()-parseInt(newValue)));
                        }
                        else if(parseInt($('#SaturdayHours'+ info.name.split(',')[0] + '').text()) < parseInt(newValue))
                        {
                            hours  = parseInt($('#TotalHours'+ info.name.split(',')[0] + '').text()) + (parseInt(newValue) - parseInt($('#SaturdayHours'+ info.name.split(',')[0] + '').text()));
                        }
                        //Get the t_number from the JSON which is the first index afer the split
                        $('#TotalHours'+ info.name.split(',')[0] + '').text(hours.toString());
                    }
                });
                totalHours += parseInt(hourObj[hour].selling_hours);
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
                        var hours;
                        if(parseInt($('#SaturdayHours'+ info.name.split(',')[0] + '').text()) > parseInt(newValue))
                        {
                            hours  = parseInt($('#TotalHours'+ info.name.split(',')[0] + '').text()) - (parseInt($('#SaturdayHours'+ info.name.split(',')[0] + '').text()-parseInt(newValue)));
                        }
                        else if(parseInt($('#SaturdayHours'+ info.name.split(',')[0] + '').text()) < parseInt(newValue))
                        {
                            hours  = parseInt($('#TotalHours'+ info.name.split(',')[0] + '').text()) + (parseInt(newValue) - parseInt($('#SaturdayHours'+ info.name.split(',')[0] + '').text()));
                        }
                        //Get the t_number from the JSON which is the first index afer the split
                        $('#TotalHours'+ info.name.split(',')[0] + '').text(hours.toString());
                    }
                });
                totalHours += parseInt(hourObj[hour].selling_hours);
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
                        var hours;
                        if(parseInt($('#SaturdayHours'+ info.name.split(',')[0] + '').text()) > parseInt(newValue))
                        {
                            hours  = parseInt($('#TotalHours'+ info.name.split(',')[0] + '').text()) - (parseInt($('#SaturdayHours'+ info.name.split(',')[0] + '').text()-parseInt(newValue)));
                        }
                        else if(parseInt($('#SaturdayHours'+ info.name.split(',')[0] + '').text()) < parseInt(newValue))
                        {
                            hours  = parseInt($('#TotalHours'+ info.name.split(',')[0] + '').text()) + (parseInt(newValue) - parseInt($('#SaturdayHours'+ info.name.split(',')[0] + '').text()));
                        }
                        //Get the t_number from the JSON which is the first index afer the split
                        $('#TotalHours'+ info.name.split(',')[0] + '').text(hours.toString());
                    }

                });
                totalHours += parseInt(hourObj[hour].selling_hours);
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
                        var hours;
                        if(parseInt($('#SaturdayHours'+ info.name.split(',')[0] + '').text()) > parseInt(newValue))
                        {
                            hours  = parseInt($('#TotalHours'+ info.name.split(',')[0] + '').text()) - (parseInt($('#SaturdayHours'+ info.name.split(',')[0] + '').text()-parseInt(newValue)));
                        }
                        else if(parseInt($('#SaturdayHours'+ info.name.split(',')[0] + '').text()) < parseInt(newValue))
                        {
                            hours  = parseInt($('#TotalHours'+ info.name.split(',')[0] + '').text()) + (parseInt(newValue) - parseInt($('#SaturdayHours'+ info.name.split(',')[0] + '').text()));
                        }
                        //Get the t_number from the JSON which is the first index afer the split
                        $('#TotalHours'+ info.name.split(',')[0] + '').text(hours.toString());
                    }

                });
                totalHours += parseInt(hourObj[hour].selling_hours);
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
                        var hours;
                        if(parseInt($('#SaturdayHours'+ info.name.split(',')[0] + '').text()) > parseInt(newValue))
                        {
                            hours  = parseInt($('#TotalHours'+ info.name.split(',')[0] + '').text()) - (parseInt($('#SaturdayHours'+ info.name.split(',')[0] + '').text()-parseInt(newValue)));
                        }
                        else if(parseInt($('#SaturdayHours'+ info.name.split(',')[0] + '').text()) < parseInt(newValue))
                        {
                            hours  = parseInt($('#TotalHours'+ info.name.split(',')[0] + '').text()) + (parseInt(newValue) - parseInt($('#SaturdayHours'+ info.name.split(',')[0] + '').text()));
                        }
                        //Get the t_number from the JSON which is the first index afer the split
                        $('#TotalHours'+ info.name.split(',')[0] + '').text(hours.toString());
                    }

                });
                totalHours += parseInt(hourObj[hour].selling_hours);
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
                        var hours;
                        if(parseInt($('#SaturdayHours'+ info.name.split(',')[0] + '').text()) > parseInt(newValue))
                        {
                            hours  = parseInt($('#TotalHours'+ info.name.split(',')[0] + '').text()) - (parseInt($('#SaturdayHours'+ info.name.split(',')[0] + '').text()-parseInt(newValue)));
                        }
                        else if(parseInt($('#SaturdayHours'+ info.name.split(',')[0] + '').text()) < parseInt(newValue))
                        {
                            hours  = parseInt($('#TotalHours'+ info.name.split(',')[0] + '').text()) + (parseInt(newValue) - parseInt($('#SaturdayHours'+ info.name.split(',')[0] + '').text()));
                        }
                        //Get the t_number from the JSON which is the first index afer the split
                        $('#TotalHours'+ info.name.split(',')[0] + '').text(hours.toString());
                    }

                });
                totalHours += parseInt(hourObj[hour].selling_hours);
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
                        var hours;
                        if(parseInt($('#SaturdayHours'+ info.name.split(',')[0] + '').text()) > parseInt(newValue))
                        {
                             hours  = parseInt($('#TotalHours'+ info.name.split(',')[0] + '').text()) - (parseInt($('#SaturdayHours'+ info.name.split(',')[0] + '').text()-parseInt(newValue)));
                        }
                        else if(parseInt($('#SaturdayHours'+ info.name.split(',')[0] + '').text()) < parseInt(newValue))
                        {
                             hours  = parseInt($('#TotalHours'+ info.name.split(',')[0] + '').text()) + (parseInt(newValue) - parseInt($('#SaturdayHours'+ info.name.split(',')[0] + '').text()));
                        }
                        //Get the t_number from the JSON which is the first index afer the split
                        $('#TotalHours'+ info.name.split(',')[0] + '').text(hours.toString());
                    }
                });
                totalHours += parseInt(hourObj[hour].selling_hours);
            }

        }
        $('#TotalHours'+ userObj[user].t_number + '').text(totalHours);
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
                var hours;
                if($('#SundayHours'+ info.name.split(',')[0] + '').text() != "") {
                    if (parseInt($('#SaturdayHours' + info.name.split(',')[0] + '').text()) > parseInt(newValue)) {
                        hours = parseInt($('#TotalHours' + info.name.split(',')[0] + '').text()) - (parseInt($('#SundayHours' + info.name.split(',')[0] + '').text() - parseInt(newValue)));
                    }
                    else if (parseInt($('#SundayHours' + info.name.split(',')[0] + '').text()) < parseInt(newValue)) {
                        hours = parseInt($('#TotalHours' + info.name.split(',')[0] + '').text()) + (parseInt(newValue) - parseInt($('#SundayHours' + info.name.split(',')[0] + '').text()));
                    }
                    //Get the t_number from the JSON which is the first index afer the split
                    $('#TotalHours' + info.name.split(',')[0] + '').text(hours.toString());
                }
                else
                {
                    hours = parseInt($('#TotalHours' + info.name.split(',')[0] + '').text()) + (parseInt($('#SundayHours' + info.name.split(',')[0] + '').text()));
                    $('#TotalHours' + info.name.split(',')[0] + '').text(hours.toString());

                }
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
                var hours;
                if($('#MondayHours'+ info.name.split(',')[0] + '').text() != "") {
                    if (parseInt($('#SaturdayHours' + info.name.split(',')[0] + '').text()) > parseInt(newValue)) {
                        hours = parseInt($('#TotalHours' + info.name.split(',')[0] + '').text()) - (parseInt($('#MondayHours' + info.name.split(',')[0] + '').text() - parseInt(newValue)));
                    }
                    else if (parseInt($('#MondayHours' + info.name.split(',')[0] + '').text()) < parseInt(newValue)) {
                        hours = parseInt($('#TotalHours' + info.name.split(',')[0] + '').text()) + (parseInt(newValue) - parseInt($('#MondayHours' + info.name.split(',')[0] + '').text()));
                    }
                    //Get the t_number from the JSON which is the first index afer the split
                    $('#TotalHours' + info.name.split(',')[0] + '').text(hours.toString());
                }
                else
                {
                    hours = parseInt($('#TotalHours' + info.name.split(',')[0] + '').text()) + (parseInt($('#MondayHours' + info.name.split(',')[0] + '').text()));
                    $('#TotalHours' + info.name.split(',')[0] + '').text(hours.toString());

                }
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
                var hours;
                if(parseInt($('#SaturdayHours'+ info.name.split(',')[0] + '').text()) > parseInt(newValue))
                {
                    hours  = parseInt($('#TotalHours'+ info.name.split(',')[0] + '').text()) - (parseInt($('#SaturdayHours'+ info.name.split(',')[0] + '').text()-parseInt(newValue)));
                }
                else if(parseInt($('#SaturdayHours'+ info.name.split(',')[0] + '').text()) < parseInt(newValue))
                {
                    hours  = parseInt($('#TotalHours'+ info.name.split(',')[0] + '').text()) + (parseInt(newValue) - parseInt($('#SaturdayHours'+ info.name.split(',')[0] + '').text()));
                }
                //Get the t_number from the JSON which is the first index afer the split
                $('#TotalHours'+ info.name.split(',')[0] + '').text(hours.toString());
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
                var hours;
                if(parseInt($('#SaturdayHours'+ info.name.split(',')[0] + '').text()) > parseInt(newValue))
                {
                    hours  = parseInt($('#TotalHours'+ info.name.split(',')[0] + '').text()) - (parseInt($('#SaturdayHours'+ info.name.split(',')[0] + '').text()-parseInt(newValue)));
                }
                else if(parseInt($('#SaturdayHours'+ info.name.split(',')[0] + '').text()) < parseInt(newValue))
                {
                    hours  = parseInt($('#TotalHours'+ info.name.split(',')[0] + '').text()) + (parseInt(newValue) - parseInt($('#SaturdayHours'+ info.name.split(',')[0] + '').text()));
                }
                //Get the t_number from the JSON which is the first index afer the split
                $('#TotalHours'+ info.name.split(',')[0] + '').text(hours.toString());
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
                var hours;
                if(parseInt($('#SaturdayHours'+ info.name.split(',')[0] + '').text()) > parseInt(newValue))
                {
                    hours  = parseInt($('#TotalHours'+ info.name.split(',')[0] + '').text()) - (parseInt($('#SaturdayHours'+ info.name.split(',')[0] + '').text()-parseInt(newValue)));
                }
                else if(parseInt($('#SaturdayHours'+ info.name.split(',')[0] + '').text()) < parseInt(newValue))
                {
                    hours  = parseInt($('#TotalHours'+ info.name.split(',')[0] + '').text()) + (parseInt(newValue) - parseInt($('#SaturdayHours'+ info.name.split(',')[0] + '').text()));
                }
                //Get the t_number from the JSON which is the first index afer the split
                $('#TotalHours'+ info.name.split(',')[0] + '').text(hours.toString());
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
                var hours;
                if(parseInt($('#SaturdayHours'+ info.name.split(',')[0] + '').text()) > parseInt(newValue))
                {
                    hours  = parseInt($('#TotalHours'+ info.name.split(',')[0] + '').text()) - (parseInt($('#SaturdayHours'+ info.name.split(',')[0] + '').text()-parseInt(newValue)));
                }
                else if(parseInt($('#SaturdayHours'+ info.name.split(',')[0] + '').text()) < parseInt(newValue))
                {
                    hours  = parseInt($('#TotalHours'+ info.name.split(',')[0] + '').text()) + (parseInt(newValue) - parseInt($('#SaturdayHours'+ info.name.split(',')[0] + '').text()));
                }
                //Get the t_number from the JSON which is the first index afer the split
                $('#TotalHours'+ info.name.split(',')[0] + '').text(hours.toString());
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
                var hours;
                if(parseInt($('#SaturdayHours'+ info.name.split(',')[0] + '').text()) > parseInt(newValue))
                {
                    hours  = parseInt($('#TotalHours'+ info.name.split(',')[0] + '').text()) - (parseInt($('#SaturdayHours'+ info.name.split(',')[0] + '').text()-parseInt(newValue)));
                }
                else if(parseInt($('#SaturdayHours'+ info.name.split(',')[0] + '').text()) < parseInt(newValue))
                {
                    hours  = parseInt($('#TotalHours'+ info.name.split(',')[0] + '').text()) + (parseInt(newValue) - parseInt($('#SaturdayHours'+ info.name.split(',')[0] + '').text()));
                }
                //Get the t_number from the JSON which is the first index afer the split
                $('#TotalHours'+ info.name.split(',')[0] + '').text(hours.toString());
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



$(document).ready(function() {
    var CTs = 0;
    var revenue = 0;
    var aotm = 0;
    var ls = 0;

    if(budgetObj[0] != undefined){
        CTs = budgetObj[0].CTs;
        revenue = budgetObj[0].revenue;
        aotm = budgetObj[0].aotm;
        ls = budgetObj[0].ls;
    }


    $('#CTs').editable({
        type: 'text',
        pk: 1,
        url: '/users/selling-hours/budgets',
        name: 'CTs' + ',' + moment().format("YYYY-MM-DD") + ',' +storesArray[0].store_id,
        value: CTs,
        emptytext:'&nbsp;',
        send: 'always',
        success: function (response, newValue) {
            if (response.status == 'error') return response.msg; //msg will be shown in editable form
        }
    });
    $('#Rev').editable({
        type: 'text',
        pk: 1,
        url: '/users/selling-hours/budgets',
        name: 'revenue' + ',' + moment().format("YYYY-MM-DD") + ',' +storesArray[0].store_id,
        value: revenue,
        emptytext:'&nbsp;',
        send: 'always',
        success: function (response, newValue) {
            if (response.status == 'error') return response.msg; //msg will be shown in editable form
        }
    });
    $('#AOTM').editable({
        type: 'text',
        pk: 1,
        url: '/users/selling-hours/budgets',
        name: 'aotm' + ',' + moment().format("YYYY-MM-DD") + ',' +storesArray[0].store_id,
        value: aotm,
        emptytext:'&nbsp;',
        send: 'always',
        success: function (response, newValue) {
            if (response.status == 'error') return response.msg; //msg will be shown in editable form
        }
    });
    $('#LS').editable({
        type: 'text',
        pk: 1,
        url: '/users/selling-hours/budgets',
        name: 'ls' + ',' + moment().format("YYYY-MM-DD") + ',' +storesArray[0].store_id,
        value: ls,
        emptytext:'&nbsp;',
        send: 'always',
        success: function (response, newValue) {
            if (response.status == 'error') return response.msg; //msg will be shown in editable form
        }
    });

    $('#BDCC').html((8 / 100 * budgetObj[0].CTs).toFixed(2));
    $('#BDSBS').html((7 / 100 * budgetObj[0].CTs).toFixed(2));
    $('#BDTB').html((7 / 100 * budgetObj[0].CTs).toFixed(2));

    
});

function applyFilter() {}

