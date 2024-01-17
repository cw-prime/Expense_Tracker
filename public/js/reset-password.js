document.addEventListener('DOMContentLoaded', function() {
  const resetPasswordForm = document.getElementById('resetPasswordForm');
  resetPasswordForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const password = document.getElementById('password').value;
    const token = document.getElementById('token').value; // INPUT_REQUIRED {User should enter the token value here}
    fetch(`/api/users/reset-password/${token}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
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
