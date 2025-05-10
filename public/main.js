// Delete function for doctors
function deleteDoctor(doctorId) {
  fetch(`/doctors/${doctorId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(res => res.json())
    .then(_=> {
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
    .then(res => res.json())
    .then(_=> {
      alert(1111)
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
    .then(res => res.json())
    .then(_=> { 
      window.location.replace('/appointments');
    })
    .catch(error => {
      console.error('Error:', error);
    });
}