"use strict";

var filteredUsers = void 0;
var filteredStore = void 0;
var filteredHours = void 0;
var filteredBudget = void 0;

var store = void 0;

var startDate = void 0;
var endDate = void 0;

//let daysOfWeekArray = [];

$(function () {
	console.debug(storeObj);
	console.debug(userObj);
	console.debug(hourObj);
	console.debug(budgetObj);

	store = $("#store");

	store.change(function (event) {

		applyFilter();
		renderTables();

		/*displayUsers();
   if(aDate) {
      $('#dateRange').daterangepicker({
          "showWeekNumbers": true,
          "singleDatePicker": true,
          "opens": "center",
          "startDate":aDate,
          locale: {
              format: 'YYYY-MM-DD'
          },
      }, function(start, end, label) {
          $('#dateRange').val(moment(start).format('YYYY-MM-DD'));
          $('#hiddenDate').val(moment(start).format('YYYY-MM-DD'));
          applyFilter();
      });
      getDaysOfTheWeek(aDate);
  }
  else {
      $('#dateRange').daterangepicker({
          "showWeekNumbers": true,
          "singleDatePicker": true,
          "opens": "center",
          locale: {
              format: 'YYYY-MM-DD'
          },
      }, function(start, end, label) {
          $('#dateRange').val(moment(start).format('YYYY-MM-DD'));
          $('#hiddenDate').val(moment(start).format('YYYY-MM-DD'));
          applyFilter();
      });
      getDaysOfTheWeek(moment().startOf('isoWeek'));
  }
  */

		//$('#hiddenDate').val($('#dateRange').val());
		//calculateHours();
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
		startDate = start;
		endDate = end;

		applyFilter();
		renderTables();
	});

	//Trigger the drop down change function to load the HTML
	store.trigger('change');
});

/*function getDaysOfTheWeek(date) {
    let monday,tuesday,wednesday,thursday,friday,saturday, sunday;

    sunday = moment(date).day("Sunday").format('YYYY-MM-DD');
    monday = moment(date).day("Monday").format('YYYY-MM-DD');
    tuesday = moment(date).day("Tuesday").format('YYYY-MM-DD');
    wednesday = moment(date).day("Wednesday").format('YYYY-MM-DD');
    thursday = moment(date).day("Thursday").format('YYYY-MM-DD');
    friday = moment(date).day("Friday").format('YYYY-MM-DD');
    saturday = moment(date).day("Saturday").format('YYYY-MM-DD');

    daysOfWeekArray[daysOfWeekArray.length]= (sunday);
    daysOfWeekArray[daysOfWeekArray.length]= (monday);
    daysOfWeekArray[daysOfWeekArray.length]= (tuesday);
    daysOfWeekArray[daysOfWeekArray.length]= (wednesday);
    daysOfWeekArray[daysOfWeekArray.length]= (thursday);
    daysOfWeekArray[daysOfWeekArray.length]= (friday);
    daysOfWeekArray[daysOfWeekArray.length]= (saturday);
}*/

/*function calculateHours() {
    let storeTotalHours = 0;

    for(let user in userObj) {
        let userTotalHours = 0;
        for (let day in daysOfWeekArray) {
            for (let hour in hourObj) {
                if (hourObj[hour].date.substring(0, 10) == daysOfWeekArray[day]
                    && userObj[user].t_number == hourObj[hour].team_member
                    && userObj[user].privileged != 5) {
                    userTotalHours += parseInt(hourObj[hour].selling_hours);
                    storeTotalHours += parseInt(hourObj[hour].selling_hours);
                }
            }
        }

        $('#totalHours_'+ userObj[user].t_number).text(userTotalHours);
        $('#budget'+ userObj[user].t_number).text(budgetObj[0].CTs);
    }

    //TODO this method broke when we combine the to tables, I think micheal made this method? Maybe he can help.
        let countTable1 = document.getElementById("countTable1");
        for(let i = 1, row; row = countTable1.rows[i]; i++){
            let sellingHours = parseInt(row.cells[2].innerHTML);
            if (sellingHours != 0 && sellingHours < storeTotalHours){
                row.cells[3].innerHTML = Math.round((sellingHours/storeTotalHours)*100) + '%'
            }
            else if (sellingHours == 0){
                row.cells[3].innerHTML = '0%'
            }
        }
    $('#storeTotalHours').text(storeTotalHours);
    console.log(storeTotalHours);
}*/

/*function displayUsers() {
    let employeeList = "";

    for(let userIndex in filteredUserArray) {
        employeeList += `<tr>
                            <td></td>
                            <td>${filteredUserArray[userIndex].first_name} ${filteredUserArray[userIndex].last_name}</td>
                            <th>${filteredUserArray[userIndex].totalHours}</th>
                            <th>${filteredUserArray[userIndex].hoursPercent}%</th>
                         <tr>`;
    }

    $(`#employeeList`).html(employeeList);
    //getDaysOfTheWeek();
    //if(aDate != '')
    //    displayEmployeeHours(filteredUserArray, filteredHoursArray, aDate);
    //else
    //    displayEmployeeHours(filteredUserArray, filteredHoursArray, moment().startOf('isoWeek'));
}*/

