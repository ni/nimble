# Contributing to Ok Components

This package generally uses the same tooling as Nimble components. See the [`nimble-components` CONTRIBUTING doc](/packages/nimble-components/CONTRIBUTING.md) for an overview.

## Code ownership

Code in Ok packages is owned the contributing team.

The Design System team will maintain infrastructure like pipelines and dependency updates. However, if an Ok component results in excessive build times, complexity during dependency updates, test instability, or is a burden on the state of the monorepo the contributing team is expected to address issues. Failing to do so will lead to components having tests disabled, build removed, and ultimately deletion from the repository.

Each set of contributions should have a short, usually 2-3 letters, project name prefix. The project name will be used to name folders to place source in each library and is used for tag / class names. Project names could be correlated to owning R&D team, project effort, or experimenting individual. For example, a project such as LabVIEW may put a collection of components under the project `lv` or personally owned components for John Doe may use a project prefix of `jd`. Reference the example project with project name `ex` in each OK library for an example of how to organize Ok contributions.

## Code quality

Code should adhere to NI and Nimble standards for quality and test coverage. The contributing team is ultimately responsible for aligning with those practices and is encouraged to reach out to Nimble developers with questions or for feedback.

## Documentation

Ok components should leverage Storybook for documentation similar to other components.
