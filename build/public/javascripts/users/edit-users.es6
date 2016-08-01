function deleteUser() {
    //Confirmation modal that appears when a user attempts to delete another user from the modify users page
    bootbox.confirm("Are you sure you want to delete this user?", (result) => {
        if (result) {
            //If the user clicks on "OK" in the confirmation box
            document.getElementById("listUsersForm").submit();
        }
    });
}