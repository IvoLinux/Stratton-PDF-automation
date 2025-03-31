import { StrattonFormData } from './formData.js';
import { extractTextFlattened, parseJsonText } from './parser.js';

document.addEventListener('DOMContentLoaded', () => {
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('file-input');
    const processBtn = document.getElementById('process-btn');
    let uploadedFile = null;

    // Helper: Enable processing when a valid PDF is selected
    function handleFiles(files) {
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
    fileInput.addEventListener('change', (e) => handleFiles(e.target.files));
    ['dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, (e) => {
            e.preventDefault();
            if (eventName === 'dragover') {
                uploadArea.classList.add('hover');
            } else {
                uploadArea.classList.remove('hover');
                if (eventName === 'drop') {
                    handleFiles(e.dataTransfer.files);
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

        // 2: Load template PDF using PDF-lib
        const templateUrl = '3. W-8BEN new.pdf';
        const existingPdfBytes = await fetch(templateUrl).then(res => res.arrayBuffer());
        const pdfDoc = await PDFLib.PDFDocument.load(existingPdfBytes);

        const templateUrl1 = '1. International Schwab Account Application.pdf';
        const existingPdfBytes1 = await fetch(templateUrl1).then(res => res.arrayBuffer());
        const pdfDoc1 = await PDFLib.PDFDocument.load(existingPdfBytes1);

        // 3: Access the form in the PDF
        const form = pdfDoc.getForm();
        const notFoundText = '';

        var homeTelephoneField = form.getTextField('clients[0].Form[0].Section1[0].border[0].Hometelephonenumbe[0]');
        var nameField = form.getTextField('clients[0].Form[0].Section1[0].border[0].Nameofindividualw[0]');
        var addressField = form.getTextField('clients[0].Form[0].Section1[0].border[0].Permanentresidence[0]');
        var stateField = form.getTextField('clients[0].Form[0].Section1[0].border[0].Cityortownstate[0]');
        var countryField = form.getTextField('clients[0].Form[0].Section1[0].border[0].CountryDonotabbr[0]');
        var usaTaxId = form.getTextField('clients[0].Form[0].Section1[0].border[0].USTaxpayerIdenti[0]');
        var foreignTaxId = form.getTextField('clients[0].Form[0].Section1[0].border[0].Foreigntaxidentify[0]');

        homeTelephoneField.setText(formDataInstance.accountHolder1.homePhoneNumber || notFoundText);
        nameField.setText(formDataInstance.accountHolder1.fullName || notFoundText);
        addressField.setText(formDataInstance.accountHolder1.homeAddress || notFoundText);
        stateField.setText(formDataInstance.accountHolder1.city + ", " + formDataInstance.accountHolder1.state || notFoundText);
        countryField.setText(formDataInstance.accountHolder1.country || notFoundText);
        if (formDataInstance.accountHolder1.taxIdType.includes("USA"))
            usaTaxId.setText(formDataInstance.accountHolder1.taxId1 || formDataInstance.accountHolder1.taxId2 || formDataInstance.accountHolder1.taxId3);
        else
            foreignTaxId.setText(formDataInstance.accountHolder1.taxId1 || formDataInstance.accountHolder1.taxId2 || formDataInstance.accountHolder1.taxId3);

        const form1 = pdfDoc1.getForm();

        var firstNameField = form1.getTextField('clients[0].Form[0].Section3start[0].border[0].AccountHolder[0].Name[0].NameFirst[0]');
        var middleNameField = form1.getTextField('clients[0].Form[0].Section3start[0].border[0].AccountHolder[0].Name[0].Middle[0]');
        var lastNameField = form1.getTextField('clients[0].Form[0].Section3start[0].border[0].AccountHolder[0].Name[0].Last[0]');
        var addressField = form1.getTextField('clients[0].Form[0].Section3start[0].border[0].AccountHolder[0].HomeLegalStreetAd[0]');
        var cityField = form1.getTextField('clients[0].Form[0].Section3start[0].border[0].AccountHolder[0].City[0]');
        var stateField = form1.getTextField('clients[0].Form[0].Section3start[0].border[0].AccountHolder[0].StateProvinceRegio[0]');
        var countryField = form1.getTextField('clients[0].Form[0].Section3start[0].border[0].AccountHolder[0].Country[0]');
        var cepField = form1.getTextField('clients[0].Form[0].Section3start[0].border[0].AccountHolder[0].ZipPostalCode[0]');
        var homeTelephoneField = form1.getTextField('clients[0].Form[0].Section3start[0].border[0].AccountHolder[0].HomeTelephoneNumbe[0]');
        var cellphoneField = form1.getTextField('clients[0].Form[0].Section3start[0].border[0].AccountHolder[0].CellularTelephoneN[0]');

        var employerNameField = form1.getTextField('clients[0].Form[0].Section3start[0].border[0].AccountHolder[0].EmploymentOccupation[0].Occupation[0].businessAddressDetails[0].employerName[0]');
        var employerAddressField = form1.getTextField('clients[0].Form[0].Section3start[0].border[0].AccountHolder[0].EmploymentOccupation[0].Occupation[0].businessAddressDetails[0].businessStreet[0]');
        var emailField = form1.getTextField('clients[0].Form[0].Section9start[0].border[0].Emailaddress[0]');

        const fullName = formDataInstance.accountHolder1.fullName;
        const firstSpaceIndex = fullName.indexOf(" ");
        const lastSpaceIndex = fullName.lastIndexOf(" ");
        firstNameField.setText(fullName.substring(0, firstSpaceIndex));
        middleNameField.setText(fullName.substring(firstSpaceIndex + 1, lastSpaceIndex));
        lastNameField.setText(fullName.substring(lastSpaceIndex + 1));
        addressField.setText(formDataInstance.accountHolder1.homeAddress || notFoundText);
        cityField.setText(formDataInstance.accountHolder1.city || notFoundText);
        stateField.setText(formDataInstance.accountHolder1.state || notFoundText);
        countryField.setText(formDataInstance.accountHolder1.country || notFoundText);
        cepField.setText(formDataInstance.accountHolder1.zipCode || notFoundText);
        homeTelephoneField.setText(formDataInstance.accountHolder1.homePhoneNumber || notFoundText);
        cellphoneField.setText(formDataInstance.accountHolder1.cellphoneNumber || notFoundText);

        employerNameField.setText(formDataInstance.accountHolder1.employerName)
        employerAddressField.setText(formDataInstance.accountHolder1.employerAddress)
        emailField.setText(formDataInstance.accountHolder1.email)

        // 4: Save the modified PDF and create a downloadable blob
        const modifiedPdfBytes = await pdfDoc.save();
        const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);

        const modifiedPdfBytes1 = await pdfDoc1.save();
        const blob1 = new Blob([modifiedPdfBytes1], { type: 'application/pdf' });
        const url1 = URL.createObjectURL(blob1);

        // 5: Update the download link and reveal the download area
        const downloadLink = document.getElementById('download-doc3-link');
        downloadLink.href = url;
        downloadLink.download = '3. W-8BEN—' + formDataInstance.accountHolder1.fullName + '.pdf';
        document.getElementById('download-doc3-area').classList.remove('hidden');


        const downloadLink1 = document.getElementById('download-doc1-link');
        downloadLink1.href = url1;
        downloadLink1.download = '1. International Schwab Account Application—' + formDataInstance.accountHolder1.fullName + '.pdf';
        document.getElementById('download-doc1-area').classList.remove('hidden');

    } catch (error) {
        const errorDiv = document.getElementById("error-message");
        errorDiv.textContent = error;
        errorDiv.classList.remove('hidden');
        console.error('Error processing PDF:', error);
    }
}
