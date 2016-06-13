$(function() {

    //When an unchecked thumb is clicked in the add-observation page
    $('.btn').click(function() {
        var submitButton = $("#submitObservation");

        //Remove the "active" class from all other thumbs
        $('.btn').removeClass('active');

        //When the user selects a behaviour, the submit button is enabled and the observation can be submitted.
        if($('#employeeDropdown option:selected').text() != "Select Employee") {
            submitButton.removeClass('disabled');
            submitButton.addClass('btn-success');
            document.getElementById('submitObservation').type = "submit";
        }

        $('#employeeDropdown').change(function() {
            var submitButton = $("#submitObservation");
            submitButton.removeClass('disabled');
            submitButton.addClass('btn-success');
            document.getElementById('submitObservation').type = "submit";
        });
    });

    $('.panel-title').click(function() {
        $(this).parent().toggleClass('active');
    });

});