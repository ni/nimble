# Nimble Blazor Components - AI Assistant Guide

This guide helps AI code generation tools like GitHub Copilot generate better code using Nimble with Blazor.

## Package Information

- **Package Name**: `NimbleBlazor`
- **Framework**: Blazor (.NET 6+)
- **Underlying**: Web Components from `@ni/nimble-components`

## Installation

```bash
dotnet add package NimbleBlazor
```

## Setup

### 1. Add to _Imports.razor

```razor
@using NimbleBlazor
```

### 2. Add Theme Provider

Wrap your application in a theme provider in `MainLayout.razor` or `App.razor`:

```razor
<NimbleThemeProvider Theme="Theme.Light">
    @Body
</NimbleThemeProvider>
```

### 3. Include Nimble Assets (if needed)

In your `index.html` (Blazor WebAssembly) or `_Host.cshtml` / `_Layout.cshtml` (Blazor Server):

```html
<!-- This is typically handled automatically by the package -->
```

## Component Naming Convention

Blazor uses PascalCase for component names and attributes:

- Web Component: `<nimble-button>` → Blazor: `<NimbleButton>`
- Attribute: `appearance-variant` → Blazor: `AppearanceVariant`

## Usage Patterns

### Data Binding

Use `@bind-Value` for two-way data binding on form controls:

```razor
@code {
    private string textValue = "";
    private int? numberValue = null;
    private bool isChecked = false;
    private string selectedValue = "";
}

<NimbleTextField @bind-Value="textValue" Placeholder="Enter text" />
<NimbleNumberField @bind-Value="numberValue" Min="0" Max="100" />
<NimbleCheckbox @bind-Checked="isChecked">Accept terms</NimbleCheckbox>
<NimbleSelect @bind-Value="selectedValue">
    <NimbleListOption Value="1">Option 1</NimbleListOption>
    <NimbleListOption Value="2">Option 2</NimbleListOption>
</NimbleSelect>
```

### Event Handling

Handle component events:

```razor
<NimbleButton @onclick="HandleClick">Click Me</NimbleButton>

<NimbleTextField Value="@textValue" 
                 ValueChanged="@HandleTextChanged" 
                 @oninput="HandleInput" />

<NimbleSelect Value="@selectedValue" 
              ValueChanged="@HandleSelectionChange">
    <!-- options -->
</NimbleSelect>

@code {
    private void HandleClick()
    {
        // Handle click
    }
    
    private void HandleTextChanged(string newValue)
    {
        textValue = newValue;
    }
    
    private void HandleInput(ChangeEventArgs e)
    {
        // Handle input
    }
    
    private void HandleSelectionChange(string newValue)
    {
        selectedValue = newValue;
        // Additional logic
    }
}
```

### Component References

Use `@ref` to access component instances and call methods:

```razor
<NimbleDialog @ref="myDialog">
    <Title>Dialog Title</Title>
    <ChildContent>
        Dialog content goes here
    </ChildContent>
    <Footer>
        <NimbleButton Appearance="ButtonAppearance.Ghost" @onclick="CloseDialog">Cancel</NimbleButton>
        <NimbleButton AppearanceVariant="ButtonAppearanceVariant.Primary" @onclick="Confirm">Confirm</NimbleButton>
    </Footer>
</NimbleDialog>

<NimbleButton @onclick="OpenDialog">Open Dialog</NimbleButton>

@code {
    private NimbleDialog? myDialog;
    
    private async Task OpenDialog()
    {
        await myDialog!.ShowAsync();
    }
    
    private void CloseDialog()
    {
        myDialog!.Close("cancelled");
    }
    
    private void Confirm()
    {
        myDialog!.Close("confirmed");
        // Perform action
    }
}
```

## Components

### Buttons

