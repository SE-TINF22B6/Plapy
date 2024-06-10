import { SavedPlaylist } from '../structs/SavedPlaylist';
import { getRepository } from 'typeorm';
import { Song } from "../structs/Song";


jest.mock('typeorm', () => ({
  PrimaryGeneratedColumn: jest.fn(),
  Entity: jest.fn(),
  Column: jest.fn(),
  ManyToMany: jest.fn(),
  JoinTable: jest.fn(),
  getRepository: jest.fn(),
}));

describe('Hello Tests', () => {
  jest.useFakeTimers();

  test('test songs get added to saved playlist', async () => {
    // Mock the behavior of the getRepository function
    const mockFindOne = jest.fn();
    const mockSave = jest.fn();
    mockFindOne.mockResolvedValue(null); // Mock the behavior for findOne
    mockSave.mockResolvedValue(new SavedPlaylist({songs: [] , title: "new playlist" , guildId: "myGuild"}));

    (getRepository as jest.Mock).mockReturnValue({
      findOne: mockFindOne,
      save: mockSave
    });

    const song = getTestSong();
    const playlist = await SavedPlaylist.getOrSaveNewPlaylist('newPlaylist', 'mockGuild');

    expect(playlist.songs).toStrictEqual([])
    await playlist.saveNewSong(song);
    expect(playlist.songs.length).toBe(1);

    await playlist.saveNewSong(getSecondTestSong());
    expect(playlist.songs.length).toBe(2)


  });

  test('0 != "0"', () => {
    expect(0).not.toBe('0');
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

const getTestSong = () =>{
  return new Song(
    {
      url: "https://song.tests.com/testSong1" ,
      title:"Testsong",
      duration: 200
    })
}

const getSecondTestSong = () => {
  return new Song(
    {
      url: "https://song.tests.com/testSong2" ,
      title:"zweiter testsong",
      duration: 100
    })
}