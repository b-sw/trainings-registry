import { createLogDash, Logger, Metrics } from '@logdash/js-sdk';
import { Global, Module } from '@nestjs/common';
import { envConfig } from '../shared/env.config';

@Global()
@Module({
    providers: [
        {
            provide: Logger,
            useFactory: () => {
                const { logger } = createLogDash({ apiKey: envConfig.logdashApiKey });
                return logger;
            },
        },
        {
            provide: Metrics,
            useFactory: () => {
                const { metrics } = createLogDash({ apiKey: envConfig.logdashApiKey });
                return metrics;
            },
        },
    ],
    exports: [Logger, Metrics],
})
export class LogdashModule {}
