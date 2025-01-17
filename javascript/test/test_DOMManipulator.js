import DOMManipulator from "../utilities/DOMManipulator";

describe("DOMManipulator", () => {
  it("should create a DOM element", () => {
    const element = DOMManipulator.createElement("div", { class: "test" }, "Hello");
    expect(element.tagName).toBe("DIV");
    expect(element.className).toBe("test");
    expect(element.innerHTML).toBe("Hello");
  });

  // Add similar tests for other methods
});
