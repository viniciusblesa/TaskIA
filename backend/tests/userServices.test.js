const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { after, test } = require('node:test');

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'taskia-users-'));
const usersFile = path.join(tempDir, 'users.json');
process.env.TASKIA_USERS_FILE = usersFile;

const userServices = require('../services/userServices');

after(() => fs.rmSync(tempDir, { recursive: true, force: true }));

test('registra e autentica sem expor senha ou hash', () => {
  const registered = userServices.register('Teste', 'senha-segura-123', 'TESTE@example.com');
  assert.equal(registered.email, 'teste@example.com');
  assert.equal('password' in registered, false);
  assert.equal('passwordHash' in registered, false);

  const authenticated = userServices.login('teste@example.com', 'senha-segura-123');
  assert.equal(authenticated.id, registered.id);
  assert.throws(() => userServices.login('teste@example.com', 'senha-errada'));

  const storedUsers = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
  assert.equal(storedUsers[0].password, undefined);
  assert.match(storedUsers[0].passwordHash, /^[a-f0-9]+:[a-f0-9]+$/);
});

test('migra senha legada no primeiro login', () => {
  fs.writeFileSync(usersFile, JSON.stringify([
    { id: 42, username: 'Legado', email: 'legado@example.com', password: 'senha-antiga' },
  ]));

  const authenticated = userServices.login('legado@example.com', 'senha-antiga');
  assert.equal(authenticated.id, 42);
  assert.equal('password' in authenticated, false);

  const [storedUser] = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
  assert.equal(storedUser.password, undefined);
  assert.ok(storedUser.passwordHash);
});

test('rejeita cadastro com senha fraca', () => {
  assert.throws(
    () => userServices.register('Teste', '123', 'fraco@example.com'),
    /pelo menos 8 caracteres/,
  );
});