window.NimbleBlazorDemo = window.NimbleBlazorDemo ?? {
    Events: {
        raiseEvent: function (elementReference, eventName, eventData) {
            const event = new CustomEvent(eventName, {
                bubbles: true,
                detail: eventData
            });
            elementReference.dispatchEvent(event);
        }
    }
};