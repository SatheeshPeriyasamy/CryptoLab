function getKeySize() {
  var a = parseInt(document.getElementById("size").value);
  return a;
}

function getkey() {
  var a = document.getElementById("key").value;
  return a;
}

function getPlainText() {
  var a = document.getElementById("plaintext").value;
  return a;
}

function getCipherText() {
  var a = document.getElementById("ciphertext").value;
  return a;
}

function calculateDeterminant(matrix) {
  const n = matrix.length;

  if (n === 2) {
    return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
  }

  let determinant = 0;
  for (let i = 0; i < n; i++) {
    determinant += matrix[0][i] * calculateCofactor(matrix, 0, i);
  }

  return determinant;
}

function calculateCofactor(matrix, row, col) {
  const subMatrix = [];
  const n = matrix.length;

  for (let i = 0; i < n; i++) {
    if (i !== row) {
      subMatrix.push(matrix[i].filter((_, index) => index !== col));
    }
  }

  const sign = (row + col) % 2 === 0 ? 1 : -1;
  return sign * calculateDeterminant(subMatrix);
}

function isMatrixInvertible(matrix) {
  const determinant = calculateDeterminant(matrix);
  return determinant;
}

function matrixMultiply(matrixA, matrixB) {
  const result = [];
  const n = matrixA.length;

  for (let i = 0; i < n; i++) {
    result[i] = [];
    for (let j = 0; j < matrixB[0].length; j++) {
      var sum = 0;
      for (let k = 0; k < matrixB.length; k++) {
        sum += matrixA[i][k] * matrixB[k][j];
      }
      result[i][j] = modValue(sum);
    }
  }

  return result;
}

function stringToMatrix(matSize, PT){
  var plainText = PT;
  const n = matSize;
  const positionMatrix = [];
  
  while (plainText.length % n !== 0) {
    plainText += "x";
  }
  
  for (let k = 0; k < plainText.length; k++) {
      positionMatrix.push(plainText.charCodeAt(k) - 32 - 65);
  }
  
  var plainTextMatrix = [];
  for (let i = 0; i < n; i++) {
    var sum = i;
    plainTextMatrix[i]=[];
    for (let j = 0; j < positionMatrix.length/n; j++) {
      plainTextMatrix[i][j] = positionMatrix[sum];
      sum+=n;
    }
  }
  return plainTextMatrix;
}

function matrixToString(encryptedMatrix){
  var encryptedText = "";
  for (let i = 0; i < encryptedMatrix[0].length; i++) {
    for (let j = 0; j < encryptedMatrix.length; j++) {
      encryptedText += String.fromCharCode((encryptedMatrix[j][i] % 26) + 97);
    }
  }
  return encryptedText;
}


function modValue(s){
  var val = s;
  if(val < 0)
  {
    val = 26 - ((-1)*val % 26);
  }
  else{
    val = val % 26;
  }
  return val;
}

function ModInverse(a, m) {
  a = a % m;
  for (let x = 1; x < m; x++) {
    if ((a * x) % m === 1) {
      return x;
    }
  }
  return 1;
}

function transposeMatrix(matrix) {
  const rows = matrix.length;
  const cols = matrix[0].length;
  const transposedMatrix = [];
  for (let i = 0; i < cols; i++) {
    transposedMatrix[i] = [];
    for (let j = 0; j < rows; j++) {
      transposedMatrix[i][j] = matrix[j][i];
    }
  }

  return transposedMatrix;
}

function calculateAdjoint(matrix) {
  const n = matrix.length;
  const adjoint = [];
  if (matrix.length === 2) {
    const adjoint = [
      [matrix[1][1], -matrix[0][1]],
      [-matrix[1][0], matrix[0][0]],
    ];
    return adjoint;
  }
  for (let i = 0; i < n; i++) {
    adjoint[i] = [];
    for (let j = 0; j < n; j++) {
      const cofactor = calculateCofactor(matrix, i, j);
      adjoint[i][j] = cofactor;
    }
  }

  return transposeMatrix(adjoint);
}



function gcd(a, b) {
  while(a != b){
      if(a > b) {
          a -= b;
      }
      else {
          b -= a;
      }
  }
  return a;
}

function scalarMultiply(matrix, scalar){
  var a = [];
  for (let i = 0; i < matrix.length; i++) {
    a[i] = [];
    for (let j = 0; j < matrix.length; j++) {
      a[i].push(modValue(matrix[i][j]*scalar));
    }
  }
  return a;
}

