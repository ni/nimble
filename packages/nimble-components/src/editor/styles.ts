import { css } from '@microsoft/fast-element';

export const styles = css`#imageUploadInput {
    display: none;
  }

  .viewer img {
    width: 400px;
    height: 400px;
  }

  #editor-window {
    position: relative;
  }

  #editor-window .ProseMirror img {
    width: 400px;
    height: 400px;
  }

  img.ProseMirror-separator {
    width: 0px !important;
    height: 0px !important;
  }

  .ProseMirror {
    min-height: 150px;
    height: fit-content;
    border: 0.5px solid rgba(22, 22, 23, 0.3);
    margin: 5px;
    background-color: transparent;
    font: inherit;
  }

  .ProseMirror:fo {
    min-height: 150px;
    height: fit-content;
    border: 0.5px solid rgba(22, 22, 23, 0.3);
    margin: 5px;
    background-color: transparent;
    font: inherit;
  }

  p {
    font-family: Lato;
  }

  .my-custom-class {
    color: #0000ee;
  }

  .items {
    background: #fff;
    border-radius: 0.5rem;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05), 0px 10px 20px rgba(0, 0, 0, 0.1);
    color: rgba(0, 0, 0, 0.8);
    font-size: 0.9rem;
    overflow: hidden;
    padding: 0.2rem;
    position: relative;
  }

  .item {
    background: transparent;
    border: 1px solid transparent;
    border-radius: 0.4rem;
    display: block;
    margin: 0;
    padding: 0.2rem 0.4rem;
    text-align: left;
    width: 100%;
  }

  .tool-bar {
    max-height: 50px;
    display: flex;
  }

  .mention-popup {
    position: absolute;
    background: rgba(0, 0, 0, 0.322);
  }

  .mention-popup ul {
    margin: 0px;
    padding: 5px;
    border-bottom: black 1px;
  }

  .mention-node {
    color: dodgerblue;
    text-decoration: underline;
  }

  p {
    font-family: Lato;
  }

  .tool-bar {
    max-height: fit-content;
  }

  .menu-item-div {
    margin-left: 5px;
  }

  .ProseMirror.ProseMirror-basic-setup-style {
    margin: 10px;
    margin-top: 0px;
    min-height: 200px;
    min-width: 450px;
    border-width: 1px;
    border-style: solid;
    border-color: black;
  }

  .ProseMirror p.is-editor-empty:first-child::before {
    color: #adb5bd;
    content: attr(data-placeholder);
    float: left;
    height: 0;
    pointer-events: none;
  }

  .ProseMirror {
    position: relative;
  }

  .ProseMirror {
    word-wrap: break-word;
    white-space: pre-wrap;
    white-space: break-spaces;
    -webkit-font-variant-ligatures: none;
    font-variant-ligatures: none;
    font-feature-settings: 'liga' 0;
  }

  .ProseMirror pre {
    white-space: pre-wrap;
  }

  .ProseMirror li {
    position: relative;
  }

  .ProseMirror-hideselection *::selection {
    background: transparent;
  }

  .ProseMirror-hideselection *::-moz-selection {
    background: transparent;
  }

  .ProseMirror-hideselection {
    caret-color: transparent;
  }

  .ProseMirror-selectednode {
    outline: 2px solid #8cf;
  }

  li.ProseMirror-selectednode {
    outline: none;
  }

  li.ProseMirror-selectednode:after {
    content: '';
    position: absolute;
    left: -32px;
    right: -2px;
    top: -2px;
    bottom: -2px;
    border: 2px solid #8cf;
    pointer-events: none;
  }

  img.ProseMirror-separator {
    display: inline !important;
    border: none !important;
    margin: 0 !important;
  }

  .ProseMirror-textblock-dropdown {
    min-width: 3em;
  }

  .ProseMirror-menu {
    margin: 0 -4px;
    line-height: 1;
  }

  .ProseMirror-tooltip .ProseMirror-menu {
    width: -webkit-fit-content;
    width: fit-content;
    white-space: pre;
  }

  .ProseMirror-menuseparator {
    border-right: 1px solid #ddd;
    margin-right: 3px;
  }

  .ProseMirror-menu-dropdown,
  .ProseMirror-menu-dropdown-menu {
    font-size: 90%;
    white-space: nowrap;
  }

  .ProseMirror-menu-dropdown {
    vertical-align: 1px;
    cursor: pointer;
    position: relative;
    padding-right: 15px;
  }

  .ProseMirror-menu-dropdown-wrap {
    padding: 1px 0 1px 4px;
    display: inline-block;
    position: relative;
  }

  .ProseMirror-menu-dropdown:after {
    content: '';
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 4px solid currentColor;
    opacity: 0.6;
    position: absolute;
    right: 4px;
    top: calc(50% - 2px);
  }

  .ProseMirror-menu-dropdown-menu,
  .ProseMirror-menu-submenu {
    position: absolute;
    background: white;
    color: #666;
    border: 1px solid #aaa;
    padding: 2px;
  }

  .ProseMirror-menu-dropdown-menu {
    z-index: 15;
    min-width: 6em;
  }

  .ProseMirror-menu-dropdown-item {
    cursor: pointer;
    padding: 2px 8px 2px 4px;
  }

  .ProseMirror-menu-dropdown-item:hover {
    background: #f2f2f2;
  }

  .ProseMirror-menu-submenu-wrap {
    position: relative;
    margin-right: -4px;
  }

  .ProseMirror-menu-submenu-label:after {
    content: '';
    border-top: 4px solid transparent;
    border-bottom: 4px solid transparent;
    border-left: 4px solid currentColor;
    opacity: 0.6;
    position: absolute;
    right: 4px;
    top: calc(50% - 4px);
  }

  .ProseMirror-menu-submenu {
    display: none;
    min-width: 4em;
    left: 100%;
    top: -3px;
  }

  .ProseMirror-menu-active {
    background: #eee;
    border-radius: 4px;
  }

  .ProseMirror-menu-disabled {
    opacity: 0.3;
  }

  .ProseMirror-menu-submenu-wrap:hover .ProseMirror-menu-submenu,
  .ProseMirror-menu-submenu-wrap-active .ProseMirror-menu-submenu {
    display: block;
  }

  .ProseMirror-menubar {
    border-top-left-radius: inherit;
    border-top-right-radius: inherit;
    display: flex;
    flex-direction: row;
    position: relative;
    min-height: 1em;
    color: #666;
    padding: 1px 6px;
    top: 0;
    left: 0;
    right: 0;
    border-bottom: 1px solid silver;
    background: white;
    z-index: 10;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    overflow: visible;
  }

  .ProseMirror-icon {
    display: inline-block;
    margin: 2px;
    line-height: 0.8;
    vertical-align: -2px;
    padding: 2px 8px;
    cursor: pointer;
    border-width: 1px;
    border-style: solid;
    border-color: black;
  }

  .ProseMirror-menu-disabled.ProseMirror-icon {
    cursor: default;
  }

  .ProseMirror-icon svg {
    fill: currentColor;
    height: 1em;
  }

  .ProseMirror-icon span {
    vertical-align: text-top;
  }

  .ProseMirror-gapcursor {
    display: none;
    pointer-events: none;
    position: absolute;
  }

  .ProseMirror-gapcursor:after {
    content: '';
    display: block;
    position: absolute;
    top: -2px;
    width: 20px;
    border-top: 1px solid black;
    animation: ProseMirror-cursor-blink 1.1s steps(2, start) infinite;
  }

  @keyframes ProseMirror-cursor-blink {
    to {
      visibility: hidden;
    }
  }

  .ProseMirror-focused .ProseMirror-gapcursor {
    display: block;
  }

  .ProseMirror-basic-setup-style hr {
    padding: 2px 10px;
    border: none;
    margin: 1em 0;
  }

  .ProseMirror-basic-setup-style hr:after {
    content: '';
    display: block;
    height: 1px;
    background-color: silver;
    line-height: 2px;
  }

  .ProseMirror ul,
  .ProseMirror ol {
    padding-left: 30px;
  }

  .ProseMirror blockquote {
    padding-left: 1em;
    border-left: 3px solid #eee;
    margin-left: 0;
    margin-right: 0;
  }

  .ProseMirror-basic-setup-style img {
    cursor: default;
  }

  .ProseMirror-prompt {
    background: white;
    padding: 5px 10px 5px 15px;
    border: 1px solid silver;
    position: fixed;
    border-radius: 3px;
    z-index: 11;
    box-shadow: -0.5px 2px 5px rgba(0, 0, 0, 0.2);
  }

  .ProseMirror-prompt h5 {
    margin: 0;
    font-weight: normal;
    font-size: 100%;
    color: #444;
  }

  .ProseMirror-prompt input[type='text'],
  .ProseMirror-prompt textarea {
    background: #eee;
    border: none;
    outline: none;
  }

  .ProseMirror-prompt input[type='text'] {
    padding: 0 4px;
  }

  .ProseMirror-prompt-close {
    position: absolute;
    left: 2px;
    top: 1px;
    color: #666;
    border: none;
    background: transparent;
    padding: 0;
  }

  .ProseMirror-prompt-close:after {
    content: 'âœ•';
    font-size: 12px;
  }

  .ProseMirror-invalid {
    background: #ffc;
    border: 1px solid #cc7;
    border-radius: 4px;
    padding: 5px 10px;
    position: absolute;
    min-width: 10em;
  }

  .ProseMirror-prompt-buttons {
    margin-top: 5px;
    /* display: none; */
  }

  #editor,
  .editor {
    background: white;
    color: black;
    background-clip: padding-box;
    border-radius: 4px;
    border: 2px solid rgba(0, 0, 0, 0.2);
    padding: 5px 0;
    margin-bottom: 23px;
  }

  .ProseMirror p:first-child,
  .ProseMirror h1:first-child,
  .ProseMirror h2:first-child,
  .ProseMirror h3:first-child,
  .ProseMirror h4:first-child,
  .ProseMirror h5:first-child,
  .ProseMirror h6:first-child {
    margin-top: 0px;
  }

  .ProseMirror {
    padding: 4px 8px 4px 14px;
    line-height: 1.2;
    outline: none;
  }

  .ProseMirror p {
    margin-bottom: 0em;
  }

  .ProseMirror {
    min-height: 150px;
    height: fit-content;
    border: solid #444 0.5px;
    margin: 5px;
  }

  .titptap-menu {
    display: flex;
  }

  .tiptap-icons {
    margin: 2px;
  }

  .tiptap-icons.disabled {
    opacity: .5;
  }

  .warning-msg {
    color: red;
  }

  .menu-item-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  `;
