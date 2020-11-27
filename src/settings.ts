import { ticksPerWeek, ticksPerHour } from '@technobuddha/library/constants';

export default {
    browser: {
        title:      'Hill Software',
        favicon:    '/assets/favicon.png'
    },
    authentication: {
        forgotPassword:   false,
        signUp:           true,
        session: {
            duration:     1   * ticksPerWeek,
            cookieAge:    1   * ticksPerWeek,
            keepAlive:    0.5 * ticksPerHour,
        },
        password: {
            minLength: null,
            maxLength:   72,
            strength:     3
        },
        concurrentSessions: false,
    }
}
