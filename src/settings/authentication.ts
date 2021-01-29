import { ticksPerWeek, ticksPerHour } from '@technobuddha/library/constants';

type Settings = {
    forgotPassword: boolean;
    signUp: boolean;
    session: {
        duration: number;
        cookieAge: number;
        keepAlive: number;
    };
    password: {
        minLength?: number | null;
        maxLength?: number | null;
        strength?:  number | null;
    };
    concurrentSessions: boolean;
};

export default {
    forgotPassword:   false,
    signUp:           true,
    session: {
        duration:     ticksPerWeek,
        cookieAge:    ticksPerWeek,
        keepAlive:    ticksPerHour * 0.5,
    },
    password: {
        minLength: null,
        maxLength:   72,
        strength:     3,
    },
    concurrentSessions: false,
} as Settings;
