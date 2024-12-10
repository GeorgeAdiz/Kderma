// API endpoint for client operations
const API_URL = 'http://localhost:5000/api/client';  // Replace with your backend URL

// DOM elements
const clientTableBody = document.querySelector('table tbody');
const searchInput = document.getElementById('search');
const saveButton = document.getElementById('save-client-btn'); // Save button in modal

// Fetch clients and update the table
const getClients = async () => {
  try {
    const response = await fetch(API_URL);
    const client = await response.json();

    // Clear table before adding new rows
    clientTableBody.innerHTML = '';

    // Populate table rows with client data
    client.forEach(client => {
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
    console.log('Sending data to create client:', formData); // Log the data being sent

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      // Log the response details for debugging
      const errorText = await response.text();
      console.error('Error response from server:', errorText);
      throw new Error('Failed to create client');
    }

    const newClient = await response.json();
    console.log('Client created:', newClient);
    getClients(); // Refresh client list after adding

    // Clear form fields after successful submission
    document.getElementById('add-client-form').reset();
    
    // Optionally hide modal after submission
    const modal = bootstrap.Modal.getInstance(document.getElementById('add-client'));
    modal.hide();
  } catch (error) {
    console.error('Error creating client:', error);
  }
};

// Event listener for adding a new client (when the modal "Save" button is clicked)
saveButton.addEventListener('click', () => {
  // Gather data from the modal form and trim whitespace from input fields
  const newClientData = {
    clientID: document.getElementById('client-id').value.trim(),
    lastName: document.getElementById('lastname').value.trim(),
    firstName: document.getElementById('firstname').value.trim(),
    middleName: document.getElementById('middlename').value.trim(),
    gender: document.getElementById('gender').value.trim(),
    age: document.getElementById('age').value.trim(),
    contactNo: document.getElementById('contact').value.trim(),
    dateAdded: document.getElementById('date-added').value.trim(),
  };

  // Validate form fields before creating client
  const isEmpty = Object.values(newClientData).some(value => value === '');

  if (isEmpty) {
    alert('Please fill in all the fields');
    return;
  }

  // Create the new client using the form data
  createClient(newClientData);
});

// Edit client
const editClient = async (clientId) => {
  try {
    const response = await fetch(`${API_URL}/${clientId}`);
    const client = await response.json();

    // Populate modal for editing
    document.getElementById('client-id').value = client.clientID;
    document.getElementById('lastname').value = client.lastName;
    document.getElementById('firstname').value = client.firstName;
    document.getElementById('middlename').value = client.middleName;
    document.getElementById('gender').value = client.gender;
    document.getElementById('age').value = client.age;
    document.getElementById('contact').value = client.contactNo;
    document.getElementById('date-added').value = client.dateAdded;

    // Bind update function
    const saveButton = document.querySelector('#edit .btn-primary');
    saveButton.onclick = () => updateClient(clientId);
  } catch (error) {
    console.error('Error fetching client for editing:', error);
  }
};

// Delete client
const deleteClient = async (clientId) => {
  const confirmDelete = confirm('Are you sure you want to delete this client record?');
  if (confirmDelete) {
    try {
      await fetch(`${API_URL}/${clientId}`, {
        method: 'DELETE',
      });
      console.log('Client deleted');
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
