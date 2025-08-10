import MockDate from 'mockdate';
import * as request from 'supertest';
import { envConfig } from '../../src/shared/env.config';
import { ActivityType } from '../../src/trainings/entities/training.entity';
import { createTestApp } from '../utils/bootstrap';

/**
 * Verifies that in non-dev environments, activity creation is blocked
 * before 12 Aug 07:00 CET (05:00 UTC) and allowed afterwards.
 */
describe('TrainingsController (time gate, non-dev)', () => {
    const originalIsDev = envConfig.isDevEnv;

    afterEach(() => {
        envConfig.isDevEnv = originalIsDev;
        MockDate.reset();
    });

    it('returns 400 when now is before opening time', async () => {
        envConfig.isDevEnv = false;
        MockDate.set('2025-08-12T04:59:59.000Z');
        const bootstrap = await createTestApp();

        const user = await bootstrap.utils.userUtils.createDefaultUser();
        const token = bootstrap.utils.authUtils.generateToken(user);
        const createTrainingDto = {
            userId: user.id,
            description: 'Early training',
            // date in the past so future-date check does not trigger
            date: new Date('2025-08-10T10:00:00.000Z').toISOString(),
            distance: 2.0,
            activityType: ActivityType.Running,
        };

        const response = await request(bootstrap.app.getHttpServer())
            .post('/trainings')
            .set('Authorization', `Bearer ${token}`)
            .send(createTrainingDto);

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Activity creation is not allowed yet');

        await bootstrap.methods.afterAll();
    });

    it('allows creation when now is after opening time', async () => {
        envConfig.isDevEnv = false;
        MockDate.set('2025-08-12T05:00:00.000Z');
        const bootstrap = await createTestApp();

        const user = await bootstrap.utils.userUtils.createDefaultUser();
        const token = bootstrap.utils.authUtils.generateToken(user);
        const createTrainingDto = {
            userId: user.id,
            description: 'On time training',
            date: new Date('2025-08-10T10:00:00.000Z').toISOString(),
            distance: 2.0,
            activityType: ActivityType.Running,
        };

        const response = await request(bootstrap.app.getHttpServer())
            .post('/trainings')
            .set('Authorization', `Bearer ${token}`)
            .send(createTrainingDto);

        expect(response.status).toBe(201);

        await bootstrap.methods.afterAll();
    });
});
