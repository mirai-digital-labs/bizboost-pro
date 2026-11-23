import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

export interface FallbackUser {
  id: string;
  email: string;
  name: string;
  password: string; // bcrypt hash
  phone?: string;
  country?: string;
  role: string;
  createdAt: string;
  subscription?: {
    plan: string;
    status: string;
  };
}

const TEMP_FILE = path.join(
  process.env.TEMP || process.env.TMPDIR || '/tmp',
  'bizboost_fallback_users.json'
);

// Pre-seeded hashed password for Demo12345!
const DEMO_HASH = bcrypt.hashSync('Demo12345!', 10);
const DEFAULT_HASH = bcrypt.hashSync('Password123', 10);

const DEFAULT_USERS: FallbackUser[] = [
  {
    id: 'user_demo_1',
    email: 'demo@bizboost.pro',
    name: 'Demo Business Owner',
    password: DEMO_HASH,
    role: 'USER',
    createdAt: new Date().toISOString(),
    subscription: { plan: 'STARTER', status: 'ACTIVE' },
  },
  {
    id: 'user_demo_2',
    email: 'admin@bizboost.pro',
    name: 'Admin User',
    password: DEFAULT_HASH,
    role: 'ADMIN',
    createdAt: new Date().toISOString(),
    subscription: { plan: 'AGENCY', status: 'ACTIVE' },
  },
];

declare global {
  var __bizboost_fallback_users: FallbackUser[] | undefined;
}

function loadUsers(): FallbackUser[] {
  // 1. Try global in-memory
  if (globalThis.__bizboost_fallback_users && globalThis.__bizboost_fallback_users.length > 0) {
    return globalThis.__bizboost_fallback_users;
  }

  // 2. Try temp file
  try {
    if (fs.existsSync(TEMP_FILE)) {
      const data = fs.readFileSync(TEMP_FILE, 'utf8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        globalThis.__bizboost_fallback_users = parsed;
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Could not read fallback users from temp file:', err);
  }

  // 3. Fallback to default seeded
  globalThis.__bizboost_fallback_users = [...DEFAULT_USERS];
  return globalThis.__bizboost_fallback_users;
}

function saveUsers(users: FallbackUser[]) {
  globalThis.__bizboost_fallback_users = users;
  try {
    fs.writeFileSync(TEMP_FILE, JSON.stringify(users, null, 2), 'utf8');
  } catch (err) {
    console.warn('Could not save fallback users to temp file:', err);
  }
}

export function findFallbackUserByEmail(email: string): FallbackUser | null {
  const users = loadUsers();
  const normalized = email.toLowerCase().trim();
  return users.find((u) => u.email.toLowerCase().trim() === normalized) || null;
}

export function saveFallbackUser(user: {
  name?: string;
  email: string;
  passwordHash: string;
  phone?: string;
  country?: string;
  role?: string;
}): FallbackUser {
  const users = loadUsers();
  const normalizedEmail = user.email.toLowerCase().trim();

  const existingIndex = users.findIndex(
    (u) => u.email.toLowerCase().trim() === normalizedEmail
  );

  const newUser: FallbackUser = {
    id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    email: normalizedEmail,
    name: user.name || normalizedEmail.split('@')[0],
    password: user.passwordHash,
    phone: user.phone || '',
    country: user.country || 'PK',
    role: user.role || 'USER',
    createdAt: new Date().toISOString(),
    subscription: {
      plan: 'STARTER',
      status: 'ACTIVE',
    },
  };

  if (existingIndex >= 0) {
    users[existingIndex] = newUser;
  } else {
    users.push(newUser);
  }

  saveUsers(users);
  return newUser;
}
