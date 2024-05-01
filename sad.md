# Plapy
## Software Architecture Documentation

### 1. Introduction
#### 1.1 Overview
> The architecture of Plapy, our Discord music bot, is primarily designed around an event-driven model. This model is ideal for handling real-time, asynchronous interactions that occur in a Discord environment. 
Whenever a user issues a command through the Discord chat, Plapy reacts immediately to these commands, triggering specific processes and responses
#### 1.2 Constraints
> Plapy is a discord-bot, which means, that there are some technical constraints from discord, that have to be considered:
> - API Rate Limits: Discord enforces strict rate limits on its APIs, which directly impacts how frequently Plapy can send requests or respond to user commands. This requires an architecture capable of efficiently managing API calls and handling potential bottlenecks or delays in user interaction.
> - Data Flow Control: Given the event-driven nature, Plapy's architecture must effectively control data flow, ensuring that events (commands from users) are processed in an orderly and timely manner, despite the asynchronous nature of interactions.
#### 1.3 Definitions, Acronyms and Abbreviations
> - Discord =  A communication platform designed primarily for gamers but widely used by various communities. It supports voice, video, and text chat.
> - 
#### 1.4 References
> no references yet

### 2. Architecture tactics
> When the decision was made to make a discord bot, it was clear from the start, that an event-driven architecture would be good. Discord only allows an event-driven architecture, because the bot has to wait for the Discord API to trigger an event in the bot, when a 
> command is typed. This means, the Plapy team did not have another choicem, than the event-driven architecture.

### 3. Architecture design
> This section specifies the architecture design in various views.

#### 3.1 Sequence diagram
> This diagram shows how the different components work with each other, in order to login the bot. The bot has to send a login-token to the discord API. If that is successful, the bot can register its commands at the discord API. The API will
> give the commands to the discord UI (so that it knows which commands are for the Plapy bot). After that, the bot will wait for an user to type a command in the UI. If this event is triggered, the UI will send the command Info to the API and the
> API will send it so the Plapy bot, which will trigger an event and the command will be executed.
> 
> ![Sequenzdiagramm_Bot-login drawio](https://github.com/SE-TINF22B6/Plapy/assets/123726628/1ba93f8e-1469-4b4a-b5c4-e673f294a700)

#### 3.2 Component diagram
> This diagram shows the different components of the Plapy Bot. The *.json-, *.js- and *.ts files are used to create the app component of the bot. It also needs the structs. It gets the commands by interaction, which uses the interfaces of the structs and utils package components. The commands can run by themselves, but are able to use data stored in a database. The database is created by the docker file.
> ![Plapy_Bot_Componentdiagram drawio](https://github.com/SE-TINF22B6/Plapy/assets/75337582/9b00a25d-064f-4368-8065-5fd4fed10617)

#### 3.3 Package diagram
> This diagram gives us a general overview about how the bot works. The DiscordIndex is the package, that communicates with the Discord API. Therefore it uses all the other packages (except datasbase and Playlists) to gather the information it needs to send to the bot and it will also trigger the Events, when someone writes a command.
> The Bot manages the MusicQueue and the Playlists. The Server manages the Database.
> 
![packageDiagram drawio (1)](https://github.com/SE-TINF22B6/Plapy/assets/123726628/a647f122-3ccf-4104-b094-68212251281c)


#### 3.1 Overview 
> In general, the Plapy bot uses an event-driven design. If a user types a command, the Discord API will trigger an event in the bot and the bot will then execute the command and then wait for the next event.

#### 3.2 Runtime view (Tips: https://docs.arc42.org/section-6/)
> The runtime view of Plapy shows how the system operates during execution. When a user enters a command in Discord, this triggers an event that is recognized by the bot. The bot processes the command and performs the corresponding action, such as playing a song or adding a song to the queue.

#### 3.3 Deployment view (Tips: https://docs.arc42.org/section-7/)
> The deployment view shows how Plapy is deployed on the servers. The bot runs on a server that is constantly communicating with the Discord API. The music database and playlists are stored on a separate database server.

#### 3.4 Concepts
> The architecture of Plapy is based on several key concepts. One of these is the event-driven model, which allows the bot to respond to user commands in real-time. Another important concept is the use of queues for managing music playback.

#### 3.5 Architecture decisions
> The decision for an event-driven architecture was made due to the requirements of Discord. This architecture allows Plapy to efficiently respond to user commands while taking into account the API rate limits of Discord.

#### 3.6 Quality
> The quality of the Plapy architecture is determined by various factors, including the response time of the bot, the accuracy of music search and playback, and the ability to handle multiple users and commands simultaneously.

#### 3.7 Risks and technical debt
> Some risks and technical debt in the Plapy architecture include the dependency on the Discord API and the need to manage the API rate limits. Additionally, managing music data and playlists can lead to technical debt if not handled efficiently.

