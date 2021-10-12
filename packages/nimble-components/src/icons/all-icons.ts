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

export interface IconTestName {
    iconName: string;
}

export const accessControl = { iconName: `nimble-${accessControlName}` };
export const admin = { iconName: `nimble-${adminName}` };
export const administration = { iconName: `nimble-${administrationName}` };
export const check = { iconName: `nimble-${checkName}` };
export const customApplications = {
    iconName: `nimble-${customApplicationsName}`
};
export const deleteIcon = { iconName: `nimble-${deleteName}` };
export const login = { iconName: `nimble-${loginName}` };
export const logout = { iconName: `nimble-${logoutName}` };
export const managedSystems = { iconName: `nimble-${managedSystemsName}` };
export const measurementDataAnalysis = {
    iconName: `nimble-${measurementDataAnalysisName}`
};
export const settings = { iconName: `nimble-${settingsName}` };
export const testInsights = { iconName: `nimble-${testInsightsName}` };
export const utilities = { iconName: `nimble-${utilitiesName}` };
