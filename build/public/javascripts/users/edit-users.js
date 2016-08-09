'use strict';

var privileges;

var tNumberInput, firstNameInput, lastNameInput, emailInput, titleInput;

var T_NUMBER_INDEX = 0,
    FIRST_NAME_INDEX = 1,
    LAST_NAME_INDEX = 2,
    EMAIL_INDEX = 3,
    TITLE_INDEX = 4;

var stores;

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

    // initialize store object
    stores = {};
    usersObj.forEach(function (user) {
        stores[user.t_number] = user.stores;
    });

    $('#storeSelect').change(function (event) {
        var target = $(event.currentTarget[event.target.selectedIndex]);
        var name = target[0].text,
            id = target[0].value;

        addStoreListItem(name, id);
        $('#storeSelect').val('0');
    });
});

function addStoreListItem(name, id) {
    var t_number = tNumberInput.val();

    if (stores[t_number].filter(function (store) {
        return store.store_id == id;
    }).length == 0) {
        stores[t_number].push({ store_id: id });
        $('#storeList').append(getStoreListItem(name, id));
    }
}

function getStoreListItem(name, id) {
    return '\n        <li class="list-group-item" id="storeListItem' + id + '">\n            <span>' + name + '</span>\n            <i class="fa fa-times-circle fa-2x pull-right" style="margin-top: -2px;" onclick="removeStoreListItem(' + id + ')"></i>\n        </li>\n    ';
}

function removeStoreListItem(id) {
    var t_number = tNumberInput.val();

    stores[t_number].splice(stores[t_number].findIndex(function (store) {
        return store.store_id == id;
    }), 1);
    $('#storeListItem' + id).remove();
}

function updateStoreListItems(t_number) {
    // reset store list
    $('#storeList').html('');

    var storeSelect = [].slice.call($('#storeSelect')[0].children);

    stores[t_number].forEach(function (store) {
        $('#storeList').append(getStoreListItem(storeSelect[storeSelect.findIndex(function (selectStore) {
            return selectStore.value == store.store_id;
        })].text, store.store_id));
    });
}

function populateEditModal(rowId) {
    tNumberInput.val($(rowId)[0].children[T_NUMBER_INDEX].textContent);
    firstNameInput.val($(rowId)[0].children[FIRST_NAME_INDEX].textContent);
    lastNameInput.val($(rowId)[0].children[LAST_NAME_INDEX].textContent);
    emailInput.val($(rowId)[0].children[EMAIL_INDEX].textContent);
    titleInput.val(privileges.find(function (privilege) {
        return privilege.name == $(rowId)[0].children[TITLE_INDEX].textContent;
    }).value);

    updateStoreListItems(tNumberInput.val());

    $('#editModal').modal('show');
}

function updateUser() {
    $.post("/users/edit", {
        t_number: tNumberInput.val(),
        first_name: firstNameInput.val(),
        last_name: lastNameInput.val(),
        email: emailInput.val(),
        title: titleInput.val(),
        password: $('#passwordInput').val(),
        stores: JSON.stringify(stores[tNumberInput.val()])
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