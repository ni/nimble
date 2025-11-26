/**
 * Shared types for lint orchestration helpers. These mirror the entities in
 * specs/002-lint-speedup/data-model.md so helpers and telemetry stay aligned.
 */

export type WorkspaceWeight = 'light' | 'standard' | 'heavy';

export interface WorkspaceLintTask {
    name: string;
    path: string;
    script: string;
    dependsOn?: string[];
    weight?: WorkspaceWeight;
    cache?: {
        eslintCacheLocation?: string;
        inputs?: string[];
    };
}

export type TelemetryStatus = 'success' | 'failed' | 'cached' | 'skipped';

export interface TelemetrySnapshot {
    timestamp: string;
    workspace: string;
    task: string;
    durationMs: number;
    status: TelemetryStatus;
    cacheHit: boolean;
    workerId?: string;
    machine?: string;
    gitSha?: string;
    commandFlags?: string[];
}

export type LintManifestStatus = 'passed' | 'failed';

export interface LintManifestEntry {
    workspace: string;
    status: LintManifestStatus;
    durationMs: number;
    eslintCacheChecksum?: string;
}

export interface LintManifest {
    runId: string;
    gitSha: string;
    timestamp: string;
    packages: LintManifestEntry[];
}
