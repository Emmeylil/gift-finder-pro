/**
 * Normalizes text by lowering case, removing punctuation, and splitting into tokens.
 */
export function normalizeText(text: string): string[] {
    return text
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .split(/\s+/)
        .filter(Boolean);
}

/**
 * Calculates the Levenshtein distance between two strings.
 */
export function levenshtein(a: string, b: string): number {
    const dp = Array.from({ length: a.length + 1 }, (_, i) =>
        Array.from({ length: b.length + 1 }, (_, j) =>
            i === 0 ? j : j === 0 ? i : 0
        )
    );

    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            dp[i][j] = Math.min(
                dp[i - 1][j] + 1, // deletion
                dp[i][j - 1] + 1, // insertion
                dp[i - 1][j - 1] + cost // substitution
            );
        }
    }

    return dp[a.length][b.length];
}

/**
 * Calculates a similarity score between 0 and 1 using Levenshtein distance.
 */
export function fuzzyMatchScore(searchWord: string, targetWord: string): number {
    const distance = levenshtein(searchWord, targetWord);
    const maxLen = Math.max(searchWord.length, targetWord.length);
    if (maxLen === 0) return 1;
    return 1 - distance / maxLen;
}

/**
 * Checks if a search query matching a target string based on a fuzzy threshold.
 */
export function isFuzzyMatch(search: string, target: string, threshold = 0.7): boolean {
    const searchTokens = normalizeText(search);
    const targetTokens = normalizeText(target);

    if (searchTokens.length === 0) return true;

    let matchCount = 0;

    for (const word of searchTokens) {
        const bestMatchScore = Math.max(
            ...targetTokens.map(token => fuzzyMatchScore(word, token)),
            0
        );
        if (bestMatchScore >= threshold) {
            matchCount++;
        }
    }

    // Require at least 70% of search tokens to match
    return matchCount >= Math.floor(searchTokens.length * 0.7);
}
