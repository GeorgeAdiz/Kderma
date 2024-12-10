// API endpoint for history operations
const API_URL = 'http://localhost:5000/api/history'; // Replace with your backend URL

// DOM elements
const historyTableBody = document.querySelector('table tbody');
const searchInput = document.getElementById('search');
const saveAddButton = document.getElementById('save-history'); // Save button in Add Modal

// Fetch history records and update the table
const getHistorys = async () => {
  try {
    const response = await fetch(API_URL);
    const historys = await response.json();

    // Clear table before adding new rows
    historyTableBody.innerHTML = '';

    // Populate table rows with history data
    historys.forEach(history => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${history.name}</td>
        <td>${history.treatment}</td>
        <td>${history.aesthetician}</td>
        <td>${new Date(history.dateAdded).toLocaleDateString()}</td>
        <td>
          <button class="btn btn-danger" onclick="deleteHistory('${history._id}')">
            <ion-icon name="trash-outline"></ion-icon>
          </button>
        </td>
      `;
      historyTableBody.appendChild(row);
    });
  } catch (error) {
    console.error('Error fetching historys:', error);
  }
};

// Create a new history record
const createHistory = async (formData) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response from server:', errorText);
      throw new Error('Failed to create history');
    }

    await response.json();
    getHistorys(); // Refresh history list after adding

    // Clear form fields and hide modal after successful submission
    document.getElementById('add-history-form').reset();
    const addModal = bootstrap.Modal.getInstance(document.getElementById('add-history')); // Use the correct ID here
    if (addModal) {
      addModal.hide();
    } else {
      console.warn('Modal instance not found.');
    }
  } catch (error) {
    console.error('Error creating history:', error);
  }
};

// Add a new history record - event listener for "Save" button
document.addEventListener('DOMContentLoaded', () => {
  const saveAddButton = document.getElementById('save-history');
  if (saveAddButton) {
    saveAddButton.addEventListener('click', () => {
      const historyNameInput = document.getElementById('client-name'); // Changed name to client-name
      if (!historyNameInput) {
        console.error('Element with ID "client-name" not found!');
        return;
      }

      const newHistoryData = {
        name: historyNameInput.value.trim(), // Changed clientName to name
        treatment: document.getElementById('treatment').value.trim(),
        aesthetician: document.getElementById('aesthetician').value.trim(),
        dateAdded: document.getElementById('date-added').value.trim(),
      };

      // Validate form fields
      if (Object.values(newHistoryData).some(value => value === '')) {
        alert('Please fill in all the fields');
        return;
      }

      createHistory(newHistoryData);
    });
  } else {
    console.error('Save button not found!');
  }
});

// Delete a history record
const deleteHistory = async (historyId) => {
  if (confirm('Are you sure you want to delete this history record?')) {
    try {
      await fetch(`${API_URL}/${historyId}`, { method: 'DELETE' });
      getHistorys(); // Refresh history list after deletion
    } catch (error) {
      console.error('Error deleting history:', error);
    }
  }
};

// Search functionality
const handleSearch = () => {
  const query = searchInput.value.toLowerCase();
  const rows = historyTableBody.getElementsByTagName('tr');

  Array.from(rows).forEach(row => {
    const cells = row.getElementsByTagName('td');
    const historyData = Array.from(cells).map(cell => cell.textContent.toLowerCase());

    const matches = historyData.some(data => data.includes(query));
    row.style.display = matches ? '' : 'none';
  });
};

// Event listener for search input
searchInput.addEventListener('input', handleSearch);

// Initialize history list
getHistorys();
