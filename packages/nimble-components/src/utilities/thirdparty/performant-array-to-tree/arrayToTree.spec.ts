/**
 * [Nimble]
 * Copied from https://github.com/philipstanislaus/performant-array-to-tree/blob/ae56091b76de0065949bdf228096010e8c0117f7/src/arrayToTree.spec.ts
 * with the following changes:
 * - Use jasmine instead of chai
 */

import { arrayToTree, countNodes } from "./arrayToTree";

describe("arrayToTree", () => {
  it("should work with nested objects", () => {
    expect(
      arrayToTree([
        { id: "4", parentId: null, custom: "abc" },
        { id: "31", parentId: "4", custom: "12" },
        { id: "1941", parentId: "418", custom: "de" },
        { id: "1", parentId: "418", custom: "ZZZz" },
        { id: "418", parentId: null, custom: "ü" },
      ])
    ).toEqual([
      {
        data: { id: "4", parentId: null, custom: "abc" },
        children: [
          { data: { id: "31", parentId: "4", custom: "12" }, children: [] },
        ],
      },
      {
        data: { id: "418", parentId: null, custom: "ü" },
        children: [
          { data: { id: "1941", parentId: "418", custom: "de" }, children: [] },
          { data: { id: "1", parentId: "418", custom: "ZZZz" }, children: [] },
        ],
      },
    ]);
  });

  it("should work with nested objects if throwIfOrphans is set to true", () => {
    expect(
      arrayToTree(
        [
          { id: "4", parentId: null, custom: "abc" },
          { id: "31", parentId: "4", custom: "12" },
          { id: "1941", parentId: "418", custom: "de" },
          { id: "1", parentId: "418", custom: "ZZZz" },
          { id: "418", parentId: null, custom: "ü" },
        ],
        { throwIfOrphans: true }
      )
    ).toEqual([
      {
        data: { id: "4", parentId: null, custom: "abc" },
        children: [
          { data: { id: "31", parentId: "4", custom: "12" }, children: [] },
        ],
      },
      {
        data: { id: "418", parentId: null, custom: "ü" },
        children: [
          { data: { id: "1941", parentId: "418", custom: "de" }, children: [] },
          { data: { id: "1", parentId: "418", custom: "ZZZz" }, children: [] },
        ],
      },
    ]);
  });

  it("should ignore circular parent child relations", () => {
    expect(
      arrayToTree([
        { id: "4", parentId: "31", custom: "abc" },
        { id: "31", parentId: "4", custom: "12" },
      ])
    ).toEqual([]);

    expect(
      arrayToTree([
        { id: "4", parentId: "31", custom: "abc" },
        { id: "31", parentId: "5", custom: "12" },
        { id: "5", parentId: "4", custom: "12" },
      ])
    ).toEqual([]);
  });

  it("should throw if throwIfOrphans is enabled and circular parent child relations are encountered, see #37", () => {
    expect(() =>
      arrayToTree(
        [
          { id: "4", parentId: "31", custom: "abc" },
          { id: "31", parentId: "4", custom: "12" },
        ],
        { throwIfOrphans: true }
      )
    ).toThrowError(
      "The items array contains nodes with a circular parent/child relationship."
    );

    expect(() =>
      arrayToTree(
        [
          { id: "4", parentId: "31", custom: "abc" },
          { id: "31", parentId: "5", custom: "12" },
          { id: "5", parentId: "4", custom: "12" },
        ],
        { throwIfOrphans: true }
      )
    ).toThrowError(
      "The items array contains nodes with a circular parent/child relationship."
    );
  });

  it("should work with integer keys", () => {
    expect(
      arrayToTree([
        { id: 4, parentId: null, custom: "abc" },
        { id: 31, parentId: 4, custom: "12" },
        { id: 1941, parentId: 418, custom: "de" },
        { id: 1, parentId: 418, custom: "ZZZz" },
        { id: 418, parentId: null, custom: "ü" },
      ])
    ).toEqual([
      {
        data: { id: 4, parentId: null, custom: "abc" },
        children: [
          { data: { id: 31, parentId: 4, custom: "12" }, children: [] },
        ],
      },
      {
        data: { id: 418, parentId: null, custom: "ü" },
        children: [
          { data: { id: 1941, parentId: 418, custom: "de" }, children: [] },
          { data: { id: 1, parentId: 418, custom: "ZZZz" }, children: [] },
        ],
      },
    ]);
  });

  it("should work with integer parentId 0", () => {
    expect(
      arrayToTree([
        { id: 0, parentId: null, custom: "abc" },
        { id: 31, parentId: 0, custom: "12" },
      ])
    ).toEqual([
      {
        data: { id: 0, parentId: null, custom: "abc" },
        children: [
          { data: { id: 31, parentId: 0, custom: "12" }, children: [] },
        ],
      },
    ]);
  });

  it("should work with nested objects and custom keys", () => {
    expect(
      arrayToTree(
        [
          { num: "4", ref: null, custom: "abc" },
          { num: "31", ref: "4", custom: "12" },
          { num: "1941", ref: "418", custom: "de" },
          { num: "1", ref: "418", custom: "ZZZz" },
          { num: "418", ref: null, custom: "ü" },
        ],
        { id: "num", parentId: "ref", childrenField: "nodes" }
      )
    ).toEqual([
      {
        data: { num: "4", ref: null, custom: "abc" },
        nodes: [{ data: { num: "31", ref: "4", custom: "12" }, nodes: [] }],
      },
      {
        data: { num: "418", ref: null, custom: "ü" },
        nodes: [
          { data: { num: "1941", ref: "418", custom: "de" }, nodes: [] },
          { data: { num: "1", ref: "418", custom: "ZZZz" }, nodes: [] },
        ],
      },
    ]);
  });

  it("should work with nested objects and a custom key with dots if nested properties are disabled", () => {
    expect(
      arrayToTree(
        [
          { ".key": "4", "my.parent": null, custom: "abc" },
          { ".key": "31", "my.parent": "4", custom: "12" },
          { ".key": "1941", "my.parent": "418", custom: "de" },
          { ".key": "1", "my.parent": "418", custom: "ZZZz" },
          { ".key": "418", "my.parent": null, custom: "ü" },
        ],
        {
          id: ".key",
          parentId: "my.parent",
          childrenField: "nodes",
          nestedIds: false,
        }
      )
    ).toEqual([
      {
        data: { ".key": "4", "my.parent": null, custom: "abc" },
        nodes: [
          { data: { ".key": "31", "my.parent": "4", custom: "12" }, nodes: [] },
        ],
      },
      {
        data: { ".key": "418", "my.parent": null, custom: "ü" },
        nodes: [
          {
            data: { ".key": "1941", "my.parent": "418", custom: "de" },
            nodes: [],
          },
          {
            data: { ".key": "1", "my.parent": "418", custom: "ZZZz" },
            nodes: [],
          },
        ],
      },
    ]);
  });

  it("should ignore objects if parentId does not exist", () => {
    expect(
      arrayToTree([
        { id: "4", parentId: null, custom: "abc" },
        { id: "31", parentId: "4", custom: "12" },
        { id: "1941", parentId: "418", custom: "de" },
        { id: "1", parentId: "418", custom: "ZZZz" },
        { id: "418", parentId: null, custom: "ü" },
        { id: "1313", parentId: "13", custom: "Not existing" },
      ])
    ).toEqual([
      {
        data: { id: "4", parentId: null, custom: "abc" },
        children: [
          { data: { id: "31", parentId: "4", custom: "12" }, children: [] },
        ],
      },
      {
        data: { id: "418", parentId: null, custom: "ü" },
        children: [
          { data: { id: "1941", parentId: "418", custom: "de" }, children: [] },
          { data: { id: "1", parentId: "418", custom: "ZZZz" }, children: [] },
        ],
      },
    ]);
  });

  it("should work with nested objects with dataField set to null", () => {
    expect(
      arrayToTree(
        [
          { id: "4", parentId: null, custom: "abc" },
          { id: "31", parentId: "4", custom: "12" },
          { id: "1941", parentId: "418", custom: "de" },
          { id: "1", parentId: "418", custom: "ZZZz" },
          { id: "418", parentId: null, custom: "ü" },
        ],
        { dataField: null }
      )
    ).toEqual([
      {
        id: "4",
        parentId: null,
        custom: "abc",
        children: [{ id: "31", parentId: "4", custom: "12", children: [] }],
      },
      {
        id: "418",
        parentId: null,
        custom: "ü",
        children: [
          { id: "1941", parentId: "418", custom: "de", children: [] },
          { id: "1", parentId: "418", custom: "ZZZz", children: [] },
        ],
      },
    ]);
  });

  it("should work with nested objects and custom keys with dataField set to null", () => {
    expect(
      arrayToTree(
        [
          { num: "4", ref: null, custom: "abc" },
          { num: "31", ref: "4", custom: "12" },
          { num: "1941", ref: "418", custom: "de" },
          { num: "1", ref: "418", custom: "ZZZz" },
          { num: "418", ref: null, custom: "ü" },
        ],
        { id: "num", parentId: "ref", dataField: null }
      )
    ).toEqual([
      {
        num: "4",
        ref: null,
        custom: "abc",
        children: [{ num: "31", ref: "4", custom: "12", children: [] }],
      },
      {
        num: "418",
        ref: null,
        custom: "ü",
        children: [
          { num: "1941", ref: "418", custom: "de", children: [] },
          { num: "1", ref: "418", custom: "ZZZz", children: [] },
        ],
      },
    ]);
  });

  it("should ignore objects if parentId does not exist with dataField set to null", () => {
    expect(
      arrayToTree(
        [
          { id: "4", parentId: null, custom: "abc" },
          { id: "31", parentId: "4", custom: "12" },
          { id: "1941", parentId: "418", custom: "de" },
          { id: "1", parentId: "418", custom: "ZZZz" },
          { id: "418", parentId: null, custom: "ü" },
          { id: "1313", parentId: "13", custom: "Not existing" },
        ],
        { dataField: null }
      )
    ).toEqual([
      {
        id: "4",
        parentId: null,
        custom: "abc",
        children: [{ id: "31", parentId: "4", custom: "12", children: [] }],
      },
      {
        id: "418",
        parentId: null,
        custom: "ü",
        children: [
          { id: "1941", parentId: "418", custom: "de", children: [] },
          { id: "1", parentId: "418", custom: "ZZZz", children: [] },
        ],
      },
    ]);
  });

  it("should treat objects with missing parentId as root objects", () => {
    expect(
      arrayToTree([
        { id: "4", custom: "abc" },
        { id: "31", parentId: "4", custom: "12" },
        { id: "1941", parentId: "418", custom: "de" },
        { id: "1", parentId: "418", custom: "ZZZz" },
        { id: "418", custom: "ü" },
        { id: "1313", parentId: "13", custom: "Not existing" },
      ])
    ).toEqual([
      {
        data: { id: "4", custom: "abc" },
        children: [
          { data: { id: "31", parentId: "4", custom: "12" }, children: [] },
        ],
      },
      {
        data: { id: "418", custom: "ü" },
        children: [
          { data: { id: "1941", parentId: "418", custom: "de" }, children: [] },
          { data: { id: "1", parentId: "418", custom: "ZZZz" }, children: [] },
        ],
      },
    ]);
  });

  it("should treat objects with empty string as parentId as root objects", () => {
    expect(
      arrayToTree([
        { id: "4", parentId: "", custom: "abc" },
        { id: "31", parentId: "4", custom: "12" },
        { id: "1941", parentId: "418", custom: "de" },
        { id: "1", parentId: "418", custom: "ZZZz" },
        { id: "418", parentId: "", custom: "ü" },
        { id: "1313", parentId: "13", custom: "Not existing" },
      ])
    ).toEqual([
      {
        data: { id: "4", parentId: "", custom: "abc" },
        children: [
          { data: { id: "31", parentId: "4", custom: "12" }, children: [] },
        ],
      },
      {
        data: { id: "418", parentId: "", custom: "ü" },
        children: [
          { data: { id: "1941", parentId: "418", custom: "de" }, children: [] },
          { data: { id: "1", parentId: "418", custom: "ZZZz" }, children: [] },
        ],
      },
    ]);
  });

  it("should treat objects with non-zero length string as parentId as root objects if these parent ids are in rootParentIds", () => {
    expect(
      arrayToTree(
        [
          { id: "4", parentId: "orphan1", custom: "abc" },
          { id: "31", parentId: "4", custom: "12" },
          { id: "1941", parentId: "418", custom: "de" },
          { id: "1", parentId: "418", custom: "ZZZz" },
          { id: "418", parentId: "orphan2", custom: "ü" },
          { id: "1313", parentId: "orphan3", custom: "will be ignored" },
        ],
        {
          rootParentIds: { "": true, orphan1: true, orphan2: true },
        }
      )
    ).toEqual([
      {
        data: { id: "4", parentId: "orphan1", custom: "abc" },
        children: [
          { data: { id: "31", parentId: "4", custom: "12" }, children: [] },
        ],
      },
      {
        data: { id: "418", parentId: "orphan2", custom: "ü" },
        children: [
          { data: { id: "1941", parentId: "418", custom: "de" }, children: [] },
          { data: { id: "1", parentId: "418", custom: "ZZZz" }, children: [] },
        ],
      },
    ]);
  });

  it("should not throw if orphans exist but throwIfOrphans is false", () => {
    expect(
      arrayToTree([
        { id: "4", parentId: null, custom: "abc" },
        { id: "31", parentId: "4", custom: "12" },
        { id: "418", parentId: "6", custom: "ü" },
      ])
    ).toEqual([
      {
        data: { id: "4", parentId: null, custom: "abc" },
        children: [
          { data: { id: "31", parentId: "4", custom: "12" }, children: [] },
        ],
      },
    ]);
  });

  it("should throw if orphans exist and throwIfOrphans is true", () => {
    expect(() =>
      arrayToTree(
        [
          { id: "4", parentId: null, custom: "abc" },
          { id: "31", parentId: "4", custom: "12" },
          { id: "418", parentId: "6", custom: "ü" },
          { id: "419", parentId: "418", custom: "ü" },
          { id: "420", parentId: "7", custom: "ü" },
        ],
        { throwIfOrphans: true }
      )
    ).toThrowError(
      "The items array contains orphans that point to the following parentIds: [6,7]. " +
        "These parentIds do not exist in the items array. " +
        "Hint: prevent orphans to result in an error by passing the following option: { throwIfOrphans: false }"
    );
  });

  it("should not throw if no orphans exist and throwIfOrphans is true, but the order is different (see #18)", () => {
    expect(
      arrayToTree(
        [
          { id: "2", parentId: "root", foo: "bar" },
          { id: "1-1", parentId: "1", foo: "bar" },
          { id: "1", parentId: "root", foo: "bar" },
          { id: "root", parentId: null, bar: "bar" },
        ],
        { dataField: null, throwIfOrphans: true }
      )
    ).toEqual([
      {
        id: "root",
        parentId: null,
        bar: "bar",
        children: [
          { id: "2", parentId: "root", foo: "bar", children: [] },
          {
            id: "1",
            parentId: "root",
            foo: "bar",
            children: [{ id: "1-1", parentId: "1", foo: "bar", children: [] }],
          },
        ],
      },
    ]);
  });

  it("should throw if orphans exist and throwIfOrphans is true and rootParentIds don't contain orphan parentId", () => {
    expect(() =>
      arrayToTree(
        [
          { id: "4", parentId: null, custom: "abc" },
          { id: "31", parentId: "4", custom: "12" },
          { id: "418", parentId: "6", custom: "ü" },
          { id: "419", parentId: "418", custom: "ü" },
          { id: "420", parentId: "7", custom: "ü" },
        ],
        {
          rootParentIds: { "": true, "6": true },
          throwIfOrphans: true,
        }
      )
    ).toThrowError(
      "The items array contains orphans that point to the following parentIds: [7]. " +
        "These parentIds do not exist in the items array. " +
        "Hint: prevent orphans to result in an error by passing the following option: { throwIfOrphans: false }"
    );
  });

  it("should throw if a node has parentId that both exists in another node and is in rootParentIds", () => {
    expect(() =>
      arrayToTree(
        [
          { id: "fakeOrphan", parentId: null },
          { id: "aaa", parentId: "fakeOrphan" },
          { id: "bbb", parentId: "aaa" },
          { id: "ccc", parentId: "bbb" },
        ],
        {
          rootParentIds: { "": true, fakeOrphan: true },
          throwIfOrphans: true,
        }
      )
    ).toThrowError(
      "The item array contains a node whose parentId both exists in another node and is in `rootParentIds` " +
        '(`itemId`: "fakeOrphan", `rootParentIds`: "", "fakeOrphan").'
    );
  });

  it("should replace default rootParentIds by the provided value", () => {
    expect(
      arrayToTree(
        [
          { id: "4", parentId: "", custom: "abc" },
          { id: "31", parentId: "4", custom: "12" },
          { id: "418", parentId: "6", custom: "ü" },
        ],
        {
          rootParentIds: { "6": true },
        }
      )
    ).toEqual([
      { data: { id: "418", parentId: "6", custom: "ü" }, children: [] },
    ]);
  });

  it("should work with empty inputs", () => {
    expect(arrayToTree([])).toEqual([]);
  });

  it("should work with nested objects and nested id and parentId properties", () => {
    expect(
      arrayToTree(
        [
          { nested: { id: "1", parentId: null, custom: "1" } },
          { nested: { id: "1.1", parentId: "1", custom: "1.1" } },
          { nested: { id: "1.1.1", parentId: "1.1", custom: "1.1.1" } },
          { nested: { id: "1.2", parentId: "1", custom: "1.2" } },
          { nested: { id: "2", parentId: null, custom: "2" } },
        ],
        { id: "nested.id", parentId: "nested.parentId" }
      )
    ).toEqual([
      {
        data: { nested: { id: "1", parentId: null, custom: "1" } },
        children: [
          {
            data: { nested: { id: "1.1", parentId: "1", custom: "1.1" } },
            children: [
              {
                data: {
                  nested: { id: "1.1.1", parentId: "1.1", custom: "1.1.1" },
                },
                children: [],
              },
            ],
          },
          {
            data: { nested: { id: "1.2", parentId: "1", custom: "1.2" } },
            children: [],
          },
        ],
      },
      {
        data: { nested: { id: "2", parentId: null, custom: "2" } },
        children: [],
      },
    ]);
  });

  it("should work with nested id property", () => {
    expect(
      arrayToTree(
        [
          { one: { id: "1" }, parentId: null, custom: "1" },
          { one: { id: "1.1" }, parentId: "1", custom: "1.1" },
        ],
        { id: "one.id", parentId: "parentId" }
      )
    ).toEqual([
      {
        data: { one: { id: "1" }, parentId: null, custom: "1" },
        children: [
          {
            data: { one: { id: "1.1" }, parentId: "1", custom: "1.1" },
            children: [],
          },
        ],
      },
    ]);
  });

  it("should work with nested parentId property", () => {
    expect(
      arrayToTree(
        [
          { id: "1", two: { parentId: null }, custom: "1" },
          { id: "1.1", two: { parentId: "1" }, custom: "1.1" },
        ],
        { id: "id", parentId: "two.parentId" }
      )
    ).toEqual([
      {
        data: { id: "1", two: { parentId: null }, custom: "1" },
        children: [
          {
            data: { id: "1.1", two: { parentId: "1" }, custom: "1.1" },
            children: [],
          },
        ],
      },
    ]);
  });

  it("should work with nested id and parentId properties", () => {
    expect(
      arrayToTree(
        [
          { one: { id: "1" }, two: { parentId: null }, custom: "1" },
          { one: { id: "1.1" }, two: { parentId: "1" }, custom: "1.1" },
        ],
        { id: "one.id", parentId: "two.parentId" }
      )
    ).toEqual([
      {
        data: { one: { id: "1" }, two: { parentId: null }, custom: "1" },
        children: [
          {
            data: { one: { id: "1.1" }, two: { parentId: "1" }, custom: "1.1" },
            children: [],
          },
        ],
      },
    ]);
  });

  it("should work with nested id and parentId properties if the parent is null", () => {
    expect(
      arrayToTree(
        [
          { one: { id: "1" }, two: null, custom: "1" },
          { one: { id: "1.1" }, two: { parentId: "1" }, custom: "1.1" },
        ],
        { id: "one.id", parentId: "two.parentId" }
      )
    ).toEqual([
      {
        data: { one: { id: "1" }, two: null, custom: "1" },
        children: [
          {
            data: { one: { id: "1.1" }, two: { parentId: "1" }, custom: "1.1" },
            children: [],
          },
        ],
      },
    ]);
  });

  it("should work with nested id and parentId properties if the parent is undefined", () => {
    expect(
      arrayToTree(
        [
          { one: { id: "1" }, custom: "1" },
          { one: { id: "1.1" }, two: { parentId: "1" }, custom: "1.1" },
        ],
        { id: "one.id", parentId: "two.parentId" }
      )
    ).toEqual([
      {
        data: { one: { id: "1" }, custom: "1" },
        children: [
          {
            data: { one: { id: "1.1" }, two: { parentId: "1" }, custom: "1.1" },
            children: [],
          },
        ],
      },
    ]);
  });

  it("should keep prototype if assign is enabled", () => {
    const animal = {
      legs() {
        return 4;
      },
    };

    const mom = Object.create(animal);
    mom.id = "mom";
    mom.parentId = null;
    const kitty = Object.create(animal);
    kitty.id = "kitty";
    kitty.parentId = "mom";

    const tree = arrayToTree([mom, kitty], { dataField: null, assign: true });

    expect(tree).toEqual([mom]);

    expect(tree[0]!.__proto__).toEqual(animal);

    expect(tree[0]!.legs()).toEqual(4);
  });

  it("should not keep prototype if assign is disabled", () => {
    const animal = {
      legs() {
        return 4;
      },
    };

    const mom = Object.create(animal);
    mom.id = "mom";
    mom.parentId = null;
    const kitty = Object.create(animal);
    kitty.id = "kitty";
    kitty.parentId = "mom";

    const tree = arrayToTree([mom, kitty], { dataField: null, assign: false });

    expect(tree).toEqual([
      {
        id: "mom",
        parentId: null,
        children: [
          {
            id: "kitty",
            parentId: "mom",
            children: [],
          },
        ],
      },
    ]);

    expect(mom.legs()).toEqual(4);

    expect(tree[0]!.__proto__).toEqual(Object.prototype);
    expect(tree[0]!.legs).toEqual(undefined);
  });
});

describe("countNodes", () => {
  it("should work with nested objects", () => {
    expect(
      countNodes(
        arrayToTree([
          { id: "4", parentId: null, custom: "abc" },
          { id: "31", parentId: "4", custom: "12" },
          { id: "1941", parentId: "418", custom: "de" },
          { id: "1", parentId: "418", custom: "ZZZz" },
          { id: "418", parentId: null, custom: "ü" },
        ]),
        "children"
      )
    ).toEqual(5);
  });

  it("should work for 1 node", () => {
    expect(
      countNodes(
        arrayToTree([{ id: "4", parentId: null, custom: "abc" }]),
        "children"
      )
    ).toEqual(1);
  });

  it("should work for 0 nodes", () => {
    expect(countNodes(arrayToTree([]), "children")).toEqual(0);
  });
});