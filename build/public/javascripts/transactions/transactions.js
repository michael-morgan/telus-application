$(function() {
    $('input[name="dateRange"]').daterangepicker();

    console.debug(storeObj);
});

function deleteTransaction(id) {
    alert('Are you sure you want to delete this transaction?');
    $.post("/", {'id': id}).done(function(result) {
        $('#transactionID' + id).remove();
    });
}