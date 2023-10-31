# Project Name
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


#### 2.2 Playlist Manager
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

> - **UML behavior diagrams** and necessary text specification
>
> - ![myImage-2](https://github.com/SE-TINF22B6/Plapy/assets/57218126/2d1702e8-9c68-4f6f-a32d-fbb7387214ca)

> - **Preconditions**
> - Functional Database
> - Interet Access
> - Discord Account
> - Postconditions
> - PLaylist loaded succesfully
> - Song added to Playlist
> - **Estimated efforts high**

### 3. Nonfunctional requirements
> Performance: Do not Share your Bots invite Link public. If the Bot joins too many servers, the performance of your Bot might suffer
> Security: Never push Database Access Files to the Server, but always insert push database access directly to the server. Otherwise, anyone with access to your Repository can modify your Database


### 4. Technical constraints
> node.js version 16.11.0 or higher