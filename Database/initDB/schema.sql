-- Create the Song table
CREATE TABLE Song (
                      id SERIAL PRIMARY KEY,
                      name VARCHAR(255) NOT NULL,
                      url VARCHAR(255) NOT NULL,
                      length INT NOT NULL
);


CREATE TABLE Playlist (
                          id SERIAL PRIMARY KEY,
                          name VARCHAR(255) NOT NULL,
                          description TEXT
);

CREATE TABLE Playlist_Song (
                               song_id INTEGER NOT NULL,
                               playlist_id INTEGER NOT NULL,
                               FOREIGN KEY (song_id) REFERENCES Song(id),
                               FOREIGN KEY (playlist_id) REFERENCES Playlist(id)
);

