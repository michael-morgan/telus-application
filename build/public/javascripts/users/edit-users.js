'use strict';

var privileges;

var tNumberInput, firstNameInput, lastNameInput, emailInput, titleInput;

// document.ready
$(function () {
    tNumberInput = $('#tNumberInput');
    firstNameInput = $('#firstNameInput');
    lastNameInput = $('#lastNameInput');
    emailInput = $('#emailInput');
    titleInput = $('#titleInput');

    $('#editModal').on('shown.bs.modal', function () {
        tNumberInput.focus();
    });

    $('[data-toggle="tooltip"]').tooltip();

    privileges = [{ name: 'Employee', value: 1 }, { name: 'Assistant Manager', value: 2 }, { name: 'Manager', value: 3 }, { name: 'Area Manager', value: 4 }];
});

function populateEditModal(rowId) {
    tNumberInput.val($(rowId)[0].children[0].textContent);
    firstNameInput.val($(rowId)[0].children[1].textContent);
    lastNameInput.val($(rowId)[0].children[2].textContent);
    emailInput.val($(rowId)[0].children[3].textContent);
    titleInput.val(privileges.find(function (privilege) {
        return privilege.name == $(rowId)[0].children[4].textContent;
    }).value);

    $('#editModal').modal('show');
}

function updateUser() {
    $.post("/users/edit", {
        t_number: tNumberInput.val(),
        first_name: firstNameInput.val(),
        last_name: lastNameInput.val(),
        email: emailInput.val(),
        title: titleInput.val(),
        password: $('#passwordInput').val()
    }).done(function (result) {
        var data = JSON.parse(result);
        populateRow('#userRow' + data.t_number, data);
    });
}

// possible functionality
function clearEditModal() {}

function populateRow(rowId, data) {
    $(rowId).html('\n        <td>' + data.t_number + '</td>\n        <td>' + data.first_name + '</td>\n        <td>' + data.last_name + '</td>\n        <td>' + data.email + '</td>\n        <td>' + privileges.find(function (privilege) {
        return privilege.value == data.title;
    }).name + '</td>\n        <td>\n            <a class="btn btn-primary" href="#" aria-label="Edit" onclick=\'populateEditModal("#userRow' + data.t_number + '")\'>\n                <i class="fa fa-pencil-square-o" aria-hidden="true"></i>\n            </a>\n        </td>\n        <td>\n            <input class="form-control" name=\'remove' + data.t_number + '\' type="checkbox">\n        </td>\n    ');
}

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