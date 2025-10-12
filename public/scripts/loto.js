const documentInput = document.getElementById('id-doc');
const lotoInput = document.getElementById('id-loto'); 
const form = document.getElementById('loto-form');

const MIN_NUM = 1;
const MAX_NUM = 45;

document.addEventListener('DOMContentLoaded', () => {
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
        alert('Morate unijeti između 6 i 10 brojeva');
        return [nums.map(n => Number(n)), false];
    } else if (new Set(nums).size !== nums.length) {
        alert('Svi brojevi moraju biti jedinstveni');
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

    await fetch('/api/loto', {
        method: 'POST',
        dataType: 'json',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            document: documentInputValue,
            numbers: nums
        })
    }).then(data => {
        if (data.status === 200) {
            alert('Uspješno ste odigrali loto!');
            documentInput.value = '';
            lotoInput.value = '';
        } else {
            data.json().then(err => {
                alert('Došlo je do pogreške: ' + err.message);
                console.error(err);
            });
        }
    }).catch(err => {
        alert('Došlo je do pogreške: ' + err.message);
        console.error(err);
    });
}