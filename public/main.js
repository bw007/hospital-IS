// Delete function for doctors
<<<<<<< HEAD
function deleteDoctor(doctorId) {
=======
function deleteDoctor(doctorId) {  
>>>>>>> f853560fece05fac4a8da4cf87226f2f7eed3318
  fetch(`/doctors/${doctorId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
<<<<<<< HEAD
    .then(res => res.json())
    .then(_=> {
=======
    .then(response => response.json())
    .then(_=> {
      alert('Doctor deleted successfully!');
      
>>>>>>> f853560fece05fac4a8da4cf87226f2f7eed3318
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
<<<<<<< HEAD
    .then(res => res.json())
    .then(_=> {
      alert(1111)
=======
    .then(response => response.json())
    .then(_=> { 
>>>>>>> f853560fece05fac4a8da4cf87226f2f7eed3318
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
<<<<<<< HEAD
    .then(res => res.json())
=======
    .then(response => response.json())
>>>>>>> f853560fece05fac4a8da4cf87226f2f7eed3318
    .then(_=> { 
      window.location.replace('/appointments');
    })
    .catch(error => {
      console.error('Error:', error);
    });
<<<<<<< HEAD
}
=======
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
>>>>>>> f853560fece05fac4a8da4cf87226f2f7eed3318
