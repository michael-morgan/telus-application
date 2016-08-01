'use strict';

var filteredArray;
var teamMember;

var storesArray;
var filterTeamMembers = function filterTeamMembers(transaction) {
    teamMember = $('#teamMember');
    //If the 'All Team Members' was chosen from the drop down, show all transactions
    if (teamMember.val() == 'all') return transaction.t_number != teamMember.val();
    //If a team member was chosen from the drop down, show transactions related to that user
    else return transaction.t_number == teamMember.val();
},
    filterDate = function filterDate(transaction) {
    var transactionDate = new Date(transaction.transaction_date);

    return transactionDate >= startDate && transactionDate <= endDate;
};
var startDate;
var endDate;

$(function () {

    storesArray = storeObj;
    console.debug(storesArray);
    console.debug(userObj);

    //Hide the delete message until a transaction has been removed
    $('#deleteMessage').hide();
    //Fade out success message after 5 secconds
    $('#successMessage').fadeOut(5000);

    var teamDropdown = $("#teamMember");

    teamDropdown.change(function () {
        //Get the selected user from from the drop down
        teamMember = $('#teamMember');
        filteredArray = storeObj[0].transactions.filter(filterTeamMembers);

        //Render the transactions and edit the HTML based on team member drop down
        renderTransactions(teamMember.val(), userObj, storeObj[0].privileged, filteredArray.filter(filterDate));
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

        //Render the transactions and edit the HTML based on team member drop down
        renderTransactions(teamMember.val(), userObj, storeObj[0].privileged, filteredArray.filter(filterDate));
    });

    //Trigger the drop down change function to load the HTML
    teamDropdown.trigger('change');
});

/**
 * Delete a transaction, uses AJAX
 * @param id
 */
function deleteTransaction(id) {
    bootbox.confirm("Are you sure you want to delete this transaction?", function (result) {
        if (result == true) {
            $.post("/users/transactions", { 'id': id }).done(function (result) {
                $('#transactionID' + id).remove();
                $('#deleteMessage').show();
                $('#removalMessage').html("The transaction was successfully deleted.");
                $('#deleteMessage').fadeOut(5000);
            });
        } //end if
    }); //end confirm;
} //end deleteTransaction

/**
 * This method filter the transactions history by filtering though the array
 * @param t_num
 * @param users
 * @param privileged
 * @param transactions
 */
