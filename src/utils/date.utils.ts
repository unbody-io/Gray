export const formatDate = (date: string) => {
    // `2021-08-12T00:00:00.000Z` to `Aug 12, 2021`
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {year: 'numeric', month: 'short', day: 'numeric'})
}
