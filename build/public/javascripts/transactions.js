$(function() {
        loadButtons();
});

function loadButtons() {
    $('.btn-number').click(function (e) {
        e.preventDefault();

        fieldName = $(this).attr('data-field');
        type = $(this).attr('data-type');
        var input = $("input[name='" + fieldName + "']");
        var currentVal = parseInt(input.val());
        if (!isNaN(currentVal)) {
            if (type == 'minus') {

                if (currentVal > input.attr('min')) {
                    input.val(currentVal - 1).change();
                }
                if (parseInt(input.val()) == input.attr('min')) {
                    $(this).attr('disabled', true);
                }

            } else if (type == 'plus') {

                if (currentVal < input.attr('max')) {
                    input.val(currentVal + 1).change();
                }
                if (parseInt(input.val()) == input.attr('max')) {
                    $(this).attr('disabled', true);
                }

            }
        } else {
            input.val(0);
        }
    });
    $('.input-number').focusin(function () {
        $(this).data('oldValue', $(this).val());
    });
    $('.input-number').change(function () {

        minValue = parseInt($(this).attr('min'));
        maxValue = parseInt($(this).attr('max'));
        valueCurrent = parseInt($(this).val());

        name = $(this).attr('name');
        if (valueCurrent >= minValue) {
            $(".btn-number[data-type='minus'][data-field='" + name + "']").removeAttr('disabled')
        } else {
            alert('Sorry, the minimum value was reached');
            $(this).val($(this).data('oldValue'));
        }
        if (valueCurrent <= maxValue) {
            $(".btn-number[data-type='plus'][data-field='" + name + "']").removeAttr('disabled')
        } else {
            alert('Sorry, the maximum value was reached');
            $(this).val($(this).data('oldValue'));
        }


    });
    $(".input-number").keydown(function (e) {
        // Allow: backspace, delete, tab, escape, enter and .
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
                // Allow: Ctrl+A
            (e.keyCode == 65 && e.ctrlKey === true) ||
                // Allow: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)) {
            // let it happen, don't do anything
            return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    })
}


var count = 1;
function addDevices() {

    count++;
    var deviceFields = '<div class="single-device"><div class="form-group"><div class="col-sm-10 col-sm-offset-1"><span>Activation Type &nbsp;<select required="" id="activationDropdown' + count + '" name="activationDropdown' + count + '"><option disabled="" selected="" value="0">Select Activation Type</option><option value="1">New Activation</option><option value="2">Renewal</option><option value="3">Prepaid</option><option value="4">Outright</option></select></span><input type="checkbox" name="sbsActivation' + count + '">SBS Activation?</div></div><div class="form-group"><div class="col-sm-10 col-sm-offset-1"><span>Device Type &nbsp;<select required="" id="deviceDropdown' + count + '" name="deviceDropdown' + count + '"><option disabled="" selected="" value="0">Select Device Type</option><option value="1">iPhone</option><option value="2">Android</option><option value="3">Blackberry</option><option value="4">Other Device</option><option value="5">SIM</option><option value="6">Tablet</option><option value="7">iPad</option><option value="8">Mobile Internet</option></select></span></div></div><div class="form-group"><div class="col-sm-10 col-sm-offset-1"><span>Warranty Type &nbsp;<select required="" id="warrantyDropdown' + count + '" name="warrantyDropdown' + count + '"><option disabled="" selected="" value="0">Select Warranty Type</option><option value="1">Device Care</option><option value="2">Device Care &amp; T-UP</option><option value="3">AppleCare+</option><option value="4">AppleCare+ &amp; T-UP</option></select></span></div></div><div class="form-group"><div class="col-sm-10 col-sm-offset-1"><span>Attached? &nbsp;<select required="" id="attached' + count + '" name="attachedDropdown' + count + '"><option selected="" value="no">No</option><option value="yes">Yes</option></select></span></div></div><div class="form-group"><div class="col-sm-5 col-sm-offset-1 plus-minus-group"><div class="input-group">Number of Accessories<span class="input-group-btn"><button type="button" data-type="minus" data-field="accessoryCount' + count + '" class="btn btn-danger btn-number"><span class="glyphicon glyphicon-minus"></span></button></span><input type="number" name="accessoryCount' + count + '" value="0" min="0" max="100" class="form-control input-number"><span class="input-group-btn"><button type="button" data-type="plus" data-field="accessoryCount' + count + '" class="btn btn-success btn-number"><span class="glyphicon glyphicon-plus"></span></button></span></div></div></div></div>';
    $('.device-group').append(deviceFields);
    loadButtons();
}



