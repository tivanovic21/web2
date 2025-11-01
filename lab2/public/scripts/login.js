document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const isBrokenAuth = document.getElementById('brokenAuth').checked;

    const body = { username, password, isBrokenAuth };

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(body)
      });

      const json = await response.json();

      if (response.ok && json.ok) {
        window.location.href = '/index';
        return;
      }

      alert('Neuspješna prijava: ' + (json.error || 'Unknown error'));
    } catch (err) {
      console.error('Error during login: ', err);
      alert('Internal server error');
    }
  });
});
