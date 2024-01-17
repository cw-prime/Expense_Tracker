document.addEventListener('DOMContentLoaded', function() {
  const registerForm = document.getElementById('registerForm');
  registerForm.addEventListener('submit', function(event) {
      event.preventDefault();
      const username = document.getElementById('username').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
      
      if(password !== confirmPassword) {
          alert("Passwords don't match!");
          return;
      }
      
      fetch('/api/users/register', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, email, password }),
          credentials: 'same-origin'
      })
      .then(response => response.json())
      .then(data => {
          if (data.msg === 'User registered successfully') {
              window.location.href = "index.html";
          } else {
              alert('Registration failed: ' + data.errors.map(e => e.msg).join(', '));
          }
      })
      .catch((error) => {
          console.error('Error:', error);
      });
  });
});
