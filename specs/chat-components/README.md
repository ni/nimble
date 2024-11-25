spright-ai-chat-text-bubble
    Props/Attrs
        actor: AIChatActor - controls corner rounding, expected by conversation. Always 'user', not settable
        text: string (support newlines)
        timestamp: date string? (not yet, might belong to conversation)
    Slots
        not needed yet, could use for label/a11y

spright-ai-chat-rich-text-bubble?
    Props/Attrs
        actor - Always 'bot', not settable
        markdown?

spright-ai-chat-content-bubble?
    Props/Attrs
        actor - Always 'bot', not settable
    Slots
        content - arbitrary HTML

spright-ai-chat-prompt-buttons - lays out buttons
    Props/Attrs
        actor: always 'system', not settable
    Slots
        buttons

spright-ai-chat-conversation - lays out text bubbles, rich text bubbles, prompt buttons, spinner
    Props/Attrs
        spinner-visible
    Slots
        child order and 'actor' attribute determine layout

spright-ai-chat-toolbar - top toolbar with buttons

spright-ai-chat-input-toolbar - bottom toolbar with buttons, text input
    Props/Attrs
        add-chat-button-disabled
        add-chat-button-disabled
        text-prompt-button-hidden
        text-prompt-button-hidden
        text-input-field-disabled
        text-input-field-hidden
        text-input-field-placeholder
        text-input-button-disabled
        text-input-button-hidden
        attach-button-disabled
        attach-button-hidden
    Events
        text-input-change
        text-input-button-click

spright-ai-chat-window - lays out conversation and toolbar. Probably no logic
    Slots
        default slot for toolbar, conversation, bottom toolbar?

AIChatActor = 'user' | 'bot' | 'system'