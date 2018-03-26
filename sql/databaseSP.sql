
	-- All DB operations should be as Atomic as possible 
	-- to avoid race conditions!!!

	
USE game460;
select '...procedure definitions...' AS '';


select '...procedure create - addPlayer' AS '';
DROP PROCEDURE IF EXISTS addPlayer;
DELIMITER //
CREATE PROCEDURE addPlayer(IN player_name VARCHAR(16))
BEGIN
   INSERT INTO game_state(name) VALUES(player_name);
	SELECT * FROM game_state WHERE game_state.name = player_name;
END //
DELIMITER ;


-- select '...procedure create - deletePlayer' AS '';
-- DROP PROCEDURE IF EXISTS deletePlayer;
-- DELIMITER //
-- CREATE PROCEDURE deletePlayer(IN u_id INT UNSIGNED)
-- BEGIN
	-- TODO: Don't delete. Just set a field like 'status' to dead code.
   -- UPDATE game_state SET other_id = 0 WHERE game_state.other_id = u_id;
	-- DELETE FROM game_state WHERE game_state.id = u_id;
-- END //
-- DELIMITER ;


select '...procedure create - updatePosition' AS '';
DROP PROCEDURE IF EXISTS updatePosition;
DELIMITER //
CREATE PROCEDURE updatePosition(IN u_id INT UNSIGNED, x_new INT UNSIGNED, y_new INT UNSIGNED)
BEGIN
	-- TODO: set last_x/y to current, then update.
	UPDATE game_state SET x_pos = x_new, y_pos = y_new WHERE game_state.id = u_id;
	-- SELECT name, x_pos, y_pos FROM game_state WHERE game_state.status > 0;
END //
DELIMITER ;


select '...procedure create - getGameState' AS '';
DROP PROCEDURE IF EXISTS getGameState;
DELIMITER //
CREATE PROCEDURE getGameState(IN u_id INT UNSIGNED)
BEGIN
	SELECT name, x_pos, y_pos FROM game_state WHERE id > 0;
END //
DELIMITER ;


select '...procedure create - clearGameState' AS '';
DROP PROCEDURE IF EXISTS clearGameState;
DELIMITER //
CREATE PROCEDURE clearGameState(IN u_id INT UNSIGNED)
BEGIN
	DELETE FROM game_state WHERE game_state.id > 0;
END //
DELIMITER ;

-- select '...procedure create - validateForgotPassToken' AS '';
-- DROP PROCEDURE IF EXISTS validateForgotPassToken;
-- DELIMITER //
-- CREATE PROCEDURE validateForgotPassToken(IN user_id INT UNSIGNED, user_token VARCHAR(64), created BIGINT UNSIGNED)
-- BEGIN
	-- -- createForgotPassToken() ensures only one row per possible user.
	-- IF user_token = (SELECT token FROM forgot_pass_tokens WHERE user_id = forgot_pass_tokens.u_id and created = forgot_pass_tokens.created_milli)
	-- THEN
		-- -- further ensures only one row per user
		-- DELETE FROM forgot_pass_tokens WHERE user_id = forgot_pass_tokens.u_id;
	-- END IF;
-- END //
-- DELIMITER ;

-- select '...procedure create - changePassword' AS '';
-- DROP PROCEDURE IF EXISTS changePassword;
-- DELIMITER //
-- CREATE PROCEDURE changePassword(IN user_id INT UNSIGNED, pass VARCHAR(64))
-- BEGIN
   -- UPDATE users SET password = pass WHERE users.u_id = user_id;
	-- SELECT * FROM users WHERE users.u_id = user_id AND users.password = pass;
-- END //
-- DELIMITER ;

-- select '...procedure create - isUserInDatabase' AS '';
-- DROP PROCEDURE IF EXISTS isUserInDatabase;
-- DELIMITER //
-- CREATE PROCEDURE isUserInDatabase(IN u_email VARCHAR(64))
-- BEGIN
   -- SELECT * FROM users WHERE email = u_email;
-- END //
-- DELIMITER ;

-- select '...procedure create - addUser' AS '';
-- DROP PROCEDURE IF EXISTS addUser;
-- DELIMITER //
-- CREATE PROCEDURE addUser(IN pEmail VARCHAR(64), uPass VARCHAR(64), pUserInfo VARCHAR(64000))
-- BEGIN
   -- INSERT INTO users(email, password, user_info) VALUES(pEmail, uPass, pUserInfo); 
   -- SELECT * FROM users WHERE email = pEmail AND password = uPass;
