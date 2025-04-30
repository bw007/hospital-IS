// Delete function to send a DELETE request
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

document.addEventListener('DOMContentLoaded', () => {
  const deleteButtons = document.querySelectorAll('.delete-btn');
  
  deleteButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      const patientId = event.target.getAttribute('data-patient-id');
      deletePatient(patientId);
    });
  });
});
