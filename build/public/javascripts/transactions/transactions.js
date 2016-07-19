$(function() {
    console.debug(storeObj);
    //Hide the delete message until a transaction has been removed
    $('#deleteMessage').hide();
    //Fade out success message after 5 secconds
    $('#successMessage').fadeOut(5000);

    var teamDropdown = $("#teamMember");

    teamDropdown.change(function () {
        var teamMember = $('#teamMember');
        console.log(teamMember.val());
        //selector.value

        renderTransactions(storeObj[0].transactions.filter(function(transaction) {
            return transaction.t_number == teamMember.val();
        }));
    });

    teamDropdown.trigger('change');
});
$('input[name="dateRange"]').daterangepicker(
    {
        locale: {
            format: 'MMMM D, YYYY'
        }
    },
    function(start, end, label) {
        alert("A new date range was chosen: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
    }
);

function deleteTransaction(id) {
    bootbox.confirm("Are you sure you want to delete this transaction?", function(result) {
        if (result == true)
        {
            $.post("/users/transactions", {'id': id}).done(function(result) {
                $('#transactionID' + id).remove();
                $('#deleteMessage').show();
                $('#removalMessage').html("The transaction was successfully deleted.");
                $('#deleteMessage').fadeOut(5000);
            });
        }
    });
}

function renderTransactions(transactions) {
    var content = '';

    for(var transactionIndex in transactions) {
        content += `
            <div id="transactionID${transactions[transactionIndex].transaction_id}" class="panel">
                <div class="panel-heading" id="purpleHead">
                    <div role="tab" class="row" id="transactionHeading${transactions[transactionIndex].transaction_id}", data-toggle"collapse", data-target="#transactionCollapse${transactions[transactionIndex].transaction_id}">
                       <div class="col-xs-4">
                            <h4 class="panel-title">${new Date(transactions[transactionIndex].transaction_date).toLocaleDateString()}</h4>
                       </div><!-- end col-xs-4 -->

                       <div class="col-xs-4 text-center">
                            <h4 class="panel-title">${transactions.transactionItems.length} Item(s)</h4>
                       </div><!-- end col-xs-4 text-center -->

                       <div class="col-xs-4">
                            <div class="pull-right">
                                <div style="padding:0;" class="col-xs-8">
                                     <h4 class="panel-title">${transactions.totalRevenue.toLocaleString('en-CA', { style: 'currency', currency: 'CAD' })}</h4>
                                </div><!-- end col-xs-8 -->
                                 <div style="padding:0;" class="col-xs-4">
                                     if user.privileged >= 3
                                </div><!-- end col-xs-8 -->
                            </div><!-- end pull-right -->
                       </div><!-- end col-xs-4 -->

                    </div><!-- end row -->
                </div><!-- end panel heading -->
            </div> <!-- end panel -->
        `;
    }

    $('#transactionContainer').html(content);
    /*
    each transaction, transIndex in stores[storeIndex].transactions

    .col-xs-4.text-center
        h4.panel-title
        | #{transaction.transactionItems.length} Item(s)
            .col-xs-4
            .pull-right
            .col-xs-8(style='padding:0;')
        h4.panel-title
        | #{transaction.totalRevenue.toLocaleString('en-CA', { style: 'currency', currency: 'CAD' })}
    .col-xs-4(style='padding:0;')
    if user.privileged >= 3
        .dropdown(style='margin-top:6px;')
        a.dropdown-toggle#ddMoreOptions(type='button', data-toggle='dropdown', aria-haspopup='true' aria-expanded='true')
    i.fa.fa-ellipsis-v.fa-2x(aria-hidden='true')
    ul.dropdown-menu(aria-labelledby='ddMoreOptions')
    li
    a(href='#' onclick='deleteTransaction(#{transaction.transaction_id})')
    | Remove Transaction
        .panel-collapse.collapse(role='tabpanel', aria-labelledby='transactionHeading#{transaction.transaction_id}', id='transactionCollapse#{transaction.transaction_id}')
        .panel-body
    each transactionItem, transItemIndex in transaction.transactionItems
        .col-xs-12.col-sm-6.col-md-4
    strong Transaction Type:
        span(style='margin-left: 5px;') #{transactionItem.transactionType}
            .col-xs-12.col-sm-6.col-md-4
    strong Warranty Type:
        span(style='margin-left: 5px;') #{transactionItem.warranty}
            .col-xs-12.col-sm-6.col-md-4
    strong Sale Type:
        span(style='margin-left: 5px;') #{transactionItem.activation}
            .col-xs-12.col-sm-6.col-md-4
    strong Attach (Yes/No):
    span(style='margin-left: 5px;') #{transactionItem.attachments === 1 ? 'Yes' : 'No'}
        .col-xs-12.col-sm-6.col-md-4
    strong Device Type:
        span(style='margin-left: 5px;') #{transactionItem.device}
            .col-xs-12.col-sm-6.col-md-4
    strong Revenue:
        span(style='margin-left: 5px;') #{transactionItem.revenue.toLocaleString('en-CA', { style: 'currency', currency: 'CAD' })}
    .col-xs-12.col-sm-6.col-md-4
    strong SBS Activation (Yes/No):
    span(style='margin-left: 5px;') #{transactionItem.sbs_activation === 1 ? 'Yes' : 'No'}
        .col-xs-12.col-sm-6.col-md-4
    strong Number of Accessories:
        span(style='margin-left: 5px;') #{transactionItem.number_of_accessories}
            .col-xs-12
    hr
    each learning, learningIndex in transaction.additionalMetricItems
    if learning.additional_metrics_items_type === 1
        .col-xs-12.col-sm-6.col-md-4
    strong Learning Sessions:
        span(style='margin-left: 5px;')
        | #{learning.additional_metrics_items_count}
    if learning.additional_metrics_items_type === 2
        .col-xs-12.col-sm-6.col-md-4
    strong AOTMs Sold:
        span(style='margin-left: 5px;')
        | #{learning.additional_metrics_items_count}
    if learning.additional_metrics_items_type === 4
        .col-xs-12.col-sm-6.col-md-4
    strong Critters Sold:
        span(style='margin-left: 5px;')
        | #{learning.additional_metrics_items_count}
    if learning.additional_metrics_items_type === 6
        .col-xs-12.col-sm-6.col-md-4
    strong Credit Card Apps:
        span(style='margin-left: 5px;')
        | #{learning.additional_metrics_items_count}
    if learning.additional_metrics_items_type === 3
        .col-xs-12.col-sm-6.col-md-4
    strong Appointments:
        span(style='margin-left: 5px;')
        | #{learning.additional_metrics_items_count}
    if learning.additional_metrics_items_type === 5
        .col-xs-12.col-sm-6.col-md-4
    strong Donations:
        span(style='margin-left: 5px;')
        | #{learning.additional_metrics_items_count}
    .col-xs-12(style='padding: 0;')
        .col-xs-6(style='margin-top: 25px;')
        .pull-left
    strong Date:
        span(style='margin-left: 5px;') #{transaction.transaction_date.toLocaleDateString()}
            .col-xs-6(style='margin-top: 25px;')
            .pull-right
    strong Completed By:
        span(style='margin-left: 5px;')
    each user, userIndex in users
    if user.t_number === transaction.t_number
    | #{user.first_name} #{user.last_name}
*/
}