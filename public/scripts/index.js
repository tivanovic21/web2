const out = document.getElementById('output');

document.getElementById('ping')?.addEventListener('click', async () => {
  out.textContent = 'Pinging...';
  try {
    const res = await fetch('/api/ping');
    const text = await res.text();
    out.textContent = text;
  } catch (err) {
    out.textContent = String(err);
  }
});


document.getElementById('ping-db')?.addEventListener('click', async () => {
  out.textContent = 'Pinging...';
  try {
    const res = await fetch('/api/dbping');
    const text = await res.text();
    out.textContent = text;
  } catch (err) {
    out.textContent = String(err);
  }
});