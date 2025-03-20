import { ticksPerHour, ticksPerWeek } from '@technobuddha/library';

type Settings = {
  login: boolean;
  forgotPassword: boolean;
  signUp: boolean;
  session: {
    duration: number;
    cookieAge: number;
    keepAlive: number;
  };
  password: {
    minLength?: number;
    maxLength?: number;
    strength?: 1 | 2 | 3 | 4;
    uppercase?: number;
    lowercase?: number;
    digit?: number;
    special?: number;
    categories?: 2 | 3 | 4;
    showInvalidOnly?: boolean;
  };
  tos: string | false;
  concurrentSessions: boolean;
};

export const authenticationSettings: Settings = {
  login: true,
  forgotPassword: false,
  signUp: true,
  session: {
    duration: ticksPerWeek,
    cookieAge: ticksPerWeek,
    keepAlive: ticksPerHour * 0.5,
  },
  password: {
    maxLength: 72,
    strength: 3,
    showInvalidOnly: true,
  },
  tos: false,
  concurrentSessions: false,
};
