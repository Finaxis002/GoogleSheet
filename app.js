let jsonData = []; // Store the fetched data

const apiKey = "AIzaSyDS0aWoloQlZj99DOTAZgzXxV8qo1Ax8Kk"; // Replace with your Google API Key
const sheetId = "1SL6zBMZwndoYzqC6epTlauL9B1sWGJksmSVGvWBa44E"; // Replace with your Google Sheet ID
const sheetName = "Sheet1"; // Name of the sheet (usually "Sheet1")

const destinationSheetId = "1sBM1jWKaTXbFoR_wg7L3yE2JqRCIv4-xvCRFI-YYOx4"; // The destination Google Sheet ID to send data to

async function getData() {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}?key=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    jsonData = json.values; // Store data for later use

    console.log(json); // Check the fetched data in the console

    populateDropdown(jsonData); // Populate the dropdown with names
  } catch (error) {
    console.error(error.message);
  }
}

// Populate the dropdown with unique names from the data
function populateDropdown(data) {
  const dropdown = document.getElementById("nameDropdown");

  // Clear the existing options
  dropdown.innerHTML = "";

  // Get unique names from the data
  const names = [...new Set(data.slice(1).map((row) => row[2]))]; // Assuming name is in the 3rd column

  // Add each name to the dropdown
  names.forEach((name, index) => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    if (index === 0) {
      option.selected = true; // Make the first name selected by default
    }
    dropdown.appendChild(option);
  });

  // Add event listener to filter data based on selected name
  dropdown.addEventListener("change", filterData);

  // Trigger the filterData function for the first name
  if (names.length > 0) {
    filterData({ target: { value: names[0] } }); // Simulate the change event for the first name
  }
}


// Display the table data
function displayData(data) {
  const tableBody = document.getElementById("data");
  tableBody.innerHTML = ""; // Clear previous data

  data.slice(1).forEach((row, rowIndex) => {
    const tr = document.createElement("tr");

    const td1 = document.createElement("td");
    td1.textContent = row[0]; // Form Types (first column)
    td1.setAttribute("contenteditable", "true");
    tr.appendChild(td1);

    const td2 = document.createElement("td");
    td2.textContent = row[1]; // Date (second column)
    td2.setAttribute("contenteditable", "true");
    tr.appendChild(td2);

    const td3 = document.createElement("td");
    td3.textContent = row[2]; // Name (third column)
    td3.setAttribute("contenteditable", "true");
    td3.addEventListener("blur", () => updateDropdownName(rowIndex, td3.textContent, data)); // Update dropdown on edit
    tr.appendChild(td3);

    const td4 = document.createElement("td");
    td4.textContent = row[3]; // Phone Number (fourth column)
    td4.setAttribute("contenteditable", "true");
    tr.appendChild(td4);

    const td5 = document.createElement("td");
    td5.textContent = row[4]; // E-mail (fifth column)
    td5.setAttribute("contenteditable", "true");
    tr.appendChild(td5);

    const td6 = document.createElement("td");
    td6.textContent = row[5]; // Message (sixth column)
    td6.setAttribute("contenteditable", "true");
    tr.appendChild(td6);

    const td7 = document.createElement("td");
    td7.textContent = row[6]; // Business Details (seventh column)
    td7.setAttribute("contenteditable", "true");
    tr.appendChild(td7);

    tableBody.appendChild(tr);
  });
}

function updateDropdownName(rowIndex, newName, data) {
  // Update the name in the data array
  data[rowIndex + 1][2] = newName; // Assuming name is in the third column

  // Now update the dropdown to reflect the change
  populateDropdown(data);
}




// Filter data based on the selected name
function filterData(event) {
  const selectedName = event.target.value;

  // If no name is selected, show all data
  if (selectedName === "") {
    displayData(jsonData);
  } else {
    const filteredData = jsonData
      .slice(1)
      .filter((row) => row[2] === selectedName);
     displayData([jsonData[0], ...filteredData]); // Include the header row with filtered data
  }
}


// function generatePDF() {
//   const selectedName = document.getElementById("nameDropdown").value;

//   if (!selectedName) {
//     alert("Please select a name first.");
//     return;
//   }

//   // Find the row corresponding to the selected name
//   const tableRows = document.querySelectorAll("#data tr");
//   let selectedData = null;

//   tableRows.forEach((row) => {
//     const nameCell = row.cells[2]; // Name is in the 3rd column (index 2)
//     if (nameCell.textContent.trim() === selectedName.trim()) {
//       selectedData = Array.from(row.cells).map((cell) => cell.textContent.trim());
//     }
//   });

//   if (!selectedData) {
//     alert("No data found for the selected name.");
//     return;
//   }

//   const { jsPDF } = window.jspdf;
//   const doc = new jsPDF();

//   // Table style and layout
//   const startX = 10;
//   const startY = 20;
//   const cellWidth = 50;
//   const cellHeight = 10;

//   // Data structure to render
//   const data = [
//     ["Form Types", selectedData[0]],
//     ["Date", selectedData[1]],
//     ["Name", selectedData[2]],
//     ["Phone Number", selectedData[3]],
//     ["E-mail", selectedData[4]],
//     ["Message", selectedData[5]],
//     ["Business Details", selectedData[6]],
//   ];

