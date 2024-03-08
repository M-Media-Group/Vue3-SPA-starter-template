import { expect } from "@storybook/test";

/** Recursively check that the children are not overflowing */
export const checkChildrenForOverflow = (
  children: HTMLCollectionOf<Element>,
  parent: Element
) => {
  for (const child of children) {
    const childRect = child.getBoundingClientRect();
    const elementRect = parent.getBoundingClientRect();
    expect(childRect.width).toBeLessThanOrEqual(elementRect.width);
    expect(childRect.height).toBeLessThanOrEqual(elementRect.height);
    if (child.children.length > 0) {
      checkChildrenForOverflow(child.children, parent);
    }
  }
};

/** Check that the element is not overflowing */
export const checkElementForTextOverflow = (element: Element) => {
  const elementRect = element.getBoundingClientRect();

  //   If the element handles overflow, we can't check for overflow. It might handle it by setting overflow: hidden and nowrap
  if (
    window.getComputedStyle(element).overflow === "hidden" &&
    window.getComputedStyle(element).whiteSpace === "nowrap"
  ) {
    return;
  }

  expect(element.scrollWidth).toBeLessThanOrEqual(elementRect.width);
  expect(element.scrollHeight).toBeLessThanOrEqual(elementRect.height);
};

/** check that an element is centered relative to parent */
export const checkElementCentered = (
  element: Element,
  parent: Element,
  checkVerticalToo = true
) => {
  const elementRect = element.getBoundingClientRect();
  const parentRect = parent.getBoundingClientRect();

  const leftDistance = elementRect.left - parentRect.left;
  const rightDistance = parentRect.right - elementRect.right;

  expect(leftDistance).toBeCloseTo(rightDistance, 0);

  if (!checkVerticalToo) {
    return;
  }

  const topDistance = elementRect.top - parentRect.top;
  const bottomDistance = parentRect.bottom - elementRect.bottom;
  expect(topDistance).toBeCloseTo(bottomDistance, 0);
};
