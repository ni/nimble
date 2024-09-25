# .NET 8 Support for Nimble/Spright Blazor

## Problem Statement

Currently our Blazor projects (Nimble/Spright) target .NET 6, which will reach [end-of-support on November 12, 2024](https://devblogs.microsoft.com/dotnet/dotnet-6-end-of-support/).

Before that date, we should update our Blazor projects to target .NET 8, which will remain in-support until November 2026 ([more info on versions / support duration here](https://dotnet.microsoft.com/en-us/platform/support/policy/dotnet-core)).


## Links To Relevant Work Items and Reference Material

Design System work items:
- [Feature 2812085: Nimble Blazor .NET 8 upgrade](https://dev.azure.com/ni/DevCentral/_workitems/edit/2812085)
- [nimble#1667: Blazor .NET 8 support](https://github.com/ni/nimble/issues/1667)

Related work items:
- ASW: [Epic 2753078: ASW .NET 8 Migration](https://dev.azure.com/ni/DevCentral/_workitems/edit/2753078)

## Implementation / Design

### Planned Changes ###
- For all projects in the Nimble `BlazorWorkspace.sln` (including Nimble Blazor and Spright Blazor):
  - Update `TargetFramework` from `net6.0` to `net8.0`
  - Update `Microsoft.AspNetCore.Components.Web` references from `6.x` to `8.x`
  - Update code analyzer package versions to latest versions
  - Resolve build warnings (mostly due to new code analysis rules)
  - Update/recreate demo projects based on newer Blazor .NET 8 templates
  - Blazor [render modes](https://learn.microsoft.com/en-us/aspnet/core/blazor/components/render-modes?view=aspnetcore-8.0#render-modes):
    - Test each render mode with our components
    - Evaluate how to represent each in example projects/ docs/ acceptance tests (if possible)
    - Render modes: Static Server, Interactive Server, Interactive WebAssembly, Interactive Auto
  - Ensure adequate test coverage, especially of interactions with Blazor initialization / lifecycle code.
- Update documentation and readme files
  - Ensure correct getting started instructions, required .NET SDK versions, etc.
  - Document which Blazor render modes are supported/ have been tested
- Investigate and fix client-filed bugs associated with .NET 8
   - [nimble#2188: Possible race condition showing Blazor NimbleDialog during OnAfterRenderAsync](https://github.com/ni/nimble/issues/2188)
   - [nimble#2355: Blazor EventCallbacks are not invoked with apps using .NET 8 template](https://github.com/ni/nimble/issues/2355)
   - .NET 8 includes changes to the [Blazor startup lifecycle and JS initializer APIs](https://learn.microsoft.com/en-us/aspnet/core/blazor/fundamentals/startup?view=aspnetcore-8.0), and uptaking those changes will be part of this effort, but more investigation is still needed.

### Current Clients ###
 Summary of known Blazor clients, by repo:
 - TestStand
   - Armstrong (`/src/dev/Armstrong/...`): `StepSettingsComponents.csproj`, `Controls.csproj`, `WebServer.csproj`, `TestStepSettingsComponents.csproj`
     - .NET 8
     - NimbleBlazor 18.2.0
     - Microsoft.AspNetCore.Components.Web 8.0.7
     - Code owners: Eric Peterson, Anand Jain
- ASW
  - ElectricVehicle (`/Source/ElectricVehicle`): `BatteryTestWebApplication.NetCore.csproj`, `EVTestUIPluginComponents.NetCore.csproj`
    - .NET 8
    - NimbleBlazor 18.2.2
    - Microsoft.AspNetCore.Components.Web 8.0.7
    - Code owners: Jonathan Ou-yang, Fei Ma
  - LicenseManagement (`/Source/LicenseManagement`):
    - `Licensing.ClientUtility.NetCore.csproj`: .NET 8
    - `Licensing.ElectronBlazorUtilities.NetCore.csproj`, `Licensing.Wizard.NetCore.csproj`: .NET 6
    - NimbleBlazor 18.2.2
    - Microsoft.AspNetCore.Components.Web 8.0.7
    - Code owners: Vineeta Chelamkuri, Tim Atwood
- Skyline
  - `/WaferMapProcessorService/`
    - .NET 6
    - NimbleBlazor 17.4.3
    - Code owners: Alon Aviv, Dror Lupu


#### Risks (to Clients) ####

Once we update to target .NET 8, remaining .NET 6 clients of Nimble Blazor can only consume the newest versions once they also update to target .NET 8.
- LicenseManagement: Current expectation is that these projects will target .NET 8 by the November date. (This is part of [Epic 2753078](https://dev.azure.com/ni/DevCentral/_workitems/edit/2753078) / [Feature 2786275](https://dev.azure.com/ni/DevCentral/_workitems/edit/2786275), and there's already been PRs in September updating some of these projects.)
- WaferMapProcessorService: Currently unknown if there's any plans to upgrade this project to .NET 8. We'll ensure that the owners are aware of our upgrade plans for Nimble Blazor.
   
### Timeline for Changes ###

1. Investigate client-filed bugs associated with .NET 8
   - We plan to investigate these issues immediately, to better characterize them. Depending on what the fixes are, they could potentially be addressed before the .NET 8 change.
2. Work on .NET 8 changes outlined above
3. Check in .NET 8 changes with a major version bump to Nimble/Spright Blazor.
    - We'll most likely aim to do this at the beginning of November 2024 (before 11/12/24).

## Alternative Implementations / Designs

### Target both .NET 6 and .NET 8

It's possible for .NET projects to [target multiple framework versions](https://learn.microsoft.com/en-us/dotnet/standard/frameworks#how-to-specify-a-target-framework), meaning we could target both .NET 6 and .NET 8 with the following `csproj` configuration:  
`<TargetFrameworks>net8.0;net6.0</TargetFrameworks>`

We've elected not to do this for the following reasons:
- Additional maintenance burden. Each target framework version can specify different dependencies/ dependency versions - we'd probably depend on different versions of `Microsoft.AspNetCore.Components.Web` for each .NET version, for example. This approach would require separate testing going forward. We would most likely need different JS initialization scripts for each .NET version (also implying that all of our Playwright tests would need to run against both versions).
- Desire not to develop against unsupported .NET versions.

## Open Issues

None