function applyFilter() {
	var storeValue = store.val();
	console.log("Value: " + storeValue);

	filteredUsers = _.cloneDeep(_.filter(userObj, function (user) {
		return user.store_id == storeValue;
	}));
	filteredStore = _.cloneDeep(_.filter(storeObj, function (store) {
		return store.store_id == storeValue;
	}))[0];

	filteredHours = _.cloneDeep(_.filter(_.filter(hourObj, function (hour) {
		return hour.store_id == storeValue;
	}), function (hour) {
		var hourDate = new Date(hour.date);

		return hourDate >= startDate && hourDate <= endDate;
	}));

	filteredBudget = _.cloneDeep(_.filter(_.filter(budgetObj, function (budget) {
		return budget.store_id == storeValue;
	}), function (budget) {
		var budgetDate = new Date(budget.date);

		return budgetDate >= startDate && budgetDate <= endDate;
	}));
}

function renderTables() {
	for (var index = 1; index <= 5; index++) {
		$("#countTable" + index).html('');
	}

	$('#countTable1').html(getCTContent());
	$('#countTable2').html(getRevContent());
	$('#countTable3').html(getLSContent());
	$('#countTable4').html(getKBSContent());
	$('#countTable5').html(getKeyMetrics());
}

function getCTContent() {
	var content = "";

	content += "\n\t\t<thead>\n\t\t\t<tr>\n\t\t\t\t<td>&nbsp;</td>\n\t\t\t\t<td>&nbsp;</td>\n\t\t\t\t<td>&nbsp;</td>\n\t\t\t\t<td>&nbsp;</td>\n\t\t\t\t<td>26.3</td>\n\t\t\t\t<td data-hide=\"all\">31.6</td>\n\t\t\t\t<td data-hide=\"all\">3</td>\n\t\t\t\t<td data-hide=\"all\">14.26%</td>\n\t\t\t</tr>\n\t\t\t<tr>\n\t\t\t\t<th>Store " + filteredStore.store_id + "</th>\n\t\t\t\t<th>TM Name</th>\n\t\t\t\t<th>Selling Hours</th>\n\t\t\t\t<th>% Hours</th>\n\t\t\t\t<th>Budgets</th>\n\t\t\t\t<th>Goal</th>\n\t\t\t\t<th>Actual</th>\n\t\t\t\t<th>% To Budget</th>\n\t\t\t</tr>\n\t\t</thead>\n\t";

	content += "<tbody>";

	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		var _loop = function _loop() {
			var user = _step.value;

			if (user.privileged == 5) {
				return "continue";
			}

			content += "\n\t\t\t<tr id=\"" + user.t_number + "\">\n\t\t\t\t<td></td>\n\t\t\t\t<td>" + user.first_name + " " + user.last_name + "</td>\n\t\t\t\t<td>" + _.reduce(_.filter(filteredHours, function (hourObj) {
				return user.t_number == hourObj.team_member;
			}), function (total, hour) {
				return total + hour.selling_hours;
			}, 0) + "</td>\n\t\t\t\t<td>" + _.reduce(_.filter(filteredHours, function (hourObj) {
				return user.t_number == hourObj.team_member;
			}), function (total, hour) {
				return total + hour.selling_hours;
			}, 0) / _.reduce(_.filter(filteredHours, function (hour) {
				return hour.team_member == (_.find(filteredUsers, function (user) {
					return user.t_number == hour.team_member && user.privileged < 5;
				}) || { t_number: '' }).t_number;
			}), function (total, hour) {
				return total + hour.selling_hours;
			}, 0) * 100 + "</td>\n\t\t\t\t<td>" + (filteredBudget.length ? filteredBudget[0].CTs : 0) + "</td>\n\t\t\t\t<td>26.3</td>\n\t\t\t\t<td>26.3</td>\n\t\t\t\t<td>&nbsp;</td>\n\t\t\t</tr>\n\t\t";
		};

		for (var _iterator = filteredUsers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var _ret = _loop();

			if (_ret === "continue") continue;
		}
	} catch (err) {
		_didIteratorError = true;
		_iteratorError = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion && _iterator.return) {
				_iterator.return();
			}
		} finally {
			if (_didIteratorError) {
				throw _iteratorError;
			}
		}
	}

	content += "</tbody>";

	content += "\n\t\t<tfoot>\n\t\t\t<tr>\n\t\t\t\t<th class=\"pls\" colspan=\"8\">~ Store Actual Totals Listed Below ~</th>\n\t\t\t</tr>\n\t\t\t<tr>\n\t\t\t\t<td>Store Total</td>\n\t\t\t\t<td></td>\n\t\t\t\t<td id=\"storeTotalHours\"></td>\n\t\t\t\t<td>100%</td>\n\t\t\t\t<td>$180</td>\n\t\t\t\t<td>$210</td>\n\t\t\t\t<td>$555</td>\n\t\t\t\t<td>100%</td>\n\t\t\t</tr>\n\t\t</tfoot>\n\t";

	return content;
}

function getRevContent() {
	return "";
}

function getLSContent() {
	return "";
}

function getKBSContent() {
	return "";
}

function getKeyMetrics() {
	return "";
}

//# sourceMappingURL=wmp.js.map