const fs = require('fs');
const path = require('path');

const filename = '09578e8d-05c9-4db1-9c6a-d3427abdad4f.png'; // One of the files listed in LS
const filePath = path.join(process.cwd(), 'public', 'uploads', filename);

console.log('Checking file:', filePath);
if (fs.existsSync(filePath)) {
  console.log('File exists!');
} else {
  console.log('File NOT found!');
}

const missingFilename = '4986b514-9f9e-4637-9d49-5b0f8b78ad67.png';
const missingFilePath = path.join(process.cwd(), 'public', 'uploads', missingFilename);
console.log('Checking missing file:', missingFilePath);
if (fs.existsSync(missingFilePath)) {
  console.log('Missing File exists!');
} else {
  console.log('Missing File NOT found!');
}
