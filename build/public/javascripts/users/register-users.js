'use strict';

var storeArray;

// document.load
$(function () {
    // initialize store array
    storeArray = [];

    $('#registerForm').submit(function (event) {
        if (storeArray.length > 0) {
            storeArray.forEach(function (store) {
                $('#registerForm').append('\n                    <input type="hidden" name="stores[]" value="' + store.id + '">\n                ');
            });
            return;
        }

        event.preventDefault();
    });

    $('#storeSelect').change(function (event) {
        var target = $(event.currentTarget[event.target.selectedIndex]);
        var name = target[0].text,
            id = target[0].value;

        addStoreListItem(name, id);
        $('#storeSelect').val('0');
    });

    console.debug(storesObj);
});

function addStoreListItem(name, id) {
    if (storeArray.filter(function (store) {
        return store.id == id;
    }).length == 0) {
        storeArray.push({ name: name, id: id });
        $('#storeList').append(getStoreListItem(name, id));
    }
}

function getStoreListItem(name, id) {
    return '\n        <li class="list-group-item" id="storeListItem' + id + '">\n            <span>' + name + '</span>\n            <i class="fa fa-times-circle fa-2x pull-right" style="margin-top: -2px;" onclick="removeStoreListItem(' + id + ')"></i>\n        </li>\n    ';
}

function removeStoreListItem(id) {
    storeArray.splice(storeArray.findIndex(function (store) {
        return store.id == id;
    }), 1);
    $('#storeListItem' + id).remove();
}

//# sourceMappingURL=register-users.js.map