# Project Name
## Software Requirements Specification
> This template is a simplified version based on the documentation templates from IBM Rational Unified Process (RUP).
### 1. Introduction
#### 1.1 Overview
> Plapy is a music Bot used for playing Youtube or Soundcloud Videos as mp3 over Discord. It supports a lot of additional features to save, automatically create and modify custom playlists.
#### 1.2 Scope
> Thius Document gives a short summary  on why and how to use Plapy. Technichal Information about how to program and install Plapy are described in the Readme.md file

### 2. Functional requirements
>  A computer, tablet or smartphone or any simular device capable of running the discord Application
> A server where you have andministrator permissions to invite the Bot

#### 2.1 Overview 
> The Bot works, once invited to the server, with a simple call and response principle. There are Bot commands that start with a "/" and are followed by a command (for example /add) and a shown number of parameters. These Commands are seen when either typing /help or just typing "/" and using the discord autocomplete feature. Alternatively, you can view the bots description on discord for a whole overview of all commands.

#### 2.2 Playlist Manager
> Specify this feature / use case by:
> - Relevant **user stories (their links or labels)**
> - **UI mockups**
The user can add the currently playing song to a Playlist with the /add command
![image](https://github.com/SE-TINF22B6/Plapy/assets/81536709/10ea1a59-1a24-4241-93cc-2c34bfa0d8e0)
The bot then responds with the songs that are in the playlist
![image](https://github.com/SE-TINF22B6/Plapy/assets/81536709/0bfdb307-7eba-4a25-9c35-ef68785e5cec)
It is also possible to add a song via search to the playlist
![image](https://github.com/SE-TINF22B6/Plapy/assets/81536709/affb2cc7-f47e-4c7a-bbba-e87c2a0384af)

The user can load a playlist with a multiselect 
![image](https://github.com/SE-TINF22B6/Plapy/assets/81536709/599ae2a2-8bc6-4247-ab83-8bf361a7bdd7)
The bot responds with all playlists saved to the server
![image](https://github.com/SE-TINF22B6/Plapy/assets/81536709/640c9913-89f2-431d-9d11-b848ab0f95ca)



> - **UML behavior diagrams** and necessary text specification
> - **Preconditions**. *A precondition of a use case is the state of the system that must be present prior to a use case being performed.*
> - Postconditions. *A postcondition of a use case is a list of possible states the system can be in immediately after a use case has finished.*
> - **Estimated efforts (high, medium, low)**


#### 2.3 Name of Feature 2 / Use Case 2
... ...

### 3. Nonfunctional requirements

> [!IMPORTANT]  
> It is not necessary to cover all of the following categories, but focus on what your project will implement.  
> If some nonfunctional requirements are described as user stories in your backlog, add their **links** in this section, or any information to guide the reader find them in your backlog, such as a **label** of those relevant user stories.

> Categories: Usability, Reliability, Performance, Efficiency, Integrity, Maintainability, Flexibility, Testability, Reusability, Security.  


### 4. Technical constraints
> Specify any major constraints, assumptions or dependencies, e.g., any restrictions about which type of server to use, which type of open source license must be complied, etc. 
