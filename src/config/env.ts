import { config } from '@dotenvx/dotenvx';

const environment = process.env.NODE_ENV ?? 'development';

config({ path: [`.env.${environment}`, '.env'], ignore: ['MISSING_ENV_FILE'] });
