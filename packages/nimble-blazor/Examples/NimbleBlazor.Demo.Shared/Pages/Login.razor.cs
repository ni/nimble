using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Forms;
using System.ComponentModel.DataAnnotations;

namespace NimbleBlazor.Demo.Shared.Pages
{
    public partial class Login
    {
        private LoginModel _loginModel = new();

        [Inject]
        private NavigationManager NavManager { get; set; } = default!;

        private bool IsModelFieldInvalid(EditContext context, string fieldName)
        {
            return !context.Validate() && context.GetValidationMessages(context.Field(fieldName)).Any();
        }

        private void HandleValidSubmit()
        {
            NavManager.NavigateTo(NavManager.BaseUri);
        }
    }

    public class LoginModel
    {
        [Required]
        public string? Username { get; set; } = "someuser";

        [Required]
        public string? Password { get; set; } = "password";
    }
}
