-- Create the Song table
CREATE TABLE Song (
                      id SERIAL PRIMARY KEY,
                      name VARCHAR(255) NOT NULL,
                      url VARCHAR(255) NOT NULL,
                      length INT NOT NULL
);

-- Create the Playlist table
CREATE TABLE Playlist (
                          id SERIAL PRIMARY KEY,
                          name VARCHAR(255) NOT NULL,
                          description TEXT,
                          songs INT[],
                          FOREIGN KEY (songs) REFERENCES Song

);
