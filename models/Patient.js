const pool = require("../config/db");
const { medicalConditions } = require("../utils/medicalConditions");

class Patient {
  constructor(data) {
    Object.assign(this, data)
  }

  // Get all patients
  static async getAllPatients({ from, to, medical_history } = {}) {
    try {
      let queryParams = [];
      let query = `SELECT * FROM patients`;

      const whereClauses = [];

      if (from && to) {
        queryParams.push(from, to);
        whereClauses.push(`
          NOT EXISTS (
            SELECT 1 FROM appointments 
            WHERE appointments.patient_id = patients.id 
            AND appointments.appointment_datetime BETWEEN $1 AND $2
          )
        `);
      }

      if (medical_history) {
        const selected = Array.isArray(medical_history)
          ? medical_history
          : [medical_history];
  
        if (selected.length > 0) {
          const offset = queryParams.length;
          const conditions = selected.map((condition, i) => {
            queryParams.push(`%"${condition}"%`);
            return `medical_history LIKE $${offset + i + 1}`;
          });
          whereClauses.push(`(` + conditions.join(" OR ") + `)`);
        }
      }
  
      if (whereClauses.length > 0) {
        query += ` WHERE ${whereClauses.join(" AND ")}`;
      }

      const result = await pool.query(query, queryParams);

      return result.rows.map(row => {
        if (!row.medical_history) {
          row.medical_history = "";
        } else {
          const history = Array.isArray(row.medical_history) 
            ? row.medical_history 
            : row.medical_history.replace(/[{}]/g, '').split(',').map(h => h.replace(/"/g, '').trim());
            
          row.medical_history = history.map(h => {
            const found = medicalConditions.find(c => c.value === h);
            return found ? found.label : h;
          }).join(", ");
        }
        
        return new Patient(row);
      });

    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }

  // Get patient by ID
  static async getPatientById(id) {
    try {
      const result = await pool.query('SELECT * FROM patients WHERE id = $1', [id]);
      
      if (result.rows.length === 0) return null;
      
      const patient = result.rows[0];

      if (patient.medical_history) {
        const history = Array.isArray(patient.medical_history) 
          ? patient.medical_history 
          : patient.medical_history.replace(/[{}]/g, '').split(',').map(h => h.replace(/"/g, '').trim());
          
        patient.medical_history = history.map(h => {
          const found = medicalConditions.find(c => c.value === h);
          return found ? found.label : h;
        }).join(", ");
      } else {
        patient.medical_history = "";
      }
      
      return new Patient(patient);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }

  // Add new patient
  static async addNewPatient({ name, age, medical_history, contact_info }) {
    try {
      const result = await pool.query(
        "INSERT INTO patients (name, age, medical_history, contact_info) VALUES ($1, $2, $3, $4)",
        [name, age, medical_history, contact_info]
      );

      return new Patient(result.rows[0])
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }

  // Update patient
  static async updatePatient(id, { name, age, medical_history, contact_info }) {
    try {
      const result = await pool.query(
        "UPDATE patients SET name = $1, age = $2, medical_history = $3, contact_info = $4 WHERE id = $5 RETURNING *",
        [name, age, medical_history, contact_info, id]
      );

      return new Patient(result.rows[0]);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }

  // Delete patient
  static async deletePatient(id) {
    try {
      const result = await pool.query("DELETE FROM patients WHERE id = $1 RETURNING *", [id]);

      if (result.rows.length === 0) return null;
      
      return new Patient(result.rows[0]);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }
}

module.exports = Patient;