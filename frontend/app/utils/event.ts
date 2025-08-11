export function hasEventStartedCET(now: Date = new Date()): boolean {
    return now.getTime() >= EVENT_START_DATE.getTime();
}

export const EVENT_START_DATE = new Date('2025-08-11T00:00:00+02:00');
export const EVENT_START_DATE_MONTH = new Date('2025-08-01T00:00:00+02:00');
