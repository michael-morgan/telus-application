$(function() {});

//Dynamically create behaviour textareas
function addBehaviour() {
    var comment = "Behaviour Description:";
    var newParagraph = document.createElement("P");
    newParagraph.textContent = comment;
    document.getElementById("Skillarea").appendChild(newParagraph);
    var textarea = document.createElement("TEXTAREA");
    textarea.class = "newTextArea";
    textarea.id = "behaviourid" + count;
    textarea.name = "behaviourid" + count;
    textarea.placeholder = "Enter Behavior Description here...";
    document.getElementById("Skillarea").appendChild(textarea);
    count++;
}

//Delete function
function initiateDelete() {
    document.getElementById("Delete").style.display = "none";
    document.getElementById("addBehaviours").style.display = "none";
    document.getElementById("saveBehaviour").textContent = "Delete";
    document.getElementById("saveBehaviour").className = "";
    document.getElementById("saveBehaviour").className = "form-btn btn btn-lg btn-danger";
    //Show checkboxes
    var divsToShow = document.getElementsByName("checkBoxes");
    for (var i = 0; i < deleteBehaviours.length; i++) {
        document.getElementById(deleteBehaviours[i]).checked = false; // uncheckbehaviours
    }
    for (var i = 0; i < divsToShow.length; i++) {
        divsToShow[i].style.display = "inline-block"; // depending on what you're doing
    }
}

