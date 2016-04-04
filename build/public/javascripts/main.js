/**
 * Created by Bradley on 3/18/2016.
 */
$(function() {


    //When an unchecked thumb is clicked in the add-observation page
    $( ".unchecked" ).click(function() {
        //Remove the "active" class from all other thumbs
        $( ".btn").removeClass('active');

        //When the user selects a behaviour, the submit button is enabled and the observation can be submitted.
        if($("#employeeDropdown option:selected").text() != "Select Employee") {
            $("#submitObservation").removeClass('disabled')
            $("#submitObservation").addClass('btn-success')
            var submitButton = document.getElementById("submitObservation").type = "submit";
        }

        $('#employeeDropdown').change(function() {
            $("#submitObservation").removeClass('disabled')
            $("#submitObservation").addClass('btn-success')
            var submitButton = document.getElementById("submitObservation").type = "submit";
        });
    });
});