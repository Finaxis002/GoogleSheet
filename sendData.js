document.getElementById("sendDataBtn").addEventListener("click", function () {
  let tableData = [];
  let rows = document.querySelectorAll("#data tr");

  rows.forEach(function (row) {
    let columns = row.querySelectorAll("td");
    if (columns.length > 8) return; // Skip rows with fewer than 7 cells

    let rowData = {
    formType: columns[0]?.innerText || "", // Use optional chaining and fallback to empty string
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
      "https://script.google.com/macros/s/AKfycbyL4G9_VDUyr-f3LrP4RIwt6NH5JwteUq8JLKMYEtFlsYUAOLdFlrncPWk3_bxliuwx/exec"; // Replace with your Apps Script Web App URL
    const formData = new FormData();

    // Add the form data
    formData.append("entry.123456", data.formType); // Replace with actual entry IDs
    formData.append("entry.7891011", data.date); // Replace with actual entry IDs
    formData.append("entry.12131415", data.name); // Replace with actual entry IDs
    let formattedPhone = data.phone.replace(/\s+/g, ""); // Remove spaces
    formData.append("entry.16171819", formattedPhone);
    formData.append("entry.20212223", data.email); // Replace with actual entry IDs
    formData.append("entry.24252627", data.message); // Replace with actual entry IDs
    formData.append("entry.21809123", data.businessDetails); // Business Details
    console.log(data);
    console.log("Data Message : "+ data.message);
    console.log("Business Details : "+data.businessDetails)

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




document.getElementById('PrintData').addEventListener('click', function() {
  fetch('https://script.google.com/macros/s/AKfycby5ixLgShz0LsQgZ9RWwkagIctXc8m6QBJyiSemdLUrbR9Dq5UnQii3OsKYwU6-sOg9/exec', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then(response => response.json())
  .then(data => {
    console.log('Data copied successfully');
  })
  .catch(error => {
    console.error('Error:', error);
  });
});
