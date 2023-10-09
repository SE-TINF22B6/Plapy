import Server from "../structs/Server";

describe("Test the API server", () => {
  jest.useFakeTimers();
  const server = new Server(3000);

  test("empty string should result in zero", () => {
    let settings = {
      url: "http://localhost:3000/stop",
      method: "POST",
      timeout: 0,
      headers: {
        guildId: "1159465114454474834",
        userID: "289527965484711939",
        channelID: "1159465116442566707"
      }
    };

    $.ajax(settings).done((response) => {
      console.log(response);
      expect(response).toBe("");
    });
  });
});
