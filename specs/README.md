# 🧐 📄 New component spec process

Before building a new component, create a spec document and review it in a pull request to get agreement on the component's behavior, API, and high-level implementation.

The process to create and approve a spec is:

1. In a new branch, create a copy of the [spec template](/specs/TEMPLATE.md). Place the copy in this `specs` directory next to the template with a name similar to other specs but unique to the component you are proposing.
2. Fill in the fields of the spec. Be sure to remove any boilerplate from the spec template which was not used. 
3. Add a link to your spec from the [component status table in the root README.md](/README.md#component-status).
4. Create a pull request for the branch to discuss the spec with Nimble maintainers.
5. Approval and merging of the pull request indicates approval to proceed with building the component!