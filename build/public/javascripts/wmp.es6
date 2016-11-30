let filteredUsers;
let filteredStore;
let filteredHours;
let filteredBudget;

let store;

let startDate;
let endDate;

//let daysOfWeekArray = [];

$(() => {
	console.debug(storeObj);
	console.debug(userObj);
	console.debug(hourObj);
	console.debug(budgetObj);

	store = $("#store");

    store.change(event => {

		//applyFilter();
		//renderTables();

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
	}, function(start, end, label) {
		startDate = start;
		endDate = end;

		//applyFilter();
		//renderTables();
	});

    // Trigger the drop down change function to load the HTML
    //store.trigger('change');
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
	let storeValue = store.val();
	console.log("Value: " + storeValue);

	filteredUsers = _.cloneDeep(_.filter(userObj, user => user.store_id == storeValue));
	filteredStore = _.cloneDeep(_.filter(storeObj, store => store.store_id == storeValue))[0];
	filteredHours = _.cloneDeep(
		_.filter(
			_.filter(hourObj, hour => hour.store_id == storeValue),
			hour => {
				let hourDate = new Date(hour.date);

				return ((hourDate >= startDate) && (hourDate <= endDate));
			}
		)
	);
	filteredBudget = _.cloneDeep(
		_.filter(
			_.filter(budgetObj, budget => budget.store_id == storeValue),
			budget => {
				let budgetDate = new Date(budget.date);

				return ((budgetDate >= startDate) && (budgetDate <= endDate));
			}
		)
	);
}

function renderTables() {
	for(let index = 1; index <= 5; index++) {
		$(`countTable${index}`).html('');
	}

	$('#countTable1').html(getCTContent());
	$('#countTable2').html(getRevContent());
	$('#countTable3').html(getLSContent());
	$('#countTable4').html(getKBSContent());
	$('#countTable5').html(getKeyMetrics());
}

function getCTContent() {
	let content = "";

	content += `
		<thead>
			<tr>
				<td>&nbsp;</td>
				<td>&nbsp;</td>
				<td>&nbsp;</td>
				<td>&nbsp;</td>
				<td>26.3</td>
				<td data-hide="all">31.6</td>
				<td data-hide="all">3</td>
				<td data-hide="all">14.26%</td>
			</tr>
			<tr>
				<th>Store ${filteredStore.store_id}</th>
				<th>TM Name</th>
				<th>Selling Hours</th>
				<th>% Hours</th>
				<th>Budgets</th>
				<th>Goal</th>
				<th>Actual</th>
				<th>% To Budget</th>
			</tr>
		</thead>
	`;

	content += "<tbody>";

	for(let user of filteredUsers) {
		if(user.privileged == 5) { continue; }

		content += `
			<tr id="${user.t_number}">
				<td></td>
				<td>${user.first_name} ${user.last_name}</td>
				<td>${user.totalHours}</td>
				<td>${user.hoursPercent}</td>
				<td>${filteredBudget.length ? filteredBudget[0].CTs : 0}</td>
				<td>26.3</td>
				<td>26.3</td>
				<td>&nbsp;</td>
			</tr>
		`;
	}

	content += "</tbody>";

	content += `
		<tfoot>
			<tr>
				<th class="pls" colspan="8">~ Store Actual Totals Listed Below ~</th>
			</tr>
			<tr>
				<td>Store Total</td>
				<td></td>
				<td id="storeTotalHours"></td>
				<td>100%</td>
				<td>$180</td>
				<td>$210</td>
				<td>$555</td>
				<td>100%</td>
			</tr>
		</tfoot>
	`;

	return content;
}

function getRevContent() {
	return ``;
}

function getLSContent() {
	return ``;
}

function getKBSContent() {
	return ``;
}

function getKeyMetrics() {
	return ``;
}