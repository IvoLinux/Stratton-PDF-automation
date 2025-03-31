// Extracts the PDF text
export async function extractTextFlattened(pdfFile) {
    const arrayBuffer = await pdfFile.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let allText = "";

    // Could optimise to only get text from last page, however is unecessary and might lead to confusion later
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();

        const pageText = content.items.map(item => item.str).join(" ");
        allText += pageText + " ";
    }

    return allText;
}

// Converts text into an object holding the form data
export function parseJsonText(rawText) {
    // Find predefined JSON delimiters amidst the text
    // These delimiters ♦♦ are set in the jotform PDF editor with stratton's account
    const delimiter = "♦♦";
    const startIndex = rawText.indexOf(delimiter);
    const endIndex = rawText.indexOf(delimiter, startIndex + delimiter.length);

    if (startIndex !== -1 && endIndex !== -1) {
        // Reconstruct a valid JSON string by wrapping the body in actual curly braces
        const jsonBody = rawText.substring(startIndex + delimiter.length, endIndex);
        const validJsonString = "{" + jsonBody + "}";

        // Parse the JSON string into a JavaScript object
        return JSON.parse(validJsonString);
    } else {
        throw ("JSON delimiters not found in the PDF");
    }
}


// DEPRECATED: NO LONGER USED SINCE JSON IS DIRECTLY EMBEDDED AS INVISBLE TEXT IN PDF
// Parse the text using known field names. Although hard to maintain, it is the best way to ensure the fields are properly extracted
export function parseWithAnchors(fullText, fields) {
    // console.log(fullText)
    // Object to store extracted values
    const extracted = {};

    // For each field, grab the text up to the next field or the end of the string
    for (let i = 0; i < fields.length; i++) {
        const fieldName = fields[i];
        // Regex to escape any special characters that might appear in the field name
        const safeFieldName = fieldName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

        // Create a pattern that matches:
        // - The current field name
        // - Followed by any text (non-greedy)
        // - Stopping right before the next field name or the end of the string
        let nextFieldNameRegex;
        if (i < fields.length - 1) {
            const nextField = fields[i + 1].replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            nextFieldNameRegex = new RegExp(`${safeFieldName}\\s*(.*?)\\s*(?=${nextField})`, "s");
        } else {
            // If it's the last field, capture everything until the end
            nextFieldNameRegex = new RegExp(`${safeFieldName}\\s*(.*)`, "s");
        }

        // Execute the regex on the fullText
        const match = fullText.match(nextFieldNameRegex);
        if (match && match[1]) {
            extracted[fieldName] = match[1].trim();
        } else {
            extracted[fieldName] = null;
        }
    }

    return extracted;
}