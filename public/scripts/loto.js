const documentInput = document.getElementById('id-doc');
const lotoInput = document.getElementById('id-loto'); 
const form = document.getElementById('loto-form');
const output = document.getElementById('output');
const koloIdInput = document.getElementById('id-kolo');


const MIN_NUM = 1;
const MAX_NUM = 45;

document.addEventListener('DOMContentLoaded', async () => {
    await fetch('/api/round-info')
        .then(res => res.json())
        .then(data => {
            if (data && data.isActive && data.koloId) {
                koloIdInput.value = data.koloId;
            }
        });

    documentInput.addEventListener('input', (event) => {
        event.target.value = event.target.value.replace(/\D/g, '');
    });
    lotoInput.addEventListener('input', (event) => {
        event.target.value = event.target.value.replace(/[^\d,]/g, '');
    });  

    form.addEventListener('submit', handleSubmit);
}); 


const validateLotoNumbersInput = (numbers) => {
    const nums = numbers.split(',')
        .map(n => n.trim())
        .filter(n => n !== '');

    if (nums.length < 6 || nums.length > 10) {
        alert('Morate unijeti između 6 i 10 brojeva te ih odvojiti zarezom');
        return [nums.map(n => Number(n)), false];
    } else if (new Set(nums).size !== nums.length) {
        alert('Brojevi se ne smiju ponavljati');
        return [nums.map(n => Number(n)), false];
    } else if (nums.some(n => isNaN(Number(n)) || Number(n) < MIN_NUM || Number(n) > MAX_NUM)) {
        alert(`Svi brojevi moraju biti između ${MIN_NUM} i ${MAX_NUM}`);
        return [nums.map(n => Number(n)), false];
    }

    return [nums.map(n => Number(n)), true];
};

const handleSubmit = async (event) => {
    event.preventDefault();
    const documentInputValue = documentInput.value;
    const lotoInputValue = lotoInput.value;

    const [nums, isValid] = validateLotoNumbersInput(lotoInputValue);

    if (documentInputValue.length <= 0 || documentInputValue.length > 20) {
        alert('Broj osobnog dokumenta mora imati između 1 i 20 znamenki');
        return;
    } else if (!isValid) {
        return;
    }

    try {
        const response = await fetch('/api/loto', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                document: documentInputValue,
                numbers: nums,
                koloId: parseInt(koloIdInput.value)
            })
        });
        const result = await response.json();

        if (response.ok) {
            const paragraph = output.querySelector('p');
            const insertAfter = paragraph ? paragraph : output;

            const qrImgDiv = document.createElement('div');
            const qrImg = document.createElement('img');
            qrImg.src = result.data.qrCodeUrl;
            qrImg.alt = 'QR Code';
            qrImgDiv.appendChild(qrImg);

            const linkDiv = document.createElement('div');
            const link = document.createElement('a');
            link.href = result.data.link;  
            link.textContent = 'Pogledaj listić';
            link.target = '_blank';
            linkDiv.appendChild(link);

            insertAfter.insertAdjacentElement('afterend', qrImgDiv);
            qrImgDiv.insertAdjacentElement('afterend', linkDiv);

            documentInput.value = '';
            lotoInput.value = '';
            output.style.display = 'flex';
        } else {
            alert(`Greška: ${result.message}`);
            output.style.display = 'none';
        }
    } catch (error) {
        alert('Došlo je do pogreške prilikom slanja podataka. Pokušajte ponovno');
        console.error('Error prilikom slanja na server:', error);
        output.style.display = 'none';
    }
}