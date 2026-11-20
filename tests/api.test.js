// Run with: npm test  (uses an in-memory MongoDB, so no real database is touched)
const { test, before, after } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server/app');

let mongo;
before(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
});
after(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

test('health endpoint responds', async () => {
  const res = await request(app).get('/api/health');
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.database, 'connected');
});

test('register, login and add a book', async () => {
  await request(app).post('/api/auth/register')
    .send({ name: 'Test', email: 'test@college.edu', password: 'secret1' }).expect(201);
  const login = await request(app).post('/api/auth/login')
    .send({ email: 'test@college.edu', password: 'secret1' }).expect(200);
  const token = login.body.token;
  await request(app).post('/api/books').set('Authorization', 'Bearer ' + token)
    .send({ title: 'DBMS', price: 200, condition: 'Good', semester: 4 }).expect(201);
  const books = await request(app).get('/api/books').expect(200);
  assert.strictEqual(books.body.length, 1);
});

test('adding a book without login is rejected', async () => {
  await request(app).post('/api/books').send({ title: 'X', price: 10 }).expect(401);
});
