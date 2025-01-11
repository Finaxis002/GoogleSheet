document.getElementById("sendDataBtn").addEventListener("click", function () {
  let tableData = [];
  let rows = document.querySelectorAll("#data tr");

  rows.forEach(function (row, index) {
    let columns = row.querySelectorAll("td");
    if (columns.length > 8) return; // Skip rows with fewer than 7 cells

    let rowData = {
      serialNumber: index + 1, // Serial number is based on the index, starting from 1
      formType: columns[0]?.innerText || "",
      date: columns[1]?.innerText || "",
      name: columns[2]?.innerText || "",
      phone: columns[3]?.innerText || "",
      email: columns[4]?.innerText || "",
      message: columns[5]?.innerText || "",
      businessDetails: columns[6]?.innerText || "",
    };
    tableData.push(rowData);
  });

  tableData.forEach(function (data) {
    const formUrl =
      "https://script.google.com/macros/s/AKfycbyL4G9_VDUyr-f3LrP4RIwt6NH5JwteUq8JLKMYEtFlsYUAOLdFlrncPWk3_bxliuwx/exec";
    const formData = new FormData();

    // Add serial number as the first entry
    formData.append("entry.111111", data.serialNumber);  // Replace with actual entry ID for serial number

    // Add the rest of the form data
    formData.append("entry.123456", data.formType);  // Replace with actual entry IDs
    formData.append("entry.7891011", data.date);  // Replace with actual entry IDs
    formData.append("entry.12131415", data.name);  // Replace with actual entry IDs
    let formattedPhone = data.phone.replace(/\s+/g, "");  // Remove spaces
    formData.append("entry.16171819", formattedPhone);  // Replace with actual entry IDs
    formData.append("entry.20212223", data.email);  // Replace with actual entry IDs
    formData.append("entry.24252627", data.message);  // Replace with actual entry IDs
    formData.append("entry.21809123", data.businessDetails);  // Replace with actual entry IDs

    console.log(data);

    // Send the data to the Google Apps Script endpoint
    fetch(formUrl, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.text())
      .then((data) => alert("Data sent to Google Sheets!"))
      .catch((error) => {
        console.error("Error:", error);
        alert("Failed to send data to Google Sheets. Please try again.");
      });
  });
});