```razor
<!-- Standard Button -->
<NimbleButton Appearance="ButtonAppearance.Outline" 
              AppearanceVariant="ButtonAppearanceVariant.Primary"
              Disabled="false"
              @onclick="HandleClick">
    Click Me
</NimbleButton>

<!-- Button with Icon -->
<NimbleButton>
    <StartIcon><NimbleIconCheck /></StartIcon>
    <ChildContent>Confirm</ChildContent>
</NimbleButton>

<!-- Icon-only Button -->
<NimbleButton ContentHidden="true" aria-label="Delete">
    <StartIcon><NimbleIconTrash /></StartIcon>
</NimbleButton>

<!-- Anchor Button (Navigation) -->
<NimbleAnchorButton Href="/settings" 
                    Appearance="ButtonAppearance.Outline"
                    AppearanceVariant="ButtonAppearanceVariant.Primary">
    Go to Settings
</NimbleAnchorButton>

<!-- Menu Button -->
<NimbleMenuButton AppearanceVariant="ButtonAppearanceVariant.Primary">
    <ChildContent>Actions</ChildContent>
    <Menu>
        <NimbleMenu>
            <NimbleMenuItem @onclick="Edit">Edit</NimbleMenuItem>
            <NimbleMenuItem @onclick="Delete">Delete</NimbleMenuItem>
        </NimbleMenu>
    </Menu>
</NimbleMenuButton>

<!-- Toggle Button -->
<NimbleToggleButton @bind-Checked="isBold" Appearance="ToggleButtonAppearance.Outline">
    <StartIcon><NimbleIconTextBold /></StartIcon>
    <ChildContent>Bold</ChildContent>
</NimbleToggleButton>
```

### Form Controls

```razor
<!-- Text Field -->
<NimbleTextField @bind-Value="name"
                 Appearance="TextFieldAppearance.Underline"
                 Placeholder="Enter your name"
                 Required="true"
                 ErrorText="@nameError"
                 ErrorVisible="@nameHasError"
                 @oninput="ValidateName" />

<!-- Text Area -->
<NimbleTextArea @bind-Value="description"
                Rows="5"
                Resize="TextAreaResize.Vertical"
                Placeholder="Enter description" />

<!-- Number Field -->
<NimbleNumberField @bind-Value="age"
                   Min="0"
                   Max="120"
                   Step="1"
                   Placeholder="Enter age" />

<!-- Checkbox -->
<NimbleCheckbox @bind-Checked="agreeToTerms">
    I agree to the terms and conditions
</NimbleCheckbox>

<!-- Switch -->
<NimbleSwitch @bind-Checked="notificationsEnabled">
    <CheckedMessage>On</CheckedMessage>
    <UncheckedMessage>Off</UncheckedMessage>
    <ChildContent>Enable notifications</ChildContent>
</NimbleSwitch>

<!-- Radio Group -->
<NimbleRadioGroup @bind-Value="selectedOption" Orientation="Orientation.Vertical">
    <Label>Choose an option:</Label>
    <ChildContent>
        <NimbleRadio Value="option1">Option 1</NimbleRadio>
        <NimbleRadio Value="option2">Option 2</NimbleRadio>
        <NimbleRadio Value="option3">Option 3</NimbleRadio>
    </ChildContent>
</NimbleRadioGroup>

<!-- Select -->
<NimbleSelect @bind-Value="selectedValue">
    <NimbleListOption Value="1">Option 1</NimbleListOption>
    <NimbleListOption Value="2">Option 2</NimbleListOption>
    <NimbleListOption Value="3" Disabled="true">Option 3 (Disabled)</NimbleListOption>
</NimbleSelect>

<!-- Combobox -->
<NimbleCombobox @bind-Value="fruit" Autocomplete="AutoComplete.List">
    <NimbleListOption Value="apple">Apple</NimbleListOption>
    <NimbleListOption Value="banana">Banana</NimbleListOption>
    <NimbleListOption Value="cherry">Cherry</NimbleListOption>
</NimbleCombobox>
```

### Navigation

