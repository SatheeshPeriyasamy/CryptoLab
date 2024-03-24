function performPrimalityTest() {
    const numberInput = parseInt(document.getElementById("numberInput").value);
    const testCases = parseInt(document.getElementById("testCases").value);
    const resultsTable = document.getElementById("resultsTable").getElementsByTagName('tbody')[0];
    for (let i = 1; i <= testCases; i++) {
        const isPrime = isPrimeNumber(numberInput);
        const newRow = resultsTable.insertRow();
        const cell1 = newRow.insertCell(0);
        const cell2 = newRow.insertCell(1);
        cell1.innerHTML = `Test Case ${i}  =  `;
        cell2.innerHTML = isPrime ? `${numberInput}   is a prime number` : `${numberInput} is not a prime number`;
    }
    return false;
}

function isPrimeNumber(number) {
    if (number <= 1) {
        return false;
    }
    if (number <= 3) {
        return true;
    }
    if (number % 2 === 0 || number % 3 === 0) {
        return false;
    }
    let i = 5;
    while (i * i <= number) {
        if (number % i === 0 || number % (i + 2) === 0) {
            return false;
        }
        i += 6;
    }
    return true;
}

function generatePrime(bits) {
    let candidate = Math.floor(Math.random() * (2 ** bits)) | 1;
    function isPrime(candidate, iterations) {
        if (candidate <= 1) return false;
        if (candidate % 2 === 0) return false;
        let s = 0;
        let d = candidate - 1;
        while (d % 2 === 0) {
            d /= 2;
            s++;
        }

        const millerRabinTest = (a) => {
            let x = BigInt(a) ** BigInt(d) % BigInt(candidate);
            if (x === 1n || x === BigInt(candidate) - 1n) return true;
            for (let r = 1; r < s; r++) {
                x = (x ** 2n) % BigInt(candidate);
                if (x === BigInt(candidate) - 1n) return true;
            }
            return false;
        };
        for (let i = 0; i < iterations; i++) {
            const a = Math.floor(Math.random() * (candidate - 3)) + 2;
            if (!millerRabinTest(a)) return false;
        }
        return true;
    }
    while (true) {
        if (isPrime(candidate, 5)) {
            return candidate;
        }
        candidate += 2; 
    }
}

function calculatePhi(p, q) {
    return (p - 1) * (q - 1);
}

function calculate() {
    const selectedRadio = document.querySelector('input[name="keyLength"]:checked');
    if (selectedRadio) {
        const bits = parseInt(selectedRadio.value);
        const p = generatePrime(bits);
        const q = generatePrime(bits);
        const n = p * q;
        const phiN = calculatePhi(p, q);
        document.getElementById('p').value = p;
        document.getElementById('q').value = q;
        document.getElementById('n').value = n;
        document.getElementById('φ(n)').value = phiN;
    } else {
        alert('Please select a key length.');
    }
}

function checkE() {
    const e = parseInt(document.getElementById('e').value);
    const phiN = parseInt(document.getElementById('φ(n)').value);
    if (e) {
    if (e < 1 || e >= phiN || gcd(e, phiN) !== 1) {
        document.getElementById('result').innerHTML = 'Invalid E value. Choose another.';
    } else {
        document.getElementById('result').innerHTML = 'Valid E value.';
    }
}else {
    alert('Please Enter E Value.');
}
}

function gcd(a, b) {
    if (b === 0) {
        return a;
    }
    return gcd(b, a % b);
}

function uploadPlainText1() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.txt'; // Filter for text files only
    fileInput.addEventListener('change', function () {
        const file = fileInput.files[0];
        if (file && file.type === 'text/plain') {
            const reader = new FileReader();
            reader.onload = function () {
                document.getElementById('plainText_e').value = reader.result;
            };
            reader.readAsText(file);
        } else {
            alert('Please select a valid text file.');
        }
    });
    fileInput.click();
}

function uploadPlainText2() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.txt'; // Filter for text files only
    fileInput.addEventListener('change', function () {
        const file = fileInput.files[0];
        if (file && file.type === 'text/plain') {
            const reader = new FileReader();
            reader.onload = function () {
                document.getElementById('plainText_d').value = reader.result;
            };
            reader.readAsText(file);
        } else {
            alert('Please select a valid text file.');
        }
    });
    fileInput.click();
}

function downloadProcessedText() {
    const text = document.getElementById('decryptedText').value;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'decrypted.txt';
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
}

function encrypt() {
    const publicKey = document.getElementById('e').value;
    if (publicKey) { // Check if publicKey is not empty
        const plainText = document.getElementById('plainText_e').value;
        const n = parseInt(document.getElementById('n').value);
        const encryptedArray = [];
        for (let i = 0; i < plainText.length; i++) {
            const charCode = plainText.charCodeAt(i);
            console.log(charCode);
            const encryptedValue = modPow(charCode, publicKey, n); // Use modPow function here
            encryptedArray.push(encryptedValue);
        }
        console.log(encryptedArray);
        document.getElementById('encryptedText').value = encryptedArray.join(', ');
    } else {
        alert('Please Enter a valid E (public key) value.');
    }
}


