$(function() {});

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

    count++;
}

//Delete function
function initiateDelete() {
    document.getElementById("Delete").style.display = "none";
    document.getElementById("addBehaviours").style.display = "none";
    document.getElementById("saveBehaviour").textContent = "Delete";
    document.getElementById("saveBehaviour").className = "form-btn btn btn-lg btn-danger customButton";
    //Show checkboxes
    var divsToShow = document.getElementsByName("checkBoxes");
    for (var i = 0; i < deleteBehaviours.length; i++) {
        document.getElementById(deleteBehaviours[i]).checked = false; // uncheckbehaviours
    }
    for (var i = 0; i < divsToShow.length; i++) {
        divsToShow[i].style.display = "inline-block"; // depending on what you're doing
    }
}

