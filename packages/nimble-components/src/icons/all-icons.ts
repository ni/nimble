import { baseName as accessControlName } from './access-control';
import { baseName as adminName } from './admin';
import { baseName as administrationName } from './administration';
import { baseName as checkName } from './check';
import { baseName as customApplicationsName } from './custom-applications';
import { baseName as deleteName } from './delete';
import { baseName as loginName } from './login';
import { baseName as logoutName } from './logout';
import { baseName as managedSystemsName } from './managed-systems';
import { baseName as measurementDataAnalysisName } from './measurement-data-analysis';
import { baseName as settingsName } from './settings';
import { baseName as testInsightsName } from './test-insights';
import { baseName as utilitiesName } from './utilities';

export interface NimbleIconComponent {
    componentName: string;
}

export const accessControl: NimbleIconComponent = { componentName: `nimble-${accessControlName}` };
export const admin: NimbleIconComponent = { componentName: `nimble-${adminName}` };
export const administration: NimbleIconComponent = { componentName: `nimble-${administrationName}` };
export const check: NimbleIconComponent = { componentName: `nimble-${checkName}` };
export const customApplications: NimbleIconComponent = {
    componentName: `nimble-${customApplicationsName}`
};
export const deleteIcon: NimbleIconComponent = { componentName: `nimble-${deleteName}` };
export const login: NimbleIconComponent = { componentName: `nimble-${loginName}` };
export const logout: NimbleIconComponent = { componentName: `nimble-${logoutName}` };
export const managedSystems: NimbleIconComponent = { componentName: `nimble-${managedSystemsName}` };
export const measurementDataAnalysis: NimbleIconComponent = {
    componentName: `nimble-${measurementDataAnalysisName}`
};
export const settings: NimbleIconComponent = { componentName: `nimble-${settingsName}` };
export const testInsights: NimbleIconComponent = { componentName: `nimble-${testInsightsName}` };
export const utilities: NimbleIconComponent = { componentName: `nimble-${utilitiesName}` };
