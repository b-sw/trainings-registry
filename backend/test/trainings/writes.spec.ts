import * as request from 'supertest';
import { ActivityType } from '../../src/trainings/entities/training.entity';
import { createTestApp } from '../utils/bootstrap';

describe('TrainingsController (writes)', () => {
    let bootstrap: Awaited<ReturnType<typeof createTestApp>>;

    beforeAll(async () => {
        bootstrap = await createTestApp();
    });

    beforeEach(async () => {
        await bootstrap.methods.beforeEach();
    });

    afterAll(async () => {
        await bootstrap.methods.afterAll();
    });

    describe('POST /trainings', () => {
        it('creates a new training', async () => {
            // given
            const user = await bootstrap.utils.userUtils.createDefaultUser();
            const token = bootstrap.utils.authUtils.generateToken(user);
            const createTrainingDto = {
                userId: user.id,
                description: 'A great training session',
                date: new Date('2025-01-15T00:00:00.000Z').toISOString(),
                distance: 5.5,
                activityType: ActivityType.Running,
            };

            // when
            const response = await request(bootstrap.app.getHttpServer())
                .post('/trainings')
                .set('Authorization', `Bearer ${token}`)
                .send(createTrainingDto);

            // then
            expect(response.status).toBe(201);
            expect(response.body).toMatchObject({
                description: 'A great training session',
                distance: 5.5,
                userId: user.id,
            });
            expect(response.body.id).toBeDefined();
        });

        it('allows user to create training for themselves (SelfGuard)', async () => {
            // given
            const user = await bootstrap.utils.userUtils.createDefaultUser();
            const token = bootstrap.utils.authUtils.generateToken(user);
            const createTrainingDto = {
                userId: user.id,
                description: 'Self training',
                date: new Date('2025-01-15T00:00:00.000Z').toISOString(),
                distance: 3.0,
                activityType: ActivityType.Cycling,
            };

            // when
            const response = await request(bootstrap.app.getHttpServer())
                .post('/trainings')
                .set('Authorization', `Bearer ${token}`)
                .send(createTrainingDto);

            // then
            expect(response.status).toBe(201);
            expect(response.body).toMatchObject({
                userId: user.id,
                description: 'Self training',
            });
        });

        it('returns 403 when user tries to create training for another user', async () => {
            // given
            const user1 = await bootstrap.utils.userUtils.createDefaultUser();
            const user2 = await bootstrap.utils.userUtils.createDefaultUser();
            const token = bootstrap.utils.authUtils.generateToken(user1);
            const createTrainingDto = {
                userId: user2.id, // Trying to create for different user
                description: 'This should fail',
                date: new Date('2025-01-15T00:00:00.000Z').toISOString(),
                distance: 1.0,
                activityType: ActivityType.Walking,
            };

            // when
            const response = await request(bootstrap.app.getHttpServer())
                .post('/trainings')
                .set('Authorization', `Bearer ${token}`)
                .send(createTrainingDto);

            // then
            expect(response.status).toBe(403);
        });

        it('allows admin to create training for any user', async () => {
            // given
            const user = await bootstrap.utils.userUtils.createDefaultUser();
            const adminUser = await bootstrap.utils.userUtils.createAdminUser();
            const token = bootstrap.utils.authUtils.generateToken(adminUser);
            const createTrainingDto = {
                userId: user.id,
                description: 'Created by admin',
                date: new Date('2025-01-15T00:00:00.000Z').toISOString(),
                distance: 2.0,
                activityType: ActivityType.Running,
            };

            // when
            const response = await request(bootstrap.app.getHttpServer())
                .post('/trainings')
                .set('Authorization', `Bearer ${token}`)
                .send(createTrainingDto);

            // then
            expect(response.status).toBe(201);
            expect(response.body).toMatchObject({
                userId: user.id,
                description: 'Created by admin',
            });
        });

        it('returns 401 when not authenticated', async () => {
            // given
            const createTrainingDto = {
                userId: 'some-user-id',
                description: 'Should fail',
                date: new Date('2025-01-15T00:00:00.000Z').toISOString(),
                distance: 1.0,
                activityType: ActivityType.Running,
            };

            // when
            const response = await request(bootstrap.app.getHttpServer())
                .post('/trainings')
                .send(createTrainingDto);

            // then
            expect(response.status).toBe(401);
        });
    });

    describe('PUT /trainings/:trainingId', () => {
        it('updates training successfully', async () => {
            // given
            const user = await bootstrap.utils.userUtils.createDefaultUser();
            const adminUser = await bootstrap.utils.userUtils.createAdminUser();
            const token = bootstrap.utils.authUtils.generateToken(adminUser);
            const training = await bootstrap.utils.trainingUtils.createTraining({
                userId: user.id,
                distance: 5.0,
            });
            const updateTrainingDto = {
                description: 'Updated description',
                distance: 7.5,
            };

            // when
            const response = await request(bootstrap.app.getHttpServer())
                .put(`/trainings/${training.id}`)
                .set('Authorization', `Bearer ${token}`)
                .send(updateTrainingDto);

            // then
            expect(response.status).toBe(200);
            expect(response.body).toMatchObject({
                description: 'Updated description',
                distance: 7.5,
                userId: user.id,
                id: training.id,
            });
        });

        it('returns 404 for non-existent training', async () => {
            // given
            const adminUser = await bootstrap.utils.userUtils.createAdminUser();
            const token = bootstrap.utils.authUtils.generateToken(adminUser);
            const nonExistentId = '507f1f77bcf86cd799439011';
            const updateTrainingDto = { description: 'Updated description' };

            // when
            const response = await request(bootstrap.app.getHttpServer())
                .put(`/trainings/${nonExistentId}`)
                .set('Authorization', `Bearer ${token}`)
                .send(updateTrainingDto);

            // then
            expect(response.status).toBe(404);
        });

        it('returns 403 when regular user tries to update', async () => {
            // given
            const user = await bootstrap.utils.userUtils.createDefaultUser();
            const regularUser = await bootstrap.utils.userUtils.createDefaultUser();
            const token = bootstrap.utils.authUtils.generateToken(regularUser);
            const training = await bootstrap.utils.trainingUtils.createTraining({
                userId: user.id,
            });
            const updateTrainingDto = { description: 'Hacked description' };

            // when
            const response = await request(bootstrap.app.getHttpServer())
                .put(`/trainings/${training.id}`)
                .set('Authorization', `Bearer ${token}`)
                .send(updateTrainingDto);

            // then
            expect(response.status).toBe(403);
        });
    });

    describe('DELETE /trainings/:trainingId', () => {
        it('allows user to delete their own training', async () => {
            // given
            const user = await bootstrap.utils.userUtils.createDefaultUser();
            const token = bootstrap.utils.authUtils.generateToken(user);
            const training = await bootstrap.utils.trainingUtils.createTraining({
                userId: user.id,
            });

            // when
            const response = await request(bootstrap.app.getHttpServer())
                .delete(`/trainings/${training.id}`)
                .set('Authorization', `Bearer ${token}`);

            // then
            expect(response.status).toBe(200);
            expect(response.body).toMatchObject({ id: training.id });
        });

        it('deletes training successfully by admin', async () => {
            // given
            const user = await bootstrap.utils.userUtils.createDefaultUser();
            const adminUser = await bootstrap.utils.userUtils.createAdminUser();
            const token = bootstrap.utils.authUtils.generateToken(adminUser);
            const training = await bootstrap.utils.trainingUtils.createTraining({
                userId: user.id,
            });

            // when
            const response = await request(bootstrap.app.getHttpServer())
                .delete(`/trainings/${training.id}`)
                .set('Authorization', `Bearer ${token}`);

            // then
            expect(response.status).toBe(200);
            expect(response.body).toMatchObject({ id: training.id });

            // Verify training is actually deleted
            const deletedTraining = await bootstrap.utils.trainingUtils.getTraining();
            expect(deletedTraining?.id).not.toBe(training.id);
        });

        it('returns 404 for non-existent training', async () => {
            // given
            const adminUser = await bootstrap.utils.userUtils.createAdminUser();
            const token = bootstrap.utils.authUtils.generateToken(adminUser);
            const nonExistentId = '507f1f77bcf86cd799439011';

            // when
            const response = await request(bootstrap.app.getHttpServer())
                .delete(`/trainings/${nonExistentId}`)
                .set('Authorization', `Bearer ${token}`);

            // then
            expect(response.status).toBe(404);
        });

        it('returns 403 when non-owner tries to delete', async () => {
            // given
            const owner = await bootstrap.utils.userUtils.createDefaultUser();
            const other = await bootstrap.utils.userUtils.createDefaultUser();
            const token = bootstrap.utils.authUtils.generateToken(other);
            const training = await bootstrap.utils.trainingUtils.createTraining({
                userId: owner.id,
            });

            // when
            const response = await request(bootstrap.app.getHttpServer())
                .delete(`/trainings/${training.id}`)
                .set('Authorization', `Bearer ${token}`);

            // then
            expect(response.status).toBe(403);
        });

        it('allows admin to delete any training', async () => {
            // given
            const user = await bootstrap.utils.userUtils.createDefaultUser();
            const adminUser = await bootstrap.utils.userUtils.createAdminUser();
            const token = bootstrap.utils.authUtils.generateToken(adminUser);
            const training = await bootstrap.utils.trainingUtils.createTraining({
                userId: user.id,
            });

            // when
            const response = await request(bootstrap.app.getHttpServer())
                .delete(`/trainings/${training.id}`)
                .set('Authorization', `Bearer ${token}`);

            // then
            expect(response.status).toBe(200);
            expect(response.body).toMatchObject({ id: training.id });
        });
    });
});
