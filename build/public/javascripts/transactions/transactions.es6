var storesArray;
var filteredArray;
var teamMember;

var startDate;
var endDate;

var filterTNumber = (obj) => {
    teamMember = $('#teamMember');

    if(teamMember.val() == 'all') {
        return obj.t_number != teamMember.val();
    }
    else {
        return obj.t_number == teamMember.val();
    }
};

var filterDate = (transaction) => {
    var transactionDate = new Date(transaction.transaction_date);

    return ((transactionDate >= startDate) && (transactionDate <= endDate));
};

$(() => {
    storesArray = JSON.parse(JSON.stringify(storeObj));

    console.debug(storesArray);
    console.debug(userObj);

    //Hide the delete message until a transaction has been removed
    $('#deleteMessage').hide();

    //Fade out success message after 5 seconds
    $('#successMessage').fadeOut(5000);

    var teamDropdown = $("#teamMember");

    teamDropdown.change((event) => {
        //Get the selected user from from the drop down
        teamMember = $('#teamMember');

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

        applyFilter();

        //Render the transactions and edit the HTML based on team member drop down
        renderTransactions(teamMember.val(), userObj, storeObj[0].privileged, filteredArray);
    });

    //Trigger the drop down change function to load the HTML
    teamDropdown.trigger('change');
});

function applyFilter() {
    filteredArray = JSON.parse(JSON.stringify(storesArray.filter(filterTNumber)));
    for(let storeIndex in filteredArray) {
        filteredArray[storeIndex].transactions = JSON.parse(JSON.stringify(storesArray[storesArray.findIndex(
            (store) => store.store_id == filteredArray[storeIndex].store_id
        )].transactions.filter(filterTNumber).filter(filterDate)));
    }
}

/**
 * Delete a transaction, uses AJAX
 * @param id
 */
function deleteTransaction(id) {
    bootbox.confirm("Are you sure you want to delete this transaction?", function(result) {
        if (result == true) {
            $.post("/users/transactions", {'id': id}).done(function(result) {
                $('#transactionID' + id).remove();
                $('#deleteMessage').show();
                $('#removalMessage').html("The transaction was successfully deleted.");
                $('#deleteMessage').fadeOut(5000);
            });
        } //end if
    }); //end confirm;
} //end deleteTransaction

/**
 * This method filter the transactions history by filtering through the array
 * @param t_num
 * @param users
 * @param privileged
 * @param stores
 */
