export const logsomething = () => {
        console.log('something')
    }

export const returnsomething = () => {
        return 'sumthin';
    }

export const log = (...args: any[]) => {
        const now = Date.now();
        while(Date.now() < now + 5000);
        console.log(args);
    }

export const exports = {
    logsomething, returnsomething, log
}

export type MyClass = typeof exports;
