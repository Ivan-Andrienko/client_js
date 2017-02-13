/**
 * Created by ivan on 04.02.17.
 */
//Реализация на function
let table = document.getElementById('usersTable');

table.onclick = function(event){
    let target = event.target;
    console.log(target.textContent);

    let td = target.closest('td');
    console.log(td);
    console.log(td.lastChild.value);

    let tr = target.closest('tr');
    //console.log(tr.firstChild.textContent);
    let id = tr.firstChild.textContent;
    //console.log(tr.rowIndex);
    let rowInd = tr.rowIndex;


    if(target.textContent == 'Удалить'){
        deleteUserDB(id, rowInd);
    } else if(target.textContent == 'Изменить'){
        if(td.firstChild.nodeName == 'FORM'){
            console.log('yes baby');
            let newUserName = document.getElementById('updateName').value;
            // newUserName ;
            updateUserNameDB(id, newUserName);
        } else {
            updateUserTbl(td, tr);
        }
    }
};

function updateUserNameDB(userId, newUserName) {         //  There is bag!!!!!!!!!!!!!!!!
    //let newNameJS = JSON.stringify(newUserName, null, 2);
    //let userNameStr = String(newUserName);
    //console.log(newUserName);

    let params = {};
    params.name = newUserName;

    let paramJS = JSON.stringify(params, null, 2);

    let xhr = new XMLHttpRequest();

    xhr.open("PUT", '/users/' + userId, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");

    xhr.onreadystatechange = function() {
        let users;
        if (xhr.readyState != 4) return;

        if (xhr.status != 200) {
            // обработать ошибку
            alert( xhr.status + ': ' + xhr.statusText );
        } else {
            try {
                users = JSON.parse(xhr.responseText);     //The bag here
                console.log('List of users: '+ users);
                showAllUsersTbl(users);
            } catch (e) {
                alert( "Некорректный ответ " + e.message );
            }

        }
    };
    //xhr.send(newNameJS);
     xhr.send(paramJS);
}

function addNewUser() {
    // console.log("Button works");
    let userName = document.getElementById('name').value;
    console.log(userName);

    let params = {};
    params.name = userName;

    let paramJS = JSON.stringify(params, null, 2);

    let xhr = new XMLHttpRequest();

    xhr.open("POST", '/users', true);
    xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");

    xhr.onreadystatechange = function() {
        let users;
        if (xhr.readyState != 4) return;

        if (xhr.status != 201) {
            // обработать ошибку
            alert( xhr.status + ': ' + xhr.statusText );
        } else {
            try {
                users = JSON.parse(xhr.responseText);
                console.log(users);
                showUserTbl(users, userName);
            } catch (e) {
                alert( "Некорректный ответ " + e.message );
            }

        }
    };
    xhr.send(paramJS);
}

function createTableDB(){
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "/users", true);

    xhr.onreadystatechange = function() {
        let users;
        if (xhr.readyState != 4) return;

        if (xhr.status != 200) {
            // обработать ошибку
            alert( xhr.status + ': ' + xhr.statusText );
        } else {
            try {
                users = JSON.parse(xhr.responseText);
                console.log(users);
                showAllUsersTbl(users);
            } catch (e) {
                alert( "Некорректный ответ " + e.message );
            }
        }
    };
    xhr.send();
}
createTableDB();

function deleteUserDB(userId, rowInd){
    console.log(userId);
    //let trList = document.getElementById('usersTable').getElementsByTagName('tr');
    //let userId = trList[this].getElementsByTagName("td")[0].innerHTML;
    //console.log(userId);

    let xhr = new XMLHttpRequest();

    xhr.open("DELETE", "/users/" + userId, true);
    xhr.onreadystatechange = function() {
        let users;
        if (xhr.readyState != 4) return;

        if (xhr.status != 204) {
            // обработать ошибку
            alert( xhr.status + ': ' + xhr.statusText );
        } else {
            try {
                users = JSON.parse(xhr.responseText);
                console.log(users);

            } catch (e) {
                alert( "Некорректный ответ " + e.message );
            }
        }
        removeUser(userId, rowInd);
    };
    xhr.send();
}

function updateUserTbl(td, tr) {
    let old = tr.lastChild;
    tr.removeChild(old);
    let tdnew = document.createElement('td');

    // td.removeChild(td.firstChild);
    // td.removeChild(td.lastChild);

    tdnew.insertAdjacentHTML("afterBegin", '<form class=\"form-inline\"><div class=\"form-group\"><label for=\"updateName\" class=\"sr-only\">Имя</label><input class=\"form-control\" type=\"text\" id=\"updateName\" placeholder=\"Change name\"></div>&nbsp;<button type=\"submit\" class=\"btn btn-primary\">Изменить</button></form>');
    tr.appendChild(tdnew);
}

function showAllUsersTbl(users){
    let table = document.getElementById('usersTable');

    for(let i=0; i<users.length; i++){
        if(users[i] != null && users[i].name != undefined){
            console.log(users[i].name);
            let tr = table.appendChild(document.createElement('tr'));

            for (let j=0;j<3;j++) {
                let td = document.createElement('td');
                if(j==0){
                    td.innerHTML = i;
                }
                if(j==1){
                    td.innerHTML = users[i].name;
                }
                if(j==2){
                    td.insertAdjacentHTML("afterBegin", '<a href=\"#delete\">Удалить</a> | <a href=\"#update\">Изменить</a>');
                }
                tr.appendChild(td);
            }
        }
    }
}

function showUserTbl(users, userName) {
    console.log(users.id);
    let table = document.getElementById('usersTable');
    // let tr = table.appendChild(document.createElement('tr'));
    let tr = document.createElement('tr');
    for (let i=0;i<3;i++) {
        let td = document.createElement('td');
        if(i==0){
            td.innerHTML = users.id;
        }
        if(i==1){
            td.innerHTML = userName;
        }
        if(i==2){
            td.insertAdjacentHTML("afterBegin", '<a onclick=\"deleteUser()\" href=\"#delete\">Удалить</a> | <a href=\"#update\">Изменить</a>');
        }
        tr.appendChild(td);
    }
    console.log(tr);
    table.appendChild(tr);
    return table;
}

// function deleteUser(user){
function removeUser(userId, rowInd){

    let trList = document.getElementById('usersTable').getElementsByTagName('tr');
    let tblId;
    for(let i=1; i<=trList.length; i++){
        tblId = trList[i].getElementsByTagName("td")[0].innerHTML;
        if(tblId == userId){
            document.getElementById('usersTable').deleteRow(rowInd);
            return;
        }
    }
}

// function l(event) {
//     with(event.target || event.srcElement) {
//         var row = parentNode.rowIndex + 1;
//         var column = cellIndex + 1;
//     }
//     alert("строка:" + row + ", столбец:" + column);
// }

