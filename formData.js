// Contains personal data of each account holder
export class AccountHolder {
    constructor(person) {
        this.fullName = person.fullName ?? null;
        this.email = person.email ?? null;
        this.taxIdType = person.taxIdType ?? null;
        this.taxId1 = person.taxId1 ?? null;
        this.taxId2 = person.taxId2 ?? null;
        this.taxId3 = person.taxId3 ?? null;
        this.usaResidence = person.usaResidence ?? null;
        this.citizenships = person.citizenships ?? null;
        this.cellphoneNumber = person.cellphoneNumber ?? null;
        this.homePhoneNumber = person.homePhoneNumber ?? null;
        this.homeAddress = person.homeAddress ?? null;
        this.city = person.city ?? null;
        this.zipCode = person.zipCode ?? null;
        this.country = person.country ?? null;
        this.professionalSituation = person.professionalSituation ?? null;
        this.profession = person.profession ?? null;
        this.employerName = person.employerName ?? null;
        this.employerAddress = person.employerAddress ?? null;
        this.employerSpecify = person.employerSpecify ?? null;
        this.professionAddress = person.professionAddress ?? null;
    }
}


// FormData encapsulates all the data found in the PDF received from the Stratton form
export class MyFormData {
    constructor(flatData) {
        this.accountType = flatData.accountType;
        this.debitCardOptions = flatData.debitCardOptions;

        this.enterpriseName = flatData.enterpriseName;
        this.enterprisePhoneNumber = flatData.enterprisePhoneNumber;
        this.enterpriseCountry = flatData.enterpriseCountry;
        this.enterpriseTaxId = flatData.enterpriseTaxId;
        this.enterpriseNAICS = flatData.enterpriseNAICS;
        this.enterpriseOperationType = flatData.enterpriseOperationType;
        this.enterpriseServices = flatData.enterpriseServices;
        this.enterpriseActivityDescription = flatData.enterpriseActivityDescription;

        this.investingExperience = flatData.investingExperience;
        this.totalFinancialInvestments = flatData.totalFinancialInvestments;
        this.totalAssets = flatData.totalAssets;
        this.monthlyIncome = flatData.monthlyIncome;
        this.investmentProfile = flatData.investmentProfile;
        this.initialDeposit = flatData.initialDeposit;
        this.additionalComments = flatData.additionalComments;
        this.howDidYouHearOfUs = flatData.howDidYouHearOfUs;
        this.personalRecommendation = flatData.personalRecommendation;
        this.onlineMedia = flatData.onlineMedia;
        this.investmentFirmRecommendation = flatData.investmentFirmRecommendation;
        this.ip = flatData.ip;


        // Regular expression to match keys: "accountHolder1FullName" or "associate2Email"
        const accountHolderRegex = /^(accountHolder\d+)([A-Z]\w+)$/;
        const associateRegex = /^(associate\d+)([A-Z]\w+)$/;
        // Temporary object to collect fields for each person.
        const personsData = {};

        // Aggregates the flaData into personsData according to the regex
        for (const key in flatData) {
            const match = key.match(accountHolderRegex) || key.match(associateRegex);
            if (match) {
                // Group fields by identifier (e.g. "accountHolder1")
                const personKey = match[1];
                const rawField = match[2];
                const fieldName = rawField.charAt(0).toLowerCase() + rawField.slice(1);

                if (!personsData[personKey]) {
                    personsData[personKey] = {};
                }
                personsData[personKey][fieldName] = flatData[key];
            }
        }

        // Instantiate AccountHolder objects for each grouped person and assign to this.
        for (const personKey in personsData) {
            this[personKey] = new AccountHolder(personsData[personKey]);
        }
    }
}

