# 🧐 📄 Nimble spec process

Before building a new component or making other large architecture or infrastructure changes, create a spec document and review it in a pull request to get agreement on the approach.

The process to create and approve a spec is:

1. In a new branch, create a copy of one of the following spec templates. Place the copy in this `specs` directory next to the template with a name similar to other specs but unique to the component or infrastructure you are proposing.
   - if building a new component based on an existing FAST component, use the [abbreviated template](/specs/TEMPLATE-FAST.md).
   - if building a new component from scratch or on top of a different library, use the [full template](/specs/TEMPLATE.md).
   - if proposing other architecture or infrastructure changes, use the [high-level design template](specs/TEMPLATE-HLD.md).
2. Fill in the fields of the spec. Be sure to remove any boilerplate from the spec template which was not used. 
3. If it's a component spec, add a link to your spec from the [component status table in the root README.md](/README.md#component-status).
4. Create a pull request for the branch to discuss the spec with Nimble maintainers.
5. Approval and merging of the pull request indicates approval to proceed with the proposed approach! 🥳