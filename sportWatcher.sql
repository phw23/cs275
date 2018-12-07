CREATE DATABASE IF NOT EXISTS sport;

USE sport;

CREATE TABLE team(
    id INT PRIMARY KEY AUTO_INCREMENT,
    team VARCHAR(255),
    city VARCHAR(255),
    conf VARCHAR(20),
    api VARCHAR(255)
);

CREATE TABLE user(
    id VARCHAR(255) PRIMARY KEY,
    pass VARCHAR(255)
);

CREATE TABLE user_team(
    user_id VARCHAR(255),
    team_id INT
);

ALTER TABLE user_team
ADD CONSTRAINT FK_userteam
FOREIGN KEY (user_id) REFERENCES user(id);

ALTER TABLE user_team
ADD CONSTRAINT FK_teamuser
FOREIGN KEY (team_id) REFERENCES team(id);

INSERT INTO team (team, city, conf, api)
VALUES 
('Hawks','Atlanta','East','583ecb8f-fb46-11e1-82cb-f4ce4684ea4c'),
('Celtics','Boston','East','583eccfa-fb46-11e1-82cb-f4ce4684ea4c'),
('Nets','Brooklyn','East','583ec9d6-fb46-11e1-82cb-f4ce4684ea4c'),
('Hornets','Charlotte','East','583ec97e-fb46-11e1-82cb-f4ce4684ea4c'),
('Bulls','Chicago','East','583ec5fd-fb46-11e1-82cb-f4ce4684ea4c'),
('Cavaliers','Cleveland','East','583ec773-fb46-11e1-82cb-f4ce4684ea4c'),
('Mavericks','Dallas','West','583ecf50-fb46-11e1-82cb-f4ce4684ea4c'),
('Nuggets','Denver','West','583ed102-fb46-11e1-82cb-f4ce4684ea4c'),
('Pistons','Detriot','East','583ec928-fb46-11e1-82cb-f4ce4684ea4c'),
('Warriors','Golden State','West','583ec825-fb46-11e1-82cb-f4ce4684ea4c'),
('Rockets','Houston','West','583ecb3a-fb46-11e1-82cb-f4ce4684ea4c'),
('Pacers','Indiana','East','583ec7cd-fb46-11e1-82cb-f4ce4684ea4c'),
('Clippers','LA','West','583ecdfb-fb46-11e1-82cb-f4ce4684ea4c'),
('Lakers','LA','West','583ecae2-fb46-11e1-82cb-f4ce4684ea4c'),
('Grizzlies','Memphis','West','583eca88-fb46-11e1-82cb-f4ce4684ea4c'),
('Heat','Miami','East','583ecea6-fb46-11e1-82cb-f4ce4684ea4c'),
('Bucks','Milwakee','East','583ecefd-fb46-11e1-82cb-f4ce4684ea4c'),
('Timberwolves','Minnesota','West','583eca2f-fb46-11e1-82cb-f4ce4684ea4c'),
('Pelicans','New Orleans','West','583ecc9a-fb46-11e1-82cb-f4ce4684ea4c'),
('Knicks','New York','East','583ec70e-fb46-11e1-82cb-f4ce4684ea4c'),
('Thunder','Oklahoma City','West','583ecfff-fb46-11e1-82cb-f4ce4684ea4c'),
('Magic','Orlando','East','583ed157-fb46-11e1-82cb-f4ce4684ea4c'),
('76ers','Philadelphia','East','583ec87d-fb46-11e1-82cb-f4ce4684ea4c'),
('Suns','Pheonix','West','583ecfa8-fb46-11e1-82cb-f4ce4684ea4c'),
('Trail Blazers','Portland','West','583ed056-fb46-11e1-82cb-f4ce4684ea4c'),
('Kings','Sacramento','West','583ed0ac-fb46-11e1-82cb-f4ce4684ea4c'),
('Raptors','Toronto','East','583ecda6-fb46-11e1-82cb-f4ce4684ea4c'),
('Wizards','Washington','East','583ec8d4-fb46-11e1-82cb-f4ce4684ea4c'),
('Spurs','San Antonio','West','583ecd4f-fb46-11e1-82cb-f4ce4684ea4c'),
('Jazz','Utah','West','583ece50-fb46-11e1-82cb-f4ce4684ea4c');

INSERT INTO user (id, pass)
VALUES
('user','password');

