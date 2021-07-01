import { css } from '@microsoft/fast-element';

export const nimbleIconFontStyles = css`
@font-face {
    font-family: "nimble-icon-font";
    src: url('nimble-icon-font.eot?t=1624985012731'); /* IE9*/
    src: url('nimble-icon-font.eot?t=1624985012731#iefix') format('embedded-opentype'), /* IE6-IE8 */
    url("nimble-icon-font.woff2?t=1624985012731") format("woff2"),
    url("nimble-icon-font.woff?t=1624985012731") format("woff"),
    url('nimble-icon-font.ttf?t=1624985012731') format('truetype'), /* chrome, firefox, opera, Safari, Android, iOS 4.2+*/
    url('nimble-icon-font.svg?t=1624985012731#nimble-icon-font') format('svg'); /* iOS 4.1- */
  }
  
  [class^="nimble-icon-font-"], [class*=" nimble-icon-font-"] {
    font-family: 'nimble-icon-font' !important;
    font-size:16px;
    font-style:normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  
  .nimble-icon-font-ActiveAlarm_40x40:before { content: "\ea01"; }
  .nimble-icon-font-ActiveJobs_40x40:before { content: "\ea02"; }
  .nimble-icon-font-AlarmActiveAcknowledged_16x16:before { content: "\ea03"; }
  .nimble-icon-font-AlarmActive_16x16:before { content: "\ea04"; }
  .nimble-icon-font-AlarmInactive_16x16:before { content: "\ea05"; }
  .nimble-icon-font-AlarmNotes_16x16:before { content: "\ea06"; }
  .nimble-icon-font-Alarm_16x16:before { content: "\ea07"; }
  .nimble-icon-font-AlarmsAndNotifications_40x40:before { content: "\ea08"; }
  .nimble-icon-font-AssetManager_40x40:before { content: "\ea09"; }
  .nimble-icon-font-Blocked_16x16:before { content: "\ea0a"; }
  .nimble-icon-font-BrowseFolder_16x16:before { content: "\ea0b"; }
  .nimble-icon-font-Calibration_16x16:before { content: "\ea0c"; }
  .nimble-icon-font-CloudConnector_40x40:before { content: "\ea0d"; }
  .nimble-icon-font-Connected_16x16:before { content: "\ea0e"; }
  .nimble-icon-font-CopyText_16x16:before { content: "\ea0f"; }
  .nimble-icon-font-CreateNew_40x40:before { content: "\ea10"; }
  .nimble-icon-font-DashboardBuilder_40x40:before { content: "\ea11"; }
  .nimble-icon-font-Details_16x16:before { content: "\ea12"; }
  .nimble-icon-font-DevicesAndInterfaces_40x40:before { content: "\ea13"; }
  .nimble-icon-font-Devices_16x16:before { content: "\ea14"; }
  .nimble-icon-font-Disconnected_16x16:before { content: "\ea15"; }
  .nimble-icon-font-DiscoveredSystem_40x40:before { content: "\ea16"; }
  .nimble-icon-font-Edit_16x16:before { content: "\ea17"; }
  .nimble-icon-font-Fail_16x16:before { content: "\ea18"; }
  .nimble-icon-font-FileViewer_40x40:before { content: "\ea19"; }
  .nimble-icon-font-Filter_16x16:before { content: "\ea1a"; }
  .nimble-icon-font-HealthMonitoring_40x40:before { content: "\ea1b"; }
  .nimble-icon-font-Help_16x16:before { content: "\ea1c"; }
  .nimble-icon-font-History_40x40:before { content: "\ea1d"; }
  .nimble-icon-font-Home_16x16:before { content: "\ea1e"; }
  .nimble-icon-font-Import_40x40:before { content: "\ea1f"; }
  .nimble-icon-font-InSecure_16x16:before { content: "\ea20"; }
  .nimble-icon-font-Information_16x16:before { content: "\ea21"; }
  .nimble-icon-font-IntermediateSelection_16x16:before { content: "\ea22"; }
  .nimble-icon-font-Key_16x16:before { content: "\ea23"; }
  .nimble-icon-font-LegendView_16x16:before { content: "\ea24"; }
  .nimble-icon-font-Locked_16x16:before { content: "\ea25"; }
  .nimble-icon-font-ManagedSystems_40x40:before { content: "\ea26"; }
  .nimble-icon-font-MergedView_16x16:before { content: "\ea27"; }
  .nimble-icon-font-NetworkSettings_40x40:before { content: "\ea28"; }
  .nimble-icon-font-OpcUa_40x40:before { content: "\ea29"; }
  .nimble-icon-font-PendingApproval_40x40:before { content: "\ea2a"; }
  .nimble-icon-font-PluginsBrowser_40x40:before { content: "\ea2b"; }
  .nimble-icon-font-Project_40x40:before { content: "\ea2c"; }
  .nimble-icon-font-Refresh_16x16:before { content: "\ea2d"; }
  .nimble-icon-font-RepositoryManager_40x40:before { content: "\ea2e"; }
  .nimble-icon-font-Secure_16x16:before { content: "\ea2f"; }
  .nimble-icon-font-Software_40x40:before { content: "\ea30"; }
  .nimble-icon-font-Succeeded_16x16:before { content: "\ea31"; }
  .nimble-icon-font-SystemManager_40x40:before { content: "\ea32"; }
  .nimble-icon-font-SystemStateManager_40x40:before { content: "\ea33"; }
  .nimble-icon-font-TagViewer_40x40:before { content: "\ea34"; }
  .nimble-icon-font-TdmsBooleanChannel_16x16:before { content: "\ea35"; }
  .nimble-icon-font-TdmsChannelGroup_16x16:before { content: "\ea36"; }
  .nimble-icon-font-TdmsFile_16x16:before { content: "\ea37"; }
  .nimble-icon-font-TdmsNumericChannel_16x16:before { content: "\ea38"; }
  .nimble-icon-font-TdmsStringChannel_16x16:before { content: "\ea39"; }
  .nimble-icon-font-TdmsTimeChannel_16x16:before { content: "\ea3a"; }
  .nimble-icon-font-TdmsWaveformChannel_16x16:before { content: "\ea3b"; }
  .nimble-icon-font-TestMonitor_40x40:before { content: "\ea3c"; }
  .nimble-icon-font-TileDashboard_40x40:before { content: "\ea3d"; }
  .nimble-icon-font-TimeSettings_40x40:before { content: "\ea3e"; }
  .nimble-icon-font-TreeView_16x16:before { content: "\ea3f"; }
  .nimble-icon-font-Warning_16x16:before { content: "\ea40"; }
  .nimble-icon-font-WebVI_40x40:before { content: "\ea41"; }  
`;

