import * as request from 'supertest';
import { ActivityType } from '../../src/trainings/entities/training.entity';
import { createTestApp } from '../utils/bootstrap';

describe('TrainingsController (reads)', () => {
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

    describe('GET /trainings', () => {
        it('returns all trainings', async () => {
            // given
            const user = await bootstrap.utils.userUtils.createDefaultUser();
            const adminUser = await bootstrap.utils.userUtils.createAdminUser();
            const token = bootstrap.utils.authUtils.generateToken(adminUser);

            await bootstrap.utils.trainingUtils.createTraining({
                userId: user.id,
                distance: 5.0,
                activityType: ActivityType.Running,
            });
            await bootstrap.utils.trainingUtils.createTraining({
                userId: user.id,
                distance: 3.0,
                activityType: ActivityType.Cycling,
            });

            // when
            const response = await request(bootstrap.app.getHttpServer())
                .get('/trainings')
                .set('Authorization', `Bearer ${token}`);

            // then
            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(2);
        });

        it('returns 401 when not authenticated', async () => {
            // when
            const response = await request(bootstrap.app.getHttpServer()).get('/trainings');

            // then
            expect(response.status).toBe(401);
        });
    });

    describe('GET /trainings/total-distance', () => {
        it('returns total distance across all trainings', async () => {
            // given
            const user = await bootstrap.utils.userUtils.createDefaultUser();
            const adminUser = await bootstrap.utils.userUtils.createAdminUser();
            const token = bootstrap.utils.authUtils.generateToken(adminUser);

            await bootstrap.utils.trainingUtils.createTraining({
                userId: user.id,
                distance: 5.0,
                activityType: ActivityType.Running,
            });
            await bootstrap.utils.trainingUtils.createTraining({
                userId: user.id,
                distance: 3.5,
                activityType: ActivityType.Walking,
            });

            // when
            const response = await request(bootstrap.app.getHttpServer())
                .get('/trainings/total-distance')
                .set('Authorization', `Bearer ${token}`);

            // then
            expect(response.status).toBe(200);
            expect(response.body).toMatchObject({
                totalDistance: 8.5,
            });
        });
    });

    describe('GET /trainings/:trainingId', () => {
        it('returns specific training by id', async () => {
            // given
            const user = await bootstrap.utils.userUtils.createDefaultUser();
            const adminUser = await bootstrap.utils.userUtils.createAdminUser();
            const token = bootstrap.utils.authUtils.generateToken(adminUser);
            const training = await bootstrap.utils.trainingUtils.createTraining({
                userId: user.id,
                distance: 7.5,
                activityType: ActivityType.Running,
            });

            // when
            const response = await request(bootstrap.app.getHttpServer())
                .get(`/trainings/${training.id}`)
                .set('Authorization', `Bearer ${token}`);

            // then
            expect(response.status).toBe(200);
            expect(response.body).toMatchObject({
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

            // when
            const response = await request(bootstrap.app.getHttpServer())
                .get(`/trainings/${nonExistentId}`)
                .set('Authorization', `Bearer ${token}`);

            // then
            expect(response.status).toBe(404);
        });
    });

    describe('GET /users/:userId/trainings', () => {
        it('returns trainings for specific user', async () => {
            // given
            const user1 = await bootstrap.utils.userUtils.createDefaultUser({
                email: 'user1@test.com',
            });
            const user2 = await bootstrap.utils.userUtils.createDefaultUser({
                email: 'user2@test.com',
            });
            const adminUser = await bootstrap.utils.userUtils.createAdminUser();
            const token = bootstrap.utils.authUtils.generateToken(adminUser);

            await bootstrap.utils.trainingUtils.createTraining({
                userId: user1.id,
                activityType: ActivityType.Running,
            });
            await bootstrap.utils.trainingUtils.createTraining({
                userId: user2.id,
                activityType: ActivityType.Running,
            });

            // when
            const response = await request(bootstrap.app.getHttpServer())
                .get(`/users/${user1.id}/trainings`)
                .set('Authorization', `Bearer ${token}`);

            // then
            expect(response.status).toBe(200);
            expect(response.body).toMatchObject({
                trainings: expect.any(Array),
                total: 1,
                hasMore: false,
                skip: 0,
                limit: 20,
            });
            expect(response.body.trainings).toHaveLength(1);
            expect(response.body.trainings[0]).toMatchObject({
                userId: user1.id,
            });
        });

        it('returns paginated trainings with custom skip and limit', async () => {
            // given
            const user = await bootstrap.utils.userUtils.createDefaultUser();
            const adminUser = await bootstrap.utils.userUtils.createAdminUser();
            const token = bootstrap.utils.authUtils.generateToken(adminUser);

            // Create 5 trainings
            for (let i = 1; i <= 5; i++) {
                await bootstrap.utils.trainingUtils.createTraining({
                    userId: user.id,
                    distance: i,
                    activityType: ActivityType.Running,
                });
            }

            // when
            const response = await request(bootstrap.app.getHttpServer())
                .get(`/users/${user.id}/trainings?skip=2&limit=2`)
                .set('Authorization', `Bearer ${token}`);

            // then
            expect(response.status).toBe(200);
            expect(response.body).toMatchObject({
                trainings: expect.any(Array),
                total: 5,
                hasMore: true,
                skip: 2,
                limit: 2,
            });
            expect(response.body.trainings).toHaveLength(2);
        });

        it('returns empty array for user with no trainings', async () => {
            // given
            const user = await bootstrap.utils.userUtils.createDefaultUser();
            const adminUser = await bootstrap.utils.userUtils.createAdminUser();
            const token = bootstrap.utils.authUtils.generateToken(adminUser);

            // when
            const response = await request(bootstrap.app.getHttpServer())
                .get(`/users/${user.id}/trainings`)
                .set('Authorization', `Bearer ${token}`);

            // then
            expect(response.status).toBe(200);
            expect(response.body).toMatchObject({
                trainings: [],
                total: 0,
                hasMore: false,
                skip: 0,
                limit: 20,
            });
        });

        it('limits maximum results to 100', async () => {
            // given
            const user = await bootstrap.utils.userUtils.createDefaultUser();
            const adminUser = await bootstrap.utils.userUtils.createAdminUser();
            const token = bootstrap.utils.authUtils.generateToken(adminUser);

            // when
            const response = await request(bootstrap.app.getHttpServer())
                .get(`/users/${user.id}/trainings?limit=150`)
                .set('Authorization', `Bearer ${token}`);

            // then
            expect(response.status).toBe(200);
            expect(response.body.limit).toBe(100); // Should be capped at 100
        });
    });

    describe('POST /users/:userId/activities', () => {
        it('returns user activity in date range', async () => {
            // given
            const user = await bootstrap.utils.userUtils.createDefaultUser();
            const adminUser = await bootstrap.utils.userUtils.createAdminUser();
            const token = bootstrap.utils.authUtils.generateToken(adminUser);

            const startDate = '2025-01-01T00:00:00.000Z';
            const endDate = '2025-01-31T23:59:59.999Z';

            await bootstrap.utils.trainingUtils.createTraining({
                userId: user.id,
                date: new Date('2025-01-15'),
                distance: 5.0,
                activityType: ActivityType.Running,
            });
            await bootstrap.utils.trainingUtils.createTraining({
                userId: user.id,
                date: new Date('2025-01-20'),
                distance: 3.0,
                activityType: ActivityType.Cycling,
            });

            // when
            const response = await request(bootstrap.app.getHttpServer())
                .post(`/users/${user.id}/activities`)
                .set('Authorization', `Bearer ${token}`)
                .send({ startDate, endDate });

            // then
            expect(response.status).toBe(200);
            expect(response.body).toMatchObject({
                userId: user.id,
                totalDistance: 8.0,
                totalTrainings: 2,
            });
            expect(response.body.trainings).toHaveLength(2);
        });
    });

    describe('POST /users/activities', () => {
        it('returns all users activities in date range', async () => {
            // given
            const user1 = await bootstrap.utils.userUtils.createDefaultUser();
            const user2 = await bootstrap.utils.userUtils.createDefaultUser();
            const adminUser = await bootstrap.utils.userUtils.createAdminUser();
            const token = bootstrap.utils.authUtils.generateToken(adminUser);

            const startDate = '2025-01-01T00:00:00.000Z';
            const endDate = '2025-01-31T23:59:59.999Z';

            await bootstrap.utils.trainingUtils.createTraining({
                userId: user1.id,
                date: new Date('2025-01-15'),
                distance: 5.0,
                activityType: ActivityType.Running,
            });
            await bootstrap.utils.trainingUtils.createTraining({
                userId: user2.id,
                date: new Date('2025-01-20'),
                distance: 3.0,
                activityType: ActivityType.Walking,
            });

            // when
            const response = await request(bootstrap.app.getHttpServer())
                .post('/users/activities')
                .set('Authorization', `Bearer ${token}`)
                .send({ startDate, endDate });

            // then
            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(2);

            const user1Activity = response.body.find((u: any) => u.userId === user1.id);
            const user2Activity = response.body.find((u: any) => u.userId === user2.id);

            expect(user1Activity).toMatchObject({
                userId: user1.id,
                totalDistance: 5.0,
                totalTrainings: 1,
            });
            expect(user2Activity).toMatchObject({
                userId: user2.id,
                totalDistance: 3.0,
                totalTrainings: 1,
            });
        });
    });

    describe('POST /teams/activities', () => {
        it('returns team activities summary', async () => {
            // given
            const user1 = await bootstrap.utils.userUtils.createDefaultUser();
            const user2 = await bootstrap.utils.userUtils.createDefaultUser();
            const adminUser = await bootstrap.utils.userUtils.createAdminUser();
            const token = bootstrap.utils.authUtils.generateToken(adminUser);

            const startDate = '2025-01-01T00:00:00.000Z';
            const endDate = '2025-01-31T23:59:59.999Z';

            await bootstrap.utils.trainingUtils.createTraining({
                userId: user1.id,
                date: new Date('2025-01-15'),
                distance: 5.0,
                activityType: ActivityType.Running,
            });
            await bootstrap.utils.trainingUtils.createTraining({
                userId: user2.id,
                date: new Date('2025-01-20'),
                distance: 3.0,
                activityType: ActivityType.Cycling,
            });

            // when
            const response = await request(bootstrap.app.getHttpServer())
                .post('/teams/activities')
                .set('Authorization', `Bearer ${token}`)
                .send({ startDate, endDate });

            // then
            expect(response.status).toBe(200);
            expect(response.body).toMatchObject({
                totalDistance: 8.0,
                totalTrainings: 2,
                totalUsers: 2,
            });
        });
    });
});
