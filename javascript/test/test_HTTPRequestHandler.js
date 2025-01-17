import HTTPRequestHandler from "../utilities/HTTPRequestHandler";

describe("HTTPRequestHandler", () => {
  global.fetch = jest.fn();

  it("should perform a GET request", async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ message: "success" }) });

    const response = await HTTPRequestHandler.get("https://api.example.com");
    expect(response).toEqual({ message: "success" });
  });

  // Add similar tests for POST and PUT methods
});
