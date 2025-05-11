const pool = require("../config/db");

class Doctor {
  constructor(data) {
    Object.assign(this, data);
  }

  // Get all doctors
  static async getAllDoctors() {
    try {
      const result = await pool.query("SELECT * FROM doctors");
      return result.rows.map((row) => new Doctor(row));
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }

  // Get doctor by ID
  static async getDoctorById(id) {
    try {
      const result = await pool.query("SELECT * FROM doctors WHERE id = $1", [ id ]);

      if (result.rows.length === 0) return null;

      return new Doctor(result.rows[0]);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }

  // Add doctor
  static async addNewDoctor(name, specialty, contact_info) {
    try {
      const result = await pool.query(
        "INSERT INTO doctors (name, specialty, contact_info) VALUES ($1, $2, $3) RETURNING *",
        [name, specialty, contact_info]
      );

      return new Doctor(result.rows[0]);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }

  // Update doctor
  static async updateDoctor(id, { name, specialty, contact_info }) {
    try {
      const result = await pool.query(
        "UPDATE doctors SET name = $1, specialty = $2, contact_info = $3 WHERE id = $4 RETURNING *",
        [name, specialty, contact_info, id]
      );

      return new Doctor(result.rows[0]);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }

  static async deleteDoctor(id) {
    try {
      const result = await pool.query("DELETE FROM doctors WHERE id = $1 RETURNING *", [ id ]);

      if (result.rows.length === 0) return null;
      
      return new Doctor(result.rows[0]);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }
}

module.exports = Doctor;
