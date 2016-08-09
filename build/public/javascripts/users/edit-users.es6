var privileges;

var tNumberInput, firstNameInput, lastNameInput,
    emailInput, titleInput;

const T_NUMBER_INDEX = 0, FIRST_NAME_INDEX = 1, LAST_NAME_INDEX = 2,
    EMAIL_INDEX = 3, TITLE_INDEX = 4;

var stores;

// document.ready
$(() => {
    tNumberInput = $('#tNumberInput');
    firstNameInput = $('#firstNameInput');
    lastNameInput = $('#lastNameInput');
    emailInput = $('#emailInput');
    titleInput = $('#titleInput');

    $('#editModal').on('shown.bs.modal', () => {
        tNumberInput.focus();
    });

    $('[data-toggle="tooltip"]').tooltip();

    privileges = [{name: 'Employee', value: 1}, {name: 'Assistant Manager', value: 2},
                {name: 'Manager', value: 3}, {name: 'Area Manager', value: 4}];

    // initialize store object
    stores = {};
    usersObj.forEach((user) => {
        stores[user.t_number] = user.stores;
    });

    $('#storeSelect').change((event) => {
        let target = $(event.currentTarget[event.target.selectedIndex]);
        let name = target[0].text, id = target[0].value;

        addStoreListItem(name, id);
        $('#storeSelect').val('0');
    });
});

function addStoreListItem(name, id) {
    let t_number = tNumberInput.val();

    if(stores[t_number].filter((store) => store.store_id == id).length == 0) {
        stores[t_number].push({store_id: id});
        $('#storeList').append(getStoreListItem(name, id));
    }
}

function getStoreListItem(name, id) {
    return `
        <li class="list-group-item" id="storeListItem${id}">
            <span>${name}</span>
            <i class="fa fa-times-circle fa-2x pull-right" style="margin-top: -2px;" onclick="removeStoreListItem(${id})"></i>
        </li>
    `;
}

function removeStoreListItem(id) {
    let t_number = tNumberInput.val();

    stores[t_number].splice(stores[t_number].findIndex((store) => store.store_id == id), 1);
    $(`#storeListItem${id}`).remove();
}

function updateStoreListItems(t_number) {
    // reset store list
    $('#storeList').html('');

    let storeSelect = [].slice.call($('#storeSelect')[0].children);

    stores[t_number].forEach((store) => {
        $('#storeList').append(getStoreListItem(
            storeSelect[storeSelect.findIndex((selectStore) => selectStore.value == store.store_id)].text,
            store.store_id
        ));
    });
}

function populateEditModal(rowId) {
    tNumberInput.val($(rowId)[0].children[T_NUMBER_INDEX].textContent);
    firstNameInput.val($(rowId)[0].children[FIRST_NAME_INDEX].textContent);
    lastNameInput.val($(rowId)[0].children[LAST_NAME_INDEX].textContent);
    emailInput.val($(rowId)[0].children[EMAIL_INDEX].textContent);
    titleInput.val(privileges.find((privilege) => privilege.name == $(rowId)[0].children[TITLE_INDEX].textContent).value);

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
    }).done(function(result) {
        let data = JSON.parse(result);
        populateRow(`#userRow${data.t_number}`, data);
    });
}

// possible functionality
function clearEditModal() {}

function populateRow(rowId, data) {
    $(rowId).html(`
        <td>${data.t_number}</td>
        <td>${data.first_name}</td>
        <td>${data.last_name}</td>
        <td>${data.email}</td>
        <td>${privileges.find((privilege) => privilege.value == data.title).name}</td>
        <td>
            <a class="btn btn-primary" href="#" aria-label="Edit" onclick='populateEditModal("#userRow${data.t_number}")'>
                <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
            </a>
        </td>
        <td>
            <input class="form-control" name='remove${data.t_number}' type="checkbox">
        </td>
    `);
}


function deleteUser() {
    //Confirmation modal that appears when a user attempts to delete another user from the modify users page
    bootbox.confirm("Are you sure you want to delete this user?", (result) => {
        if (result) {
            //If the user clicks on "OK" in the confirmation box
            document.getElementById("listUsersForm").submit();
        }
    });
}