-- END //
-- DELIMITER ;


-- select '...procedure create - getUserInfo ' AS '';
-- DROP PROCEDURE IF EXISTS getUserInfo;
-- DELIMITER //
-- CREATE PROCEDURE getUserInfo(IN user_id INT UNSIGNED)
-- BEGIN
   -- SELECT user_info FROM users WHERE users.u_id = user_id;
-- END //
-- DELIMITER ;


-- select '...procedure create - updateUserInfo ' AS '';
-- DROP PROCEDURE IF EXISTS updateUserInfo;
-- DELIMITER //
-- CREATE PROCEDURE updateUserInfo(IN user_id INT UNSIGNED, u_info VARCHAR(16384))
-- BEGIN
   -- UPDATE users SET user_info = u_info WHERE users.u_id = user_id;
-- END //
-- DELIMITER ;


-- select '...procedure create - getAllCounters' AS '';
-- DROP PROCEDURE IF EXISTS getAllCounters;
-- DELIMITER //
-- CREATE PROCEDURE getAllCounters(IN user_id INT UNSIGNED)
-- BEGIN
   -- SELECT email_response, resume_request, msg_or_call_from FROM users
	-- UNION
	-- SELECT email_response, resume_request, msg_or_call_from FROM contacts WHERE contacts.u_id = user_id;
-- END //
-- DELIMITER ;


-- select '...procedure create - updateGlobalCounters' AS '';
-- DROP PROCEDURE IF EXISTS updateGlobalCounters;
-- DELIMITER //
-- CREATE PROCEDURE updateGlobalCounters(IN user_id INT UNSIGNED, email_resp INT UNSIGNED, resume_req INT UNSIGNED, msgCall INT UNSIGNED)
-- BEGIN
	-- IF email_resp IS NOT NULL THEN
		-- UPDATE users SET email_response = email_resp WHERE user_id = users.u_id;
	-- END IF;
	-- IF resume_req IS NOT NULL THEN
		-- UPDATE users SET resume_request = resume_req WHERE user_id = users.u_id;
	-- END IF;
	-- IF msgCall IS NOT NULL THEN
		-- UPDATE users SET msg_or_call_from = msgCall WHERE user_id = users.u_id;
	-- END IF;
-- END //
-- DELIMITER ;


-- select '...procedure create - getAllContacts' AS '';
-- DROP PROCEDURE IF EXISTS getAllContacts;
-- DELIMITER //
-- CREATE PROCEDURE getAllContacts(IN user_id INT UNSIGNED)
-- BEGIN
   -- SELECT c_id, firstname, lastname, organization, created_milli, created, updated FROM contacts WHERE contacts.u_id = user_id;
-- END //
-- DELIMITER ;


-- select '...procedure create - getContactInfo' AS '';
-- DROP PROCEDURE IF EXISTS getContactInfo;
-- DELIMITER //
-- CREATE PROCEDURE getContactInfo(IN user_id INT UNSIGNED, cont_id INT UNSIGNED)
-- BEGIN
   -- SELECT * FROM contacts WHERE contacts.u_id = user_id and contacts.c_id = cont_id;
-- END //
-- DELIMITER ;


-- select '...procedure create - newContact' AS '';
-- DROP PROCEDURE IF EXISTS newContact;
-- DELIMITER //
-- CREATE PROCEDURE newContact(IN   user_id INT UNSIGNED,
											-- full_name VARCHAR(256),
											-- first_name VARCHAR(128),
											-- last_name VARCHAR(128),
											-- org VARCHAR(128),
											-- job VARCHAR(256),
											-- c_email VARCHAR(128),
											-- c_phone VARCHAR(64),
											-- linkedin VARCHAR(256),
											-- address VARCHAR(128),
											-- u_notes VARCHAR(16384),
											-- other VARCHAR(16384),
											-- created BIGINT UNSIGNED)
-- BEGIN
	-- INSERT INTO contacts(u_id, fullname, firstname, lastname, organization, position, email, phone, url_linkedin, mail_address, notes, other_info, created_milli)
	-- VALUES(user_id, full_name, first_name, last_name, org, job, c_email, c_phone, linkedin, address, u_notes, other, created);
	-- -- Ideally you'd return a new list of contacts that includes the new one. But we'll let the client request that explicitly.
-- END //
-- DELIMITER ;


