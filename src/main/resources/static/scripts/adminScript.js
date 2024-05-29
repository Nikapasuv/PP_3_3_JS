
const URL = 'http://localhost:8080/api/users/'
const URL_ROLES = 'http://localhost:8080/api/users/roles'
const URL_AUTH = 'http://localhost:8080/api/users/auth'
const formNewUser = document.forms['formNewUser']
const formEditUser = document.forms['formEditUser']
const formDeleteUser = document.forms['formDeleteUser']
let id = ''
let tr = ''
let user = ''

$(async function () {
    await printUsersTable()
    await printUsersRoles()
    await auth()
})

// ------ event handler function
const on = (element, event, selector, handler) => {
    element.addEventListener(event, e => {
        if (e.target.closest(selector)) {
            handler(e)
        }
    })
}

// ------ Users table
async function printUsersTable() {
    await fetch(URL)
        .then(response => response.json())
        .then(data => {
            let result = ''
            data.forEach(user => {
                result +=
                    `<tr>
                        <td>${user.id}</td>
                        <td>${user.firstName}</td> 
                        <td>${user.lastName}</td> 
                        <td>${user.age}</td>
                        <td>${user.username}</td>
                        <td>${user.rolesToString}</td>
                        <td>
                            <button type="button" id="btnEdit" class="btn btn-info" data-toggle="modal"
                                data-action="edit" data-target="#modalEdit">Edit</button></td>
                        <td>
                             <button type="button" id="btnDelete" class="btn btn-danger" data-toggle="modal"
                                 data-action="delete" data-target="#modalDelete">Delete</button></td>
                    </tr>`
            })
            tableAllUsersBody.innerHTML = result
        }).catch(error => console.log(error))
}

// ------ Get User
async function getUser(id) {
    let response = await fetch(URL + id);
    return await response.json();
}

// ------ Modal Edit
on(document, 'click', '#btnEdit', e => { // вытаскиваем id юзера через клик по кнопке btnEdit и передаем его в функцию
    tr = e.target.parentNode.parentNode
    id = tr.children[0].innerHTML
    showModalEdit(id)
})

async function showModalEdit(id) { // заполняем модальное окно
    user = await getUser(id)
    idEditForm.value = user.id
    firstNameEditForm.value = user.firstName
    lastNameEditForm.value = user.lastName
    ageEditForm.value = user.age
    usernameEditForm.value = user.username
    passwordEditForm.value = ''

    $('#userRolesEditForm').empty()

    await fetch(URL_ROLES)
        .then(response => response.json())
        .then(roles => {
            roles.forEach(role => {
                let selectedRole = false
                for (let i = 0; i < user.roles.length; i++) {
                    if (user.roles[i].name === role.name) {
                        selectedRole = true
                        break
                    }
                }
                let element = document.createElement('option')
                element.text = role.name.substring(5)
                element.value = role.id
                if (selectedRole) {
                    element.selected = true
                }
                userRolesEditForm.appendChild(element)
            })
        }).catch(error => console.log(error))
}

formEditUser.addEventListener("submit", (e) => { // при нажатии на submit сохраняем изменения, закрываем модальное окно
    e.preventDefault()
    let rolesUser = []

    for (let i = 0; i < formEditUser.roles.options.length; i++) {
        if (formEditUser.roles.options[i].selected) rolesUser.push({
            id: formEditUser.roles.options[i].value,
            name: formEditUser.roles.options[i].name
        })
    }

    fetch(URL, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: idEditForm.value,
            firstName: firstNameEditForm.value,
            lastName: lastNameEditForm.value,
            age: ageEditForm.value,
            username: usernameEditForm.value,
            password: passwordEditForm.value,
            roles: rolesUser
        })
    })
        .then(response => response.json())
        .then(() => {
            printUsersTable()
        })
        .catch(error => console.log(error))

    $("#modalEdit").modal("hide")
})

// ------ Modal Delete
on(document, 'click', '#btnDelete', e => { // вытаскиваем id юзера через клик по кнопке btnDelete и передаем его в функцию
    tr = e.target.parentNode.parentNode
    id = tr.children[0].innerHTML
    showModalDelete(id)
})

async function showModalDelete(id) { // заполняем модальное окно
    user = await getUser(id)
    idDeleteForm.value = user.id
    firstNameDeleteForm.value = user.firstName
    lastNameDeleteForm.value = user.lastName
    ageDeleteForm.value = user.age
    usernameDeleteForm.value = user.username

    $('#rolesDeleteForm').empty()

    await fetch(URL_ROLES)
        .then(response => response.json())
        .then(roles => {
            roles.forEach(role => {
                let selectedRole = false
                for (let i = 0; i < user.roles.length; i++) {
                    if (user.roles[i].name === role.name) {
                        selectedRole = true
                        break
                    }
                }
                let element = document.createElement('option')
                element.text = role.name.substring(5)
                element.value = role.id
                if (selectedRole) {
                    element.selected = true
                }
                rolesDeleteForm.appendChild(element)
            })
        }).catch(error => console.log(error))
}
formDeleteUser.addEventListener("submit", (e) => { // при нажатии submit удаляем юзера и строку в таблице, закрываем модальное окно
    e.preventDefault()

    fetch(URL + id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .catch(error => console.log(error))

    $("#modalDelete").modal("hide")
    tr.remove()
})

// ------ Add New User
formNewUser.addEventListener("submit", (e) => {
    e.preventDefault()
    let rolesNewUserForm = []

    for (let i = 0; i < formNewUser.roles.options.length; i++) {
        if (formNewUser.roles.options[i].selected) rolesNewUserForm.push({
            id: formNewUser.roles.options[i].value,
            name: formNewUser.roles.options[i].name
        })
    }

    fetch(URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            firstName: firstNameNewForm.value,
            lastName: lastNameNewForm.value,
            age: ageNewForm.value,
            username: usernameNewForm.value,
            password: passwordNewForm.value,
            roles: rolesNewUserForm
        })
    })
        .then(response => response.json())
        .then(() => {
            printUsersTable()
            $('#tab_users_table').click()
        })
        .catch(error => console.log(error))
})

// ------ User roles
async function printUsersRoles() { // функция для вывода ролей на экран
    await fetch(URL_ROLES)
        .then(response => response.json())
        .then(roles => {
            roles.forEach(role => {
                let element = document.createElement('option')
                element.text = role.name.substring(5)
                element.value = role.id
                userRolesNewForm.appendChild(element)
            })
        })
        .catch(error => console.log(error))
}

// ------ Get current user
async function auth() { // функция для получения информации о текущем пользователе
    await fetch(URL_AUTH)
        .then(response => response.json())
        .then(currentUser => {
            $('#currentUserUsername').append(currentUser.username)
            $('#currentUserRoles').append(currentUser.rolesToString)
        })
        .catch(error => console.log(error))
}
