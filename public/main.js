// Delete function for doctors
function deleteDoctor(doctorId) {  
  fetch(`/doctors/${doctorId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(response => response.json())
    .then(_=> {
      alert('Doctor deleted successfully!');
      
      window.location.replace('/doctors');
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

// Delete function for patients
function deletePatient(patientId) {  
  fetch(`/patients/${patientId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(response => response.json())
    .then(_=> { 
      window.location.replace('/patients');
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

// Delete function for appointments
function deleteAppointment(appointmentId) {  
  fetch(`/appointments/${appointmentId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(response => response.json())
    .then(_=> { 
      window.location.replace('/appointments');
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

document.addEventListener('DOMContentLoaded', () => {
  const doctorDeleteButtons = document.querySelectorAll('.doctor-delete-btn');
    
  doctorDeleteButtons.forEach(button => {
    button.addEventListener('click', (event) => {
    const doctorId = event.target.getAttribute('data-doctor-id');
    deleteDoctor(doctorId);
    });
  });

  const patientDeleteButtons = document.querySelectorAll('.patient-delete-btn');
  
  patientDeleteButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      const patientId = event.target.getAttribute('data-patient-id');
      deletePatient(patientId);
    });
  });

  const appointmentDeleteButtons = document.querySelectorAll('.appointment-delete-btn');
  
  appointmentDeleteButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      const appointmentId = event.target.getAttribute('data-appointment-id');
      deleteAppointment(appointmentId);
    });
  });
});