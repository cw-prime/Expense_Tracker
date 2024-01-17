document.addEventListener('DOMContentLoaded', function() {
  const forgotPasswordForm = document.getElementById('forgotPasswordForm');
  forgotPasswordForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    fetch('/api/users/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
      credentials: 'same-origin'
    })
    .then(response => response.json())
    .then(data => {
      // Handle success or failure
      alert(data.msg);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  });
});
