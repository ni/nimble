import { webviCustom16X16 } from '@ni/nimble-tokens/dist/icons/js/single';

const imgBlob = new Blob([webviCustom16X16.data], {
    type: 'image/svg+xml'
});
export const imgBlobUrl = URL.createObjectURL(imgBlob);

export const markdownExample = "I see **Esc**, **Ctrl**, and **Pg Up**. There doesn't seem to be any **Any** key.";

export const multiLineMarkdownExample = `
Introduction to TestStand

NI TestStand is a flexible and open test management framework for building, customizing, and deploying a full-featured test management system.

**TestStand Sequence Editor**

The sequence editor is a development environment in which you create, edit, execute, and debug sequences and the tests sequences call. Use the sequence editor to access all features, such as step types and process models. Refer to the Process Models section of this tutorial for more information about process models.

You can debug a sequence using the following techniques, similar to how you debug in application development environments (ADEs) such as LabVIEW, LabWindows/CVI (ANSI), and Microsoft Visual Studio:

- Setting breakpoints
- Stepping into, out of, or over steps
- Tracing through program executions
- Displaying variables
- Monitoring variables, expressions, and output messages during executions
- Performing static analysis of sequence files to locate errors and enforce coding guidelines

In the sequence editor, you can start multiple concurrent executions, execute multiple instances of the same sequence, or execute different sequences at the same time. Each execution instance opens an Execution window. In Trace Mode, the Execution window shows the steps in the currently executing sequence. If the execution suspends, the Execution window shows the next step to execute and provides debugging options.

In the sequence editor, you can fully customize the pane and tab layout to optimize development and debugging tasks. You can also customize the menus, toolbars, and keyboard shortcuts.
`;
