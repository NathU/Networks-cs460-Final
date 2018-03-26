USE syndeo_db;

-- Static Content
INSERT INTO activity_types(activity_type) VALUES("Send Email");
INSERT INTO activity_types(activity_type) VALUES("Informational Interview");
INSERT INTO activity_types(activity_type) VALUES("Phone Call");
INSERT INTO activity_types(activity_type) VALUES("Meeting");
INSERT INTO activity_types(activity_type) VALUES("Interview");
INSERT INTO activity_types(activity_type) VALUES("Other");

INSERT INTO std_iiscript_Qs(text) VALUES("Have you ever murdered someone?");
INSERT INTO std_iiscript_Qs(text) VALUES("How many people have you murdered?");
INSERT INTO std_iiscript_Qs(text) VALUES("Will you please not murder me?");

INSERT INTO modules(module_name, module_number, module_content) VALUES("Doing Things Non-Badly", 1, "Lorem Ipsum Doodle Diddle Dee.");
INSERT INTO modules(module_name, module_number, module_content) VALUES("Doing Things Okayly", 2, "Lorem Ipsum Doodle Diddle Dee.");
INSERT INTO modules(module_name, module_number, module_content) VALUES("Doing Things Goodly", 3, "Lorem Ipsum Doodle Diddle Dee.");
INSERT INTO modules(module_name, module_number, module_content) VALUES("Doing Things Betterly", 4, "Lorem Ipsum Doodle Diddle Dee.");
INSERT INTO modules(module_name, module_number, module_content) VALUES("Doing Things Bestly", 5, "Lorem Ipsum Doodle Diddle Dee.");

-- Test User Content
CALL addUser("nathanulmer@gmail.com", "asdf", "{\"firstname\":\"Nathan\", \"lastname\":\"Ulmer\"}");

CALL newContact(1, "Zoe Barton", "Zoe", "Barton", "Walmart", "Recruiter", NULL, NULL, NULL, NULL, NULL, NULL, NULL);
CALL newContact(1, "Bill Smarterman", "Bill", "Smarterman", "Walmart", "Developer", NULL, NULL, NULL, NULL, NULL, NULL, NULL);
CALL newContact(1, "Mr. J J", "Mr. J", "J", "Walmart", "Bossman", NULL, NULL, NULL, NULL, NULL, NULL, NULL);

CALL newActivity(1, 1, 3, "Hangin Out", 1000000, "notes about this meeting.....", 0);
CALL newActivity(1, 2, 1, "Bizznass", 1000002, "gonna crush this", 0);
CALL newActivity(1, 2, 2, "Mo Bizznass", 1000003, "dont hurt my chiuaua!", 0);

CALL newIIscript(1, 2, "This could\nBe one flipping\nHuge blob of text.\nBut its\nNot.");