function encrypt() {
  var plainText = getPlainText();
  var KeySize = getKeySize();
  var key = getkey();
  if(plainText.length === 0){
    window.alert("Enter the plaintext");
    return;
  }

  if(key.length !== KeySize*KeySize){
    window.alert("Enter appropriate key");
    return;
  }

  var keyMatrix = stringToMatrix(KeySize, key);

  var a = isMatrixInvertible(keyMatrix);

  if (a === 0) {
    window.alert("Enter the valid key");
    return;
  }

  const plainTextMatrix = stringToMatrix(KeySize, plainText);  

  const encryptedMatrix = matrixMultiply(keyMatrix, plainTextMatrix);
  
  let encryptedText = matrixToString(encryptedMatrix);

  document.getElementById("ciphertext").value = encryptedText;
}

function decrypt() {
  var ciphertext = getCipherText();
  var KeySize = getKeySize();
  var key = getkey();
  if(ciphertext.length === 0){
    window.alert("Enter the ciphertext");
    return;
  }

  if(ciphertext.length%KeySize !== 0){
    window.alert("Enter correct cipher text of correct length");
    return;
  }

  if(key.length !== KeySize*KeySize){
    window.alert("Enter appropriate key");
    return;
  }

  var keyMatrix = stringToMatrix(KeySize, key);

  var detofKey = modValue(calculateDeterminant(keyMatrix));

  if (detofKey === 0){
    window.alert("Enter the valid key");
    return;
  }

  var gc = gcd(detofKey, 26);

  if(gc!==1){
    window.alert("Inverse of key does not exists");
    return;
  }

  var cipherMatrix = stringToMatrix(ciphertext, KeySize);

  var inverse = ModInverse(gc, 26);

  var adjoint = calculateAdjoint(keyMatrix);

  var kInverse = scalarMultiply(adjoint, inverse);

  var ptMatrix = matrixMultiply(kInverse, cipherMatrix);

  var pt = matrixToString(ptMatrix);

  document.getElementById("plaintext").value = pt;
}

function knownPTCT(){
  var pt = document.getElementById("pt").value;
  var ct = document.getElementById("ct").value;
  var ks = document.getElementById("size").value;

  if(pt.length === 0){
    window.alert("Enter the known plaintext");
    return;
  }
  if(ct.length === 0){
    window.alert("Enter the known ciphertext");
    return;
  }

  if (ks.length === 0){
    window.alert("Enter key size");
    return;
  }
  
  if(ct.length !== pt.length){
    window.alert("Enter the equal length of plain and cipher text");
    return;
  }

  if(ct.length < ks*ks || pt.length < ks*ks){
    window.alert("Enter the appropriate key size");
    return;
  }

  ks = parseInt(ks);

  var plainTextMatrix = stringToMatrix(ks, pt);
  var cipherTextMatrix = stringToMatrix(ks, ct);
  
  var cMat = []; 
  var detCT;

  for (let i = 0; i < cipherTextMatrix[0].length-ks+1; i++) {
    var subCipher = [];
    for (let j = 0; j < cipherTextMatrix.length; j++) {
      subCipher[j] = [];
      for (let k = i; k < ks+i; k++) {
        subCipher[j].push(cipherTextMatrix[j][k]);
      }
    }
    var det = calculateDeterminant(subCipher);
    var moddet = modValue(det);
    var gc = gcd(moddet, 26);
    if(det !== 0 && gc === 1){
      cMat = subCipher;
      detCT = moddet;
      break;
    }
  }
  if(cMat.length === 0){
    window.alert("Inverse does not existes for given cipher text! Try for different");
    return;
  }

  var inverse = modValue(ModInverse(detCT, 26));


  var adjoint = calculateAdjoint(cMat);

  var cInverse = scalarMultiply(adjoint, inverse);

  var p = [];
  for (let j = 0; j < plainTextMatrix.length; j++) {
    p[j] = [];
    for (let k = 0; k < ks; k++) {
      p[j].push(plainTextMatrix[j][k]);
    }
  }

  console.log(p);

  var key = matrixMultiply(p, cInverse);

  var cipher = matrixToString(key);

  document.getElementById("deckey").value = cipher;

}

function goto(){
  var a  = document.getElementById("s").value;
  if(a === "Hill Cipher"){
    window.location.href = "./b.html";
  }
  else{
    window.location.href = "./z.html";
  }
}
