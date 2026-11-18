const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const usersFile = process.env.TASKIA_USERS_FILE || path.join(__dirname, '../user.json');

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function passwordMatches(password, storedHash) {
  const [salt, hash] = storedHash.split(':');
  if (!salt || !hash) return false;

  const expected = Buffer.from(hash, 'hex');
  const actual = crypto.scryptSync(password, salt, expected.length);
  return expected.length > 0 && crypto.timingSafeEqual(expected, actual);
}

function publicUser({ password, passwordHash, ...user }) {
  return user;
}

// ler usuários
function readUsers() {
  if (!fs.existsSync(usersFile)) return [];
  const users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
  let migrated = false;
  const safeUsers = users.map((user) => {
    if (!user.password || user.passwordHash) return user;
    migrated = true;
    const { password, ...userWithoutPassword } = user;
    return { ...userWithoutPassword, passwordHash: hashPassword(password) };
  });

  if (migrated) saveUsers(safeUsers);
  return safeUsers;
}

// salvar usuários
function saveUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

// registrar usuário
exports.register = (username, password, email) => {
  username = typeof username === 'string' ? username.trim() : '';
  email = typeof email === 'string' ? email.trim().toLowerCase() : '';
  if (!username || !email || typeof password !== 'string' || password.length < 8) {
    throw new Error('Informe nome, e-mail e uma senha com pelo menos 8 caracteres.');
  }

  const users = readUsers();
  const userExists = users.find((user) => user.email.toLowerCase() === email);

  if (userExists) {
    throw new Error('Usuário já existe!');
  }

  const newUser = { id: Date.now(), username, passwordHash: hashPassword(password), email };
  users.push(newUser);
  saveUsers(users);

  return publicUser(newUser);
};

// login de usuário
exports.login = (email, password) => {
  email = typeof email === 'string' ? email.trim().toLowerCase() : '';
  if (!email || typeof password !== 'string') {
    throw new Error('Credenciais inválidas!');
  }

  const users = readUsers();
  const user = users.find((candidate) => candidate.email.toLowerCase() === email);

  if (!user || !passwordMatches(password, user.passwordHash || '')) {
    throw new Error('Credenciais inválidas!');
  }

  return publicUser(user);
};