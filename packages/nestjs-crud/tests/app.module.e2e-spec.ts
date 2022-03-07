import supertest from 'supertest';

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { useSeeders } from '@jorgebodega/typeorm-seeding';
import { AppModule } from './app.module';
import { Photo } from './photo/photo.entity';
import { PhotoSeeder } from './photo/photo.seeder';
import { PhotoFactory } from './photo/photo.factory';

describe('AppController (e2e)', () => {
  describe('Authentication', () => {
    let app: INestApplication;
    let photoId: number;

    const photoFactory = new PhotoFactory();

    beforeEach(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();
      app = moduleFixture.createNestApplication();
      await app.init();

      await useSeeders(PhotoSeeder, { connection: 'default' });
    });

    afterEach(async () => {
      jest.clearAllMocks();
      return app ? await app.close() : undefined;
    });

    it('GET /photo?limit=10', async () => {
      const response = await supertest(app.getHttpServer())
        .get('/photo?limit=10')
        .expect(200)
        .then((data) => {
          photoId = data.body[0].id;
          return data;
        });

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toEqual(10);

      expect(response.body).toBeInstanceOf(Object);
    });

    it('GET /photo?limit=10&page=1', async () => {
      const response = await supertest(app.getHttpServer())
        .get('/photo?limit=10&page=1')
        .expect(200);

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toEqual(10);
      expect(response.body.page).toEqual(1);
      expect(response.body.pageCount).toEqual(2);
      expect(response.body.count).toEqual(10);
      expect(response.body.total).toEqual(15);
      expect(typeof response.body.data[0].id).toEqual('number');
    });

    it('GET /photo/1', async () => {
      const response = await supertest(app.getHttpServer())
        .get(`/photo/${photoId}`)
        .expect(200);

      expect(response.body).toBeInstanceOf(Object);
    });

    it('POST /photo', async () => {
      const photo = await photoFactory.create();
      delete photo.id;

      const response = await supertest(app.getHttpServer())
        .post('/photo')
        .send(photo)
        .expect(201);

      expect(response.body).toBeInstanceOf(Object);
      expect(typeof response.body.id).toEqual('number');
    });

    it('POST /photo/bulk', async () => {
      const photos = await photoFactory.createMany(5);

      const response = await supertest(app.getHttpServer())
        .post('/photo/bulk')
        .send({
          bulk: photos,
        })
        .expect(201);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toEqual(5);
    });

    it('PATCH /photo/1', async () => {
      const photo = await photoFactory.create();
      expect(photo).toBeInstanceOf(Photo);
      delete photo.id;
      photo.views = 37;

      const response = await supertest(app.getHttpServer())
        .patch('/photo/1')
        .send(photo)
        .expect(200);

      delete response.body.id;

      expect(response.body).toMatchObject(photo);
      expect(response.body.views).toEqual(37);
    });

    it('PUT /photo/1', async () => {
      const photo = await photoFactory.create();
      expect(photo).toBeInstanceOf(Photo);
      delete photo.id;

      const response = await supertest(app.getHttpServer())
        .put('/photo/1')
        .send(photo)
        .expect(200);

      delete response.body.id;

      expect(response.body).toMatchObject(photo);
    });

    it('DELETE /photo/1', async () => {
      await supertest(app.getHttpServer()).delete('/photo/1').expect(200);

      await supertest(app.getHttpServer()).get('/photo/1').expect(404);
    });

    it('DELETE /photo/soft/1', async () => {
      await supertest(app.getHttpServer()).delete('/photo/soft/1').expect(200);

      await supertest(app.getHttpServer()).get('/photo/1').expect(404);
    });

    it('PATCH /photo/recover/1', async () => {
      await supertest(app.getHttpServer()).delete('/photo/soft/1').expect(200);

      await supertest(app.getHttpServer()).get('/photo/1').expect(404);

      await supertest(app.getHttpServer())
        .patch('/photo/recover/1')
        .expect(200);

      await supertest(app.getHttpServer()).get('/photo/1').expect(200);
    });
  });
});
