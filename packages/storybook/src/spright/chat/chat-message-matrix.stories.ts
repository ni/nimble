import type { StoryFn, Meta } from '@storybook/html';
import { html, ViewTemplate } from '@microsoft/fast-element';
import { chatMessageTag } from '../../../../spright-components/src/chat/message';
import { ChatMessageType } from '../../../../spright-components/src/chat/types';
import {
    createMatrix,
    sharedMatrixParameters,
    createMatrixThemeStory
} from '../../utilities/matrix';
import { createStory } from '../../utilities/storybook';
import { hiddenWrapper } from '../../utilities/hidden';
import { loremIpsum } from '../../utilities/lorem-ipsum';
import { richTextViewerTag } from '../../../../nimble-components/src/rich-text/viewer';

const chatMessageTypes = [
    ['outbound', ChatMessageType.outbound],
    ['inbound', ChatMessageType.inbound],
    ['system', ChatMessageType.system]
] as const;
type ChatMessageTypeState = (typeof chatMessageTypes)[number];

const metadata: Meta = {
    title: 'Tests Spright/Chat Message',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

const multiLineMessage = `
--------------------------------------------------------------------

Introduction to TestStand

NI TestStand is a flexible and open test management framework for building, customizing, and deploying a full-featured test management system.

**Creating a TestStand-Based System**

Creating a TestStand-based test solution is a process that includes designing the test system, developing test sequences for units under test (UUTs), customizing the TestStand framework, debugging the test sequences, and deploying the test system to test station computers.

**Design**

Learn about the components of the TestStand framework, learn how to use those features, and understand when to customize that behavior. Plan the system architecture of the proposed solution. Determine the development environments to use to develop user interfaces and code modules in the solution. Consider how to manage the development and deployment of the solution, including how to organize files under development, how to deploy the files, and how to debug and update systems you deploy.

Refer to the section of this tutorial for more information about the components and features of TestStand and how to customize those features. Refer to the NI TestStand Advanced Architecture Series for more advanced concept and architecture information. This series is a suite of documents TestStand architects and developers created to provide more detailed information for experienced TestStand users with complex projects.

**Develop**

Write test sequences for use on a test station computer. A test sequence is a series of steps that initialize instruments, perform complex tests, or change the flow of executions. Use the sequence editor or a custom sequence editor to write and edit test sequences.

**Customize**

Edit the default behavior of the TestStand framework depending on the needs of the application you create. You can customize reporting, database logging, process models, callback sequences, and user interfaces to create a unique, robust test solution for an application.

**Debug**

Ensure that the test sequences and any customized features execute correctly before you deploy the test system. Use the TestStand Sequence Analyzer in the sequence editor or the stand-alone sequence analyzer application during development or before deployment to find errors and enforce custom development guidelines you establish.

TestStand provides multiple features in the sequence editor or a custom sequence editor for debugging sequences, including tracing, breakpoints, conditional breakpoints, stepping through code, and watch expressions. The TestStand system development cycle is an iterative process, and you might have to debug an application multiple times.

**Deploy**

After you develop, customize, and debug a TestStand system, you can deploy the system to multiple test stations. The TestStand Deployment Utility simplifies the complex process of deploying a TestStand system by automating many of the steps involved, including collecting sequence files, code modules, configuration data for instruments, and support files for the test system. You can also use the deployment utility to create an installer or patch distributions.

**Major Software Components of TestStand**

The major software components of TestStand include the TestStand Engine, sequence editor, user interfaces, module adapters, process models, and deployment utility.

**TestStand Engine**

The TestStand Engine is a set of DLLs that exports an ActiveX Automation server API. The sequence editor and TestStand User Interfaces use the TestStand API, which you can call from any programming environment that supports access to ActiveX servers, including code modules you write in LabVIEW and LabWindows/CVI. The NI TestStand Help includes detailed documentation for the TestStand API.

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

**User Interfaces**

A TestStand User Interface is an application you deploy to a development system or a production station to provide a custom GUI for executing, debugging, or editing sequences. Simple user interfaces might only support running sequences, and custom sequence editors might support editing, running, and debugging sequences.

TestStand includes separate user interface applications developed in LabVIEW, LabWindows/CVI, Microsoft Visual Basic .NET Framework, C#, and C++ (MFC). Because TestStand also includes the source code for each user interface, you can fully customize the user interfaces. You can create a custom user interface using any programming language that can host ActiveX controls or control ActiveX Automation servers.

TestStand ships with full-featured Custom Sequence Editor user interfaces. These interfaces can be found by default at C:/Users/Public/Documents/National Instruments/TestStand 20XX/UserInterfaces/Full-Featured/, or by navigating to **Start » All Programs » National Instruments » TestStand <Version> » User Interfaces** from the Windows Start Menu.

With the user interfaces in Editor Mode, you can modify sequences and display sequence variables, sequence parameters, step properties, and so on. With the user interfaces in Operator Mode, you can start multiple concurrent executions, set breakpoints, and step through sequences.

**Module Adapters**

The TestStand Engine uses module adapters to invoke code modules that sequences call. A code module is a program module from an ADE or programming language and can contain one or more functions that perform a specific test or other action. Module adapters load and call code modules, pass parameters to code modules, and return values and status from code modules. The module adapters support the following types of code modules:

- LabVIEW VIs
- LabWindows/CVI functions in DLLs you create in LabWindows/CVI or other compilers
- C/C++ functions in DLLs
- .NET assemblies
- ActiveX Automation servers
- HTBasic subroutines
- Python modules

Adapters specific to an ADE can open the ADE, create source code for a new code module in the ADE, and display the source for an existing code module in the ADE. The adapters support stepping into the source code in the ADE while you execute the step from the TestStand Sequence Editor or a TestStand User Interface.

TestStand includes the following module adapters:

- LabVIEW Adapter—Calls LabVIEW VIs with a variety of connector panes. The VIs can exist in LLBs or in LabVIEW packed project libraries. You can also call VIs in the context of a LabVIEW project or call LabVIEW class member VIs.
- LabWindows/CVI Adapter—Calls C functions in a DLL with a variety of parameter types.
- C/C++ DLL Adapter—Calls C/C++ functions and static C++ class methods in a DLL with a variety of parameter types. You can call global static methods or static class methods in C++ DLLs. You can create the DLL code module with LabWindows/CVI, Visual Studio, or any other environment that can create a C/C++ DLL, including LabVIEW-built shared libraries.
.- NET Adapter—Calls .NET assemblies written in any .NET-compliant language, such as C# or Microsoft Visual Basic .NET.
- ActiveX/COM Adapter—Creates ActiveX/COM objects, calls methods, and accesses properties of those objects. When you create an object, you can assign the object reference to a variable or property for later use in other ActiveX/COM Adapter steps.
- Sequence Adapter—Calls a subsequence in the current sequence file, in another sequence file, or a sequence file on a remote system. You can also make recursive sequence calls.
- Python Adapter—Calls Python modules.

Refer to the following tutorials for more information about using LabVIEW and LabWindows/CVI with TestStand. Refer to the NI TestStand Help for more information about using the LabVIEW and LabWindows/CVI Adapters.

- Calling LabVIEW VIs
- Calling LabWindows/CVI Code Modules

**Process Models**

Testing a UUT requires more than just executing a set of tests. Usually, the test system must perform a series of operations before and after it executes the sequence that performs the tests. Common operations that define the testing process include identifying the UUT, notifying the operator of pass/fail status, logging results, and generating a report. The set of operations and the flow of execution is called a process model. A TestStand process model is a sequence file you can use to define standard testing operations so you do not have to re-implement the same operations in every sequence file you write.

TestStand includes predefined Sequential, Parallel, and Batch models you can modify or replace. Use the Sequential model to run a test sequence on one UUT at a time. Use the Parallel and Batch models to run the same test sequence on multiple UUTs simultaneously.

You can modify an existing TestStand process model or you can create a custom process model. The ability to modify a process model is essential because the testing process can vary depending on production lines, production sites, or company systems and practices. You can edit a process model in the same way you edit other sequence files. You can also use client sequence files to customize various model operations by overriding the callback sequences process models define.

**Entry Points**

A process model defines a set of entry points, and each entry point is a sequence in the process model file that invokes a test sequence file. Defining multiple entry points in a process model gives the test station operator different ways to invoke a Main sequence or configure the process model.

Execution entry points in a process model provide different ways for the test station operator to invoke a Main sequence. Execution entry points handle common operations, such as UUT identification and report generation. For example, the default Sequential process model provides the Test UUTs and Single Pass Execution entry points. The Test UUTs Execution entry point initiates a loop that repeatedly identifies and tests UUTs. The Single Pass Execution entry point tests a single UUT without identifying it.

Configuration entry points provide an interface for configuring the process model, typically through a GUI. For example, the default Batch model provides the Configure Model Options entry point. This entry point creates the Configure menu item.

**TestStand Deployment Utility**

Use the TestStand Deployment Utility to create a deployable image or a patch deployment of a TestStand system and an optional installer. The deployable image can contain sequence files, code modules, process models and supporting files, user interface applications, configuration files, and step types and supporting files the TestStand system uses. The installer can contain all files from a deployable image or contain only a subset of files to create a patch for a previously deployed image.

You can also use the deployment utility to include the TestStand Engine and supporting files, LabVIEW and LabWindows/CVI Run-Time Engines, and hardware drivers in the installer you create. The installer that the deployment utility creates can also register ActiveX servers, replace existing files on the target computer, and create program shortcuts. You can configure the deployment utility to remove VI block diagrams or to lock the VIs you deploy.

--------------------------------------------------------------------`;

const component = ([
    chatMessageTypeName,
    messageType
]: ChatMessageTypeState): ViewTemplate => html`
    <${chatMessageTag}
        message-type=${() => messageType}
        style="margin-right: 8px;">
            ${() => `Message Type: ${chatMessageTypeName}`}</${chatMessageTag}>
`;

const differentChatSizeConversationTestCase = (
    [message]: [string],
    [messageType]: [string]
): ViewTemplate => html`
    <${chatMessageTag}
        message-type=${() => messageType}
        style="margin-right: 8px;">
        <${richTextViewerTag}
            :markdown="${_ => message}">
        </${richTextViewerTag}
    </${chatMessageTag}>
`;

export const chatMessageThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component, [chatMessageTypes])
);

export const tinyMessageSizing: StoryFn = createStory(html`
    ${createMatrix(differentChatSizeConversationTestCase, [
        [
            ['a'],
        ],
        [
            ['outbound'],
            ['inbound'],
            ['system']
        ]
    ])}
`);

export const extraWideMessagSizing: StoryFn = createStory(html`
    ${createMatrix(differentChatSizeConversationTestCase, [
        [
            [loremIpsum],
        ],
        [
            ['outbound'],
            ['inbound'],
            ['system']
        ]
    ])}
`);

export const manyLinesMessagSizing: StoryFn = createStory(html`
    ${createMatrix(differentChatSizeConversationTestCase, [
        [
            [multiLineMessage],
        ],
        [
            ['outbound'],
            ['inbound'],
            ['system']
        ]
    ])}
`);

export const hiddenChatMessage: StoryFn = createStory(
    hiddenWrapper(
        html`<${chatMessageTag} hidden>Hidden Chat Message</${chatMessageTag}>`
    )
);
