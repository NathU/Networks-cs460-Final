-- what's your MySQL username and password? Fill out in the <>'s below...
CREATE DATABASE IF NOT EXISTS game460;
USE game460;
GRANT EXECUTE ON game460.* TO '<username>'@'localhost' IDENTIFIED BY '<password>';

-- There's just one table in our DB for this silly little game.
DROP TABLE IF EXISTS game_state;
CREATE TABLE IF NOT EXISTS game_state(
	id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
	name VARCHAR(32) DEFAULT "Phil", 
	status INT UNSIGNED DEFAULT 1,
	x_pos INT UNSIGNED DEFAULT 1,
	y_pos INT UNSIGNED DEFAULT 1,
	last_x INT UNSIGNED DEFAULT 0,
	last_y INT UNSIGNED DEFAULT 0,
	action INT UNSIGNED DEFAULT 0,
	other_id INT UNSIGNED DEFAULT 0,
	CONSTRAINT unique_id UNIQUE(id),
	CONSTRAINT unique_name UNIQUE(name)
);