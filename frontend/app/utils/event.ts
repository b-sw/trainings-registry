export function hasEventStartedCET(now: Date = new Date()): boolean {
    const eventDate = new Date('2025-08-12T00:00:00+02:00');
    return now.getTime() >= eventDate.getTime();
}
