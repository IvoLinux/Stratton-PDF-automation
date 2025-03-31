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


// DEPRECATED: ALL OF THE BELOW IS NO LONGER USED SINCE JSON IS DIRECTLY EMBEDDED AS INVISBLE TEXT IN PDF
// A lookup object: each parsed key -> path in the FormData class
export const FIELD_MAPPING = {
    "Abra sua Conta": "personalInfo.accountType",
    "Cartão de Débito Internacional Cartão de débito": "personalInfo.debitCard",
    "Informações Pessoais Nome Completo": "personalInfo.fullName",
    "E-mail": "personalInfo.email",
    "Você tem domicilio fiscal nos US ou em algum território americano?": "personalInfo.taxableInUS",
    "Cidadania(s)": "personalInfo.citizenships",
    "Celular": "personalInfo.cellphone",
    "Endereço": "personalInfo.address",
    "Cidade": "personalInfo.city",
    "Estado": "personalInfo.state",
    "CEP": "personalInfo.cep",
    "País": "personalInfo.country",
    "Status Profissional": "personalInfo.profession",
    "Documentos Passaporte": "personalInfo.passport",
    "1 Comprovante de residência": "personalInfo.proofOfResidence",
    "A conta possui segundo titular?": "otherTenants.otherTenants",
    "Informações Pessoais  Segundo titular  Documentos": "otherTenants.secondTenant",
    "Informações Pessoais  Terceiro titular  Documentos": "otherTenants.thirdTenant",
    "Informações Pessoais  Quarto titular  Documentos": "otherTenants.fourthTenant",
    "Informações da Empresa  Informações do Sócio Principal Documentos": "otherMember.firstMember",
    "Repita o cadastro para todos os sócios com mais de 10%  Informações Pessoais  Segundo sócio  Documentos": "otherMember.secondMember",
    "Repita o cadastro para todos os sócios com mais de 10%  Informações Pessoais  Terceiro sócio  Documentos": "otherMember.thirdMember",
    "Repita o cadastro para todos os sócios com mais de 10%  Informações Pessoais  Quarto sócio  Documentos": "otherMember.fourthMember",
    "Perfil do Investidor Qual a sua experiência como investidor?": "financeData.experience",
    "2 Valor total dos investimentos financeiros": "financeData.portfolioValue",
    "Valor total do seu patrimônio, incluindo imóveis": "financeData.netAssetsValue",
    "Faixa de renda": "financeData.monthlyIncome",
    "Indique abaixo o perfil desejado para seus investimentos no exterior:": "financeData.investorProfile",
    "Reservamos esse espaço para comentários que você julgue relevantes para planejarmos seus investimentos": "financeData.additionalInfo",
    "Informações Adicionais Como você conheceu a Stratton?": "metaInfo.howDidYouHearAboutUs",
};

export const FIELDS = Object.keys(FIELD_MAPPING);

// Receives parsedData, which is the mapping from the field names in the form to their respective values
// Inserts the data into a FormData instance
export function mapParsedDataToFormData(parsedData) {
    const formData = new FormData();

    // Loop through each parsed key-value pair
    for (const [rawKey, rawValue] of Object.entries(parsedData)) {
        // Check if we have a known mapping
        if (FIELD_MAPPING[rawKey]) {
            // Set the nested property on our formData instance
            setDeepValue(formData, FIELD_MAPPING[rawKey], rawValue);
        }
    }

    return formData;
}

// Helper function that takes the field name and interprets it to the correct property in FormData
export function setDeepValue(obj, path, value) {
    // Split the path, e.g. "personalInfo.name" -> ["personalInfo", "name"]
    const parts = path.split(".");
    let current = obj;

    // Traverse each part of the path except the last
    for (let i = 0; i < parts.length - 1; i++) {
        const key = parts[i];
        // If this key doesn't exist yet, create it as an empty object
        if (!current[key]) {
            current[key] = {};
        }
        current = current[key];
    }

    // Set the final property
    const lastKey = parts[parts.length - 1];
    current[lastKey] = value;
}