document.addEventListener('DOMContentLoaded', function() {
    const logoutButton = document.getElementById('logoutButton');
    logoutButton.addEventListener('click', function() {
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
    });
});

