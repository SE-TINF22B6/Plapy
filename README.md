# workflow:
<img width="764" alt="Bildschirmfoto 2023-10-06 um 15 36 50" src="https://github.com/SE-TINF22B6/Plapy/assets/57218126/1a0bbcc4-cf52-4dea-b867-e0eb538265ec">

# 🤖 Plapy (Discord Music Bot)

> Plapy is a Discord Music Bot built with TypeScript, discord.js & uses Command Handler from [discordjs.guide](https://discordjs.guide)
> The project is based on a fork of the open source music bot evobot https://github.com/eritislami/evobot.
> Goals of the project are:
1. To add more functionality like saving and playing playlists from the bots database.
2. To provide an API for the user that allows control outside of discord command
3. To create a web interface that allows control via the API with a GUI
4. To improve the queue experience by providing new features like autoplay and play next
5. To host the bot and website on an external server enabling 24/7 access

## Requirements

1. Discord Bot Token **[Guide](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot)**  
   1.1. Enable 'Message Content Intent' in Discord Developer Portal
2. Node.js 16.11.0 or newer
3. Open port 80 (or the desired port that you configured) on the server that's hosting the project for API and website access

## 🚀 Getting Started

After installation finishes follow configuration instructions then run `npm run start` to start the bot.
If you want to setup the Bot on an Ubuntu server you can follow the instructions in [UbuntuServerSetup.md](UbuntuServerSetup.md)

## ⚙️ Configuration

Copy or Rename `config.json.example` to `config.json` and fill out the values:

⚠️ **Note: Never commit or share your token or api keys publicly** ⚠️

```json
{
  "TOKEN": "",
  "MAX_PLAYLIST_SIZE": 10,
  "PRUNING": false,
  "LOCALE": "en",
  "DEFAULT_VOLUME": 100,
  "STAY_TIME": 30,
   "SERVER_IP": "localhost"
}
```


## 📝 Base Functionality

- 🎶 Play music from YouTube via url

`/play https://www.youtube.com/watch?v=GLvohMXgcBo`

- 🔎 Play music from YouTube via search query

`/play under the bridge red hot chili peppers`

- 🔎 Search and select music to play

`/search Pearl Jam`

- 📃 Play youtube playlists via url

`/playlist https://www.youtube.com/watch?v=YlUKcNNmywk&list=PL5RNCwK3GIO13SR_o57bGJCEmqFAwq82c`

- 🔎 Play youtube playlists via search query

`/playlist linkin park meteora`

- Now Playing (/np)
- Queue system (/queue)
- Loop / Repeat (/loop)
- Shuffle (/shuffle)
- Volume control (/volume)
- Lyrics (/lyrics)
- Pause (/pause)
- Resume (/resume)
- Skip (/skip)
- Skip to song # in queue (/skipto)
- Move a song in the queue (/move)
- Remove song # from queue (/remove)
- Show ping to Discord API (/ping)
- Show bot uptime (/uptime)
- Help (/help)
- Command Handler from [discordjs.guide](https://discordjs.guide/)
- Media Controls via Reactions

## 🆕 New commands available with Plapy

- Start an autoplay radio based on a song (/radio)

## 🫵 Available API-Endpoints

- Stop the playback (/stop)
- Skip (/skip)
- Volume control (/volume)
- Play --currently only available if a server has an active queue-- (/play)

![reactions](https://i.imgur.com/0hdUX1C.png)

## 🌎 Locales

⚠️ **Note: The Plapy team only maintains the english localization for all added commands** ⚠️

Currently available locales are:

- English (en)

⚠️ **Not maintained for Plapy commands** ⚠️

- Arabic (ar)
- Brazilian Portuguese (pt_br)
- Bulgarian (bg)
- Romanian (ro)
- Czech (cs)
- Dutch (nl)
- French (fr)
- German (de)
- Greek (el)
- Indonesian (id)
- Italian (it)
- Japanese (ja)
- Korean (ko)
- Minionese (mi)
- Persian (fa)
- Polish (pl)
- Russian (ru)
- Simplified Chinese (zh_cn)
- Singaporean Mandarin (zh_sg)
- Spanish (es)
- Swedish (sv)
- Traditional Chinese (zh_tw)
- Thai (th)
- Turkish (tr)
- Ukrainian (uk)
- Vietnamese (vi)
- Check [Contributing](#-contributing) if you wish to help add more languages!
- For languages please use [ISO 639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) two letter format
