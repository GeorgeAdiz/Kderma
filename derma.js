const apiBaseUrl = 'http://localhost:5000/api/schedule'; // Replace with actual API endpoint

// DOM elements
const scheduleTableBody = document.querySelector('tbody');
const searchInput = document.getElementById('search');
const saveButton = document.querySelector('#add-client .btn-primary'); // Save button in modal

// Fetch schedules from the backend
const fetchSchedules = async () => {
  try {
    const response = await fetch(apiBaseUrl);
    const schedules = await response.json();
    displaySchedules(schedules);
  } catch (error) {
    console.error('Error fetching schedules:', error);
  }
};

// Display schedules in the table
const displaySchedules = (schedules) => {
  scheduleTableBody.innerHTML = ''; // Clear existing rows

  schedules.forEach(schedule => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${schedule.clientID}</td>
      <td>${schedule.clientName}</td>
      <td>${schedule.aesthetician}</td>
      <td>${schedule.treatment}</td>
      <td>${schedule.date}</td>
      <td>${schedule.time}</td>
      <td>
        <button class="btn btn-warning" onclick="editSchedule('${schedule._id}')">
          <ion-icon name="create-outline"></ion-icon>
        </button>
        <button class="btn btn-danger" onclick="deleteSchedule('${schedule._id}')">
          <ion-icon name="trash-outline"></ion-icon>
        </button>
      </td>
    `;
    scheduleTableBody.appendChild(row);
  });
};

// Create a new schedule
const createSchedule = async (event) => {
  event.preventDefault();

  const scheduleData = {
    clientID: document.getElementById('Client-ID').value.trim(),
    clientName: document.getElementById('Client-Name').value.trim(),
    aesthetician: document.getElementById('Aesthetician').value.trim(),
    treatment: document.getElementById('Treatment').value.trim(),
    date: document.getElementById('date').value.trim(),
    time: document.getElementById('time').value.trim(),
  };

  try {
    const response = await fetch(apiBaseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(scheduleData),
    });

    const newSchedule = await response.json();
    if (response.ok) {
      fetchSchedules(); // Refresh the schedule list
      $('#add-client').modal('hide'); // Close the modal after saving
    } else {
      alert('Error creating schedule: ' + newSchedule.error);
    }
  } catch (error) {
    console.error('Error creating schedule:', error);
  }
};

// Edit an existing schedule
const editSchedule = async (id) => {
  try {
    const response = await fetch(`${apiBaseUrl}/${id}`);
    const schedule = await response.json();

    // Populate the modal with schedule data
    document.getElementById('Client-ID').value = schedule.clientID;
    document.getElementById('Client-Name').value = schedule.clientName;
    document.getElementById('Aesthetician').value = schedule.aesthetician;
    document.getElementById('Treatment').value = schedule.treatment;
    document.getElementById('date').value = schedule.date;
    document.getElementById('time').value = schedule.time;

    saveButton.onclick = async () => {
      const updatedSchedule = {
        clientID: document.getElementById('Client-ID').value.trim(),
        clientName: document.getElementById('Client-Name').value.trim(),
        aesthetician: document.getElementById('Aesthetician').value.trim(),
        treatment: document.getElementById('Treatment').value.trim(),
        date: document.getElementById('date').value.trim(),
        time: document.getElementById('time').value.trim(),
      };

      try {
        const response = await fetch(`${apiBaseUrl}/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedSchedule),
        });

        const updated = await response.json();
        if (response.ok) {
          fetchSchedules(); // Refresh the schedule list
          $('#add-client').modal('hide'); // Close the modal after saving
        } else {
          alert('Error updating schedule: ' + updated.error);
        }
      } catch (error) {
        console.error('Error updating schedule:', error);
      }
    };
  } catch (error) {
    console.error('Error fetching schedule for editing:', error);
  }
};

// Delete a schedule
const deleteSchedule = async (id) => {
  const confirmDelete = confirm('Are you sure you want to delete this schedule?');
  if (confirmDelete) {
    try {
      const response = await fetch(`${apiBaseUrl}/${id}`, { method: 'DELETE' });
      const result = await response.json();
      if (response.ok) {
        fetchSchedules(); // Refresh the schedule list
      } else {
        alert('Error deleting schedule: ' + result.error);
      }
    } catch (error) {
      console.error('Error deleting schedule:', error);
    }
  }
};

// Search functionality for filtering schedules by client name
searchInput.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase();
  const rows = scheduleTableBody.getElementsByTagName('tr');
  
  Array.from(rows).forEach(row => {
    const cells = row.getElementsByTagName('td');
    const clientName = cells[1].textContent.toLowerCase(); // Target the second column for client name
    row.style.display = clientName.includes(query) ? '' : 'none'; // Filter rows
  });
});

// Event listener for creating a schedule (form submission)
document.querySelector('#add-client form').addEventListener('submit', createSchedule);

// Fetch all schedules when the page loads
window.addEventListener('load', fetchSchedules);
