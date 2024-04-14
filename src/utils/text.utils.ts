function getLevenshteinDistance(a: string, b: string): number {
    // Create a matrix to hold the distances
    const matrix: number[][] = [];

    // Initialize the matrix
    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    // Calculate distances
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) == a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }

    return matrix[b.length][a.length];
}

export function getSimilarityScore(a: string, b: string): number {
    const distance = getLevenshteinDistance(a, b);
    const longestLength = Math.max(a.length, b.length);
    if (longestLength === 0) {
        return 1.0; // Both strings are empty
    }
    return (longestLength - distance) / longestLength;
}