-- select '...procedure create - deleteContact' AS '';
-- DROP PROCEDURE IF EXISTS deleteContact;
-- DELIMITER //
-- CREATE PROCEDURE deleteContact(IN user_id INT UNSIGNED, cont_id INT UNSIGNED)
-- BEGIN
	-- -- Must remove all items related to the contact (activities & iiscripts)
	-- DELETE FROM iiscripts WHERE iiscripts.u_id = user_id and iiscripts.c_id = cont_id;
	-- DELETE FROM activities WHERE activities.u_id = user_id and activities.c_id = cont_id;
   -- DELETE FROM contacts WHERE contacts.u_id = user_id and contacts.c_id = cont_id;
-- END //
-- DELIMITER ;


-- select '...procedure create - updateContact' AS '';
-- DROP PROCEDURE IF EXISTS updateContact;
-- DELIMITER //
-- CREATE PROCEDURE updateContact(IN   user_id INT UNSIGNED,
												-- c_id INT UNSIGNED,
												-- first_name VARCHAR(128),
												-- last_name VARCHAR(128),
												-- org VARCHAR(128),
												-- job VARCHAR(256),
												-- c_email VARCHAR(128),
												-- c_phone VARCHAR(64),
												-- linkedin VARCHAR(256),
												-- address VARCHAR(128),
												-- u_notes VARCHAR(16384),
												-- other VARCHAR(16384))
-- BEGIN
	-- IF first_name IS NOT NULL THEN
		-- UPDATE contacts SET firstname = first_name
		-- WHERE user_id = contacts.u_id and c_id = contacts.c_id;
	-- END IF;
	-- IF last_name IS NOT NULL THEN
		-- UPDATE contacts SET lastname = last_name
		-- WHERE user_id = contacts.u_id and c_id = contacts.c_id;
	-- END IF;
	-- IF org IS NOT NULL THEN
		-- UPDATE contacts SET organization = org
		-- WHERE user_id = contacts.u_id and c_id = contacts.c_id;
	-- END IF;
	-- IF job IS NOT NULL THEN
		-- UPDATE contacts SET position = job
		-- WHERE user_id = contacts.u_id and c_id = contacts.c_id;
	-- END IF;
	-- IF c_email IS NOT NULL THEN
		-- UPDATE contacts SET email = c_email
		-- WHERE user_id = contacts.u_id and c_id = contacts.c_id;
	-- END IF;
	-- IF c_phone IS NOT NULL THEN
		-- UPDATE contacts SET phone = c_phone
		-- WHERE user_id = contacts.u_id and c_id = contacts.c_id;
	-- END IF;
	-- IF linkedin IS NOT NULL THEN
		-- UPDATE contacts SET url_linkedin = linkedin
		-- WHERE user_id = contacts.u_id and c_id = contacts.c_id;
	-- END IF;
	-- IF address IS NOT NULL THEN
		-- UPDATE contacts SET mail_address = address
		-- WHERE user_id = contacts.u_id and c_id = contacts.c_id;
	-- END IF;
	-- IF u_notes IS NOT NULL THEN
		-- UPDATE contacts SET notes = u_notes
		-- WHERE user_id = contacts.u_id and c_id = contacts.c_id;
	-- END IF;
	-- IF other IS NOT NULL THEN
		-- UPDATE contacts SET other_info = other
		-- WHERE user_id = contacts.u_id and c_id = contacts.c_id;
	-- END IF;	
	
	
-- END //
-- DELIMITER ;


-- select '...procedure create - updateContactStats' AS '';
-- DROP PROCEDURE IF EXISTS updateContactStats;
-- DELIMITER //
-- CREATE PROCEDURE updateContactStats(IN user_id INT UNSIGNED, c_id INT UNSIGNED, email_resp INT UNSIGNED, resume_req INT UNSIGNED, msgCall INT UNSIGNED)
-- BEGIN
	-- IF email_resp IS NOT NULL THEN
		-- UPDATE contacts SET email_response = email_resp
		-- WHERE user_id = contacts.u_id and c_id = contacts.c_id;
	-- END IF;
	-- IF resume_req IS NOT NULL THEN
		-- UPDATE contacts SET resume_request = resume_req
		-- WHERE user_id = contacts.u_id and c_id = contacts.c_id;
	-- END IF;
	-- IF msgCall IS NOT NULL THEN
		-- UPDATE contacts SET msg_or_call_from = msgCall
		-- WHERE user_id = contacts.u_id and c_id = contacts.c_id;
	-- END IF;
-- END //
-- DELIMITER ;


