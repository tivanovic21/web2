addEventListener('DOMContentLoaded', async () => {
  toggleMainDiv(false);

  await fetch('/api/me').then(r => r.json()).then(j => {
    if (!j.loggedIn) {
      window.location.href = '/login';
      return;
    }
    document.getElementById('info').textContent = 'Pozdrav: ' + (j.username);

    toggleMainDiv(true);
    
    document.getElementById('contactBtn').addEventListener('click', async () => {
      await fetchContactInfo();
    });

  }).catch(() => { window.location.href = '/login'; });
});

const toggleMainDiv = async (show) => {
  const mainDiv = document.getElementById('mainDiv');
  mainDiv.style.display = show ? 'block' : 'none';
  
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

const fetchContactInfo = async () => {
  const username = document.getElementById('contact').value;
  const isSqlInjection = document.getElementById('brokenAuth').checked;

  if (!username) return;

  const resp = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, isSqlInjection })
  });
  const j = await resp.json();

  if (!resp.ok) {
    document.getElementById('contactInfo').textContent = 'Error: ' + (j.error || JSON.stringify(j));
    return;
  }
  console.log(j);

  document.getElementById('contactInfo').textContent = JSON.stringify(j, null, 2);

}