function calculateD() {
    const e = parseInt(document.getElementById('e').value);
    if (e) {
        const phiN = parseInt(document.getElementById('φ(n)').value);
        if (gcd(e, phiN) === 1) {
            const d = modInverse(e, phiN);
            document.getElementById('d').value = d;
        } else {
            alert('The GCD of E and φ(n) is not equal to 1. D does not exist.');
        }
    } else {
        alert('Please Enter E Value.');
    }
}

function modInverse(a, m) {
    let m0 = m;
    let x0 = 0;
    let x1 = 1;
    if (m === 1) return 0;
    while (a > 1) {
        const q = Math.floor(a / m);
        let t = m;
        m = a % m;
        a = t;
        t = x0;
        x0 = x1 - q * x0;
        x1 = t;
    }
    if (x1 < 0) x1 += m0;
    return x1;
}

function extendedGCD(a, b) {
    if (a === 0) {
        return [0, 1];
    }
    const [x1, y1] = extendedGCD(b % a, a);
    const x = y1 - Math.floor(b / a) * x1;
    const y = x1;
    return [x, y];
}

function decrypt() {
    const privateKey = (document.getElementById('d').value);
    if (privateKey > 0n) {
        const encryptedText = document.getElementById('plainText_d').value;
        const n = (document.getElementById('n').value);
        const encryptedArray = encryptedText.split(', ');
        const decryptedArray = [];
        for (let i = 0; i < encryptedArray.length; i++) {
            const encryptedValue = (encryptedArray[i]);
            const decryptedValue = modPow(encryptedValue, privateKey, n);
            decryptedArray.push(decryptedValue.toString());
        }
        const decryptedText = decryptedArray.join(', ');
        document.getElementById('decryptedText').value = decryptedText;
    } else {
        alert('Please Enter a valid D (private key) value.');
    }
}

function modPow(base, exponent, modulus) {
    if (modulus === 1) return 0;
    let result = 1;
    base = base % modulus;
    while (exponent > 0) {
        if (exponent % 2 === 1) {
            result = (result * base) % modulus;
        }
        exponent = Math.floor(exponent / 2);
        base = (base * base) % modulus;
    }
    return result;
}

function factorise() {
    const inputValue = document.getElementById('factor').value;
    const numberToFactorize = parseInt(inputValue);
    if (isNaN(numberToFactorize) || !Number.isInteger(numberToFactorize) || numberToFactorize <= 0) {
        document.getElementById('factoredText').value = 'Please enter a valid positive integer.';
        return;
    }
    const factors = getFactors(numberToFactorize);
    document.getElementById('factoredText').value = factors.join(', ');
}

function getFactors(number) {
    const factors = [];
    for (let i = 1; i <= number; i++) {
        if (number % i === 0) {
            factors.push(i);
        }
    }
    return factors;
}

function reset() {
    document.getElementById('factor').value = '';
    document.getElementById('factoredText').value = '';
}

function expo() {
    const base = parseInt(document.getElementById('base').value);
    const exponent = parseInt(document.getElementById('exponent').value);
    const modulo = parseInt(document.getElementById('modulo').value);

    if (isNaN(base) || isNaN(exponent) || isNaN(modulo)) {
        alert('Please enter valid numeric values.');
        return;
    }

    const result = modPow(base, exponent, modulo);
    document.getElementById('result_expo').value = base+" ^ "+exponent+" mod "+modulo+" = "+result;
}

function inv() {
    const integer = parseInt(document.getElementById('int').value);
    const moduloN = parseInt(document.getElementById('modulon').value);
    if (isNaN(integer) || isNaN(moduloN)) {
        alert('Please enter valid numeric values.');
        return;
    }
    const result = modInverse(integer, moduloN);
    if (result === null) {
        document.getElementById('result_inv').value = 'No modular inverse exists.';
    } else {
        document.getElementById('result_inv').value = integer+" ^-1 mod "+moduloN+" = "+result;
    }
}

function reset1() {
    document.getElementById('base').value = '';
    document.getElementById('exponent').value = '';
    document.getElementById('modulo').value = '';
    document.getElementById('result_expo').value = '';
}

function reset2() {
    document.getElementById('int').value = '';
    document.getElementById('modulon').value = '';
    document.getElementById('result_inv').value = '';
}

function copy1() {
    const encryptedText = document.getElementById('encryptedText');
    encryptedText.select();
    document.execCommand('copy');
    encryptedText.setSelectionRange(0, 0);
    alert('Text copied to clipboard');
}

function copy2() {
    const decryptedText = document.getElementById('decryptedText');
    decryptedText.select();
    document.execCommand('copy');
    decryptedText.setSelectionRange(0, 0);
    alert('Text copied to clipboard');
}
