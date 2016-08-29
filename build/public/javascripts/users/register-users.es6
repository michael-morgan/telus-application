var storeArray;

// document.ready
$(() => {
    // initialize store array
    storeArray = [];

    $('#registerForm').submit((event) => {
        if(storeArray.length > 0) {
            storeArray.forEach((store) => {
                $('#registerForm').append(`
                    <input type="hidden" name="stores[]" value="${store.id}">
                `);
            });
            return;
        }

        event.preventDefault();
    });

    $('#storeSelect').change((event) => {
        let target = $(event.currentTarget[event.target.selectedIndex]);
        let name = target[0].text, id = target[0].value;

        addStoreListItem(name, id);
        $('#storeSelect').val('0');
    });
});

function addStoreListItem(name, id) {
    if(storeArray.filter((store) => store.id == id).length == 0) {
        storeArray.push({name: name, id: id});
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
    storeArray.splice(storeArray.findIndex((store) => store.id == id), 1);
    $(`#storeListItem${id}`).remove();
}