```razor
<!-- Breadcrumb -->
<NimbleBreadcrumb>
    <NimbleBreadcrumbItem Href="/">Home</NimbleBreadcrumbItem>
    <NimbleBreadcrumbItem Href="/products">Products</NimbleBreadcrumbItem>
    <NimbleBreadcrumbItem>Details</NimbleBreadcrumbItem>
</NimbleBreadcrumb>

<!-- Tabs -->
<NimbleTabs ActiveId="@activeTabId" ActiveIdChanged="@HandleTabChange">
    <NimbleTab Id="tab1">Tab 1</NimbleTab>
    <NimbleTab Id="tab2">Tab 2</NimbleTab>
    <NimbleTabPanel>Content for Tab 1</NimbleTabPanel>
    <NimbleTabPanel>Content for Tab 2</NimbleTabPanel>
</NimbleTabs>

<!-- Anchor Tabs -->
<NimbleAnchorTabs>
    <NimbleAnchorTab Href="/overview">Overview</NimbleAnchorTab>
    <NimbleAnchorTab Href="/details">Details</NimbleAnchorTab>
    <NimbleTabPanel>Overview content</NimbleTabPanel>
    <NimbleTabPanel>Details content</NimbleTabPanel>
</NimbleAnchorTabs>

<!-- Tree View -->
<NimbleTreeView SelectionMode="TreeViewSelectionMode.Single">
    <NimbleTreeItem>
        Item 1
        <NimbleTreeItem>Child 1.1</NimbleTreeItem>
        <NimbleTreeItem>Child 1.2</NimbleTreeItem>
    </NimbleTreeItem>
    <NimbleTreeItem>Item 2</NimbleTreeItem>
</NimbleTreeView>
```

### Feedback & Overlays

```razor
<!-- Banner -->
<NimbleBanner Severity="BannerSeverity.Information" 
              @bind-Open="bannerOpen"
              CloseEvent="@HandleBannerClose">
    <Title>Information</Title>
    <ChildContent>This is an informational message.</ChildContent>
    <Actions>
        <NimbleButton Appearance="ButtonAppearance.Ghost">Learn More</NimbleButton>
    </Actions>
</NimbleBanner>

<!-- Dialog -->
<NimbleDialog @ref="confirmDialog" CloseEvent="@HandleDialogClose">
    <Title>Confirm Deletion</Title>
    <ChildContent>
        Are you sure you want to delete this item?
    </ChildContent>
    <Footer>
        <NimbleButton Appearance="ButtonAppearance.Ghost" @onclick="CancelDelete">Cancel</NimbleButton>
        <NimbleButton AppearanceVariant="ButtonAppearanceVariant.Primary" @onclick="ConfirmDelete">Delete</NimbleButton>
    </Footer>
</NimbleDialog>

<!-- Drawer -->
<NimbleDrawer @ref="settingsDrawer" Location="DrawerLocation.Right">
    <Title>Settings</Title>
    <ChildContent>
        <!-- Drawer content -->
    </ChildContent>
</NimbleDrawer>

<!-- Spinner -->
<NimbleSpinner Appearance="SpinnerAppearance.Default" />

<!-- Tooltip -->
<NimbleButton id="help-button">Help</NimbleButton>
<NimbleTooltip Anchor="help-button" 
               Severity="TooltipSeverity.Default"
               Position="TooltipPosition.Top">
    Click for assistance
</NimbleTooltip>
```

### Data Display

