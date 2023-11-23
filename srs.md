# Plapy
## Software Requirements Specification
> This template is a simplified version based on the documentation templates from IBM Rational Unified Process (RUP).
### 1. Introduction
#### 1.1 Overview
> Plapy is a music Bot used for playing Youtube or Soundcloud Videos as mp3 over Discord. It supports a lot of additional features to save, automatically create and modify custom playlists.
#### 1.2 Scope
> This Document gives a short summary on why and how to use the Plapy specific features. The base functionality of the music bot Plapy is based on will not be documented. Technichal Information about how to program and install Plapy are described in the [README.md](README.md) file
#### 1.3 Definitions, Acronyms and Abbreviations
> - Plapy: Name of the Discord Bot
> - Node.js: A serverside javascript framework
> - Typescript: The programming languge used to write Plapy. Compliles to JavaScript
> - Disord: A social platform with voice chat and messaging capabilities

### 2. Functional requirements
> A computer, tablet or smartphone or any simular device capable of running the discord Application
> A server where you have andministrator permissions to invite the Bot

#### 2.1 Overview 
> The Bot works, once invited to the server, with a simple call and response principle. There are Bot commands that start with a "/" and are followed by a command (for example /add) and a shown number of parameters. These Commands are seen when either typing /help or just typing "/" and using the discord autocomplete feature. Alternatively, you can view the bots description on discord for a whole overview of all commands.

#### 2.2 Use Cases

##### 2.2.1 Playlist Manager
> Specify this feature / use case by:
> - Relevant **user stories (their links or labels)**
> - https://github.com/SE-TINF22B6/Plapy/issues/26
> - **UI mockups** \
The user can add the currently playing song to a Playlist with the /add command \
![image](https://github.com/SE-TINF22B6/Plapy/assets/81536709/10ea1a59-1a24-4241-93cc-2c34bfa0d8e0) \
The bot then responds with the songs that are in the playlist \
![image](https://github.com/SE-TINF22B6/Plapy/assets/81536709/0bfdb307-7eba-4a25-9c35-ef68785e5cec) \
It is also possible to add a song via search to the playlist\
![image](https://github.com/SE-TINF22B6/Plapy/assets/81536709/affb2cc7-f47e-4c7a-bbba-e87c2a0384af) \
The user can load a playlist with a multiselect \
![image](https://github.com/SE-TINF22B6/Plapy/assets/81536709/599ae2a2-8bc6-4247-ab83-8bf361a7bdd7) \
The bot responds with all playlists saved to the server \
![image](https://github.com/SE-TINF22B6/Plapy/assets/81536709/640c9913-89f2-431d-9d11-b848ab0f95ca) \

> - **UML use case diagram**
>
> - ![Use case diagram](https://github.com/SE-TINF22B6/Plapy/assets/75337582/d62fc703-42b9-4298-a953-926ae13ccca5)


> - **Preconditions**
> - Functional Database
> - Interet Access
> - Discord Account
> - Postconditions
> - PLaylist loaded succesfully
> - Song added to Playlist
> - **Estimated efforts high**

##### 2.2.2 "/play"-command
> Specify this feature / use case by:
> - Relevant **user stories (their links or labels)**
> - https://github.com/SE-TINF22B6/Plapy/issues/35
> - **UI mockups** \
Play normal Song:

![Play_UI](https://github.com/SE-TINF22B6/Plapy/assets/123726628/44538b7f-ccde-4e76-a1f8-3402ba847ac8)
Play a Playlist:

![Playlist_UI](https://github.com/SE-TINF22B6/Plapy/assets/123726628/66ee50b4-8d47-4c24-a372-ff49af4463db)
> - **UML behavior diagrams** and necessary text specification
![play (8) drawio (2)](https://github.com/SE-TINF22B6/Plapy/assets/123726628/e01eb43a-bf24-4eb4-ba2e-79c19131df3f)

##### 2.2.3 "/add"-command
> Specify this feature / use case by:
> - Relevant **user stories (their links or labels)**
> - https://github.com/SE-TINF22B6/Plapy/issues/7
> - https://github.com/SE-TINF22B6/Plapy/issues/46
> - **UI mockups** \
![add_UI](https://github.com/SE-TINF22B6/Plapy/assets/123726628/623ed087-c987-4054-a98f-82db12d82389)

> - **UML behavior diagrams** and necessary text specification
![add drawio (2)](https://github.com/SE-TINF22B6/Plapy/assets/123726628/75acd187-819a-406d-ba44-f11756706a99)

##### 2.2.4 "/radio"-command
> Specify this feature / use case by:
> - Relevant **user stories (their links or labels)**
> - https://github.com/SE-TINF22B6/Plapy/issues/21
> - https://github.com/SE-TINF22B6/Plapy/issues/34
> - **UI mockups** \
![radio_UI](https://github.com/SE-TINF22B6/Plapy/assets/123726628/554c81d1-6aab-4042-b50a-5aede7088f35)

> - **UML behavior diagrams** and necessary text specification
![radio drawio (2)](https://github.com/SE-TINF22B6/Plapy/assets/123726628/6e0e0f7e-ed2d-4f30-800f-495150204488)


#### 2.3 Communication with other Software
##### 2.3.1 Communication with discord API
![Sequenzdiagramm_Bot-login drawio](https://github.com/SE-TINF22B6/Plapy/assets/123726628/1ba93f8e-1469-4b4a-b5c4-e673f294a700)


### 3. Nonfunctional requirements

|Who |Event |Influence |Condition |Action | Measurement |
|- |- |- |- |- | - |
|Discord API | Ping to API | System | Runtime | Response from API | Max latency of 300ms|
|Developer | Design a new command |Design |Design time | Design a new command to the bot | In 3 hour | 
|Developer | Add a new command |Code |Developement | Add a new command to the bot | In 1 hour | 
|Developer | Implement command |Code |Developement | Implement the command functionlity | In 8 hours |
|Developer | Create Pull Request |Code |Developement | Merge PR | Reviewed in <24h |
|User |Use /play |System |Normal Operation | Song is played | Avg. wait time until playback < 1s |
|User |Use /help |System |Normal Operation | Help for commands | help covers 100% of commands |
|User |Use Plapy API |System |Normal Operation | API respondes | Max latency 300ms |
|User | Sets up local Plapy install |Setup |Own System | Plapy is functional | Setup time <2h (If using documentation)|

> Performance: Do not Share your Bots invite Link public. If the Bot joins too many servers, the performance of your Bot might suffer
> Security: Never push Database Access Files to the Server, but always insert push database access directly to the server. Otherwise, anyone with access to your Repository can modify your Database


### 4. Technical constraints
> node.js version 16.11.0 or higher


