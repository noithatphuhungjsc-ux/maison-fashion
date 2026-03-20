-- =============================================
-- MAISON — Role-Based Admin Migration
-- Copy vao Supabase SQL Editor -> Run
-- =============================================

-- 1. Users table (synced with Supabase Auth)
CREATE TABLE IF NOT EXISTS users (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT UNIQUE NOT NULL,
  full_name   TEXT,
  phone       TEXT,
  avatar_url  TEXT,
  role        TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'manager', 'workshop')),
  workshop_name TEXT,              -- Ten xuong (chi dung cho role = 'workshop')
  workshop_address TEXT,           -- Dia chi xuong
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Workshop Orders (phan cong san xuat cho xuong ve tinh)
CREATE TABLE IF NOT EXISTS workshop_orders (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id        UUID REFERENCES orders(id) ON DELETE CASCADE,
  workshop_id     UUID REFERENCES users(id),          -- xuong duoc phan cong
  assigned_by     UUID REFERENCES users(id),          -- manager phan cong
  status          TEXT DEFAULT 'pending' CHECK (status IN (
    'pending',        -- cho xu ly
    'cutting',        -- dang cat
    'sewing',         -- dang may
    'finishing',      -- hoan thien
    'quality_check',  -- kiem tra chat luong
    'completed',      -- hoan thanh
    'rejected'        -- bi tu choi (loi)
  )),
  priority        TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  product_name    TEXT NOT NULL,
  quantity        INTEGER NOT NULL DEFAULT 1,
  size            TEXT,
  notes           TEXT,
  due_date        TIMESTAMPTZ,
  started_at      TIMESTAMPTZ,
  completed_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Add user_id to orders table (link orders to users)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE orders ADD COLUMN user_id UUID REFERENCES users(id);
  END IF;
END $$;

-- =============================================
-- Indexes
-- =============================================
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_workshop_orders_workshop ON workshop_orders(workshop_id);
CREATE INDEX IF NOT EXISTS idx_workshop_orders_status ON workshop_orders(status);
CREATE INDEX IF NOT EXISTS idx_workshop_orders_order ON workshop_orders(order_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);

-- =============================================
-- Row Level Security
-- =============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshop_orders ENABLE ROW LEVEL SECURITY;

-- Users: moi nguoi doc profile cua minh, manager doc tat ca
DO $$ BEGIN
  CREATE POLICY "users_read_own" ON users
    FOR SELECT USING (auth.uid() = id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "managers_read_all_users" ON users
    FOR SELECT USING (
      EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'manager')
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "users_update_own" ON users
    FOR UPDATE USING (auth.uid() = id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "managers_manage_users" ON users
    FOR ALL USING (
      EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'manager')
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Workshop orders: workshop doc cua minh, manager doc tat ca
DO $$ BEGIN
  CREATE POLICY "workshop_read_own_orders" ON workshop_orders
    FOR SELECT USING (workshop_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "workshop_update_own_orders" ON workshop_orders
    FOR UPDATE USING (workshop_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "managers_manage_workshop_orders" ON workshop_orders
    FOR ALL USING (
      EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'manager')
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Orders: customers doc cua minh, managers doc tat ca
DO $$ BEGIN
  CREATE POLICY "orders_read_own" ON orders
    FOR SELECT USING (user_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "managers_manage_orders" ON orders
    FOR ALL USING (
      EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'manager')
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- =============================================
-- Auto-create user profile on signup
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- Seed: Manager account (change email/password in Supabase Auth)
-- =============================================

-- Seed demo workshop orders (optional, for testing)
-- INSERT INTO workshop_orders (order_id, workshop_id, assigned_by, status, priority, product_name, quantity, size, notes, due_date) VALUES ...

-- =============================================
-- Verify
-- =============================================
SELECT 'users' as "table", count(*) as "rows" FROM users
UNION ALL
SELECT 'workshop_orders', count(*) FROM workshop_orders;