//   // Draw table
//   data.forEach((row, index) => {
//     const y = startY + index * cellHeight;

//     // Draw background for labels
//     doc.setFillColor(76, 175, 80); // Green background
//     doc.rect(startX, y, cellWidth, cellHeight, "F");

//     // Draw background for values
//     doc.setFillColor(255, 255, 255); // White background
//     doc.rect(startX + cellWidth, y, cellWidth * 2, cellHeight, "F");

//     // Add borders for labels
//     doc.setDrawColor(221, 221, 221);
//     doc.setLineWidth(0.042); // Border thickness: 3px
//     doc.rect(startX, y, cellWidth, cellHeight, "S");

//     // Add borders for values
//     doc.rect(startX + cellWidth, y, cellWidth * 2, cellHeight, "S");

//     // Add text
//     doc.setFontSize(10);
//     doc.setTextColor(255, 255, 255); // White text for labels
//     doc.text(row[0], startX + 5, y + 7);

//     doc.setTextColor(0, 0, 0); // Black text for values
//     doc.text(row[1], startX + cellWidth + 5, y + 7);
//   });

//   // PDF filename
//   const pdfName = `${selectedName}_data.pdf`;

//   // Save the generated PDF
//   doc.save(pdfName);

//   // Now define the email parameters
//   const emailParams = {
//     to_email: "priyadiw128@gmail.com", // Owner's email address
//     subject: `Report Generated: ${pdfName}`,
//     message: `The report for ${selectedName} has been successfully generated. Please find the attached PDF: ${pdfName}.`,
//   };

//   // Send email to the owner
//   emailjs.init("SefUrMy_NeoIIgb5A"); // Initialize EmailJS with your user ID

//   emailjs.send("service_9226afz", "template_6w7lhal", emailParams)
//     .then((response) => {
//       console.log("Email sent successfully:", response);
//     })
//     .catch((error) => {
//       console.error("Error sending email:", error); // Log any error that occurred
//       if (error && error.text) {
//         console.error("EmailJS error response:", error.text); // Log the actual error message from EmailJS
//       }
//     });
// }




// Add event listener for Generate PDF button


function generatePDF() {
  const selectedName = document.getElementById("nameDropdown").value;

  if (!selectedName) {
    alert("Please select a name first.");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const totalPages = 30;

  // Dummy data template
  const generateDummyData = (pageNumber) => [
    ["Form Types", `Form Type ${pageNumber}`],
    ["Date", `2025-01-${pageNumber < 10 ? `0${pageNumber}` : pageNumber}`],
    ["Name", `User ${pageNumber}`],
    ["Phone Number", `+1 123-456-78${pageNumber}`],
    ["E-mail", `user${pageNumber}@example.com`],
    ["Message", `This is a sample message for page ${pageNumber}.`],
    ["Business Details", `Business description for page ${pageNumber}.`],
  ];

  // Dummy graph data template
  const generateGraphData = (pageNumber) => ({
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    values: [10 + pageNumber, 15 - pageNumber, 12 + pageNumber, 20 - pageNumber, 14 + pageNumber, 18 - pageNumber],
  });

  // Page layout settings
  const startX = 10;
  const startY = 20;
  const cellWidth = 50;
  const cellHeight = 10;

  for (let page = 1; page <= totalPages; page++) {
    if (page > 1) doc.addPage();

    // Page title
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(`Page ${page}`, startX, startY - 10);

    // Table rendering
    const dummyData = generateDummyData(page);
    dummyData.forEach((row, index) => {
      const y = startY + index * cellHeight;

      // Draw labels background
      doc.setFillColor(76, 175, 80); // Green background
      doc.rect(startX, y, cellWidth, cellHeight, "F");

      // Draw values background
      doc.setFillColor(255, 255, 255); // White background
      doc.rect(startX + cellWidth, y, cellWidth * 2, cellHeight, "F");

      // Add text
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255); // White text for labels
      doc.text(row[0], startX + 5, y + 7);

      doc.setTextColor(0, 0, 0); // Black text for values
      doc.text(row[1], startX + cellWidth + 5, y + 7);
    });

    // Add a placeholder graph
    const graphData = generateGraphData(page);
    const graphX = 10;
    const graphY = startY + dummyData.length * cellHeight + 10;
    const graphWidth = 180;
    const graphHeight = 60;

    // Draw a rectangle as graph background
    doc.setFillColor(230, 230, 230);
    doc.rect(graphX, graphY, graphWidth, graphHeight, "F");

    // Draw graph bars
    const barWidth = 20;
    graphData.labels.forEach((label, i) => {
      const barHeight = graphData.values[i] * 2; // Scale for visibility
      const barX = graphX + i * (barWidth + 10);
      const barY = graphY + graphHeight - barHeight;

      doc.setFillColor(100 + page, 150, 250 - page); // Bar color changes per page
      doc.rect(barX, barY, barWidth, barHeight, "F");

      // Label the bars
      doc.setFontSize(8);
      doc.setTextColor(0, 0, 0);
      doc.text(label, barX + 5, graphY + graphHeight + 5);
    });
  }

  // PDF filename
  const pdfName = `${selectedName}_data.pdf`;

  // Save the generated PDF
  doc.save(pdfName);
}



document.getElementById("GeneratePdf").addEventListener("click", generatePDF);




// Call getData when the page loads
getData();
