/**
 * Created by ivan on 07.02.17.
 */
//Реализация на Promise
let table = document.getElementById('usersTable');

table.onclick = function(event){
    let target = event.target;
    // console.log(target.textContent);

    let td = target.closest('td');
    // console.log(td);
    // console.log(td.lastChild.value);

    let tr = target.closest('tr');
    //console.log(tr.firstChild.textContent);
    let id = tr.firstChild.textContent;
    //console.log(tr.rowIndex);
    let rowInd = tr.rowIndex;

    if(target.textContent == 'Удалить'){
        deleteUserDBP(id)
            .then(response =>{
                console.log(response);
                removeUserTbl(id, rowInd);
            })
            .catch(error =>{
                console.log(error);
            })
    } else if(target.textContent == 'Изменить'){
        if(td.firstChild.nodeName == 'FORM'){
            // console.log('yes baby');
            let newUserName = document.getElementById('updateName').value;
            updateUserDBP(id, newUserName)
                .then(response =>{
                    console.log(response);
                })
                .catch(error =>{
                    console.log(error);
                })
        } else {
            updateUserTbl(td, tr);
        }
    }
};

function createTableDBP(){

    return new Promise(function(resolve, reject){

        let xhr = new XMLHttpRequest();
        xhr.open("GET", "/users", true);

        xhr.onload = function () {
            if(this.status == 200){
                resolve(this.response);
            }else{
                let error = new Error(this.statusText);
                error.code = this.status;
                alert( this.status + ': ' + this.statusText );
                reject(error);
            }
        };

        xhr.onerror = function(){
           reject(new Error("Network error"));
        };

        xhr.send();
    });
}

createTableDBP()
    .then(response => {
            console.log(response);
            let users = JSON.parse(response);
            return users;
    })
    .then(users => {
        showAllUsersTblP(users);
    })
    .catch(error => {
        console.log(error);
    });


function addNewUserDBP(){
    return new Promise((resolve, reject)=>{

        let userName = document.getElementById('name').value;
        console.log(userName);

        let params = {};
        params.name = userName;

        let paramJS = JSON.stringify(params, null, 2);

        let xhr = new XMLHttpRequest();
        xhr.open("POST", "/users", true);
        xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");

        xhr.onload = function(){
          if(this.status == 201) {
              resolve(this.response);
          }else{
              let error = new Error(this.statusText);
              error.code = this.status;
              alert( this.status + ': ' + this.statusText );
              reject(error);
          }
        };

        xhr.onerror = function(){
            reject(new Error("Network error"));
        };

        xhr.send(paramJS);
    })
}

function addNewUserP(){
    addNewUserDBP()
        .then(response => {
            let user = JSON.parse(response);
            return user;
        })
        .then(user => {
            showUserTblP(user);
        })
        .catch(error => {
            console.log(error);
        });
}

function deleteUserDBP(userId) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open("DELETE", "/users/" + userId, true);

        xhr.onload = function () {
            if (this.status == 204) {
                resolve(this.response);
                console.log(this.response);
            }else{
                let error = new Error(this.statusText);
                error.code = this.status;
                alert(this.status + ': ' + this.statusText);
                reject(error);
            }
        };
        xhr.send();
    });
}

function removeUserTbl(userId, rowInd){

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


function showAllUsersTblP(users){
    // let table = document.getElementById('usersTable');

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


function showUserTblP(user) {
    console.log(user.id);
    let userName = document.getElementById('name').value;
    let table = document.getElementById('usersTable');
    // let tr = table.appendChild(document.createElement('tr'));
    let tr = document.createElement('tr');
    for (let i=0;i<3;i++) {
        let td = document.createElement('td');
        if(i==0){
            td.innerHTML = user.id;
        }
        if(i==1){
            td.innerHTML = userName;
        }
        if(i==2){
            // td.insertAdjacentHTML("afterBegin", '<a onclick=\"deleteUser()\" href=\"#delete\">Удалить</a> | <a href=\"#update\">Изменить</a>');
            td.insertAdjacentHTML("afterBegin", '<a href=\"#delete\">Удалить</a> | <a href=\"#update\">Изменить</a>');
        }
        tr.appendChild(td);
    }
    console.log(tr);
    table.appendChild(tr);
    return table;
}


function updateUserDBP(userId, newName){
    return new Promise((resolve, reject) => {
        let params = {};
        params.name = newName;
        let paramsJSN = JSON.stringify(params, null, 2);

        let xhr = new XMLHttpRequest();

        xhr.open("PUT", "/users/" + userId, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");

        xhr.onload = function(){
          if(this.status == 200){
              resolve(this.response);
          }else{
              let error = new Error(this.statusText);
              error.code = this.status;
              alert(this.status + ': ' + this.statusText);
              reject(error);
          }
        };

        xhr.onerror = function(){
          reject(new Error("Network error"));
        };

        xhr.send(paramsJSN);
    });
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