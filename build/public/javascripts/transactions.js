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
    var deviceFields = '<div class="device-group"><div class="single-device"><h3 class="device">Device #</h3><div class="form-group"><div class="col-sm-1 col-sm-offset-1 text-right"><span class="transaction">Activation Type:</span></div><div class="col-sm-10"><select required="required" id="activationDropdown" name="activationDropdown" class="transact"><option disabled="disabled" selected="selected" value="0">Select Activation Ty</option></select><input type="checkbox" name="sbsActivation"/>SBS Activation?</div></div><div class="form-group"><div class="col-sm-1 col-sm-offset-1 text-right"><span class="transaction">Device Type:</span></div><div class="col-sm-10"><select required="required" id="deviceDropdown" name="deviceDropdown" class="transact"><option disabled="disabled" selected="selected" value="0">Select Device Type</option></select></div></div><div class="form-group"><div class="col-sm-1 col-sm-offset-1 text-right"><span class="transaction">Warranty Type:</span></div><div class="col-sm-10"><select required="required" id="warrantyDropdown" name="warrantyDropdown"><option disabled="disabled" selected="selected" value="0" class="transact">Select Warranty Type</option></select></div></div><div class="form-group"><div class="col-sm-1 col-sm-offset-1 text-right"><span class="transaction">Attached?</span></div><div class="col-sm-10"><select required="required" id="attached" name="attachedDropdown" class="transact"><option selected="selected" value="no">No</option><option value="yes">Yes</option></select></div></div><div class="form-group"><div class="col-sm-3 plus-minus-group move"><div class="input-group">Number of Accessories:&nbsp<span class="input-group-btn"><button type="button" data-type="minus" data-field="accessoryCount" class="btn btn-danger btn-number"><span class="glyphicon glyphicon-minus"></span></button></span><input type="number" name="accessoryCount" value="0" min="0" max="100" class="form-control input-number plusminus"/><span class="input-group-btn"><button type="button" data-type="plus" data-field="accessoryCount" class="btn btn-success btn-number whitespace"><span class="glyphicon glyphicon-plus"></span></button></span></div></div></div></div></div>';
    $('.device-group').append(deviceFields);
    loadButtons();
}




