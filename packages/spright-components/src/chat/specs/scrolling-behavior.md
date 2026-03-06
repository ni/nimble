# Chat Component - Scrolling Behavior Specification

## Overview
This document defines the scrolling behavior for the chat component specifically system-initiated scrolling and how user-initiated scrolling impacts it.

### Background
- The Nigel chat needs defined scrolling behavior to balance automatic updates with user control

### Types of Scrolling in AI Chat

**User-initiated scrolling:**
User initiated scrolling is done by the user to view previous chats in the message area. User scrolling can be initiated with the mouse, keyboard, or clicking on the scrollbar.
-**Manual interruption:** A specific type of user scrolling that takes place when the user scrolls up while AI is generating response to stop auto-scroll.

**System-initiated scrolling:**
- **Post send auto-scroll:** Automatic scrolling to the users next message when the user sends a message
- **AI response auto-scroll:** Scrolling as AI generates and streams response content

## Auto-scrolling behavior

**Post send auto-scroll**
Post send auto-scrolling should appear any time the user sends a new message (regardless of where they are in the chat history at the time)

**AI response auto-scroll**
AI response auto-scroll should occur only if the AI streams responses. Long responses should auto scroll because streaming should be happening at a human readable pace and therefore start removing the old (assumed read) content off screen. If we are not streaming the response and instead returning a block of text, we should not autoscroll because this would take unread content off the screen.

System-initiated auto-scrolling should stop when a manual interruption occurs. 

**Auto-scroll Re-engagement**
Auto scroll is re-rengaged when a user does any action to return to the bottom of the chat

**Scroll position memory:**
- Scroll position should only be preserved for the open chat, we do not need to remember scroll position history when navigating the chat history

## Mouse Interactions

### Scrolling Behavior
- **Mouse wheel scrolling:** Standard scrolling behavior, disables auto-scroll when user scrolls up
- **Scrollbar dragging:** Precise scroll control, temporarily disables auto-scroll

## Non-Mouse Interactions

### Keyboard Navigation
- **Page Up/Down in message area:** Navigate through message history, disables auto-scroll
- **Tab navigation:** Focus management doesn't affect scroll position for on screen elements but if we begin to tab upwards in the chat to nonvisible content we should scroll to it

### Accessibility Considerations
- **Screen readers:** Announce new messages without forcing scroll position changes
- **Focus management:** Maintain logical tab order regardless of scroll position

## Open Issues
None
