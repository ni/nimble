spright-chat-message - draws outline/bg, sizes its content
    Props/Attrs
        source: ChatMessageSource - controls corner rounding.
        timestamp: date string? (not yet, might belong to conversation)
    Slots
        any content:
            plain text, including new lines
            rich text viewer populated via markdown
            styled HTML

ChatMessageSource = 
'me' | 'them' | 'system' 
'sent' | 'received' | 'status'
'outgoing' | 'incoming' | 'status'
'right' | 'left' | 'center'
'this-user' | 'other-user' | 'system'

appearance='ghost' | 'block' and location = 'start' | 'end' | 'middle'

spright-chat-load-more-button - button at top or bottom of conversation to "virtualize"

spright-chat-conversation - lays out text bubbles, rich text bubbles, prompt buttons, spinner vertically with 100% width
    Props/Attrs
        order = newest-top or newest-bottom (or use DOM order?)
    Slots
        child order determine layout

Notes:
- remove "AI", "bot", "user"
- appearance (or variant) for color and position, remove "actor"
- bubble is responsible for layout, conversation just does vertical layout
- single chat bubble, slot in content, use rich text viewer for MD if needed
- rich text viewer would need more features for links, images
- research a11y patterns for chat widgets
- mention plugins for links

 Other examples
 https://daisyui.com/components/chat/
 https://www.telerik.com/design-system/docs/components/chat/
 https://carbondesignsystem.com/community/patterns/chatbot/usage/
