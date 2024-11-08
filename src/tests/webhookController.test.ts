import server from "@/server";

describe("Webhook Endpoints", () => {
  afterAll(async () => {
    await server.close(); //Encerra o server após testar
  });

  it("Should responde with 200 for a valid incoming message", async () => {
    const response = await server.inject({
      method: "POST",
      url: "/v1/webhook",
      payload: {
        entry: [
          {
            changes: [
              {
                value: {
                  messages: [
                    {
                      from: "5511920051759",
                      text: { body: "Hello world" },
                    },
                  ],
                },
              },
            ],
          },
        ],
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ status: "success" });
  });

  it("Should respond with 400 for an invalid message format", async () => {
    const response = await server.inject({
      method: "POST",
      url: "/v1/webhook",
      payload: {}, //invalid payload
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toHaveProperty("error", "Invalid message format");
  });

  it("should respond with 403 for an invalid verification token", async () => {
    const response = await server.inject({
      method: "GET",
      url: "/v1/webhook",
      query: {
        "hub.verify_token": "wrong_token",
        "hub.challenge": "12345",
      },
    });
    expect(response.statusCode).toBe(403);
    expect(response.body).toBe("Invalid token.");
  });

  it("should respond with challenge for a valid verification token", async () => {
    const response = await server.inject({
      method: "GET",
      url: "/v1/webhook",
      query: {
        "hub.verify_token": "12345678", // Token correto
        "hub.challenge": "12345",
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toBe("12345");
  });
});
