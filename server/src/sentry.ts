import * as Sentry from '@sentry/node';
import { expressIntegration } from '@sentry/node';

function initSentry() {
    Sentry.init({
        dsn: 'https://818ca8975fe9783562da69d86f6d5ac4@o4509798651527168.ingest.de.sentry.io/4509798654017616',
        integrations: [expressIntegration()],
        tracePropagationTargets: ['localhost', 'example.com']
    });
}

export { initSentry, Sentry };