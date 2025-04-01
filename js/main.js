import { StrattonFormData } from './formData.js';
import { extractTextFlattened, parseJsonText } from './parser.js';
import { populateW8BEN, populateSchwabApplication } from './templateFiller.js';

document.addEventListener('DOMContentLoaded', () => {
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('file-input');
    const processBtn = document.getElementById('process-btn');
    let uploadedFile = null;

    // Update UI when a file is uploaded. Also checks if it's a valid .pdf
    function handleFileUpload(files) {
        document.getElementById('download-doc1-area').classList.add('hidden');
        document.getElementById('download-doc3-area').classList.add('hidden');
        document.getElementById("error-message").classList.add('hidden');

        if (!files.length) return;
        const file = files[0];
        if (file.type === 'application/pdf') {
            uploadedFile = file;
            uploadArea.innerHTML = `<p>${file.name} selected</p>`;
            processBtn.disabled = false;
        } else {
            alert('Please upload a PDF file.');
        }
    }

    // Event listeners for file selection and drag/drop
    uploadArea.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => handleFileUpload(e.target.files));
    ['dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, (e) => {
            e.preventDefault();
            if (eventName === 'dragover') {
                uploadArea.classList.add('hover');
            } else {
                uploadArea.classList.remove('hover');
                if (eventName === 'drop') {
                    handleFileUpload(e.dataTransfer.files);
                }
            }
        });
    });

    // Process the PDF on button click
    processBtn.addEventListener('click', async () => {
        if (!uploadedFile) return;
        processBtn.innerText = 'Processing...';
        processBtn.disabled = true;
        await processPDF(uploadedFile);
        processBtn.innerText = 'Process PDF';
        processBtn.disabled = false;
    });
});

async function processPDF(file) {
    try {
        // 1: Extract and parse text data from the uploaded PDF
        const fullText = await extractTextFlattened(file);
        const parsedData = parseJsonText(fullText);
        const formDataInstance = new StrattonFormData(parsedData);
        console.log('Extracted Data:', formDataInstance);

        // 2: Load the template PDFs using PDF-lib
        const basePath = window.location.pathname.replace(/\/[^/]*$/, ''); // Works for local and deployment environments (?)
        const w8benTemplateUrl = `${basePath}/assets/pdf/3. W-8BEN new.pdf`;
        const schwabTemplateUrl = `${basePath}/assets/pdf/1. International Schwab Account Application.pdf`;

        const [w8benBytes, schwabBytes] = await Promise.all([
            fetch(w8benTemplateUrl).then(res => res.arrayBuffer()),
            fetch(schwabTemplateUrl).then(res => res.arrayBuffer())
        ]);

        const pdfDocW8BEN = await PDFLib.PDFDocument.load(w8benBytes);
        const pdfDocSchwab = await PDFLib.PDFDocument.load(schwabBytes);

        // 3: Populate the PDFs
        await populateW8BEN(pdfDocW8BEN, formDataInstance.accountHolder1);
        await populateSchwabApplication(pdfDocSchwab, formDataInstance.accountHolder1);

        // 4: Save the modified PDFs and prepare download URLs
        const modifiedPdfBytesW8BEN = await pdfDocW8BEN.save();
        const blobW8BEN = new Blob([modifiedPdfBytesW8BEN], { type: 'application/pdf' });
        const urlW8BEN = URL.createObjectURL(blobW8BEN);

        const modifiedPdfBytesSchwab = await pdfDocSchwab.save();
        const blobSchwab = new Blob([modifiedPdfBytesSchwab], { type: 'application/pdf' });
        const urlSchwab = URL.createObjectURL(blobSchwab);

        // 5: Update download anchors in html
        const downloadLinkW8BEN = document.getElementById('download-doc3-link');
        downloadLinkW8BEN.href = urlW8BEN;
        downloadLinkW8BEN.download = '3. W-8BEN—' + formDataInstance.accountHolder1.fullName + '.pdf';
        document.getElementById('download-doc3-area').classList.remove('hidden');

        const downloadLinkSchwab = document.getElementById('download-doc1-link');
        downloadLinkSchwab.href = urlSchwab;
        downloadLinkSchwab.download = '1. International Schwab Account Application—' + formDataInstance.accountHolder1.fullName + '.pdf';
        document.getElementById('download-doc1-area').classList.remove('hidden');

    } catch (error) {
        const errorDiv = document.getElementById("error-message");
        errorDiv.textContent = error;
        errorDiv.classList.remove('hidden');
        console.error('Error processing PDF:', error);
    }
}
