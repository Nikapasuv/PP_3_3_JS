$(async function () {
    await auth()
    await printCurrentUserTable()
})

// ------ Table
async function printCurrentUserTable() {
    await fetch('http://localhost:8080/api/users/auth')
        .then(response => response.json())
        .then(currentUser => {
            let result = ''
            result += `
    <tr> 
        <td>${currentUser.id}</td>
        <td>${currentUser.firstName}</td>
        <td>${currentUser.lastName}</td>
        <td>${currentUser.age}</td>
        <td>${currentUser.username}</td>
        <td>${currentUser.rolesToString}</td>
</tr>`
            currentUserTableBody.innerHTML = result
            document.getElementById("admin-link").hidden = !currentUser.rolesToString.includes("ADMIN")
        }).catch(error => console.log(error))
}

// ------ Get current user
async function auth() { // функция для получения информации о текущем пользователе
    fetch('http://localhost:8080/api/users/auth')
        .then(response => response.json())
        .then(currentUser => {
            $('#currentUserUsername').append(currentUser.username)
            $('#currentUserRoles').append(currentUser.rolesToString)
        })
        .catch(error => console.log(error))
}