export default {
    browser: {
        title:      'Hill Software',
        favicon:    '/assets/favicon.png'
    },
    authentication: {
        forgotPassword:   true,
        signUp:           true,
        session: {
            duration:     1000 * 60 * 60 * 24 * 7,
            cookieAge:    1000 * 60 * 60 * 24 * 7,
            keepAlive:    1000 * 60 * 60 * 24,
        },
        password: {
            minLength: null,
            maxLength:   72,
            strength:     3
        },
        concurrentSessions: false,
    }
}
