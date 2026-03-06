/*
  # Initialize Real Estate Platform Schema

  1. New Tables
    - `users`: User profiles and authentication metadata
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `password_hash` (text)
      - `full_name` (text)
      - `role` (text: admin, agency, client)
      - `agency_id` (uuid, foreign key to agencies)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `agencies`: Real estate agencies
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text)
      - `phone` (text)
      - `address` (text)
      - `created_at` (timestamp)
    
    - `properties`: Real estate properties
      - `id` (uuid, primary key)
      - `agency_id` (uuid, foreign key)
      - `title` (text)
      - `description` (text)
      - `type` (text: apartment, house, commercial)
      - `price` (numeric)
      - `location` (text)
      - `bedrooms` (integer)
      - `bathrooms` (integer)
      - `area` (numeric)
      - `image_url` (text)
      - `created_at` (timestamp)
    
    - `visits`: Property visits scheduled by clients
      - `id` (uuid, primary key)
      - `property_id` (uuid, foreign key)
      - `client_id` (uuid, foreign key)
      - `scheduled_at` (timestamp)
      - `status` (text: pending, confirmed, completed)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for each role
*/

CREATE TABLE IF NOT EXISTS agencies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  address text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL DEFAULT 'client' CHECK (role IN ('admin', 'agency', 'client')),
  agency_id uuid REFERENCES agencies(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id uuid NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  type text NOT NULL CHECK (type IN ('apartment', 'house', 'commercial')),
  price numeric NOT NULL,
  location text NOT NULL,
  bedrooms integer DEFAULT 0,
  bathrooms integer DEFAULT 0,
  area numeric,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  scheduled_at timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Agencies are viewable by all authenticated users"
  ON agencies FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can read own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Properties are viewable by all authenticated users"
  ON properties FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Agencies can create properties"
  ON properties FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'agency'
      AND users.agency_id = properties.agency_id
    )
  );

CREATE POLICY "Visits are viewable by clients and agencies"
  ON visits FOR SELECT
  TO authenticated
  USING (
    client_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM properties p
      JOIN users u ON u.id = auth.uid()
      WHERE p.id = visits.property_id AND p.agency_id = u.agency_id
    )
  );

CREATE POLICY "Clients can create visits"
  ON visits FOR INSERT
  TO authenticated
  WITH CHECK (
    client_id = auth.uid() AND
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'client')
  );

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_agency ON users(agency_id);
CREATE INDEX IF NOT EXISTS idx_properties_agency ON properties(agency_id);
CREATE INDEX IF NOT EXISTS idx_visits_property ON visits(property_id);
CREATE INDEX IF NOT EXISTS idx_visits_client ON visits(client_id);
