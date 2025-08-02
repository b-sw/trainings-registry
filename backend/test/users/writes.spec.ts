import * as request from 'supertest';
import { Role } from '../../src/users/entities/user.entity';
import { createTestApp } from '../utils/bootstrap';

describe('UsersController (writes)', () => {
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

    describe('POST /users', () => {
        it('creates a new user', async () => {
            // given
            const adminUser = await bootstrap.utils.userUtils.createAdminUser();
            const token = bootstrap.utils.authUtils.generateToken(adminUser);
            const createUserDto = {
                email: 'newuser@test.com',
                name: 'New User',
                role: Role.User,
            };

            // when
            const response = await request(bootstrap.app.getHttpServer())
                .post('/users')
                .set('Authorization', `Bearer ${token}`)
                .send(createUserDto);

            // then
            expect(response.status).toBe(201);
            expect(response.body).toMatchObject({
                email: 'newuser@test.com',
                name: 'New User',
                role: Role.User,
            });
            expect(response.body.id).toBeDefined();
        });

        it('returns 409 when email already exists', async () => {
            // given
            const existingUser = await bootstrap.utils.userUtils.createDefaultUser({
                email: 'existing@test.com',
            });
            const adminUser = await bootstrap.utils.userUtils.createAdminUser();
            const token = bootstrap.utils.authUtils.generateToken(adminUser);
            const createUserDto = {
                email: 'existing@test.com',
                name: 'Duplicate User',
            };

            // when
            const response = await request(bootstrap.app.getHttpServer())
                .post('/users')
                .set('Authorization', `Bearer ${token}`)
                .send(createUserDto);

            // then
            expect(response.status).toBe(409);
        });

        it('returns 403 when not admin', async () => {
            // given
            const regularUser = await bootstrap.utils.userUtils.createDefaultUser();
            const token = bootstrap.utils.authUtils.generateToken(regularUser);
            const createUserDto = {
                email: 'newuser@test.com',
                name: 'New User',
            };

            // when
            const response = await request(bootstrap.app.getHttpServer())
                .post('/users')
                .set('Authorization', `Bearer ${token}`)
                .send(createUserDto);

            // then
            expect(response.status).toBe(403);
        });

        it('returns 401 when not authenticated', async () => {
            // given
            const createUserDto = {
                email: 'newuser@test.com',
                name: 'New User',
            };

            // when
            const response = await request(bootstrap.app.getHttpServer())
                .post('/users')
                .send(createUserDto);

            // then
            expect(response.status).toBe(401);
        });
    });

    describe('PUT /users/:userId', () => {
        it('updates user successfully', async () => {
            // given
            const user = await bootstrap.utils.userUtils.createDefaultUser({
                email: 'original@test.com',
                name: 'Original Name',
            });
            const adminUser = await bootstrap.utils.userUtils.createAdminUser();
            const token = bootstrap.utils.authUtils.generateToken(adminUser);
            const updateUserDto = {
                name: 'Updated Name',
                role: Role.Employee,
            };

            // when
            const response = await request(bootstrap.app.getHttpServer())
                .put(`/users/${user.id}`)
                .set('Authorization', `Bearer ${token}`)
                .send(updateUserDto);

            // then
            expect(response.status).toBe(200);
            expect(response.body).toMatchObject({
                name: 'Updated Name',
                role: Role.Employee,
                email: 'original@test.com', // Should remain unchanged
                id: user.id,
            });
        });

        it('returns 404 for non-existent user', async () => {
            // given
            const adminUser = await bootstrap.utils.userUtils.createAdminUser();
            const token = bootstrap.utils.authUtils.generateToken(adminUser);
            const nonExistentId = '507f1f77bcf86cd799439011';
            const updateUserDto = { name: 'Updated Name' };

            // when
            const response = await request(bootstrap.app.getHttpServer())
                .put(`/users/${nonExistentId}`)
                .set('Authorization', `Bearer ${token}`)
                .send(updateUserDto);

            // then
            expect(response.status).toBe(404);
        });

        it('returns 403 when not admin', async () => {
            // given
            const user = await bootstrap.utils.userUtils.createDefaultUser();
            const regularUser = await bootstrap.utils.userUtils.createDefaultUser();
            const token = bootstrap.utils.authUtils.generateToken(regularUser);
            const updateUserDto = { name: 'Hacked Name' };

            // when
            const response = await request(bootstrap.app.getHttpServer())
                .put(`/users/${user.id}`)
                .set('Authorization', `Bearer ${token}`)
                .send(updateUserDto);

            // then
            expect(response.status).toBe(403);
        });
    });

    describe('DELETE /users/:userId', () => {
        it('deletes user successfully', async () => {
            // given
            const user = await bootstrap.utils.userUtils.createDefaultUser({
                email: 'todelete@test.com',
            });
            const adminUser = await bootstrap.utils.userUtils.createAdminUser();
            const token = bootstrap.utils.authUtils.generateToken(adminUser);

            // when
            const response = await request(bootstrap.app.getHttpServer())
                .delete(`/users/${user.id}`)
                .set('Authorization', `Bearer ${token}`);

            // then
            expect(response.status).toBe(200);
            expect(response.body).toMatchObject({
                email: 'todelete@test.com',
                id: user.id,
            });

            // Verify user is actually deleted
            const deletedUser = await bootstrap.utils.userUtils.getUser();
            expect(deletedUser?.email).not.toBe('todelete@test.com');
        });

        it('returns 404 for non-existent user', async () => {
            // given
            const adminUser = await bootstrap.utils.userUtils.createAdminUser();
            const token = bootstrap.utils.authUtils.generateToken(adminUser);
            const nonExistentId = '507f1f77bcf86cd799439011';

            // when
            const response = await request(bootstrap.app.getHttpServer())
                .delete(`/users/${nonExistentId}`)
                .set('Authorization', `Bearer ${token}`);

            // then
            expect(response.status).toBe(404);
        });

        it('returns 403 when not admin', async () => {
            // given
            const user = await bootstrap.utils.userUtils.createDefaultUser();
            const regularUser = await bootstrap.utils.userUtils.createDefaultUser();
            const token = bootstrap.utils.authUtils.generateToken(regularUser);

            // when
            const response = await request(bootstrap.app.getHttpServer())
                .delete(`/users/${user.id}`)
                .set('Authorization', `Bearer ${token}`);

            // then
            expect(response.status).toBe(403);
        });
    });
});
