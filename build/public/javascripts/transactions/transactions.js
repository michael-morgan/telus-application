$(function() {
    console.debug(storeObj);
    console.debug(userObj);
    //Hide the delete message until a transaction has been removed
    $('#deleteMessage').hide();
    //Fade out success message after 5 secconds
    $('#successMessage').fadeOut(5000);

    var teamDropdown = $("#teamMember");

    teamDropdown.change(function () {
        var teamMember = $('#teamMember');
        console.log(teamMember.val());
        //selector.value

        renderTransactions(userObj, storeObj[0].privileged, storeObj[0].transactions.filter(function(transaction) {
            if(teamMember.val() == 'all') {
                return transaction.t_number != teamMember.val();
            } else{
                return transaction.t_number == teamMember.val();
            }
        }));
    });

    teamDropdown.trigger('change');
});
$('input[name="dateRange"]').daterangepicker({
        locale: {
            format: 'MMMM D, YYYY'
        }
    },
    function(start, end, label) {
        alert("A new date range was chosen: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
    }
);

/**
 *
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
    }) //end confirm;
} //end deleteTransaction

/**
 * This method filter the transactions history by filtering though the array
 * @param privileged Logged in users privilege level
 * @param transactions Transaction array
 */
function renderTransactions(users, privileged, transactions) {
    var content = '';
    //For each transaction
    for(var transactionIndex in transactions) {
        //content hold all the HTML for the filtered array
        content += `
            <div id="transactionID${transactions[transactionIndex].transaction_id}" class="panel">
                <div class="panel-heading purpleHead">
                    <div role="tab" class="row" id="transactionHeading${transactions[transactionIndex].transaction_id}" data-toggle="collapse" data-target="#transactionCollapse${transactions[transactionIndex].transaction_id}">
                       <div class="col-xs-4">
                            <h4 class="panel-title">${new Date(transactions[transactionIndex].transaction_date).toLocaleDateString()}</h4>
                       </div><!-- end col-xs-4 -->

                       <div class="col-xs-4 text-center">
                            <h4 class="panel-title">${transactions[transactionIndex].transactionItems.length} Item(s)</h4>
                       </div><!-- end col-xs-4 text-center -->

                       <div class="col-xs-4">
                            <div class="pull-right">
                                <div style="padding:0;" class="col-xs-8">
                                     <h4 class="panel-title">${transactions[transactionIndex].totalRevenue.toLocaleString('en-CA', { style: 'currency', currency: 'CAD' })}</h4>
                                </div><!-- end col-xs-8 -->
                                <div style="padding:0;" class="col-xs-4">`;
                                     console.log(privileged);
                                     if(privileged >= 3){
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
                <div class="panel-collapse collapse" role="tabpanel" aria-labelledby="transactionHeading${transactions[transactionIndex].transaction_id}" id="transactionCollapse${transactions[transactionIndex].transaction_id}">
                    <div class="panel-body">`;
                    //For each transactionItem in a trasactions
                    for(var transactionItemsIndex in transactions[transactionIndex].transactionItems){
                    content += `
                        <div class="col-xs-12 col-sm-6 col-md-4">
                            <strong>Transaction Type:</strong>
                            <span style="margin-left: 5px;">${transactions[transactionIndex].transactionItems[transactionItemsIndex].transactionType}</span>
                        </div><!-- end col-xs-12 col-sm-6 col-md-4 -->
                        <div class="col-xs-12 col-sm-6 col-md-4">
                            <strong>Warranty Type:</strong>
                            <span style="margin-left: 5px;">`;
                            if(transactions[transactionIndex].transactionItems[transactionItemsIndex].warranty) {
                                content += `${transactions[transactionIndex].transactionItems[transactionItemsIndex].warranty}`;
                            } else {
                                content += `None`;
                            }
                            content += `</span>
                        </div><!-- end col-xs-12 col-sm-6 col-md-4 -->
                        <div class="col-xs-12 col-sm-6 col-md-4">
                            <strong>Sale Type:</strong>
                            <span style="margin-left: 5px;">`;
                            if(transactions[transactionIndex].transactionItems[transactionItemsIndex].activation) {
                                content += `${transactions[transactionIndex].transactionItems[transactionItemsIndex].activation}`;
                            } else {
                                content += `None`;
                            }
                        content +=`</span>
                        </div><!-- end col-xs-12 col-sm-6 col-md-4 -->
                        <div class="col-xs-12 col-sm-6 col-md-4">
                            <strong>Attach (Yes/No):</strong>
                            <span style="margin-left: 5px;">${transactions[transactionIndex].transactionItems[transactionItemsIndex].attached  === 1 ? 'Yes' : 'No'}</span>
                        </div><!-- end col-xs-12 col-sm-6 col-md-4 -->
                        <div class="col-xs-12 col-sm-6 col-md-4">
                            <strong>Device Type:</strong>
                            <span style="margin-left: 5px;">`;
                            if(transactions[transactionIndex].transactionItems[transactionItemsIndex].device) {
                                content += `${transactions[transactionIndex].transactionItems[transactionItemsIndex].device}`;
                            } else {
                                content += `None`;
                            }
                            content += `</span>
                        </div><!-- end col-xs-12 col-sm-6 col-md-4 -->
                        <div class="col-xs-12 col-sm-6 col-md-4">
                            <strong>Revenue:</strong>
                            <span style="margin-left: 5px;">${transactions[transactionIndex].transactionItems[transactionItemsIndex].revenue.toLocaleString('en-CA', { style: 'currency', currency: 'CAD' })}</span>
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
                    for(var additionalMetricIndex in transactions[transactionIndex].additionalMetricItems){
                        if(transactions[transactionIndex].additionalMetricItems[additionalMetricIndex].additional_metrics_items_type === 1){
                            content += `
                                <div class="col-xs-12 col-sm-6 col-md-4">
                                    <strong>Learning Sessions:</strong>
                                    <span style="margin-left: 5px;">${transactions[transactionIndex].additionalMetricItems[additionalMetricIndex].additional_metrics_items_count}</span>
                                </div><!-- end col-xs-12 col-sm-6 col-md-4 -->
                            `;
                        } //end if
                        if(transactions[transactionIndex].additionalMetricItems[additionalMetricIndex].additional_metrics_items_type=== 2){
                            content += `
                                <div class="col-xs-12 col-sm-6 col-md-4">
                                    <strong>AOTMs Sold:</strong>
                                    <span style="margin-left: 5px;">${transactions[transactionIndex].additionalMetricItems[additionalMetricIndex].additional_metrics_items_count}</span>
                                </div><!-- end col-xs-12 col-sm-6 col-md-4 -->
                            `;
                        } //end if
                        if(transactions[transactionIndex].additionalMetricItems[additionalMetricIndex].additional_metrics_items_type === 3){
                            content += `
                                <div class="col-xs-12 col-sm-6 col-md-4">
                                    <strong>Appointments:</strong>
                                    <span style="margin-left: 5px;">${transactions[transactionIndex].additionalMetricItems[additionalMetricIndex].additional_metrics_items_count}</span>
                                </div><!-- end col-xs-12 col-sm-6 col-md-4 -->
                            `;
                        } //end if
                        if(transactions[transactionIndex].additionalMetricItems[additionalMetricIndex].additional_metrics_items_type === 4){
                            content += `
                                <div class="col-xs-12 col-sm-6 col-md-4">
                                    <strong>Critters Sold:</strong>
                                    <span style="margin-left: 5px;">${transactions[transactionIndex].additionalMetricItems[additionalMetricIndex].additional_metrics_items_count}</span>
                                </div><!-- end col-xs-12 col-sm-6 col-md-4 -->
                            `;
                        } //end if

                        if(transactions[transactionIndex].additionalMetricItems[additionalMetricIndex].additional_metrics_items_type === 5){
                            content += `
                                <div class="col-xs-12 col-sm-6 col-md-4">
                                    <strong>Donations:</strong>
                                    <span style="margin-left: 5px;">${transactions[transactionIndex].additionalMetricItems[additionalMetricIndex].additional_metrics_items_count}</span>
                                </div><!-- end col-xs-12 col-sm-6 col-md-4 -->
                            `;
                        } //end if
                        if(transactions[transactionIndex].additionalMetricItems[additionalMetricIndex].additional_metrics_items_type === 6){
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
                            <span style="margin-left: 5px;">${new Date(transactions[transactionIndex].transaction_date).toLocaleDateString()}</span>
                        </div><!-- end pull-left -->
                    </div><!-- end col-xs-6 -->
                    <div style="margin-top: 25px;" class="col-xs-6">
                        <div class="pull-right">
                            <strong>Completed By:</strong>
                            <span style="margin-left: 5px;">`;
                            for(var userIndex in users){
                                if(users[userIndex].t_number === transactions[transactionIndex].t_number){
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

    $('#transactionContainer').html(content);
}