function renderTransactions(t_num, users, privileged, transactions) {
    if (transactions.length > 0) {
        filteredArray = transactions;
    }
    //console.debug(filteredArray);

    //Initialize variables for storing data
    var totalDeviceCount = 0;
    var deviceCount = 0;
    var appleDeviceCount = 0;
    var deviceWarrantyCount = 0;
    var appleWarrantyCount = 0;
    var transactionCount = 0;
    var accessoriesCount = 0;
    var controllableTransactionsCount = 0;
    var controllableRevenue = 0;
    var warrantyDevices = 0;
    var otherDevices = 0;
    var sbsCount = 0;
    var tabletCount = 0;
    var hsRevenue = 0;
    var learningSessions = 0;
    var critters = 0;
    var appointments = 0;
    var aotm = 0;
    var donations = 0;
    var creditCards = 0;

    //Loop through all the transactions
    for (var transactionIndex in transactions) {

        //If 'All Team Members' was selected, count all transactions
        if (t_num == 'all') transactionCount = transactions.length;
        //If a team member was chosen, only show transactions related to them
        else {
                if (transactions[transactionIndex].t_number == t_num) transactionCount++;
            } //end if

        //Loop through the transactionsItems for each transactions
        for (var transactionItemsIndex in transactions[transactionIndex].transactionItems) {

            //If device type is 2 (Android) or 3 (Blackberry), increment the deviceCount
            if (transactions[transactionIndex].transactionItems[transactionItemsIndex].device_type == 2 || transactions[transactionIndex].transactionItems[transactionItemsIndex].device_type == 3) deviceCount++;

            //If device type is 1 (iPhone) or 7 (iPad), increment the appleDeviceCount
            else if (transactions[transactionIndex].transactionItems[transactionItemsIndex].device_type == 1 || transactions[transactionIndex].transactionItems[transactionItemsIndex].device_type == 7) appleDeviceCount++;

            //If device type is not 5 (SIM), increment the totalDeviceCount
            if (transactions[transactionIndex].transactionItems[transactionItemsIndex].device_type != 5) totalDeviceCount++;

            //If the transaction type is 1 (Device), add the revenue of the transaction to hsRevenue
            if (transactions[transactionIndex].transaction_type == 1) hsRevenue += transactions[transactionIndex].transactionItems[transactionItemsIndex].revenue;

            //If the warranty type is 1 (Device Care) or 2 (Device Care & T-UP), increment the deviceWarrantyCount
            if (transactions[transactionIndex].transactionItems[transactionItemsIndex].warranty_type == 1 || transactions[transactionIndex].transactionItems[transactionItemsIndex].warranty_type == 2) deviceWarrantyCount++;

            //If the warranty type is 3 (AppleCare+) or 4 (AppleCare+ & T-UP), increment the appleWarrantyCount
            else if (transactions[transactionIndex].transactionItems[transactionItemsIndex].warranty_type == 3 || transactions[transactionIndex].transactionItems[transactionItemsIndex].warranty_type == 4) appleWarrantyCount++;

            //If the warranty type is 1 (New Activation) or 2 (Renewal), increment the controllableTransactionsCount
            if (transactions[transactionIndex].transactionItems[transactionItemsIndex].activation_type == 1 || transactions[transactionIndex].transactionItems[transactionItemsIndex].activation_type == 2) controllableTransactionsCount++;

            //If 'All Team Members' was selected, sum up all the revenue
            if (t_num == 'all') controllableRevenue += transactions[transactionIndex].transactionItems[transactionItemsIndex].revenue;
            //If a team member was chosen, sum up transactions related to them
            else {
                    if (transactions[transactionIndex].t_number == t_num) controllableRevenue += transactions[transactionIndex].transactionItems[transactionItemsIndex].revenue;
                }

            //If the device_type is not 5 (SIM) or 8 (Mobile Internet), increment the warrantyDevices
            if (transactions[transactionIndex].transactionItems[transactionItemsIndex].device_type != 5 || transactions[transactionIndex].transactionItems[transactionItemsIndex].device_type != 8) warrantyDevices++;

            //If the device_type is not 1 (iPhone) or 2 (Android), increment the otherDevices
            if (transactions[transactionIndex].transactionItems[transactionItemsIndex].device_type != 1 || transactions[transactionIndex].transactionItems[transactionItemsIndex].device_type != 2) otherDevices++;

            //If the sbs_activation is 1 (Yes), increment the sbsCount
            if (transactions[transactionIndex].transactionItems[transactionItemsIndex].sbs_activation == 1) sbsCount++;

            //If the device_type is 6 (tablet), increment the tabletCount
            if (transactions[transactionIndex].transactionItems[transactionItemsIndex].device_type == 6 || transactions[transactionIndex].transactionItems[transactionItemsIndex].device_type == 7) tabletCount++;

            //Sum up all the num_of_accessories
            accessoriesCount += transactions[transactionIndex].transactionItems[transactionItemsIndex].num_of_accessories;
        } //end for transactionItemsIndex

        //Loop through all the additionalMetricItems per transaction
        for (var metricItemsIndex in transactions[transactionIndex].additionalMetricItems) {
            //Check based on the additional metric type
            switch (transactions[transactionIndex].additionalMetricItems[metricItemsIndex].additional_metrics_items_type) {
                //If metric type is 1 (Learning Sessions), add the metric count to learningSessions
                case 1:
                    learningSessions += transactions[transactionIndex].additionalMetricItems[metricItemsIndex].additional_metrics_items_count;
                    break;
                //If metric type is 2 (AOTM), add the metric count to aotm
                case 2:
                    aotm += transactions[transactionIndex].additionalMetricItems[metricItemsIndex].additional_metrics_items_count;
                    break;
                //If metric type is 3 (Appointments), add the metric count to appointments
                case 3:
                    appointments += transactions[transactionIndex].additionalMetricItems[metricItemsIndex].additional_metrics_items_count;
                    break;
                //If metric type is 4 (Critters), add the metric count to critters
                case 4:
                    critters += transactions[transactionIndex].additionalMetricItems[metricItemsIndex].additional_metrics_items_count;
                    break;
                //If metric type is 5 (Donations), add the metric count to donations
                case 5:
                    donations += transactions[transactionIndex].additionalMetricItems[metricItemsIndex].additional_metrics_items_count;
                    break;
                //If metric type is 6 (Credit Cards), add the metric count to creditCards
                case 6:
                    creditCards += transactions[transactionIndex].additionalMetricItems[metricItemsIndex].additional_metrics_items_count;
                    break;
            } //end switch
        } //end for metricItemsIndex
    } //end for transactionIndex


    for (var i in storesArray) {
        var summaryContent = '';
        summaryContent += '\n        <div role="tablist" aria-multiselectable="true" class="panel-group">\n            <div class="panel">\n                <div class="panel panel-default">\n                    <div role="tab" id="transactionHeading' + storesArray[i].store_id + '" data-toggle="collapse" data-target="#transactionCollapse' + storesArray[i].store_id + '" class="panel-heading purpleHead collapsed" aria-expanded="false">\n                        <div class="row">\n                            <div class="col-xs-4 text-center">\n                                <h4 class="panel-title">Acc. Units per Transaction:\n                                    <strong style="margin-left: 5px;">';
        //If transactionsCount is 0, display 0
        if (transactionCount <= 0) summaryContent += '0%';
        //Else display the value
        else summaryContent += '' + parseFloat(Math.round(accessoriesCount / transactionCount)).toFixed(2);
        summaryContent += '\n                                    </strong>\n                                </h4>\n                            </div><!--end col-xs-4 text-center-->\n                            <div class="col-xs-4 text-center">\n                                <h4 class="panel-title">Basket Size:\n                                    <strong style="margin-left: 5px;">';
        //If transactionsCount is 0, display 0
        if (transactionCount <= 0) summaryContent += '' + 0 .toLocaleString('en-CA', { style: 'currency', currency: 'CAD' });
        //Else display the value
        else summaryContent += ' ' + (controllableRevenue / transactionCount).toLocaleString('en-CA', {
                style: 'currency',
                currency: 'CAD'
            });
        summaryContent += '\n                                    </strong>\n                                </h4>\n                            </div><!--end col-xs-4 text-center-->\n                            <div class="col-xs-4 text-center">\n                                <h4 class="panel-title">Average $ per HS:\n                                    <strong style="margin-left: 5px;">';
        //If totalDeviceCount is 0, display 0
        if (totalDeviceCount <= 0) summaryContent += '' + 0 .toLocaleString('en-CA', { style: 'currency', currency: 'CAD' });
        //Else display the value
        else summaryContent += ' ' + (hsRevenue / totalDeviceCount).toLocaleString('en-CA', {
                style: 'currency',
                currency: 'CAD'
            });
        summaryContent += '\n                                    </strong>\n                                </h4>\n                            </div><!--end row-->\n                        </div><!--end -->\n                    </div><!--end panel-heading purpleHead collapsed-->\n                    <div role="tabpanel" aria-labelledby="transactionHeading' + storesArray[i].store_id + '" id="transactionCollapse' + storesArray[i].store_id + '" class="panel-collapse collapse" aria-expanded="false" style="height: 0px;">\n                        <div class="panel-body">\n                            <div class="panel panel-default">\n                                <div class="panel-body">\n                                    <div class="col-xs-12 col-sm-6 col-md-4">\n                                        <strong>Number of Transactions:</strong>\n                                        <span style="margin-left: 5px;">' + transactionCount + '</span>\n                                    </div><!--end col-xs-12 col-sm-6 col-md-4-->\n                                    <div class="col-xs-12 col-sm-6 col-md-4">\n                                        <strong>Device Care:</strong>\n                                        <span style="margin-left: 5px;">';
        //If deviceCount is 0, display 0
        if (deviceCount <= 0) summaryContent += '0%';
        //Else display the value
        else summaryContent += parseInt(deviceWarrantyCount / deviceCount * 100, 10) + '%';
        summaryContent += '\n                                        </span>\n                                    </div><!--end col-xs-12 col-sm-6 col-md-4-->\n                                    <div class="col-xs-12 col-sm-6 col-md-4">\n                                        <strong>iPhone:</strong>\n                                        <span style="margin-left: 5px;">' + appleDeviceCount + '</span>\n                                    </div><!--end col-xs-12 col-sm-6 col-md-4-->\n                                    <div class="col-xs-12 col-sm-6 col-md-4">\n                                        <strong>Controllable Transactions:</strong>\n                                        <span style="margin-left: 5px;">' + controllableTransactionsCount + '</span>\n                                    </div><!--end col-xs-12 col-sm-6 col-md-4-->\n                                    <div class="col-xs-12 col-sm-6 col-md-4">\n                                        <strong>AppleCare:</strong>\n                                        <span style="margin-left: 5px;">';
        //If appleDeviceCount is 0, display 0
        if (appleDeviceCount <= 0) summaryContent += '0%';
        //Else display the value
        else summaryContent += parseInt(appleWarrantyCount / appleDeviceCount * 100, 10) + '%';
        summaryContent += '\n                                        </span>\n                                    </div><!--end col-xs-12 col-sm-6 col-md-4-->\n                                    <div class="col-xs-12 col-sm-6 col-md-4">\n                                        <strong>Android:</strong>\n                                        <span style="margin-left: 5px;">' + deviceCount + '</span>\n                                    </div><!--end col-xs-12 col-sm-6 col-md-4-->\n                                    <div class="col-xs-12 col-sm-6 col-md-4">\n                                        <strong>Controllable Revenue:</strong>\n                                        <span style="margin-left: 5px;">' + controllableRevenue.toLocaleString('en-CA', {
            style: 'currency',
            currency: 'CAD'
        }) + '</span>\n                                    </div><!--end col-xs-12 col-sm-6 col-md-4-->\n                                    <div class="col-xs-12 col-sm-6 col-md-4">\n                                        <strong>Warranty:</strong>\n                                        <span style="margin-left: 5px;">';
        //If warrantyDevices is 0, display 0
        if (warrantyDevices <= 0) summaryContent += '0%';
        //Else display the value
        else summaryContent += parseInt(appleWarrantyCount + deviceWarrantyCount / warrantyDevices * 100, 10) + '%';
        summaryContent += '\n                                        </span>\n                                    </div><!--end col-xs-12 col-sm-6 col-md-4-->\n                                    <div class="col-xs-12 col-sm-6 col-md-4">\n                                        <strong>Other Devices:</strong>\n                                        <span style="margin-left: 5px;">' + otherDevices + '</span>\n                                    </div><!--end col-xs-12 col-sm-6 col-md-4-->\n                                    <div class="col-xs-12">\n                                        <hr>\n                                    </div><!--end col-xs-12 col-sm-6 col-md-4-->\n                                    <div class="col-xs-12 col-sm-6 col-md-4">\n                                        <strong>SBS Activations:</strong>\n                                        <span style="margin-left: 5px;">' + sbsCount + '</span>\n                                    </div><!--end col-xs-12 col-sm-6 col-md-4-->\n                                    <div class="col-xs-12 col-sm-6 col-md-4">\n                                        <strong>Learning Sessions:</strong>\n                                        <span style="margin-left: 5px;">' + learningSessions + '</span>\n                                    </div><!--end col-xs-12 col-sm-6 col-md-4-->\n                                    <div class="col-xs-12 col-sm-6 col-md-4">\n                                        <strong>Critters:</strong>\n                                        <span style="margin-left: 5px;">' + critters + '</span>\n                                    </div><!--end col-xs-12 col-sm-6 col-md-4-->\n                                    <div class="col-xs-12 col-sm-6 col-md-4">\n                                        <strong>Appointments:</strong>\n                                        <span style="margin-left: 5px;">' + appointments + '</span>\n                                    </div><!--end col-xs-12 col-sm-6 col-md-4-->\n                                    <div class="col-xs-12 col-sm-6 col-md-4">\n                                        <strong>AOTM:</strong>\n                                        <span style="margin-left: 5px;">' + aotm + '</span>\n                                    </div><!--end col-xs-12 col-sm-6 col-md-4-->\n                                    <div class="col-xs-12 col-sm-6 col-md-4">\n                                        <strong>Donations:</strong>\n                                        <span style="margin-left: 5px;">' + donations + '</span>\n                                    </div><!--end col-xs-12 col-sm-6 col-md-4-->\n                                    <div class="col-xs-12 col-sm-6 col-md-4">\n                                        <strong>Credit Cards:</strong>\n                                        <span style="margin-left: 5px;">' + creditCards + '</span>\n                                    </div><!--end col-xs-12 col-sm-6 col-md-4-->\n                                    <div class="col-xs-12 col-sm-6 col-md-4">\n                                        <strong>Tablets:</strong>\n                                        <span style="margin-left: 5px;">' + tabletCount + '</span>\n                                    </div><!--end col-xs-12 col-sm-6 col-md-4-->\n                                </div><!--end panel-body-->\n                            </div><!--end panel panel-default -->\n                        </div><!--end panel-body-->\n                    </div><!--end panel-collapse collapse-->\n                </div><!--end panel panel-default -->\n            </div><!--end col-xs-12 col-lg-10 col-lg-offset-1 -->\n        </div><!--end panel group -->';
        $('#summaryContainer' + storesArray[i].store_id).html(summaryContent);
        console.log(storesArray[i].store_id);
    }

    //For each transaction
    for (var i in storesArray) {
        var content = '';
        for (var transactionIndex in transactions) {
            //content hold all the HTML for the filtered array
            content += '\n       <div id="' + storesArray[i].store_id + 'transactionID' + transactions[transactionIndex].transaction_id + '" class="panel">\n           <div class="panel-heading purpleHead">\n               <div role="tab" class="row" id="' + storesArray[i].store_id + 'transactionHeading' + transactions[transactionIndex].transaction_id + '" data-toggle="collapse" data-target="#' + storesArray[i].store_id + 'transactionCollapse' + transactions[transactionIndex].transaction_id + '">\n                  <div class="col-xs-4">\n                       <h4 class="panel-title">' + new Date(transactions[transactionIndex].transaction_date).toLocaleDateString() + '</h4>\n                  </div><!-- end col-xs-4 -->\n\n                  <div class="col-xs-4 text-center">\n                       <h4 class="panel-title">' + transactions[transactionIndex].transactionItems.length + ' Item(s)</h4>\n                  </div><!-- end col-xs-4 text-center -->\n\n                  <div class="col-xs-4">\n                       <div class="pull-right">\n                           <div style="padding:0;" class="col-xs-8">\n                                <h4 class="panel-title">' + transactions[transactionIndex].totalRevenue.toLocaleString('en-CA', {
                style: 'currency',
                currency: 'CAD'
            }) + '</h4>\n                           </div><!-- end col-xs-8 -->\n                           <div style="padding:0;" class="col-xs-4">';
            //If the user is privileged to remove transactions'
            if (privileged >= 3) {
                content += '\n                                       <div style="padding:0;" class="col-xs-4">\n                                           <div style="margin-top:6px;" class="dropdown">\n                                               <a id="ddMoreOptions" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true" class="dropdown-toggle"><i aria-hidden="true" class="fa fa-ellipsis-v fa-2x"></i></a>\n                                               <ul aria-labelledby="ddMoreOptions" class="dropdown-menu">\n                                                   <li><a href="#" onclick="deleteTransaction(' + transactions[transactionIndex].transaction_id + ')">Remove Transaction</a></li>\n                                               </ul>\n                                           </div><!-- end dropdown -->\n                                       </div><!-- end col-xs-4 -->\n                                    ';
            }
            content += '\n                           </div><!-- end col-xs-8 -->\n                       </div><!-- end pull-right -->\n                  </div><!-- end col-xs-4 -->\n               </div><!-- end row -->\n           </div><!-- end panel heading -->';
            content += '\n           <div class="panel-collapse collapse" role="tabpanel" aria-labelledby="' + storesArray[i].store_id + 'transactionHeading' + transactions[transactionIndex].transaction_id + '" id="' + storesArray[i].store_id + 'transactionCollapse' + transactions[transactionIndex].transaction_id + '">\n               <div class="panel-body">';
            //For each transactionItem in a trasactions
            for (var transactionItemsIndex in transactions[transactionIndex].transactionItems) {
                content += '\n                   <div class="col-xs-12 col-sm-6 col-md-4">\n                       <strong>Transaction Type:</strong>\n                       <span style="margin-left: 5px;">' + transactions[transactionIndex].transactionItems[transactionItemsIndex].transactionType + '</span>\n                   </div><!-- end col-xs-12 col-sm-6 col-md-4 -->\n                   <div class="col-xs-12 col-sm-6 col-md-4">\n                       <strong>Warranty Type:</strong>\n                       <span style="margin-left: 5px;">';
                if (transactions[transactionIndex].transactionItems[transactionItemsIndex].warranty) {
                    content += '' + transactions[transactionIndex].transactionItems[transactionItemsIndex].warranty;
                } else {
                    content += 'None';
                }
                content += '</span>\n                   </div><!-- end col-xs-12 col-sm-6 col-md-4 -->\n                   <div class="col-xs-12 col-sm-6 col-md-4">\n                       <strong>Sale Type:</strong>\n                       <span style="margin-left: 5px;">';
                if (transactions[transactionIndex].transactionItems[transactionItemsIndex].activation) {
                    content += '' + transactions[transactionIndex].transactionItems[transactionItemsIndex].activation;
                } else {
                    content += 'None';
                }
                content += '</span>\n                   </div><!-- end col-xs-12 col-sm-6 col-md-4 -->\n                   <div class="col-xs-12 col-sm-6 col-md-4">\n                       <strong>Attach (Yes/No):</strong>\n                       <span style="margin-left: 5px;">' + (transactions[transactionIndex].transactionItems[transactionItemsIndex].attached === 1 ? 'Yes' : 'No') + '</span>\n                   </div><!-- end col-xs-12 col-sm-6 col-md-4 -->\n                   <div class="col-xs-12 col-sm-6 col-md-4">\n                       <strong>Device Type:</strong>\n                       <span style="margin-left: 5px;">';
                if (transactions[transactionIndex].transactionItems[transactionItemsIndex].device) {
                    content += '' + transactions[transactionIndex].transactionItems[transactionItemsIndex].device;
                } else {
                    content += 'None';
                }
                content += '</span>\n                   </div><!-- end col-xs-12 col-sm-6 col-md-4 -->\n                   <div class="col-xs-12 col-sm-6 col-md-4">\n                       <strong>Revenue:</strong>\n                       <span style="margin-left: 5px;">' + transactions[transactionIndex].transactionItems[transactionItemsIndex].revenue.toLocaleString('en-CA', {
                    style: 'currency',
                    currency: 'CAD'
                }) + '</span>\n                   </div><!-- end col-xs-12 col-sm-6 col-md-4 -->\n                   <div class="col-xs-12 col-sm-6 col-md-4">\n                       <strong>SBS Activation (Yes/No):</strong>\n                       <span style="margin-left: 5px;">' + (transactions[transactionIndex].transactionItems[transactionItemsIndex].sbs_activation === 1 ? 'Yes' : 'No') + '</span>\n                   </div><!-- end col-xs-12 col-sm-6 col-md-4 -->\n                   <div class="col-xs-12 col-sm-6 col-md-4">\n                       <strong>Number of Accessories:</strong>\n                       <span style="margin-left: 5px;">' + transactions[transactionIndex].transactionItems[transactionItemsIndex].num_of_accessories + '</span>\n                   </div><!-- end col-xs-12 col-sm-6 col-md-4 -->\n                   <div class="col-xs-12">\n                       <hr />\n                   </div><!-- end col-xs-12 -->\n               ';
            } //end for transactionItems
            //For each additionalMetric
            for (var additionalMetricIndex in transactions[transactionIndex].additionalMetricItems) {
                if (transactions[transactionIndex].additionalMetricItems[additionalMetricIndex].additional_metrics_items_type === 1) {
                    content += '\n                           <div class="col-xs-12 col-sm-6 col-md-4">\n                               <strong>Learning Sessions:</strong>\n                               <span style="margin-left: 5px;">' + transactions[transactionIndex].additionalMetricItems[additionalMetricIndex].additional_metrics_items_count + '</span>\n                           </div><!-- end col-xs-12 col-sm-6 col-md-4 -->\n                       ';
                } //end if
                if (transactions[transactionIndex].additionalMetricItems[additionalMetricIndex].additional_metrics_items_type === 2) {
                    content += '\n                           <div class="col-xs-12 col-sm-6 col-md-4">\n                               <strong>AOTMs Sold:</strong>\n                               <span style="margin-left: 5px;">' + transactions[transactionIndex].additionalMetricItems[additionalMetricIndex].additional_metrics_items_count + '</span>\n                           </div><!-- end col-xs-12 col-sm-6 col-md-4 -->\n                       ';
                } //end if
                if (transactions[transactionIndex].additionalMetricItems[additionalMetricIndex].additional_metrics_items_type === 3) {
                    content += '\n                           <div class="col-xs-12 col-sm-6 col-md-4">\n                               <strong>Appointments:</strong>\n                               <span style="margin-left: 5px;">' + transactions[transactionIndex].additionalMetricItems[additionalMetricIndex].additional_metrics_items_count + '</span>\n                           </div><!-- end col-xs-12 col-sm-6 col-md-4 -->\n                       ';
                } //end if
                if (transactions[transactionIndex].additionalMetricItems[additionalMetricIndex].additional_metrics_items_type === 4) {
                    content += '\n                           <div class="col-xs-12 col-sm-6 col-md-4">\n                               <strong>Critters Sold:</strong>\n                               <span style="margin-left: 5px;">' + transactions[transactionIndex].additionalMetricItems[additionalMetricIndex].additional_metrics_items_count + '</span>\n                           </div><!-- end col-xs-12 col-sm-6 col-md-4 -->\n                       ';
                } //end if

                if (transactions[transactionIndex].additionalMetricItems[additionalMetricIndex].additional_metrics_items_type === 5) {
                    content += '\n                           <div class="col-xs-12 col-sm-6 col-md-4">\n                               <strong>Donations:</strong>\n                               <span style="margin-left: 5px;">' + transactions[transactionIndex].additionalMetricItems[additionalMetricIndex].additional_metrics_items_count + '</span>\n                           </div><!-- end col-xs-12 col-sm-6 col-md-4 -->\n                       ';
                } //end if
                if (transactions[transactionIndex].additionalMetricItems[additionalMetricIndex].additional_metrics_items_type === 6) {
                    content += '\n                           <div class="col-xs-12 col-sm-6 col-md-4">\n                               <strong>Credit Card Apps:</strong>\n                               <span style="margin-left: 5px;">' + transactions[transactionIndex].additionalMetricItems[additionalMetricIndex].additional_metrics_items_count + '</span>\n                           </div><!-- end col-xs-12 col-sm-6 col-md-4 -->\n                       ';
                } //end if
            } //end for additionalMetricItems
            content += '\n               <div class="col-xs-12"></div><!-- end col-xs-12 -->\n               <div style="margin-top: 25px;" class="col-xs-6">\n                   <div class="pull-left">\n                       <strong>Time:</strong>\n                       <span style="margin-left: 5px;">' + new Date(transactions[transactionIndex].transaction_date).toLocaleTimeString() + '</span>\n                   </div><!-- end pull-left -->\n               </div><!-- end col-xs-6 -->\n               <div style="margin-top: 25px;" class="col-xs-6">\n                   <div class="pull-right">\n                       <strong>Completed By:</strong>\n                       <span style="margin-left: 5px;">';
            for (var userIndex in users) {
                if (users[userIndex].t_number === transactions[transactionIndex].t_number) {
                    content += users[userIndex].first_name + ' ' + users[userIndex].last_name;
                } //end if
            } //end for
            content += '</span>\n                   </div><!-- end pull-right -->\n              </div><!-- end col-xs-6 -->\n          </div><!-- end panel-body -->\n       </div><!-- end panel-collapse collapse -->\n   </div> <!-- end panel -->';
        } //end for transactions

        $('#transactionContainer' + storesArray[i].store_id).html(content);
    } //end for stores

} //end render transaction

//# sourceMappingURL=transactions.js.map