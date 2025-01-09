document.getElementById("sendDataBtn").addEventListener("click", function () {
  let tableData = [];
  let rows = document.querySelectorAll("#data tr");

  rows.forEach(function (row) {
    let columns = row.querySelectorAll("td");
    let rowData = {
      formType: columns[0].innerText,
      date: columns[1].innerText,
      name: columns[2].innerText,
      phone: columns[3].innerText,
      email: columns[4].innerText,
      message: columns[5].innerText,
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
    // Assuming 'data.phone' contains the phone number with spaces
    let formattedPhone = data.phone.replace(/\s+/g, ""); // Removes all spaces

    // Append the formatted phone number to formData
    formData.append("entry.16171819", formattedPhone);

    formData.append("entry.20212223", data.email); // Replace with actual entry IDs
    formData.append("entry.24252627", data.message); // Replace with actual entry IDs

    // Send the data to the Google Apps Script endpoint
    fetch(formUrl, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.text())
      .then((data) => alert("Data sent to Google Sheets!"))
      .catch((error) => console.error("Error:", error));
  });
});
