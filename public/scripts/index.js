const out = document.getElementById('output');
const loginBtn = document.getElementById('login');
const logoutBtn = document.getElementById('logout');

const lotoBtn = document.getElementById('loto');

const toggleLotoButton = (disabled, hidden) => {
  lotoBtn.disabled = disabled;
  lotoBtn.hidden = hidden;
}

document.addEventListener('DOMContentLoaded', async () => {
  let isAuthenticated = false;
  toggleLotoButton(true, true);


  await fetch('/user-info')
    .then(res => res.json())
    .then(data => {
      if (data.isAuthenticated) {
        isAuthenticated = true;
        out.innerHTML = `<p>Welcome ${data.user.name}!</p>`;
        loginBtn.style.display = 'none';
        logoutBtn.style.display = 'block';
        toggleLotoButton(false, false);
      } else {
        isAuthenticated = false;
        out.innerHTML = '<p>Please log in.</p>';
        loginBtn.style.display = 'block';
        logoutBtn.style.display = 'none';
        toggleLotoButton(true, true);
      }
    });

  loginBtn.addEventListener('click', () => {
    window.location.href = '/login';
  });

  logoutBtn.addEventListener('click', () => {
    window.location.href = '/logout';
  });

  lotoBtn.addEventListener('click', () => {
    window.location.href = '/loto';
  });
});