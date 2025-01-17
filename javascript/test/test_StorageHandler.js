import StorageHandler from "../utilities/StorageHandler";

describe("StorageHandler", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it("should set and get an item in localStorage", () => {
    StorageHandler.setItem("key", { data: "value" });
    const result = StorageHandler.getItem("key");
    expect(result).toEqual({ data: "value" });
  });

  // Add similar tests for sessionStorage and removeItem
});
