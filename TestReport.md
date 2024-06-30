# Plapy
## Test Report

### 1. Introduction
> Since we have two parts that need to work flawlessly togehter, we need a comprehensive testing environment to ensure our software is working correctly

### 2. Test Strategy
> Since a lot of things are not or only very difficultly testable, we need to rely on a lot of frameworks working correctly. 
> Then, we can use Mocks to test the parts that we can actually test correctly

### 3. Test Plan
> There are two majopr parts that need to be tested: The API and also the MusicQueue and its interactions with the savedPlaylist. 
> For that purpose, we created a database mock that gives us Playlists and a Mock for our MusicQueue, so we can execute commands with our Playlist on the MusicQueue
> For the API, we need to ensure it keeps working correctly for almost any possible input.


### 4. Test Cases
> Test Cases for MusicQueue:
  Try to add Song to MusicQueue with no MusicQueue existend -> expected Result: a new Queue should be created and the song added. Passed
  Try to add a Song to an already existing Queue -> expected Result: Song is added, Queue is one longer. Passed
  Try to add song to a playlist that does not exist. -> expected Result: New Playlist created. Passed
  Try to create a new Playlist with a name that already exists. -> Expected Result: Error with message informing that the playlist exists. Passed
  Try to access a Playlist that exists. -> Ecpected Result: Playlist can be accessed. Passed
  Try to Access a Playlist that doesnt exits -> Expected Result: Error with message informing that the playlist is Invalid. Passed
  Try to Access a Playlist on a different Server -> Expected Result: Error with message informing that the playlist is Invalid (User should not know that the playlist exists, but on another server). Passed
  For API Testing Report please see [Api Test Report](https://github.com/SE-TINF22B6/Plapy/blob/master/API%20Testing%20Report.pdf)

### 5. Test Results 
> At our latest state, all tests passed without issue. The Test with trying to add sth to the non-existing MusicQueue sometimes makes trouble, because the MusicQueue by Discord.JS is not supposed to be created like we do in our test, so we decided to use a Mock instead. 

### 6. Metrics
> Since a lot of things are not testable beacuse of Discord.js's Blackboxed System, we dontb have a very high automated test coverage in our Project. Because of this, we rely on active testing and a very good supporting Community that notifies us if something doenst work.

### 7. Recommendations
> If Discord.js releases a way to create or even mock their structures forn testing purposes, we can enable a lot of automated tests that are currently impossible to do. For example, we cant test any command working correctly, because for this, we would need to create a discord message and this message cant even be mocked as its only constructor is a 600 args constructor that manages all of int usages.

### 8. Conclusion
> The cases that can be tested are tested very deep and work very good.
>  We still need to rely on a lot of third party services to do their job correctly as if they dont, we can only notice by seeing our bot not working correctly.
> However, this is probably still the best that can be archived.

