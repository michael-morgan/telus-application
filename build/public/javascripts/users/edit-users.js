"use strict";

function deleteUser() {
    //Confirmation modal that appears when a user attempts to delete another user from the modify users page
    bootbox.confirm("Are you sure you want to delete this user?", function (result) {
        if (result) {
            //If the user clicks on "OK" in the confirmation box
            document.getElementById("listUsersForm").submit();
        }
    });
}

//# sourceMappingURL=edit-users.js.map