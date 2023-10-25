# Project Name
## Software Requirements Specification
> This template is a simplified version based on the documentation templates from IBM Rational Unified Process (RUP).
### 1. Introduction
#### 1.1 Overview
> Plapy is a music Bot used for playing Youtube or Soundcloud Videos as mp3 over Discord. It supports a lot of additional features to save, automatically create and modify custom playlists.
#### 1.2 Scope
> This Document gives a short summary  on why and how to use Plapy. Technichal Information about how to program and install Plapy are described in the Readme.md file

### 2. Functional requirements
>  A computer, tablet or smartphone or any simular device capable of running the discord Application
> A server where you have andministrator permissions to invite the Bot

#### 2.1 Overview 
> The Bot works, once invited to the server, with a simple call and response principle. There are Bot commands that start with a "/" and are followed by a command (for example /add) and a shown number of parameters. These Commands are seen when either typing /help or just typing "/" and using the discord autocomplete feature. Alternatively, you can view the bots description on discord for a whole overview of all commands.

#### 2.2 Name of Feature 1 / Use Case 1
> Specify this feature / use case by:
> - Relevant **user stories (their links or labels)**
> - **UI mockups**
> - **UML behavior diagrams** and necessary text specification
> - **Preconditions**. *A precondition of a use case is the state of the system that must be present prior to a use case being performed.*
> - Postconditions. *A postcondition of a use case is a list of possible states the system can be in immediately after a use case has finished.*
> - **Estimated efforts (high, medium, low)**


#### 2.3 Name of Feature 2 / Use Case 2
... ...

### 3. Nonfunctional requirements

> Performance: Do not Share your Bots invite Link public. If the Bot joins too many servers, the performance of your Bot might suffer
> Security: Never push Database Access Files to the Server, but always insert push database access directly to the server. Otherwise, anyone with access to your Repository can modify your Database


### 4. Technical constraints
> node.js version 9.5.1 or higher
> A server capable of running on at least 8GB ram (less might cause problems with the /radio command due to timeout with the YouTube Api - rest should still work with less)
