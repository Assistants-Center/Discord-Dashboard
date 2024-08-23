import { Environment } from '@discord-dashboard/typings/dist/Config';

interface LogEntry {
    level: 'info' | 'warn' | 'error';
    message: string;
    timestamp: Date;
}

class Logger {
    private logs: LogEntry[] = [];
    private readonly maxLogs: number = 25;

    constructor(private readonly environment: Environment) {}

    public info(message: string): void {
        this.addLog('info', message);
    }

    public warn(message: string): void {
        this.addLog('warn', message);
    }

    public error(message: string): void {
        this.addLog('error', message);
    }

    private addLog(level: 'info' | 'warn' | 'error', message: string): void {
        const logEntry: LogEntry = {
            level,
            message,
            timestamp: new Date(),
        };
        this.logs.push(logEntry);

        if (this.logs.length > this.maxLogs) {
            this.logs.shift();
        }

        if (this.environment === Environment.DEVELOPMENT) {
            console.log(
                `DBDv3 [${logEntry.timestamp.toISOString()}] ${level.toUpperCase()}: ${message}`,
            );
        }
    }

    public getLogs(): LogEntry[] {
        return this.logs;
    }
}

export default Logger;
