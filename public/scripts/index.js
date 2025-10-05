const out = document.getElementById('output');
const loginBtn = document.getElementById('login');
const logoutBtn = document.getElementById('logout');

document.addEventListener('DOMContentLoaded', async () => {
    await fetch('/user-info')
      .then(res => res.json())
      .then(data => {
        if (data.isAuthenticated) {
          out.innerHTML = `<p>Welcome ${data.user.name}!</p>`;
          loginBtn.style.display = 'none';
          logoutBtn.style.display = 'block';
        } else {
          out.innerHTML = '<p>Please log in.</p>';
          loginBtn.style.display = 'block';
          logoutBtn.style.display = 'none';
        }
      })

    loginBtn.addEventListener('click', () => {
      window.location.href = '/login';
    });

    logoutBtn.addEventListener('click', () => {
      window.location.href = '/logout';
    });
});