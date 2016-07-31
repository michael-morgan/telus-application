'use strict';

$(function () {
    loadButtons();

    console.debug(warrentyObj);
    console.debug(deviceObj);
    console.debug(activationObj);
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
            $(".btn-number[data-type='minus'][data-field='" + name + "']").removeAttr('disabled');
        } else {
            alert('Sorry, the minimum value was reached');
            $(this).val($(this).data('oldValue'));
        }
        if (valueCurrent <= maxValue) {
            $(".btn-number[data-type='plus'][data-field='" + name + "']").removeAttr('disabled');
        } else {
            alert('Sorry, the maximum value was reached');
            $(this).val($(this).data('oldValue'));
        }
    });
    $(".input-number").keydown(function (e) {
        // Allow: backspace, delete, tab, escape, enter and .
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
        // Allow: Ctrl+A
        e.keyCode == 65 && e.ctrlKey === true ||
        // Allow: home, end, left, right
        e.keyCode >= 35 && e.keyCode <= 39) {
            // let it happen, don't do anything
            return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });
}

var count = 2;
function addDevices() {
    //Add device fields
    var deviceFields = '<div class="single-device" id="device' + count + '">\
                            <div class="form-group show-if-device">\
                                <div class="col-sm-4">\
                                    <h3 class="device show-if-device">Device  ' + count + '</h3>\
                                </div>\
                                <div class="col-sm-8">\
                                <a class="btn-remove pull-left btn btn-danger" id="remove' + count + '" onclick="removeDevice(' + count + ')">X</a>\
                                </div>\
                            </div>\
                            <div class="form-group show-if-device">\
                                <div class="col-sm-2 text-right transaction"><span class="transaction">Activation Type:</span></div>\
                                <div class="col-sm-10">\
                                    <select id="activationDropdown' + count + '" name="activationDropdown' + count + '" class="transact">\
                                        <option disabled="" selected="" value="0">Select Activation Type</option>\
                                        <option value="1">New Activation</option>\
                                        <option value="2">Renewal</option>\
                                        <option value="3">Prepaid</option>\
                                        <option value="4">Outright</option>\
                                    </select>\
                                    <div class="sbs"><input type="checkbox" name="sbsActivation' + count + '"><span>SBS Activation?</span></div>\
                                </div>\
                            </div>\
                            <!--Show only if transaction type is device-->\
                            <div class="form-group show-if-device">\
                                <div class="col-sm-2 text-right transaction"><span class="transaction">Device Type:</span></div>\
                                <div class="col-sm-10">\
                                    <select id="deviceDropdown' + count + '" name="deviceDropdown' + count + '" class="transact">\
                                        <option disabled="" selected="" value="0">Select Device Type</option>\
                                        <option value="1">iPhone</option>\
                                        <option value="2">Android</option>\
                                        <option value="3">Blackberry</option>\
                                        <option value="4">Other Device</option>\
                                        <option value="5">SIM</option>\
                                        <option value="6">Tablet</option>\
                                        <option value="7">iPad</option>\
                                        <option value="8">Mobile Internet</option>\
                                    </select>\
                                </div>\
                            </div>\
                            <!--Show only if transaction type is device-->\
                            <div class="form-group show-if-device">\
                                <div class="col-sm-2 text-right transaction"><span class="transaction">Warranty Type:</span></div>\
                                <div class="col-sm-10">\
                                    <select id="warrantyDropdown' + count + '" name="warrantyDropdown' + count + '" class="warrantyDropdown">\
                                        <option disabled="" selected="" value="0" class="transact">Select Warranty Type</option>\
                                        <option value="1">Device Care</option>\
                                        <option value="2">Device Care &amp; T-UP</option>\
                                        <option value="3">AppleCare+</option>\
                                        <option value="4">AppleCare+ &amp; T-UP</option>\
                                    </select>\
                                </div>\
                            </div>\
                            <!--Show only on all transaction types, but Accessory-->\
                            <div class="form-group show-if-not-accessory">\
                                <div class="col-sm-2 text-right transaction"><span class="transaction">Attached?</span></div>\
                                <div class="col-sm-10">\
                                    <select id="attached' + count + '" name="attachedDropdown' + count + '" class="transact">\
                                        <option selected="" value="no">No</option>\
                                        <option value="yes">Yes</option>\
                                    </select>\
                                </div>\
                            </div>\
                            <!--Show on all transaction types-->\
                            <div class="form-group show-on-all">\
                                <div class="col-sm-2 text-right transaction"><span class="transaction">Number of Accessories:</div></span>\
                                <div class="col-sm-10">\
                                    <input type="number" name="accessoryCount' + count + '" value="0" min="0" max="100" class="form-control input-number">\
                                </div>\
                            </div>\
                            <div class="form-group show-on-all" style="display: block">\
                                <div class="col-sm-2 text-right transaction">\
                                    <span class="transaction">Revenue:</span>\
                                </div>\
                                <div class="col-sm-10">\
                                    <input name="revenueText' + count + '" placeholder="Revenue" type="text" min="0" max="1000000" class="form-control formInput input-number">\
                                </div>\
                            </div>\
                        </div>';
    $('.device-group').append(deviceFields);
    count++;
    $('.show-if-device').attr('style', 'display: block');
    $('.show-if-not-accessory').attr('style', 'display: block');
    $('.show-on-all').attr('style', 'display: block');
}