function renderTransactions(t_num, users, privileged, stores) {
    if(stores.length == 0) {
        return;
    }

    for(let storeIndex in stores) {

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
        for (let transactionIndex in stores[storeIndex].transactions) {
            let transactions = stores[storeIndex].transactions;

            //If 'All Team Members' was selected, count all transactions
            if (t_num == 'all')
                transactionCount = transactions.length;
            //If a team member was chosen, only show transactions related to them
            else {
                if (transactions[transactionIndex].t_number == t_num)
                    transactionCount++
            } //end if

            //Loop through the transactionsItems for each transactions
            for (var transactionItemsIndex in transactions[transactionIndex].transactionItems) {

                //If device type is 2 (Android) or 3 (Blackberry), increment the deviceCount
                if (transactions[transactionIndex].transactionItems[transactionItemsIndex].device_type == 2 || transactions[transactionIndex].transactionItems[transactionItemsIndex].device_type == 3)
                    deviceCount++;

                //If device type is 1 (iPhone) or 7 (iPad), increment the appleDeviceCount
                else if (transactions[transactionIndex].transactionItems[transactionItemsIndex].device_type == 1 || transactions[transactionIndex].transactionItems[transactionItemsIndex].device_type == 7)
                    appleDeviceCount++;

                //If device type is not 5 (SIM), increment the totalDeviceCount
                if (transactions[transactionIndex].transactionItems[transactionItemsIndex].device_type != 5)
                    totalDeviceCount++;

                //If the transaction type is 1 (Device), add the revenue of the transaction to hsRevenue
                if (transactions[transactionIndex].transaction_type == 1)
                    hsRevenue += transactions[transactionIndex].transactionItems[transactionItemsIndex].revenue;

                //If the warranty type is 1 (Device Care) or 2 (Device Care & T-UP), increment the deviceWarrantyCount
                if (transactions[transactionIndex].transactionItems[transactionItemsIndex].warranty_type == 1 || transactions[transactionIndex].transactionItems[transactionItemsIndex].warranty_type == 2)
                    deviceWarrantyCount++;

                //If the warranty type is 3 (AppleCare+) or 4 (AppleCare+ & T-UP), increment the appleWarrantyCount
                else if (transactions[transactionIndex].transactionItems[transactionItemsIndex].warranty_type == 3 || transactions[transactionIndex].transactionItems[transactionItemsIndex].warranty_type == 4)
                    appleWarrantyCount++;

                //If the warranty type is 1 (New Activation) or 2 (Renewal), increment the controllableTransactionsCount
                if (transactions[transactionIndex].transactionItems[transactionItemsIndex].activation_type == 1 || transactions[transactionIndex].transactionItems[transactionItemsIndex].activation_type == 2)
                    controllableTransactionsCount++;

                //If 'All Team Members' was selected, sum up all the revenue
                if (t_num == 'all')
                    controllableRevenue += transactions[transactionIndex].transactionItems[transactionItemsIndex].revenue;
                //If a team member was chosen, sum up transactions related to them
                else {
                    if (transactions[transactionIndex].t_number == t_num)
                        controllableRevenue += transactions[transactionIndex].transactionItems[transactionItemsIndex].revenue;
                }

                //If the device_type is not 5 (SIM) or 8 (Mobile Internet), increment the warrantyDevices
                if (transactions[transactionIndex].transactionItems[transactionItemsIndex].device_type != 5 || transactions[transactionIndex].transactionItems[transactionItemsIndex].device_type != 8)
                    warrantyDevices++;

                //If the device_type is not 1 (iPhone) or 2 (Android), increment the otherDevices
                if (transactions[transactionIndex].transactionItems[transactionItemsIndex].device_type != 1 || transactions[transactionIndex].transactionItems[transactionItemsIndex].device_type != 2)
                    otherDevices++;

                //If the sbs_activation is 1 (Yes), increment the sbsCount
                if (transactions[transactionIndex].transactionItems[transactionItemsIndex].sbs_activation == 1)
                    sbsCount++;

                //If the device_type is 6 (tablet), increment the tabletCount
                if (transactions[transactionIndex].transactionItems[transactionItemsIndex].device_type == 6 || transactions[transactionIndex].transactionItems[transactionItemsIndex].device_type == 7)
                    tabletCount++;

                //Sum up all the num_of_accessories
                accessoriesCount += transactions[transactionIndex].transactionItems[transactionItemsIndex].num_of_accessories;
            }//end for transactionItemsIndex

            //Loop through all the additionalMetricItems per transaction
            for (var metricItemsIndex in transactions[transactionIndex].additionalMetricItems) {
                //Check based on the additional metric type
                switch (transactions[transactionIndex].additionalMetricItems[metricItemsIndex].additional_metrics_items_type) {
                    //If metric type is 1 (Learning Sessions), add the metric count to learningSessions
                    case 1:
                        learningSessions += transactions[transactionIndex].additionalMetricItems[metricItemsIndex].additional_metrics_items_count
                        break
                    //If metric type is 2 (AOTM), add the metric count to aotm
                    case 2:
                        aotm += transactions[transactionIndex].additionalMetricItems[metricItemsIndex].additional_metrics_items_count
                        break;
                    //If metric type is 3 (Appointments), add the metric count to appointments
                    case 3:
                        appointments += transactions[transactionIndex].additionalMetricItems[metricItemsIndex].additional_metrics_items_count
                        break;
                    //If metric type is 4 (Critters), add the metric count to critters
                    case 4:
                        critters += transactions[transactionIndex].additionalMetricItems[metricItemsIndex].additional_metrics_items_count
                        break;
                    //If metric type is 5 (Donations), add the metric count to donations
                    case 5:
                        donations += transactions[transactionIndex].additionalMetricItems[metricItemsIndex].additional_metrics_items_count
                        break;
                    //If metric type is 6 (Credit Cards), add the metric count to creditCards
                    case 6:
                        creditCards += transactions[transactionIndex].additionalMetricItems[metricItemsIndex].additional_metrics_items_count
                        break;
                } //end switch
            } //end for metricItemsIndex
        } //end for transactionIndex

        var summaryContent = '';
        summaryContent += `
            <div role="tablist" aria-multiselectable="true" class="panel-group">
                <div class="panel">
                    <div class="panel panel-default">
                        <div role="tab" id="transactionHeading${stores[storeIndex].store_id}" data-toggle="collapse" data-target="#transactionCollapse${stores[storeIndex].store_id}" class="panel-heading purpleHead collapsed" aria-expanded="false">
                            <div class="row">
                                <div class="col-xs-4 text-center">
                                    <h4 class="panel-title">Acc. Units per Transaction:
                                        <strong style="margin-left: 5px;">
        `;

        //If transactionsCount is 0, display 0
        if (transactionCount <= 0) {
            summaryContent += `0%`;
        }
        //Else display the value
        else {
            summaryContent += `${parseFloat(Math.round(accessoriesCount / transactionCount)).toFixed(2)}`;
        }

        summaryContent += `
                                    </strong>
                                </h4>
                            </div><!--end col-xs-4 text-center-->
                            <div class="col-xs-4 text-center">
                                <h4 class="panel-title">Basket Size:
                                    <strong style="margin-left: 5px;">
        `;
        //If transactionsCount is 0, display 0
        if (transactionCount <= 0)
            summaryContent += `${(0).toLocaleString('en-CA', {style: 'currency', currency: 'CAD'})}`;
        //Else display the value
        else
            summaryContent += ` ${(controllableRevenue / transactionCount).toLocaleString('en-CA', {
                style: 'currency',
                currency: 'CAD'
            })}`;
        summaryContent += `
                                    </strong>
                                </h4>
                            </div><!--end col-xs-4 text-center-->
                            <div class="col-xs-4 text-center">
                                <h4 class="panel-title">Average $ per HS:
                                    <strong style="margin-left: 5px;">`;
        //If totalDeviceCount is 0, display 0
        if (totalDeviceCount <= 0)
            summaryContent += `${(0).toLocaleString('en-CA', {style: 'currency', currency: 'CAD'})}`;
        //Else display the value
        else
            summaryContent += ` ${(hsRevenue / totalDeviceCount).toLocaleString('en-CA', {
                style: 'currency',
                currency: 'CAD'
            })}`;
        summaryContent += `
                                    </strong>
                                </h4>
                            </div><!--end row-->
                        </div><!--end -->
                    </div><!--end panel-heading purpleHead collapsed-->
                    <div role="tabpanel" aria-labelledby="transactionHeading${stores[storeIndex].store_id}" id="transactionCollapse${stores[storeIndex].store_id}" class="panel-collapse collapse" aria-expanded="false" style="height: 0px;">
                        <div class="panel-body">
                            <div class="panel panel-default">
                                <div class="panel-body">
                                    <div class="col-xs-12 col-sm-6 col-md-4">
                                        <strong>Number of Transactions:</strong>
                                        <span style="margin-left: 5px;">${transactionCount}</span>
                                    </div><!--end col-xs-12 col-sm-6 col-md-4-->
                                    <div class="col-xs-12 col-sm-6 col-md-4">
                                        <strong>Device Care:</strong>
                                        <span style="margin-left: 5px;">`;
        //If deviceCount is 0, display 0
        if (deviceCount <= 0)
            summaryContent += `0%`;
        //Else display the value
        else
            summaryContent += `${parseInt(deviceWarrantyCount / deviceCount * 100, 10)}%`;
        summaryContent += `
                                        </span>
                                    </div><!--end col-xs-12 col-sm-6 col-md-4-->
                                    <div class="col-xs-12 col-sm-6 col-md-4">
                                        <strong>iPhone:</strong>
                                        <span style="margin-left: 5px;">${appleDeviceCount}</span>
                                    </div><!--end col-xs-12 col-sm-6 col-md-4-->
                                    <div class="col-xs-12 col-sm-6 col-md-4">
                                        <strong>Controllable Transactions:</strong>
                                        <span style="margin-left: 5px;">${controllableTransactionsCount}</span>
                                    </div><!--end col-xs-12 col-sm-6 col-md-4-->
                                    <div class="col-xs-12 col-sm-6 col-md-4">
                                        <strong>AppleCare:</strong>
                                        <span style="margin-left: 5px;">`;
        //If appleDeviceCount is 0, display 0
        if (appleDeviceCount <= 0)
            summaryContent += `0%`;
        //Else display the value
        else
            summaryContent += `${parseInt(appleWarrantyCount / appleDeviceCount * 100, 10)}%`;
        summaryContent += `
                                        </span>
                                    </div><!--end col-xs-12 col-sm-6 col-md-4-->
                                    <div class="col-xs-12 col-sm-6 col-md-4">
                                        <strong>Android:</strong>
                                        <span style="margin-left: 5px;">${deviceCount}</span>
                                    </div><!--end col-xs-12 col-sm-6 col-md-4-->
                                    <div class="col-xs-12 col-sm-6 col-md-4">
                                        <strong>Controllable Revenue:</strong>
                                        <span style="margin-left: 5px;">${controllableRevenue.toLocaleString('en-CA', {
            style: 'currency',
            currency: 'CAD'
        })}</span>
                                    </div><!--end col-xs-12 col-sm-6 col-md-4-->
                                    <div class="col-xs-12 col-sm-6 col-md-4">
                                        <strong>Warranty:</strong>
                                        <span style="margin-left: 5px;">`;
        //If warrantyDevices is 0, display 0
        if (warrantyDevices <= 0)
            summaryContent += `0%`;
        //Else display the value
        else
            summaryContent += `${parseInt(appleWarrantyCount + deviceWarrantyCount / warrantyDevices * 100, 10)}%`;
        summaryContent += `
                                        </span>
                                    </div><!--end col-xs-12 col-sm-6 col-md-4-->
                                    <div class="col-xs-12 col-sm-6 col-md-4">
                                        <strong>Other Devices:</strong>
                                        <span style="margin-left: 5px;">${otherDevices}</span>
                                    </div><!--end col-xs-12 col-sm-6 col-md-4-->
                                    <div class="col-xs-12">
                                        <hr>
                                    </div><!--end col-xs-12 col-sm-6 col-md-4-->
                                    <div class="col-xs-12 col-sm-6 col-md-4">
                                        <strong>SBS Activations:</strong>
                                        <span style="margin-left: 5px;">${sbsCount}</span>
                                    </div><!--end col-xs-12 col-sm-6 col-md-4-->
                                    <div class="col-xs-12 col-sm-6 col-md-4">
                                        <strong>Learning Sessions:</strong>
                                        <span style="margin-left: 5px;">${learningSessions}</span>
                                    </div><!--end col-xs-12 col-sm-6 col-md-4-->
                                    <div class="col-xs-12 col-sm-6 col-md-4">
                                        <strong>Critters:</strong>
                                        <span style="margin-left: 5px;">${critters}</span>
                                    </div><!--end col-xs-12 col-sm-6 col-md-4-->
                                    <div class="col-xs-12 col-sm-6 col-md-4">
                                        <strong>Appointments:</strong>
                                        <span style="margin-left: 5px;">${appointments}</span>
                                    </div><!--end col-xs-12 col-sm-6 col-md-4-->
                                    <div class="col-xs-12 col-sm-6 col-md-4">
                                        <strong>AOTM:</strong>
                                        <span style="margin-left: 5px;">${aotm}</span>
                                    </div><!--end col-xs-12 col-sm-6 col-md-4-->
                                    <div class="col-xs-12 col-sm-6 col-md-4">
                                        <strong>Donations:</strong>
                                        <span style="margin-left: 5px;">${donations}</span>
                                    </div><!--end col-xs-12 col-sm-6 col-md-4-->
                                    <div class="col-xs-12 col-sm-6 col-md-4">
                                        <strong>Credit Cards:</strong>
                                        <span style="margin-left: 5px;">${creditCards}</span>
                                    </div><!--end col-xs-12 col-sm-6 col-md-4-->
                                    <div class="col-xs-12 col-sm-6 col-md-4">
                                        <strong>Tablets:</strong>
                                        <span style="margin-left: 5px;">${tabletCount}</span>
                                    </div><!--end col-xs-12 col-sm-6 col-md-4-->
                                </div><!--end panel-body-->
                            </div><!--end panel panel-default -->
                        </div><!--end panel-body-->
                    </div><!--end panel-collapse collapse-->
                </div><!--end panel panel-default -->
            </div><!--end col-xs-12 col-lg-10 col-lg-offset-1 -->
        </div><!--end panel group -->`;
        $(`#summaryContainer${stores[storeIndex].store_id}`).html(summaryContent);

        //For each store
        var content = '';
        for (let transactionIndex in stores[storeIndex].transactions) {
            let transactions = stores[storeIndex].transactions;

            //content hold all the HTML for the filtered array
            content += `
       <div id="${stores[storeIndex].store_id}transactionID${transactions[transactionIndex].transaction_id}" class="panel">
           <div class="panel-heading purpleHead">
               <div role="tab" class="row" id="${stores[storeIndex].store_id}transactionHeading${transactions[transactionIndex].transaction_id}" data-toggle="collapse" data-target="#${stores[storeIndex].store_id}transactionCollapse${transactions[transactionIndex].transaction_id}">
                  <div class="col-xs-4">
                       <h4 class="panel-title">${new Date(transactions[transactionIndex].transaction_date).toLocaleDateString()}</h4>
                  </div><!-- end col-xs-4 -->

                  <div class="col-xs-4 text-center">
                       <h4 class="panel-title">${transactions[transactionIndex].transactionItems.length} Item(s)</h4>
                  </div><!-- end col-xs-4 text-center -->

                  <div class="col-xs-4">
                       <div class="pull-right">
                           <div style="padding:0;" class="col-xs-8">
                                <h4 class="panel-title">${transactions[transactionIndex].totalRevenue.toLocaleString('en-CA', {
                style: 'currency',
                currency: 'CAD'
            })}</h4>
                           </div><!-- end col-xs-8 -->
                           <div style="padding:0;" class="col-xs-4">`;
            //If the user is privileged to remove transactions'
            if (privileged >= 3) {
                content += `
                                       <div style="padding:0;" class="col-xs-4">
                                           <div style="margin-top:6px;" class="dropdown">
                                               <a id="ddMoreOptions" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true" class="dropdown-toggle"><i aria-hidden="true" class="fa fa-ellipsis-v fa-2x"></i></a>
                                               <ul aria-labelledby="ddMoreOptions" class="dropdown-menu">
                                                   <li><a href="#" onclick="deleteTransaction(${transactions[transactionIndex].transaction_id})">Remove Transaction</a></li>
                                               </ul>
                                           </div><!-- end dropdown -->
                                       </div><!-- end col-xs-4 -->
                                    `;
            }
            content += `
                           </div><!-- end col-xs-8 -->
                       </div><!-- end pull-right -->
                  </div><!-- end col-xs-4 -->
               </div><!-- end row -->
           </div><!-- end panel heading -->`;
            content += `
           <div class="panel-collapse collapse" role="tabpanel" aria-labelledby="${stores[storeIndex].store_id}transactionHeading${transactions[transactionIndex].transaction_id}" id="${stores[storeIndex].store_id}transactionCollapse${transactions[transactionIndex].transaction_id}">
               <div class="panel-body">`;
            //For each transactionItem in a trasactions
            for (var transactionItemsIndex in transactions[transactionIndex].transactionItems) {
                content += `
                   <div class="col-xs-12 col-sm-6 col-md-4">
                       <strong>Transaction Type:</strong>
                       <span style="margin-left: 5px;">${transactions[transactionIndex].transactionItems[transactionItemsIndex].transactionType}</span>
                   </div><!-- end col-xs-12 col-sm-6 col-md-4 -->
                   <div class="col-xs-12 col-sm-6 col-md-4">
                       <strong>Warranty Type:</strong>
                       <span style="margin-left: 5px;">`;
                if (transactions[transactionIndex].transactionItems[transactionItemsIndex].warranty) {
                    content += `${transactions[transactionIndex].transactionItems[transactionItemsIndex].warranty}`;
                } else {
                    content += `None`;
                }
                content += `</span>
                   </div><!-- end col-xs-12 col-sm-6 col-md-4 -->
                   <div class="col-xs-12 col-sm-6 col-md-4">
                       <strong>Sale Type:</strong>
                       <span style="margin-left: 5px;">`;
                if (transactions[transactionIndex].transactionItems[transactionItemsIndex].activation) {
                    content += `${transactions[transactionIndex].transactionItems[transactionItemsIndex].activation}`;
                } else {
                    content += `None`;
                }
                content += `</span>
                   </div><!-- end col-xs-12 col-sm-6 col-md-4 -->
                   <div class="col-xs-12 col-sm-6 col-md-4">
                       <strong>Attach (Yes/No):</strong>
                       <span style="margin-left: 5px;">${transactions[transactionIndex].transactionItems[transactionItemsIndex].attached === 1 ? 'Yes' : 'No'}</span>
                   </div><!-- end col-xs-12 col-sm-6 col-md-4 -->
                   <div class="col-xs-12 col-sm-6 col-md-4">
                       <strong>Device Type:</strong>
                       <span style="margin-left: 5px;">`;
                if (transactions[transactionIndex].transactionItems[transactionItemsIndex].device) {
                    content += `${transactions[transactionIndex].transactionItems[transactionItemsIndex].device}`;
                } else {
                    content += `None`;
                }
                content += `</span>
                   </div><!-- end col-xs-12 col-sm-6 col-md-4 -->
                   <div class="col-xs-12 col-sm-6 col-md-4">
                       <strong>Revenue:</strong>
                       <span style="margin-left: 5px;">${transactions[transactionIndex].transactionItems[transactionItemsIndex].revenue.toLocaleString('en-CA', {
                    style: 'currency',
                    currency: 'CAD'
                })}</span>
                   </div><!-- end col-xs-12 col-sm-6 col-md-4 -->
                   <div class="col-xs-12 col-sm-6 col-md-4">
                       <strong>SBS Activation (Yes/No):</strong>
                       <span style="margin-left: 5px;">${transactions[transactionIndex].transactionItems[transactionItemsIndex].sbs_activation === 1 ? 'Yes' : 'No'}</span>
                   </div><!-- end col-xs-12 col-sm-6 col-md-4 -->
                   <div class="col-xs-12 col-sm-6 col-md-4">
                       <strong>Number of Accessories:</strong>
                       <span style="margin-left: 5px;">${transactions[transactionIndex].transactionItems[transactionItemsIndex].num_of_accessories}</span>
                   </div><!-- end col-xs-12 col-sm-6 col-md-4 -->
                   <div class="col-xs-12">
                       <hr />
                   </div><!-- end col-xs-12 -->
               `;
            }  //end for transactionItems
            //For each additionalMetric
            for (var additionalMetricIndex in transactions[transactionIndex].additionalMetricItems) {
                if (transactions[transactionIndex].additionalMetricItems[additionalMetricIndex].additional_metrics_items_type === 1) {
                    content += `
                           <div class="col-xs-12 col-sm-6 col-md-4">
                               <strong>Learning Sessions:</strong>
                               <span style="margin-left: 5px;">${transactions[transactionIndex].additionalMetricItems[additionalMetricIndex].additional_metrics_items_count}</span>
                           </div><!-- end col-xs-12 col-sm-6 col-md-4 -->
                       `;
                } //end if
                if (transactions[transactionIndex].additionalMetricItems[additionalMetricIndex].additional_metrics_items_type === 2) {
                    content += `
                           <div class="col-xs-12 col-sm-6 col-md-4">
                               <strong>AOTMs Sold:</strong>
                               <span style="margin-left: 5px;">${transactions[transactionIndex].additionalMetricItems[additionalMetricIndex].additional_metrics_items_count}</span>
                           </div><!-- end col-xs-12 col-sm-6 col-md-4 -->
                       `;
                } //end if
                if (transactions[transactionIndex].additionalMetricItems[additionalMetricIndex].additional_metrics_items_type === 3) {
                    content += `
                           <div class="col-xs-12 col-sm-6 col-md-4">
                               <strong>Appointments:</strong>
                               <span style="margin-left: 5px;">${transactions[transactionIndex].additionalMetricItems[additionalMetricIndex].additional_metrics_items_count}</span>
                           </div><!-- end col-xs-12 col-sm-6 col-md-4 -->
                       `;
                } //end if
                if (transactions[transactionIndex].additionalMetricItems[additionalMetricIndex].additional_metrics_items_type === 4) {
                    content += `
                           <div class="col-xs-12 col-sm-6 col-md-4">
                               <strong>Critters Sold:</strong>
                               <span style="margin-left: 5px;">${transactions[transactionIndex].additionalMetricItems[additionalMetricIndex].additional_metrics_items_count}</span>
                           </div><!-- end col-xs-12 col-sm-6 col-md-4 -->
                       `;
                } //end if

                if (transactions[transactionIndex].additionalMetricItems[additionalMetricIndex].additional_metrics_items_type === 5) {
                    content += `
                           <div class="col-xs-12 col-sm-6 col-md-4">
                               <strong>Donations:</strong>
                               <span style="margin-left: 5px;">${transactions[transactionIndex].additionalMetricItems[additionalMetricIndex].additional_metrics_items_count}</span>
                           </div><!-- end col-xs-12 col-sm-6 col-md-4 -->
                       `;
                } //end if
                if (transactions[transactionIndex].additionalMetricItems[additionalMetricIndex].additional_metrics_items_type === 6) {
                    content += `
                           <div class="col-xs-12 col-sm-6 col-md-4">
                               <strong>Credit Card Apps:</strong>
                               <span style="margin-left: 5px;">${transactions[transactionIndex].additionalMetricItems[additionalMetricIndex].additional_metrics_items_count}</span>
                           </div><!-- end col-xs-12 col-sm-6 col-md-4 -->
                       `;
                } //end if
            } //end for additionalMetricItems
            content += `
               <div class="col-xs-12"></div><!-- end col-xs-12 -->
               <div style="margin-top: 25px;" class="col-xs-6">
                   <div class="pull-left">
                       <strong>Time:</strong>
                       <span style="margin-left: 5px;">${new Date(transactions[transactionIndex].transaction_date).toLocaleTimeString()}</span>
                   </div><!-- end pull-left -->
               </div><!-- end col-xs-6 -->
               <div style="margin-top: 25px;" class="col-xs-6">
                   <div class="pull-right">
                       <strong>Completed By:</strong>
                       <span style="margin-left: 5px;">`;
            for (var userIndex in users) {
                if (users[userIndex].t_number === transactions[transactionIndex].t_number) {
                    content += `${users[userIndex].first_name} ${users[userIndex].last_name}`;
                } //end if
            } //end for
            content += `</span>
                   </div><!-- end pull-right -->
              </div><!-- end col-xs-6 -->
          </div><!-- end panel-body -->
       </div><!-- end panel-collapse collapse -->
   </div> <!-- end panel -->`;
        } //end for transactions

        $(`#transactionContainer${stores[storeIndex].store_id}`).html(content);
    } // end of stores for loop
} //end render transaction