CREATE DATABASE TaskManagement;

CREATE TABLE Users(
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(100),
    user_password VARCHAR(255)
);

CREATE TABLE Tasks (
    task_id SERIAL PRIMARY KEY,
    title VARCHAR(100),
    task_description VARCHAR(255),
    is_complete BOOLEAN DEFAULT false,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);