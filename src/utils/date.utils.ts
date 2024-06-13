export const formatDate = (date: string) => {
    // `2021-08-12T00:00:00.000Z` to `Aug 12, 2021`
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {year: 'numeric', month: 'short', day: 'numeric'})
}

export function timeToSeconds(time: string): number {
    const [h, m, s] = time.split(':');
    const [sec, ms] = s.split('.');
    return Number(h) * 3600 + Number(m) * 60 + Number(sec) + Number(ms) / 1000;
}

export const formatTime = (time: string): string => {
    const [h, m, s] = time.split(':');
    const [sec, ms] = s.split('.');

    if (Number(h) === 0) {
        return `${m.padStart(2, "0")}:${sec.padStart(2, '0')}`;
    }else{
        return `${h.padStart(2, "0")}:${m.padStart(2, "0")}`
    }
}


export const formatTimeFromSeconds = (time: number): string => {
    const h = Math.floor(time / 3600);
    const m = Math.floor((time % 3600) / 60);
    const s = Math.floor(time % 60);
    if (h === 0) {
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}
