CREATE DATABASE IF NOT EXISTS sport;

USE sport;

CREATE TABLE team(
    id INT key AUTO_INCREMENT,
    team VARCHAR(255),
    city VARCHAR(255),
    conf VARCHAR(20)
);

CREATE TABLE user(
    id VARCHAR(255) key,
    pass VARCHAR(255)
);

INSERT INTO team (team, city, conf)
VALUES 
('Hawks','Atlanta','East'),
('Celtics','Boston','East'),
('Nets','Brooklyn','East'),
('Hornets','Charlotte','East'),
('Bulls','Chicago','East'),
('Cavaliers','Cleveland','East'),
('Mavericks','Dallas','West'),
('Nuggets','Denver','West'),
('Pistons','Detriot','East'),
('Warriors','Golden State','West'),
('Rockets','Houston','West'),
('Pacers','Indiana','East'),
('Clippers','LA','West'),
('Lakers','LA','West'),
('Grizzlies','Memphis','West'),
('Heat','Miami','East'),
('Bucks','Milwakee','East'),
('Timberwolves','Minnesota','West'),
('Pelicans','New Orleans','West'),
('Knicks','New York','East'),
('Thunder','Oklahoma City','West'),
('Magic','Orlando','East'),
('76ers','Philadelphia','East'),
('Suns','Pheonix','West'),
('Trail Blazers','Portland','West'),
('Kings','Sacramento','West');

INSERT INTO user (id, pass)
VALUES
('user','password');