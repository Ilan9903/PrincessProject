// Token blacklist
// En production, utiliser Redis avec TTL pour partager entre instances
export const tokenBlacklist = new Set();
