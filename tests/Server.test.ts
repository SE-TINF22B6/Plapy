import Server from "../structs/Server";

describe("Hello Tests", () => {
  jest.useFakeTimers();

  test("1 + 2 = 3", () => {
    expect(1 + 2).toBe(3);
  });

  test('0 != "0"', () => {
    expect(0).not.toBe("0");
  });
  /*
      runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Use Node.js 20.9.0
        uses: actions/setup-node@v3
        with:
          node-version: "20.9.0"
          cache: "npm"
      - run: npm ci
      - run: npm run build --if-present
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

   */
});
