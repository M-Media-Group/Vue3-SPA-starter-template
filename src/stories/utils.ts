import { expect } from "@storybook/test";

// Recursively check that the children are not overflowing
export const checkChildrenForOverflow = (
  children: HTMLCollectionOf<Element>,
  parent: Element
) => {
  for (const child of children) {
    const childRect = child.getBoundingClientRect();
    const articleRect = parent.getBoundingClientRect();
    expect(childRect.width).toBeLessThanOrEqual(articleRect.width);
    expect(childRect.height).toBeLessThanOrEqual(articleRect.height);
    if (child.children.length > 0) {
      checkChildrenForOverflow(child.children, parent);
    }
  }
};
