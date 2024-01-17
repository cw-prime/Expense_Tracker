document.addEventListener('DOMContentLoaded', function() {
    includeHeader();
    // Include logout functionality for all pages
    const logoutButton = document.getElementById('logoutButton');
    logoutButton.addEventListener('click', logout);
});

function includeHeader() {
    fetch('/shared/header.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('header').innerHTML = data;
    });
}

function logout() {
    fetch('/api/users/logout', {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => {
        if (response.ok) {
            window.location.href = 'index.html';
        }
        return response.json();
    })
    .then(data => {
        alert(data.msg);
    })
    .catch(error => {
        console.error('Logout error:', error);
    });
}
