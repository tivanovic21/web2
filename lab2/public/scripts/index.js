addEventListener('DOMContentLoaded', async () => {
  toggleLogoutButton(false);

  await fetch('/api/me').then(r => r.json()).then(j => {
    if (!j.loggedIn) {
      window.location.href = '/login';
      return;
    }
    document.getElementById('info').textContent = 'Pozdrav: ' + (j.username);

    toggleLogoutButton(true);
  }).catch(() => { window.location.href = '/login'; });
});

const toggleLogoutButton = async (show) => {
  const logoutBtn = document.getElementById('logoutBtn');
  logoutBtn.style.display = show ? 'block' : 'none';
  logoutBtn.onclick = async () => {
    await fetch('/api/logout', { method: 'POST' })
      .then((res) => {
        if (res.ok) {
          window.location.href = '/login';
        }
      })
      .catch((err) => {
        console.error('Logout failed: ', err);
      });
  };
};