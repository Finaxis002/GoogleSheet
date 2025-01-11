document.getElementById("PrintData").addEventListener("click", async () => {
  const apiKey = "AIzaSyDS0aWoloQlZj99DOTAZgzXxV8qo1Ax8Kk"; // Replace with your Google Sheets API key
  const spreadsheetId = "1sBM1jWKaTXbFoR_wg7L3yE2JqRCIv4-xvCRFI-YYOx4"; // Spreadsheet ID
  const rangeData = "Sheet2!A1:B6"; // Range to fetch the data
  const rangeName = "Sheet1!B3"; // Range to fetch the name for filename

  try {
    // Fetch the value for the name from Sheet1!B4
    const nameUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${rangeName}?key=${apiKey}`;
    const nameResponse = await fetch(nameUrl);
    if (!nameResponse.ok) throw new Error("Failed to fetch name for filename");
    const nameData = await nameResponse.json();
    const name = nameData.values ? nameData.values[0][0] : "GoogleSheetData"; // Use value from B4, fallback to default name

    // Fetch the data from Sheet2
    const dataUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${rangeData}?key=${apiKey}`;
    const dataResponse = await fetch(dataUrl);
    if (!dataResponse.ok)
      throw new Error("Failed to fetch data from the sheet");
    const sheetData = await dataResponse.json();
    const values = sheetData.values;

    // Generate PDF with jsPDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const cellWidth = 95; // Width of each cell
    const cellHeight = 10; // Height of each cell
    const startX = 10; // Start X position for the table
    let startY = 20; // Start Y position for the table

    // Add table rows with custom styling
    values.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const x = startX + colIndex * cellWidth;
        const y = startY;

        // Set background color and text color
        if (colIndex === 0) {
          // A column
          doc.setFillColor(76, 175, 80); // #4CAF50
          doc.setTextColor(255, 255, 255); // White
        } else {
          // B column
          doc.setFillColor(255, 255, 255); // White
          doc.setTextColor(0, 0, 0); // Black
        }

        // Draw cell background
        doc.rect(x, y, cellWidth, cellHeight, "F");

        // Draw cell border
        doc.setDrawColor(221, 221, 221); // #DDDDDD
        doc.setLineWidth(0.3);
        doc.rect(x, y, cellWidth, cellHeight, "S");

        // Add text
        doc.text(cell, x + 5, y + 7); // Add padding inside the cell
      });

      startY += cellHeight; // Move to the next row
    });

    // Create dynamic filename using the value from B4 (e.g., 'AkiritiReport.pdf')
    const fileName = `${name}Report.pdf`;
    const pdfBlob = doc.output("blob");

    // Save the styled PDF with dynamic filename
    doc.save(fileName);

    const emailData = new FormData();
    emailData.append("email", "priyadiw128@gmail.com"); // Recipient email
    emailData.append("subject", "PDF Report Generated"); // Subject
    emailData.append(
      "message",
      `Project report for '${name}' has been printed.`
    ); // Message with dynamic name
    emailData.append("attachment", pdfBlob, fileName);

    const response = await fetch(
      "https://formsubmit.co/ajax/priyadiw128@gmail.com",
      {
        method: "POST",
        body: emailData,
      }
    );

    if (!response.ok) throw new Error("Failed to send email");
    console.log("Email notification sent successfully!");
  } catch (error) {
    console.error("Error:", error.message);
    alert("An error occurred while generating the report. Please try again.");
  }
});
