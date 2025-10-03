CREATE TABLE IF NOT EXISTS pixels_sale (
  id uuid PRIMARY KEY,
  x integer NOT NULL,
  y integer NOT NULL,
  w integer NOT NULL,
  h integer NOT NULL,
  price numeric(12,2) NOT NULL,
  name text,
  link text,
  image_url text,
  status text NOT NULL DEFAULT 'reserved',
  reserved_until timestamptz,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_pixel_box ON pixels_sale (x, y);
