export const healthStatus = {
    healthy: 'Healthy',
    error: 'Error',
    unknown: 'Unknown',
} as const;

export type HealthStatus = typeof healthStatus[keyof typeof healthStatus];