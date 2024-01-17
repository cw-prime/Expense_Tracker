document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        fetch('/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            if (data.msg === 'Login successful') {
                window.location.href = "/dashboard.html";
            } else {
                alert('Login failed: ' + data.msg);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    });
});
