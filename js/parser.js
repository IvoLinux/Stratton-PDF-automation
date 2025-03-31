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