-- select '...procedure create - getActivityTypes' AS '';
-- DROP PROCEDURE IF EXISTS getActivityTypes;
-- DELIMITER //
-- CREATE PROCEDURE getActivityTypes(IN user_id INT UNSIGNED)
-- BEGIN
   -- SELECT atype_id, activity_type FROM activity_types;
-- END //
-- DELIMITER ;


-- select '...procedure create - newActivity' AS '';
-- DROP PROCEDURE IF EXISTS newActivity;
-- DELIMITER //
-- CREATE PROCEDURE newActivity(IN	user_id INT UNSIGNED,
											-- contact_id INT UNSIGNED,
											-- act_type INT UNSIGNED,
											-- act_name VARCHAR(128),
											-- act_date BIGINT UNSIGNED,
											-- act_notes VARCHAR(4096),
											-- act_completed INT UNSIGNED,
											-- loc VARCHAR(128))
-- BEGIN
	-- IF contact_id IS NOT NULL 
	-- and user_id = (SELECT u_id FROM contacts WHERE contact_id = contacts.c_id)
	-- THEN
		-- INSERT INTO activities(u_id, c_id, atype_id, activity_name, event_date, notes, completed, location)
		-- VALUES(user_id, contact_id, act_type, act_name, act_date, act_notes, act_completed, loc);
	-- ELSE
		-- INSERT INTO activities(u_id, atype_id, activity_name, event_date, notes, completed, location)
		-- VALUES(user_id, act_type, act_name, act_date, act_notes, act_completed, loc);
	-- END IF;
-- END //
-- DELIMITER ;


-- select '...procedure create - updateActivity' AS '';
-- DROP PROCEDURE IF EXISTS updateActivity;
-- DELIMITER //
-- -- Can't change who it belongs to.
-- CREATE PROCEDURE updateActivity(IN	user_id INT UNSIGNED,
												-- act_id INT UNSIGNED,
												-- act_type INT UNSIGNED,
												-- act_name VARCHAR(128),
												-- act_date BIGINT UNSIGNED,
												-- act_notes VARCHAR(4096),
												-- act_completed INT UNSIGNED,
												-- loc VARCHAR(128))
-- BEGIN
	-- IF act_type IS NOT NULL THEN
		-- UPDATE activities SET atype_id = act_type
		-- WHERE user_id = activities.u_id and activities.a_id = act_id;
	-- END IF;
	-- IF act_name IS NOT NULL THEN
		-- UPDATE activities SET activity_name = act_name
		-- WHERE user_id = activities.u_id and activities.a_id = act_id;
	-- END IF;
	-- IF act_date IS NOT NULL THEN
		-- UPDATE activities SET event_date = act_date
		-- WHERE user_id = activities.u_id and activities.a_id = act_id;
	-- END IF;
	-- IF act_notes IS NOT NULL THEN
		-- UPDATE activities SET notes = act_notes
		-- WHERE user_id = activities.u_id and activities.a_id = act_id;
	-- END IF;
	-- IF act_completed IS NOT NULL THEN
		-- UPDATE activities SET completed = act_completed
		-- WHERE user_id = activities.u_id and activities.a_id = act_id;
	-- END IF;
	-- IF loc IS NOT NULL THEN
		-- UPDATE activities SET location = loc
		-- WHERE user_id = activities.u_id and activities.a_id = act_id;
	-- END IF;
-- END //
-- DELIMITER ;


-- select '...procedure create - deleteActivity' AS '';
-- DROP PROCEDURE IF EXISTS deleteActivity;
-- DELIMITER //
-- CREATE PROCEDURE deleteActivity(IN user_id INT UNSIGNED, act_id INT UNSIGNED)
-- BEGIN
   -- DELETE FROM activities WHERE activities.u_id = user_id and activities.a_id = act_id;
-- END //
-- DELIMITER ;


-- select '...procedure create - getAllActivities' AS '';
-- DROP PROCEDURE IF EXISTS getAllActivities;
-- DELIMITER //
-- CREATE PROCEDURE getAllActivities(IN user_id INT UNSIGNED)
-- BEGIN
   -- SELECT * FROM activities WHERE activities.u_id = user_id;
-- END //
-- DELIMITER ;


-- select '...procedure create - getContActs' AS '';
-- DROP PROCEDURE IF EXISTS getContActs;
-- DELIMITER //
-- CREATE PROCEDURE getContActs(IN user_id INT UNSIGNED, contact_id INT UNSIGNED)
-- BEGIN
   -- SELECT * FROM activities WHERE user_id = activities.u_id and contact_id = activities.c_id;
