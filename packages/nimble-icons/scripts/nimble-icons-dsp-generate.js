'use strict';

// This script was used to generate an initial DSP component.json file for the icons.
// Run with `node nimble-icons-dsp-generate.js`

const fs = require('fs');
let icons = ["ActiveAlarm_40x40", "ActiveJobs_40x40", "AlarmActiveAcknowledged_16x16", "AlarmActive_16x16", "AlarmInactive_16x16", "AlarmNotes_16x16", "Alarm_16x16", "AlarmsAndNotifications_40x40", "AssetManager_40x40", "Blocked_16x16", "BrowseFolder_16x16", "Calibration_16x16", "CloudConnector_40x40", "Connected_16x16", "CopyText_16x16", "CreateNew_40x40", "DashboardBuilder_40x40", "Details_16x16", "DevicesAndInterfaces_40x40", "Devices_16x16", "Disconnected_16x16", "DiscoveredSystem_40x40", "Edit_16x16", "Fail_16x16", "FileViewer_40x40", "Filter_16x16", "HealthMonitoring_40x40", "Help_16x16", "History_40x40", "Home_16x16", "Import_40x40", "InSecure_16x16", "Information_16x16", "IntermediateSelection_16x16", "Key_16x16", "LegendView_16x16", "Locked_16x16", "ManagedSystems_40x40", "MergedView_16x16", "NetworkSettings_40x40", "OpcUa_40x40", "PendingApproval_40x40", "PluginsBrowser_40x40", "Project_40x40", "Refresh_16x16", "RepositoryManager_40x40", "Secure_16x16", "Software_40x40", "Succeeded_16x16", "SystemManager_40x40", "SystemStateManager_40x40", "TagViewer_40x40", "TdmsBooleanChannel_16x16", "TdmsChannelGroup_16x16", "TdmsFile_16x16", "TdmsNumericChannel_16x16", "TdmsStringChannel_16x16", "TdmsTimeChannel_16x16", "TdmsWaveformChannel_16x16", "TestMonitor_40x40", "TileDashboard_40x40", "TimeSettings_40x40", "TreeView_16x16", "Warning_16x16", "WebVI_40x40"];


let dsp = {
    "dsp_spec_version": "0.0.1",
    "last_updated_by": "",
    "last_updated": "2020-11-11T17:46:12.665Z",
    "entities": [
        {
            "class": "component",
            "type": "page",
            "tags": [],
            "id": "accessibility",
            "related_entity_ids": [
                "accessibility"
            ],
            "snippets": {
                "trigger": "accessibility",
                "languages": {
                    "html": "<i class=\"accessibility\"></i>"
                }
            },
            "name": "accessibility",
            "last_updated": "2020-11-11T17:48:47.661Z",
            "last_updated_by": ""
        }
    ]
};

let entities = [];

for (const iconName of icons) {
    let component = {
        "class": "component",
        "type": "page",
        "tags": [],
        "id": "PLACEHOLDER",
        "related_entity_ids": [],
        "snippets": {
            "trigger": "PLACEHOLDER",
            "languages": {
                "html": "<i class=\"PLACEHOLDER\"></i>"
            }
        },
        "name": "PLACEHOLDER",
        "last_updated": "2020-11-11T17:48:47.661Z",
        "last_updated_by": "",
        "renditions": []
    };

    let iconNameOnly = iconName.split("_")[0];
    component.id = iconName;
    component.snippets.trigger = iconName;
    component.name = "Icon - " + iconNameOnly;
    component.snippets.languages = {
        "html": "<i class=\""+ iconName + "\"></i>"
    }
    component.renditions.push("icons/" + iconName + ".svg");
    
    component.tags = iconName.split('-');
    
    entities.push ( component );
   
}
dsp.entities = entities; 

let data = JSON.stringify(dsp);
fs.writeFileSync('generated-icon-components.json', data);