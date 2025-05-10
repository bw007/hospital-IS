const pool = require("../config/db");

class Doctor {
  constructor(data) {
    Object.assign(this, data)
  }

  static async getAllDoctors() {
    const result = await pool.query('SELECT * FROM doctors');
    return result.rows.map(row => new Doctor(row));
  }

  static async getDoctorById(id) {
    const result = await pool.query('SELECT * FROM doctors WHERE id = $1', [id]);
    
    const row = result.rows[0];
    return new Doctor(row);
  }

  static async addNewDoctor(name, specialty, contact_info) {
    const result = await pool.query(
      'INSERT INTO doctors (name, specialty, contact_info) VALUES ($1, $2, $3) RETURNING *',
      [name, specialty, contact_info]
    );
    const row = result.rows[0];
    return new Doctor(row);
  }

  static async updateDoctor(name, specialty, contact_info, id) {
    const result = await pool.query(
      'UPDATE doctors SET name = $1, specialty = $2, contact_info = $3 WHERE id = $4 RETURNING *',
      [name, specialty, contact_info, id]
    );
    const row = result.rows[0];
    return new Doctor(row)
  }

  static async deleteDoctor(id) {
    const result = await pool.query('DELETE FROM doctors WHERE id = $1 RETURNING *', [id]);
    const row = result.rows[0];
    return new Doctor(row);
  }

}

module.exports = Doctor;