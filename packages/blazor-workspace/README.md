# Blazor Workspace

This workspace contains:
1. Blazor components and styles matching the NI brand. These are published as Nuget packages to be consumed by Blazor applications.
    - `NimbleBlazor` contains general-purpose components
    - `SprightBlazor` contains special-purpose or application-specific components
2. Three Blazor demo applications that consume the components: a Blazor WebAssembly Standalone application (`Demo.Client`), a Blazor Web App application (`Demo.Server`) that uses the Interactive Server render mode, and a Blazor Hybrid application (`Demo.Hybrid`).

Refer to the `README.md` files in the individual project directories for more details.

## Validation

Run `dotnet restore --locked-mode` in this directory before linting (CI already
does this before building). `npm run lint:cs` uses `dotnet format --no-restore`
so it can run alongside `npm test` during root-level `npm run validate` without
concurrent NuGet restores writing the same `obj/project.assets.json` files.
