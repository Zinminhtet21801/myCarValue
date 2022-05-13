import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authentication System (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a signup request', async () => {
    const email = 'zinminhtet@gmail.com';
    return await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email: email,
        password: '123456',
      })
      .expect(201)
      .then((res) => {
        const { id, email } = res.body;
        expect(id).toBeDefined();
        expect(email).toBe(email);
      });
  });

  it('signup as a new user then get the currently logged in user', async () => {
    const testEmail = 'zinminhtet12@gmail.com';
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email: testEmail,
        password: '123456',
      })
      .expect(201);

    const cookie = res.get('Set-Cookie');

    const {
      body: { id, email },
    } = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200);

    expect(email).toBe(testEmail);
  });

  it('handles a signin request', async () => {
    const testEmail = 'zinminhtet@gmail.com';
    const {
      body: { id, email },
    } = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({
        email: testEmail,
        password: '123456',
      })
      .expect(201);
    expect(email).toBe(testEmail);
  });
});