function resetDevice() {
    var deviceFields = '<div class="single-device">\
                            <h3 class="device show-if-device">Device 1</h3>\
                                <div class="form-group show-if-device">\
                                    <div class="col-sm-2 text-right transaction"><span class="transaction">Activation Type:</span></div>\
                                        <div class="col-sm-10">\
                                            <select id="activationDropdown" name="activationDropdown" class="transact">\
                                                <option disabled="" selected="" value="0">Select Activation Type</option>\
                                                <option value="1">New Activation</option>\
                                                <option value="2">Renewal</option>\
                                                <option value="3">Prepaid</option>\
                                                <option value="4">Outright</option>\
                                            </select>\
                                        <div class="sbs"><input type="checkbox" name="sbsActivation"><span>SBS Activation?</span></div>\
                                    </div>\
                                </div>\
                        <!--Show only if transaction type is device-->\
                        <div class="form-group show-if-device">\
                            <div class="col-sm-2 text-right transaction"><span class="transaction">Device Type:</span></div>\
                            <div class="col-sm-10">\
                                <select id="deviceDropdown" name="deviceDropdown" class="transact">\
                                    <option disabled="" selected="" value="0">Select Device Type</option>\
                                    <option value="1">iPhone</option>\
                                    <option value="2">Android</option>\
                                    <option value="3">Blackberry</option>\
                                    <option value="4">Other Device</option>\
                                    <option value="5">SIM</option>\
                                    <option value="6">Tablet</option>\
                                    <option value="7">iPad</option>\
                                    <option value="8">Mobile Internet</option>\
                                </select>\
                            </div>\
                        </div>\
                        <!--Show only if transaction type is device-->\
                        <div class="form-group show-if-device">\
                            <div class="col-sm-2 text-right transaction"><span class="transaction">Warranty Type:</span></div>\
                            <div class="col-sm-10">\
                                <select id="warrantyDropdown" name="warrantyDropdown" class="warrantyDropdown">\
                                    <option disabled="" selected="" value="0" class="transact">Select Warranty Type</option>\
                                    <option value="1">Device Care</option>\
                                    <option value="2">Device Care &amp; T-UP</option>\
                                    <option value="3">AppleCare+</option>\
                                    <option value="4">AppleCare+ &amp; T-UP</option>\
                                </select>\
                            </div>\
                        </div>\
                        <!--Show only on all transaction types, but Accessory-->\
                        <div class="form-group show-if-not-accessory">\
                            <div class="col-sm-2 text-right transaction"><span class="transaction">Attached?</span></div>\
                            <div class="col-sm-10">\
                                <select id="attached" name="attachedDropdown" class="transact">\
                                    <option selected="" value="no">No</option>\
                                    <option value="yes">Yes</option>\
                                </select>\
                            </div>\
                        </div>\
                        <!--Show on all transaction types-->\
                        <div class="form-group show-on-all">\
                            <div class="col-sm-2 text-right transaction"><span class="transaction">Number of Accessories:</div></span>\
                                <div class="col-sm-10">\
                                    <input type="number" name="accessoryCount" value="0" min="0" max="100" class="form-control input-number">\
                                </div>\
                            </div>\
                        <div class="form-group show-on-all" style="display: block">\
                            <div class="col-sm-2 text-right transaction">\
                                    <span class="transaction">Revenue:</span>\
                            </div>\
                            <div class="col-sm-10">\
                                <input name="revenueText" placeholder="Revenue" type="text" min="0" max="1000000" class="form-control formInput input-number">\
                            </div>\
                        </div>\
                        </div>';
    $('.device-group').html(deviceFields);
    count = 2;
}

$("#transactionDropdown").change(function () {
    var selector = document.getElementById('transactionDropdown');
    if (selector.value == "1") {
        $('.show-if-device').attr('style', 'display: block');
    } else if (selector.value == "2") {
        $('.show-if-not-accessory').attr('style', 'display: none');
        $('.show-if-device').attr('style', 'display: none');
    }
    if (selector.value != "1") {
        $('.show-if-device').attr('style', 'display: none');
        resetDevice();
    }
    if (selector.value != "2") {
        $('.show-if-not-accessory').attr('style', 'display: block');
    }
    $('.show-on-all').attr('style', 'display: block');
});

//This function is called when the user presses the cancel button while adding a transaction
function cancelButton() {
    window.location.href = '/users/transactions';
};

function removeDevice(id) {
    $('#device' + id).remove();
    count--;
};

//# sourceMappingURL=add-transactions.js.map