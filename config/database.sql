-- Database schema for a healthcare application
CREATE EXTENSION IF NOT EXISTS plpgsql;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  age INTEGER NOT NULL,
  medical_history TEXT NOT NULL,
  contact_info JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id),
  doctor_name VARCHAR(100) NOT NULL,
  appointment_date DATE NOT NULL,
  status VARCHAR(40) CHECK (status IN ('scheduled', 'completed', 'cancelled')) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Function
CREATE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger
CREATE TRIGGER update_patients_updated_at
BEFORE UPDATE ON patients
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- Trigger
CREATE TRIGGER update_appointments_updated_at
BEFORE UPDATE ON appointments
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();