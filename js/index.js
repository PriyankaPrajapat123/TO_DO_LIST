let postData = [];
let isEdit = false;
let editId;
(async function getPostsData() {
    let res = await fetch('https://jsonplaceholder.typicode.com/posts');
    postData = await res.json();
    console.log(postData)
    displaytodos(postData);
})();
function handleSubmitForm(e) {
    e.preventDefault();
    if (isEdit) {
        submitEditData(e);
    } else {
        handleAddPost(e);
    }
}
async function handleAddPost(e) {
    let title1 = e.target[0].value;
    let desc = e.target[1].value;
    let id1 = postData.length + 1;
    console.log(e)
    const body = {
        title: title1,
        body: desc,
        userId: 1,
        id: id1
    }
    const header = {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    }
    let res = await fetch('https://jsonplaceholder.typicode.com/posts', header)
    let result = await res.json();
    const data = {
        ...result,
        ...body
    }
    postData.length
    postData.unshift(data)
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = '';
    displaytodos();
    document.getElementById('title').value = null;
    document.getElementById('desc').value = null;

}
function displaytodos() {
    console.log(postData);
    const tableBody = document.getElementById('table-body');
    postData.forEach((val, i) => {
        let tableRow = document.createElement("tr");
        tableRow.appendChild(createTemp('td', i + 1));
        for (let key in val) {
            if (key == 'title' || key == 'body') {
                tableRow.appendChild(createTemp('td', val[key]));
            }
        }
        let tblAction = createTemp('td', '');
        tblAction.appendChild(createTemp('i', '', 'fa-solid fa-pencil icons', `edit-${val.id}`));
        tblAction.appendChild(createTemp('i', '', 'fa-solid fa-trash icons', `delete-${val.id}`));
        tableRow.appendChild(tblAction);
        tableBody.appendChild(tableRow)
    })
}
function createTemp(tagName, innerHtml, className, idName) {
    let child = document.createElement(tagName);
    if (className) {
        child.className = className;
    }
    if (idName) {
        child.id = idName;
        if (idName.split('-')[0] == 'edit') {
            child.addEventListener("click", handleEditPost);
        }
        if (idName.split('-')[0] == 'delete') {
            child.addEventListener("click", handleDeletePost);
            child.innerHTML = '';
        }
    }
    child.innerHTML = innerHtml;
    return child;
}
function handleEditPost(e) {
    if (confirm("Do you want edit") == true) {
        isEdit = true;
        console.log(e)
        let id = e.target.id.split('-')[1];
        // let data = postData.find(val => val.id == id);
        editId = id;
        let data;
        postData.forEach((val) => {
            if (val.id == id) {
                data = val;
            }
        })
        document.getElementById('title').value = data.title;
        document.getElementById('desc').value = data.body;
        changeButton();

    }
    else {
        document.getElementById('title').value = null;
        document.getElementById('desc').value = null;

    }
}
async function submitEditData(e) {
    let title1 = e.target[0].value;
    let desc = e.target[1].value;
    const body = {
        id: editId,
        title: title1,
        body: desc,
        userId: 1,
    }
    const editKey = await fetch('https://jsonplaceholder.typicode.com/posts/', {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
    postData = postData.map(val => {
        if (val.id == editId) {
            val = body;
        }
        console.log(val)
        return val;
    })
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = '';
    displaytodos();
    cancleFunction();

    document.getElementById('title').value = null;
    document.getElementById('desc').value = null;
    isEdit = false;
    editId = undefined;


}
async function handleDeletePost(e) {
    // let data = postData.find(val => val.id == id);
    if (confirm("Do you want delete") == true) {
        let id = e.target.id.split('-')[1];
        const deleteapi = await fetch('https://jsonplaceholder.typicode.com/posts/' + id, {
            method: 'DELETE',
        });
        postData = postData.filter(el => el.id != id)
        const tableBody = document.getElementById('table-body');
        tableBody.innerHTML = '';
        displaytodos();
        console.log('hello')
    }
}

function changeButton() {
    let button = document.getElementById("edit");
    button.value = "Edit";
    let form = document.querySelector('form')
    const btn = document.createElement("input");
    btn.type = "submit"
    btn.value = "Cancle";
    form.appendChild(btn);
    btn.setAttribute("id", "cancle")
    const list = btn.classList;
    list.add("submit_button");
    btn.addEventListener("click", cancleFunction);


}
function cancleFunction() {
    let button = document.getElementById("edit");
    button.value = "Add";
    let cancleButton = document.getElementById("cancle");
    cancleButton.remove();
    document.getElementById('title').value = null;
    document.getElementById('desc').value = null;




}




