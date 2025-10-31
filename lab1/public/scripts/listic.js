document.addEventListener('DOMContentLoaded', () => {
    const data = window.listicData;
    const content = document.getElementById('content');

    if (!data) {
    content.innerHTML = '<p>Učitavanje...</p>';
    return;
    }

    if (data.error) {
    content.innerHTML = `<p style="color: red;">Greška: ${data.error}</p>`;
    } else if (data.listic) {
    content.innerHTML = `
        <h1>Vaš listić je uspješno uplaćen!</h1>
        <p>Dokument: ${data.listic.document_id}</p>
        <p>Uplaćeni brojevi: ${data.listic.loto_brojevi.join(', ')}</p>
        <p>Dobitni brojevi: ${data.winning_numbers ? data.winning_numbers.join(', ') : 'Još nisu izvučeni'}</p>
        ${data.winning_numbers ? `<p style="color: ${data.is_winner ? 'green' : 'red'}">Pobjednik: ${data.is_winner ? 'DA - ČESTITAMO!' : 'NE - Više sreće drugi put!'}</p>` : 'Kolo je u tijeku...'}
    `;
    } else {
    content.innerHTML = '<p>Nema podataka.</p>';
    }
});