-- END //
-- DELIMITER ;


-- select '...procedure create - newIIscript' AS '';
-- DROP PROCEDURE IF EXISTS newIIscript;
-- DELIMITER //
-- CREATE PROCEDURE newIIscript(IN	user_id INT UNSIGNED, contact_id INT UNSIGNED, ii_text VARCHAR(16384))
-- BEGIN
	-- IF user_id = (SELECT u_id FROM contacts WHERE contact_id = contacts.c_id)
		-- THEN INSERT INTO iiscripts(u_id, c_id, text) VALUES(user_id, contact_id, ii_text);
	-- END IF;
-- END //
-- DELIMITER ;


-- select '...procedure create - getContactIIScripts' AS '';
-- DROP PROCEDURE IF EXISTS getContactIIScripts;
-- DELIMITER //
-- CREATE PROCEDURE getContactIIScripts(IN user_id INT UNSIGNED, contact_id INT UNSIGNED)
-- BEGIN
   -- SELECT ii_id, c_id, text, created FROM iiscripts WHERE iiscripts.u_id = user_id and iiscripts.c_id = contact_id ;
-- END //
-- DELIMITER ;


-- select '...procedure create - updateIIscript' AS '';
-- DROP PROCEDURE IF EXISTS updateIIscript;
-- DELIMITER //
-- CREATE PROCEDURE updateIIscript(IN user_id INT UNSIGNED, iiscript_id INT UNSIGNED, contact_id INT UNSIGNED, ii_text VARCHAR(16384))
-- BEGIN
	-- -- ensure user can only modify iiscripts related to his own contacts
	-- -- IF user_id = (SELECT u_id FROM iiscripts WHERE contact_id = iiscripts.c_id and iiscript_id = iiscripts.ii_id)
		-- -- THEN UPDATE iiscripts SET text = ii_text WHERE contact_id = iiscripts.c_id and iiscript_id = iiscripts.ii_id;
	-- -- END IF;
	-- UPDATE iiscripts SET text = ii_text WHERE iiscripts.u_id  = user_id and 
															-- iiscripts.c_id  = contact_id and 
															-- iiscripts.ii_id = iiscript_id;
-- END //
-- DELIMITER ;


-- select '...procedure create - deleteIIscript' AS '';
-- DROP PROCEDURE IF EXISTS deleteIIscript;
-- DELIMITER //
-- CREATE PROCEDURE deleteIIscript(IN user_id INT UNSIGNED, iiscript_id INT UNSIGNED, contact_id INT UNSIGNED)
-- BEGIN
   -- DELETE FROM iiscripts WHERE	iiscripts.u_id = user_id and 
											-- iiscripts.ii_id = iiscript_id and 
											-- iiscripts.c_id = contact_id;
-- END //
-- DELIMITER ;


-- select '...procedure create - newIIscriptQ' AS '';
-- DROP PROCEDURE IF EXISTS newIIscriptQ;
-- DELIMITER //
-- CREATE PROCEDURE newIIscriptQ(IN	user_id INT UNSIGNED, iiq_text VARCHAR(2048))
-- BEGIN
	-- INSERT INTO user_iiscript_Qs(u_id, text) VALUES(user_id, iiq_text);
-- END //
-- DELIMITER ;


-- select '...procedure create - deleteIIScriptQ' AS '';
-- DROP PROCEDURE IF EXISTS deleteIIScriptQ;
-- DELIMITER //
-- CREATE PROCEDURE deleteIIScriptQ(IN	user_id INT UNSIGNED, question_id INT UNSIGNED)
-- BEGIN
	-- -- std_iiscript_Qs.q_id is 0 by default. THese cannot be deleted by users.
	-- IF question_id > 0 THEN
		-- DELETE FROM user_iiscript_Qs WHERE user_iiscript_Qs.u_id = user_id and user_iiscript_Qs.q_id = question_id;
	-- END IF;
-- END //
-- DELIMITER ;


-- select '...procedure create - getIIscriptQs' AS '';
-- DROP PROCEDURE IF EXISTS getIIscriptQs;
-- DELIMITER //
-- CREATE PROCEDURE getIIscriptQs(IN user_id INT UNSIGNED)
-- BEGIN
   -- SELECT q_id, text FROM std_iiscript_Qs
	-- UNION
	-- SELECT q_id, text FROM user_iiscript_Qs WHERE user_iiscript_Qs.u_id = user_id;
-- END //
-- DELIMITER ;

