using System;
using Microsoft.AspNetCore.Components;

namespace NimbleBlazor
{
    /// <summary>
    /// The "code behind" for the Nimble Button.
    /// </summary>
    public partial class Button : ComponentBase
    {
        /// <summary>
        /// The text displayed on the button
        /// </summary>
        [Parameter]
        public string Text { get; set; }

        /// <summary>
        /// The event fired when the button is clicked
        /// </summary>
        [Parameter]
        public EventCallback ButtonClicked { get; set; }
    }
}
