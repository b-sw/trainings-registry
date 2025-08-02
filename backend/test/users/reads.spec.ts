import * as request from 'supertest';
import { Role } from '../../src/users/entities/user.entity';
import { createTestApp } from '../utils/bootstrap';

describe('UsersController (reads)', () => {
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

    describe('GET /users', () => {
        it('returns all users', async () => {
            // given
            const user1 = await bootstrap.utils.userUtils.createDefaultUser({
                email: 'user1@test.com',
                name: 'User One',
            });
            const user2 = await bootstrap.utils.userUtils.createDefaultUser({
                email: 'user2@test.com',
                name: 'User Two',
            });
            const adminUser = await bootstrap.utils.userUtils.createAdminUser({
                email: 'admin@test.com',
            });
            const token = bootstrap.utils.authUtils.generateToken(adminUser);

            // when
            const response = await request(bootstrap.app.getHttpServer())
                .get('/users')
                .set('Authorization', `Bearer ${token}`);

            // then
            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(3);
            expect(response.body.map((u: any) => u.email)).toContain('user1@test.com');
            expect(response.body.map((u: any) => u.email)).toContain('user2@test.com');
        });

        it('returns 401 when not authenticated', async () => {
            // when
            const response = await request(bootstrap.app.getHttpServer()).get('/users');

            // then
            expect(response.status).toBe(401);
        });

        it('returns 401 with invalid token', async () => {
            // when
            const response = await request(bootstrap.app.getHttpServer())
                .get('/users')
                .set('Authorization', 'Bearer invalid-token');

            // then
            expect(response.status).toBe(401);
        });
    });

    describe('GET /users/admins', () => {
        it('returns only admin users', async () => {
            // given
            await bootstrap.utils.userUtils.createDefaultUser({ email: 'user@test.com' });
            const admin1 = await bootstrap.utils.userUtils.createAdminUser({
                email: 'admin1@test.com',
            });
            const admin2 = await bootstrap.utils.userUtils.createAdminUser({
                email: 'admin2@test.com',
            });
            const token = bootstrap.utils.authUtils.generateToken(admin1);

            // when
            const response = await request(bootstrap.app.getHttpServer())
                .get('/users/admins')
                .set('Authorization', `Bearer ${token}`);

            // then
            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(2);
            expect(response.body.every((u: any) => u.role === Role.Admin)).toBe(true);
        });
    });

    describe('GET /users/employees', () => {
        it('returns only employee users', async () => {
            // given
            await bootstrap.utils.userUtils.createDefaultUser({ email: 'user@test.com' });
            const employee = await bootstrap.utils.userUtils.createEmployeeUser({
                email: 'employee@test.com',
            });
            const adminUser = await bootstrap.utils.userUtils.createAdminUser({
                email: 'admin@test.com',
            });
            const token = bootstrap.utils.authUtils.generateToken(adminUser);

            // when
            const response = await request(bootstrap.app.getHttpServer())
                .get('/users/employees')
                .set('Authorization', `Bearer ${token}`);

            // then
            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(1);
            expect(response.body[0]).toMatchObject({
                role: Role.Employee,
                email: 'employee@test.com',
            });
        });
    });

    describe('GET /users/:userId', () => {
        it('returns specific user by id', async () => {
            // given
            const user = await bootstrap.utils.userUtils.createDefaultUser({
                email: 'user@test.com',
                name: 'Test User',
            });
            const adminUser = await bootstrap.utils.userUtils.createAdminUser();
            const token = bootstrap.utils.authUtils.generateToken(adminUser);

            // when
            const response = await request(bootstrap.app.getHttpServer())
                .get(`/users/${user.id}`)
                .set('Authorization', `Bearer ${token}`);

            // then
            expect(response.status).toBe(200);
            expect(response.body).toMatchObject({
                email: 'user@test.com',
                name: 'Test User',
                id: user.id,
            });
        });

        it('returns 404 for non-existent user', async () => {
            // given
            const adminUser = await bootstrap.utils.userUtils.createAdminUser();
            const token = bootstrap.utils.authUtils.generateToken(adminUser);
            const nonExistentId = '507f1f77bcf86cd799439011';

            // when
            const response = await request(bootstrap.app.getHttpServer())
                .get(`/users/${nonExistentId}`)
                .set('Authorization', `Bearer ${token}`);

            // then
            expect(response.status).toBe(404);
        });

        it('returns 401 when not authenticated', async () => {
            // given
            const user = await bootstrap.utils.userUtils.createDefaultUser();

            // when
            const response = await request(bootstrap.app.getHttpServer()).get(`/users/${user.id}`);

            // then
            expect(response.status).toBe(401);
        });
    });
});
