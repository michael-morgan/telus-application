'use strict';

$(function () {
    validate();
    $('#skillid1, #behaviourid1').change(validate);
});

//Dynamically create behaviour textareas
function addBehaviour() {

    var behaviourContent = '<div class="behaviour">\
                                <div class="row">\
                                    <div class="col-xs-12 col-sm-3">\
                                        <div id="descName">Behaviour Description</div>\
                                    </div>\
                                    <div class="col-xs-12 col-sm-9 behaviourClass">\
                                        <textarea placeholder="Enter Behavior Description here..." maxlength="300" id="behaviourid' + count + '" name="behaviourid' + count + '" class="behaviourDescription"></textarea>\
                                    </div>\
                                </div>\
                            </div>';
    $('#behaviourSection').append(behaviourContent);
    $('#behaviourid' + count).change(validate);

    count++;
    validate();
}

//Delete function
function initiateDelete() {
    document.getElementById("Delete").style.display = "none";
    document.getElementById("addBehaviours").style.display = "none";
    document.getElementById("saveBehaviour").textContent = "Delete";
    document.getElementById("saveBehaviour").className = "form-btn btn btn-lg btn-danger btn-block";
    //Show checkboxes
    var divsToShow = document.getElementsByName("checkBoxes");
    for (var i = 0; i < deleteBehaviours.length; i++) {
        document.getElementById(deleteBehaviours[i]).checked = false; // uncheckbehaviours
    }
    for (var i = 0; i < divsToShow.length; i++) {
        divsToShow[i].style.display = "inline-block"; // depending on what you're doing
    }
}

function validate() {
    var isValid = function isValid() {
        for (var i = 1; i < count; i += 1) {
            if (i == 1) {
                if (!($('#skillid' + i).val().length > 0) || !($('#behaviourid' + i).val().length > 0)) {
                    return false;
                }
            } else {
                if (!($('#behaviourid' + i).val().length > 0)) {
                    return false;
                }
            }
        }
        return true;
    };

    $('#saveBehaviour').prop('disabled', !isValid());
}

//The save and delete are the same button, determine which and perform an action
function saveOrDeleteFunc() {
    if (document.getElementById("saveBehaviour").textContent == "Save") {
        document.getElementById("addBehaviourForm").submit();
    } else {

        var checkboxes = document.getElementsByClassName("skillOrBehaviourCheckbox");
        var skillCheckbox = document.getElementsByClassName("skillCheckbox");
        var behaviourCheckboxes = document.getElementsByClassName("behaviourCheckbox");
        var checkedBoxes = 0;

        for (var i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i].checked == true) {
                checkedBoxes++;
            }
        }
        //If the skill and all its behaviours are selected for deletion
        if (skillCheckbox[0].checked == true) bootbox.confirm("Are you sure you want to delete this skill and all of its behaviours?", function (result) {
            if (result == true) {
                //If the user clicks on "OK" in the confirmation box
                document.getElementById("addBehaviourForm").submit();
            }
        });
        //If there are behaviours selected for deletion, but not the skill
        else if (checkedBoxes > 0) {
                bootbox.confirm("Are you sure you want delete the behaviour(s)?", function (result) {
                    if (result == true) {
                        //If the user clicks on "OK" in the confirmation box
                        document.getElementById("addBehaviourForm").submit();
                    }
                });
            }

            //If the user does not select any items for deletion
            else {
                    bootbox.alert("You have not selected any items to delete.", function () {});
                }
    }
}

//# sourceMappingURL=add-behaviour.js.map