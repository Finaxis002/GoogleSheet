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


function generatePDF() {
  const selectedName = document.getElementById("nameDropdown").value;

  if (!selectedName) {
    alert("Please select a name first.");
    return;
  }

  // Find the row corresponding to the selected name
  const tableRows = document.querySelectorAll("#data tr");
  let selectedData = null;

  tableRows.forEach((row) => {
    const nameCell = row.cells[2]; // Name is in the 3rd column (index 2)
    if (nameCell.textContent.trim() === selectedName.trim()) {
      selectedData = Array.from(row.cells).map((cell) => cell.textContent.trim());
    }
  });

  if (!selectedData) {
    alert("No data found for the selected name.");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Table style and layout
  const startX = 10;
  const startY = 20;
  const cellWidth = 50;
  const cellHeight = 10;

  // Data structure to render
  const data = [
    ["Form Types", selectedData[0]],
    ["Date", selectedData[1]],
    ["Name", selectedData[2]],
    ["Phone Number", selectedData[3]],
    ["E-mail", selectedData[4]],
    ["Message", selectedData[5]],
    ["Business Details", selectedData[6]],
  ];

  // Draw table
  data.forEach((row, index) => {
    const y = startY + index * cellHeight;

    // Draw background for labels
    doc.setFillColor(76, 175, 80); // Green background
    doc.rect(startX, y, cellWidth, cellHeight, "F");

    // Draw background for values
    doc.setFillColor(255, 255, 255); // White background
    doc.rect(startX + cellWidth, y, cellWidth * 2, cellHeight, "F");

    // Add borders for labels
    doc.setDrawColor(221, 221, 221);
    doc.setLineWidth(0.042); // Border thickness: 3px
    doc.rect(startX, y, cellWidth, cellHeight, "S");

    // Add borders for values
    doc.rect(startX + cellWidth, y, cellWidth * 2, cellHeight, "S");

    // Add text
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255); // White text for labels
    doc.text(row[0], startX + 5, y + 7);

    doc.setTextColor(0, 0, 0); // Black text for values
    doc.text(row[1], startX + cellWidth + 5, y + 7);
  });

  // PDF filename
  const pdfName = `${selectedName}_data.pdf`;
  
  // Save the generated PDF
  doc.save(pdfName);

  // Send email to the owner
  emailjs.init("PY4UYESCPEYEUR26OZZG4P2JLBETAGRHHZAQQPLIKF3F24SFFBEAOQ3ZLQGXMW22"); // Initialize EmailJS with your user ID

  const emailParams = {
    to_email: "priyadiw128@gmail.com", // Owner's email address
    subject: `Report Generated: ${pdfName}`,
    message: `The report for ${selectedName} has been successfully generated. Please find the attached PDF.`,
  };

  emailjs.send("service_uxa4c9n", "template_6w7lhal", emailParams)
    .then((response) => {
      console.log("Email sent successfully:", response);
    })
    .catch((error) => {
      console.error("Error sending email:", error);
    });
}



// Add event listener for Generate PDF button
document.getElementById("GeneratePdf").addEventListener("click", generatePDF);




// Call getData when the page loads
getData();