```razor
<!-- Table -->
<NimbleTable @ref="table"
             TData="Person"
             IdFieldName="Id"
             SelectionMode="TableRowSelectionMode.Multiple"
             SelectionChangeEvent="@HandleSelectionChange">
    
    <NimbleTableColumnText ColumnId="firstName" 
                          FieldName="@nameof(Person.FirstName)"
                          Sortable="true"
                          Groupable="true">
        First Name
    </NimbleTableColumnText>
    
    <NimbleTableColumnText ColumnId="lastName" 
                          FieldName="@nameof(Person.LastName)"
                          Sortable="true"
                          Groupable="true">
        Last Name
    </NimbleTableColumnText>
    
    <NimbleTableColumnNumberText ColumnId="age" 
                                 FieldName="@nameof(Person.Age)"
                                 Sortable="true">
        Age
    </NimbleTableColumnNumberText>
</NimbleTable>

@code {
    private NimbleTable<Person>? table;
    private List<Person> people = new();
    
    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
        {
            people = new List<Person>
            {
                new Person { Id = "1", FirstName = "John", LastName = "Doe", Age = 30 },
                new Person { Id = "2", FirstName = "Jane", LastName = "Smith", Age = 25 }
            };
            await table!.SetDataAsync(people);
        }
    }
    
    private void HandleSelectionChange()
    {
        var selectedIds = table!.GetSelectedRecordIds();
        // Handle selection
    }
}

public class Person
{
    public string Id { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public int Age { get; set; }
}

<!-- Card -->
<NimbleCard>
    <h3>Card Title</h3>
    <p>Card content goes here.</p>
</NimbleCard>

<!-- Card Button -->
<NimbleCardButton Selected="@isSelected" @onclick="SelectCard">
    <h3>Option A</h3>
    <p>Description of option A</p>
</NimbleCardButton>
```

### Layout

```razor
<!-- Toolbar -->
<NimbleToolbar>
    <NimbleButton>New</NimbleButton>
    <NimbleButton>Save</NimbleButton>
    <NimbleButton>Delete</NimbleButton>
</NimbleToolbar>
```

## Common Patterns

### Form with Validation

```razor
<EditForm Model="@formModel" OnValidSubmit="@HandleValidSubmit">
    <DataAnnotationsValidator />
    
    <NimbleTextField @bind-Value="formModel.Name"
                     Required="true"
                     ErrorText="@GetErrorMessage(nameof(formModel.Name))"
                     ErrorVisible="@HasError(nameof(formModel.Name))"
                     Placeholder="Enter your name" />
    
    <NimbleTextField @bind-Value="formModel.Email"
                     Type="TextFieldType.Email"
                     Required="true"
                     ErrorText="@GetErrorMessage(nameof(formModel.Email))"
                     ErrorVisible="@HasError(nameof(formModel.Email))"
                     Placeholder="Enter your email" />
    
    <NimbleNumberField @bind-Value="formModel.Age"
                       Min="0"
                       Max="120"
                       Placeholder="Enter your age" />
    
    <NimbleButton Type="submit" AppearanceVariant="ButtonAppearanceVariant.Primary">Submit</NimbleButton>
</EditForm>

@code {
    private FormModel formModel = new();
    private ValidationMessageStore? messageStore;
    
    [CascadingParameter]
    private EditContext? CurrentEditContext { get; set; }
    
    protected override void OnInitialized()
    {
        if (CurrentEditContext != null)
        {
            messageStore = new ValidationMessageStore(CurrentEditContext);
        }
    }
    
    private string GetErrorMessage(string fieldName)
    {
        if (messageStore == null) return string.Empty;
        var messages = messageStore.this[new FieldIdentifier(formModel, fieldName)];
        return messages.FirstOrDefault() ?? string.Empty;
    }
    
    private bool HasError(string fieldName)
    {
        return !string.IsNullOrEmpty(GetErrorMessage(fieldName));
    }
    
    private void HandleValidSubmit()
    {
        // Submit form
    }
}

public class FormModel
{
    [Required(ErrorMessage = "Name is required")]
    [MinLength(3, ErrorMessage = "Name must be at least 3 characters")]
    public string Name { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Invalid email format")]
    public string Email { get; set; } = string.Empty;
    
    [Range(0, 120, ErrorMessage = "Age must be between 0 and 120")]
    public int? Age { get; set; }
}
```

### Dialog Pattern

