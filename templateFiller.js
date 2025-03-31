// This module contains functions to populate the PDF templates with form data.
export async function populateW8BEN(pdfDoc, accountHolder) {
    const form = pdfDoc.getForm();
    const notFoundText = '';

    // Get form fields for the W-8BEN template
    const homeTelephoneField = form.getTextField('clients[0].Form[0].Section1[0].border[0].Hometelephonenumbe[0]');
    const nameField = form.getTextField('clients[0].Form[0].Section1[0].border[0].Nameofindividualw[0]');
    const addressField = form.getTextField('clients[0].Form[0].Section1[0].border[0].Permanentresidence[0]');
    const stateField = form.getTextField('clients[0].Form[0].Section1[0].border[0].Cityortownstate[0]');
    const countryField = form.getTextField('clients[0].Form[0].Section1[0].border[0].CountryDonotabbr[0]');
    const usaTaxIdField = form.getTextField('clients[0].Form[0].Section1[0].border[0].USTaxpayerIdenti[0]');
    const foreignTaxIdField = form.getTextField('clients[0].Form[0].Section1[0].border[0].Foreigntaxidentify[0]');

    // Set common field values
    homeTelephoneField.setText(accountHolder.homePhoneNumber || notFoundText);
    nameField.setText(accountHolder.fullName || notFoundText);
    addressField.setText(accountHolder.homeAddress || notFoundText);
    stateField.setText(accountHolder.city + ", " + accountHolder.state || notFoundText);
    countryField.setText(accountHolder.country || notFoundText);

    // Set tax id field based on tax type
    if (accountHolder.taxIdType.includes("USA")) {
        usaTaxIdField.setText(accountHolder.taxId1 || accountHolder.taxId2 || accountHolder.taxId3 || notFoundText);
    } else {
        foreignTaxIdField.setText(accountHolder.taxId1 || accountHolder.taxId2 || accountHolder.taxId3 || notFoundText);
    }
}

export async function populateSchwabApplication(pdfDoc, accountHolder) {
    const form = pdfDoc.getForm();
    const notFoundText = '';

    // Get form fields for the International Schwab Account Application
    const firstNameField = form.getTextField('clients[0].Form[0].Section3start[0].border[0].AccountHolder[0].Name[0].NameFirst[0]');
    const middleNameField = form.getTextField('clients[0].Form[0].Section3start[0].border[0].AccountHolder[0].Name[0].Middle[0]');
    const lastNameField = form.getTextField('clients[0].Form[0].Section3start[0].border[0].AccountHolder[0].Name[0].Last[0]');
    const addressField = form.getTextField('clients[0].Form[0].Section3start[0].border[0].AccountHolder[0].HomeLegalStreetAd[0]');
    const cityField = form.getTextField('clients[0].Form[0].Section3start[0].border[0].AccountHolder[0].City[0]');
    const stateField = form.getTextField('clients[0].Form[0].Section3start[0].border[0].AccountHolder[0].StateProvinceRegio[0]');
    const countryField = form.getTextField('clients[0].Form[0].Section3start[0].border[0].AccountHolder[0].Country[0]');
    const cepField = form.getTextField('clients[0].Form[0].Section3start[0].border[0].AccountHolder[0].ZipPostalCode[0]');
    const homeTelephoneField = form.getTextField('clients[0].Form[0].Section3start[0].border[0].AccountHolder[0].HomeTelephoneNumbe[0]');
    const cellphoneField = form.getTextField('clients[0].Form[0].Section3start[0].border[0].AccountHolder[0].CellularTelephoneN[0]');
    const employerNameField = form.getTextField('clients[0].Form[0].Section3start[0].border[0].AccountHolder[0].EmploymentOccupation[0].Occupation[0].businessAddressDetails[0].employerName[0]');
    const employerAddressField = form.getTextField('clients[0].Form[0].Section3start[0].border[0].AccountHolder[0].EmploymentOccupation[0].Occupation[0].businessAddressDetails[0].businessStreet[0]');
    const emailField = form.getTextField('clients[0].Form[0].Section9start[0].border[0].Emailaddress[0]');

    // Split full name into first, middle, and last names
    const fullName = accountHolder.fullName || "";
    const firstSpaceIndex = fullName.indexOf(" ");
    const lastSpaceIndex = fullName.lastIndexOf(" ");
    const firstName = firstSpaceIndex > -1 ? fullName.substring(0, firstSpaceIndex) : fullName;
    const middleName = firstSpaceIndex > -1 && lastSpaceIndex > firstSpaceIndex
        ? fullName.substring(firstSpaceIndex + 1, lastSpaceIndex)
        : '';
    const lastName = lastSpaceIndex > -1 ? fullName.substring(lastSpaceIndex + 1) : '';

    firstNameField.setText(firstName);
    middleNameField.setText(middleName);
    lastNameField.setText(lastName);

    addressField.setText(accountHolder.homeAddress || notFoundText);
    cityField.setText(accountHolder.city || notFoundText);
    stateField.setText(accountHolder.state || notFoundText);
    countryField.setText(accountHolder.country || notFoundText);
    cepField.setText(accountHolder.zipCode || notFoundText);
    homeTelephoneField.setText(accountHolder.homePhoneNumber || notFoundText);
    cellphoneField.setText(accountHolder.cellphoneNumber || notFoundText);
    employerNameField.setText(accountHolder.employerName || notFoundText);
    employerAddressField.setText(accountHolder.employerAddress || notFoundText);
    emailField.setText(accountHolder.email || notFoundText);
}
