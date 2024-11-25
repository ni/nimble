spright-chat-text-bubble
    Props/Attrs
        actor: ChatActor - controls corner rounding, expected by conversation. Always 'user', not settable
        text: string (support newlines)
        timestamp: date string? (not yet, might belong to conversation)
    Slots
        not needed yet, could use for label/a11y

spright-chat-rich-text-bubble?
    Props/Attrs
        actor - Always 'bot', not settable
        markdown?

spright-chat-content-bubble?
    Props/Attrs
        actor - Always 'bot', not settable
    Slots
        content - arbitrary HTML

spright-chat-prompt-buttons - lays out buttons
    Props/Attrs
        actor: always 'system', not settable
    Slots
        buttons

spright-chat-load-more-button - button at top or bottom of conversation to "virtualize"

spright-chat-conversation - lays out text bubbles, rich text bubbles, prompt buttons, spinner
    Props/Attrs
        order = newest-top or newest-bottom (or use DOM order?)
    Slots
        child order and 'actor' attribute determine layout

spright-chat-toolbar - top toolbar with buttons

spright-chat-input-toolbar - bottom toolbar with buttons, text input
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

spright-chat-window - lays out conversation and toolbar. Probably no logic
    Slots
        default slot for toolbar, conversation, bottom toolbar?

ChatActor = 'user' | 'bot' | 'system'


Notes:
 - remove "AI", "bot", "user"
 - appearance (or variant) for color and position, remove "actor"
 - bubble is responsible for layout, conversation just does vertical layout
 - single chat bubble, slot in content, use rich text viewer for MD if needed
 - rich text viewer would need more features for links, images
 - research a11y patterns for chat widgets
 - mention plugins for links
 - 