```razor
<NimbleButton @onclick="ShowConfirmation">Delete Item</NimbleButton>

<NimbleDialog @ref="confirmDialog" CloseEvent="@HandleDialogClose">
    <Title>Confirm Deletion</Title>
    <ChildContent>
        Are you sure you want to delete this item?
    </ChildContent>
    <Footer>
        <NimbleButton Appearance="ButtonAppearance.Ghost" @onclick="CancelDelete">Cancel</NimbleButton>
        <NimbleButton AppearanceVariant="ButtonAppearanceVariant.Primary" @onclick="ConfirmDelete">Delete</NimbleButton>
    </Footer>
</NimbleDialog>

@code {
    private NimbleDialog? confirmDialog;
    
    private async Task ShowConfirmation()
    {
        await confirmDialog!.ShowAsync();
    }
    
    private void CancelDelete()
    {
        confirmDialog!.Close("cancelled");
    }
    
    private void ConfirmDelete()
    {
        confirmDialog!.Close("confirmed");
        // Perform deletion
    }
    
    private void HandleDialogClose(DialogCloseEventArgs args)
    {
        Console.WriteLine($"Dialog closed with reason: {args.Reason}");
    }
}
```

## Enumerations

Use NimbleBlazor enums for type-safe property values:

```csharp
using NimbleBlazor;

// Appearance enums
ButtonAppearance.Outline
ButtonAppearance.Ghost
ButtonAppearance.Block

ButtonAppearanceVariant.Default
ButtonAppearanceVariant.Primary
ButtonAppearanceVariant.Accent

TextFieldAppearance.Underline
TextFieldAppearance.Outline
TextFieldAppearance.Block

// Severity enums
BannerSeverity.Default
BannerSeverity.Error
BannerSeverity.Warning
BannerSeverity.Information

TooltipSeverity.Default
TooltipSeverity.Error
TooltipSeverity.Warning
TooltipSeverity.Information

IconSeverity.Default
IconSeverity.Error
IconSeverity.Warning
IconSeverity.Information
IconSeverity.Success

// Other enums
Theme.Light
Theme.Dark
Theme.Color

Orientation.Horizontal
Orientation.Vertical

DrawerLocation.Left
DrawerLocation.Right

TableRowSelectionMode.None
TableRowSelectionMode.Single
TableRowSelectionMode.Multiple

TextAreaResize.None
TextAreaResize.Vertical
TextAreaResize.Horizontal
TextAreaResize.Both

// And many more...
```

## Icons

Use Nimble icon components:

```razor
<NimbleButton>
    <StartIcon><NimbleIconCheck /></StartIcon>
    <ChildContent>Confirm</ChildContent>
</NimbleButton>

<NimbleIconXmark Severity="IconSeverity.Error" />
<NimbleIconArrowExpanderDown />
<NimbleIconSettings />
```

Common icons:
- `NimbleIconCheck`
- `NimbleIconXmark`
- `NimbleIconArrowExpanderDown`
- `NimbleIconArrowExpanderUp`
- `NimbleIconSettings`
- `NimbleIconSearch`
- `NimbleIconTrash`
- `NimbleIconEdit`
- `NimbleIconAdd`

## Best Practices

1. **Add `@using NimbleBlazor`** to `_Imports.razor`
2. **Wrap app in NimbleThemeProvider** in MainLayout.razor
3. **Use `@bind-Value`** for two-way binding on form controls
4. **Use `@ref`** to access component instances and methods
5. **Use enums** for type-safe property values
6. **Call async methods** like `ShowAsync()` with `await`
7. **Handle validation** using ErrorText and ErrorVisible properties
8. **Use EditForm** with DataAnnotations for form validation

## Additional Resources

- Nimble Blazor Storybook: https://ni.github.io/nimble/storybook
- Blazor Integration Examples: https://ni.github.io/nimble/storybook/blazor-client-app/wwwroot
- GitHub Repository: https://github.com/ni/nimble
