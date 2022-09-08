# 🧐 📄 Nimble spec process

Before building a new component or making other large architecture or infrastructure changes, create a spec document and review it in a pull request to get agreement on the approach.

For smaller architectural changes, opening an issue and gathering consensus on a proposal can also be a lighter-weight alternative to a spec. If you're unsure which approach to use, feel free to open an issue to discuss.

The process to create and approve a spec is:

1. In a new branch, create a copy of one of the following spec templates as described below:
   - if proposing other architecture or infrastructure changes, use the [high-level design template](/specs/templates/high-level-design.md) and place the spec at `/specs/title-of-your-proposal/README.md`.
   - if proposing a new component, use one of the following templates and place the spec at `packages/nimble-components/src/component-name/component-name.spec.md`:
      - use the [FAST-based component template](/specs/templates/fast-based-component.md) if leveraging a FAST component.
      - use the [custom component template](/specs/templates/custom-component.md) if building a new component from scratch or on top of a different library.
   - if proposing extra component-specific effort/features use the [high-level design template](/specs/templates/high-level-design.md), and place the spec at `packages/nimble-components/src/component-name/component-name.topic.spec.md`
2. Fill in the fields of the spec. Be sure to remove any boilerplate from the spec template which was not used. 
3. Create a pull request for the branch to discuss the spec with Nimble maintainers. You can set the Beachball change type for the PR as `none`.
4. Approval and merging of the pull request indicates approval to proceed with the proposed approach! 🥳
