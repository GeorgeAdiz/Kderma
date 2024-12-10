// API endpoint for client operations
const API_URL = 'http://localhost:5000/api/client'; // Replace with your backend URL

// DOM elements
const clientTableBody = document.querySelector('table tbody');
const searchInput = document.getElementById('search');
const saveAddButton = document.getElementById('save-client-btn'); // Save button in Add Modal

// Fetch clients and update the table
const getClients = async () => {
  try {
    const response = await fetch(API_URL);
    const clients = await response.json();

    // Clear table before adding new rows
    clientTableBody.innerHTML = '';

    // Populate table rows with client data
    clients.forEach(client => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${client.clientID}</td>
        <td>${client.lastName}</td>
        <td>${client.firstName}</td>
        <td>${client.middleName}</td>
        <td>${client.gender}</td>
        <td>${client.age}</td>
        <td>${client.contactNo}</td>
        <td>${new Date(client.dateAdded).toLocaleDateString()}</td>
        <td>
          <button class="btn btn-warning" onclick="editClient('${client._id}')">
            <ion-icon name="create-outline"></ion-icon>
          </button>
          <button class="btn btn-danger" onclick="deleteClient('${client._id}')">
            <ion-icon name="trash-outline"></ion-icon>
          </button>
        </td>
      `;
      clientTableBody.appendChild(row);
    });
  } catch (error) {
    console.error('Error fetching clients:', error);
  }
};

// Create a new client
const createClient = async (formData) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response from server:', errorText);
      throw new Error('Failed to create client');
    }

    await response.json();
    getClients(); // Refresh client list after adding

    // Clear form fields and hide modal after successful submission
    document.getElementById('add-client-form').reset();
    const addModal = bootstrap.Modal.getInstance(document.getElementById('add-record')); // Use the correct ID here
    if (addModal) {
      addModal.hide();
    } else {
      console.warn('Modal instance not found.');
    }
  } catch (error) {
    console.error('Error creating client:', error);
  }
};



// Add a new client - event listener for "Save" button
document.addEventListener('DOMContentLoaded', () => {
  const saveAddButton = document.getElementById('save-client-btn');
  if (saveAddButton) {
    saveAddButton.addEventListener('click', () => {
      const clientIDInput = document.getElementById('add-client-id');
      if (!clientIDInput) {
        console.error('Element with ID "add-client-id" not found!');
        return;
      }

      const newClientData = {
        clientID: clientIDInput.value.trim(),
        lastName: document.getElementById('add-lastname').value.trim(),
        firstName: document.getElementById('add-firstname').value.trim(),
        middleName: document.getElementById('add-middlename').value.trim(),
        gender: document.getElementById('add-gender').value.trim(),
        age: document.getElementById('add-age').value.trim(),
        contactNo: document.getElementById('add-contact').value.trim(),
        dateAdded: document.getElementById('add-date-added').value.trim(),
      };

      // Validate form fields
      if (Object.values(newClientData).some(value => value === '')) {
        alert('Please fill in all the fields');
        return;
      }

      createClient(newClientData);
    });
  } else {
    console.error('Save button not found!');
  }
});


// Edit a client
const editClient = async (clientId) => {
  try {
    const response = await fetch(`${API_URL}/${clientId}`);
    const client = await response.json();

    // Populate the Edit Client modal with existing data
    document.getElementById('edit-client-id').value = client.clientID;
    document.getElementById('edit-lastname').value = client.lastName;
    document.getElementById('edit-firstname').value = client.firstName;
    document.getElementById('middle-name').value = client.middleName;
    document.getElementById('Gender').value = client.gender;
    document.getElementById('age').value = client.age;
    document.getElementById('Contact No').value = client.contactNo;
    document.getElementById('date-added').value = new Date(client.dateAdded).toISOString().split('T')[0];

    // Bind the "Save" button in the Edit Client modal to update the client
    const saveEditButton = document.getElementById('save-changes');
    saveEditButton.onclick = null; // Clear previous bindings
    saveEditButton.addEventListener('click', () => updateClient(clientId));

    // Show the modal after populating the data
    const editModal = new bootstrap.Modal(document.getElementById('edit')); // Use correct ID for modal
    editModal.show(); // Show the modal
  } catch (error) {
    console.error('Error fetching client for editing:', error);
  }
};



// Update a client
const updateClient = async (clientId) => {
  const updatedClientData = {
    clientID: document.getElementById('edit-client-id').value.trim(),
    lastName: document.getElementById('edit-lastname').value.trim(),
    firstName: document.getElementById('edit-firstname').value.trim(),
    middleName: document.getElementById('edit-middle-name').value.trim(),
    gender: document.getElementById('edit-gender').value.trim(),
    age: document.getElementById('edit-age').value.trim(),
    contactNo: document.getElementById('edit-contact').value.trim(),
    dateAdded: document.getElementById('edit-date-added').value.trim(),
  };

  try {
    const response = await fetch(`${API_URL}/${clientId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedClientData),
    });

    // Check if the response is OK (status code 200-299)
    if (response.ok) {
      console.log('Client updated successfully');
      getClients(); // Refresh client list after update
      const editModal = bootstrap.Modal.getInstance(document.getElementById('edit'));
      editModal.hide(); // Hide the modal after saving changes
    } else {
      // Log the error message and status if the request fails
      const errorData = await response.json();
      console.error('Failed to update client:', errorData);
      alert('Failed to update client. Please try again later.');
    }
  } catch (error) {
    // Catch any network or other unexpected errors
    console.error('Error updating client:', error);
    alert('An unexpected error occurred. Please try again later.');
  }
};



// Delete a client
const deleteClient = async (clientId) => {
  if (confirm('Are you sure you want to delete this client record?')) {
    try {
      await fetch(`${API_URL}/${clientId}`, { method: 'DELETE' });
      getClients(); // Refresh client list after deletion
    } catch (error) {
      console.error('Error deleting client:', error);
    }
  }
};

// Search functionality
const handleSearch = () => {
  const query = searchInput.value.toLowerCase();
  const rows = clientTableBody.getElementsByTagName('tr');

  Array.from(rows).forEach(row => {
    const cells = row.getElementsByTagName('td');
    const clientData = Array.from(cells).map(cell => cell.textContent.toLowerCase());

    const matches = clientData.some(data => data.includes(query));
    row.style.display = matches ? '' : 'none';
  });
};

// Event listener for search input
searchInput.addEventListener('input', handleSearch);

// Initialize client list
getClients();
