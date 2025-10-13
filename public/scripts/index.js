const out = document.getElementById('output');
const loginBtn = document.getElementById('login');
const logoutBtn = document.getElementById('logout');

const lotoBtn = document.getElementById('loto');
const roundDiv = document.getElementById('round-info');
const numOfTicketsSpan = document.getElementById('num-of-tickets');
const winningNumbersSpan = document.getElementById('winning-numbers');
const isActiveSpan = document.getElementById('is-active');

const toggleLotoButton = (disabled, hidden) => {
  lotoBtn.disabled = disabled;
  lotoBtn.hidden = hidden;
}

document.addEventListener('DOMContentLoaded', async () => {
  let isAuthenticated = false;
  toggleLotoButton(true, true);


  await fetch('/api/user-info')
    .then(res => res.json())
    .then(data => {
      if (data.isAuthenticated) {
        isAuthenticated = true;
        out.innerHTML = `<p>Dobrodošli ${data.user.name}!</p>`;
        loginBtn.style.display = 'none';
        logoutBtn.style.display = 'block';
        toggleLotoButton(false, false);
      } else {
        isAuthenticated = false;
        out.innerHTML = '<p>Prijavite se.</p>';
        loginBtn.style.display = 'block';
        logoutBtn.style.display = 'none';
        toggleLotoButton(true, true);
      }
    });

  await fetch ('/api/round-info')
    .then(res => res.json())
    .then(data => {
      if (data) {
        numOfTicketsSpan.innerText = data.numOfTickets ?? '0';
        winningNumbersSpan.innerText = data.isActive ? 'Kolo je u tijeku...' : (data.winningNumbers ? data.winningNumbers.join(', ') : 'N/A') ;
        isActiveSpan.innerText = data.isActive ? 'Da' : 'Ne';
        roundDiv.style.display = 'block';

        // kolo nije aktivno, prikaži zadnje odigrano kolo
        if (!data.isActive && data.numOfTickets && data.winningNumbers) {
          document.getElementById('current-round-p').innerText = `Broj uplata u zadnjem odigranom kolu: ${data.numOfTickets}`;
        }

        if (data.isActive && isAuthenticated) {
          toggleLotoButton(false, false);
        } else {
          toggleLotoButton(true, true);
        }
      } else {
        roundDiv.style.display = 'none';
      }
    })

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