CREATE TABLE users(
    user_id INTEGER GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1) NOT NULL,
    username VARCHAR2(100) UNIQUE NOT NULL,
    email VARCHAR2(100) UNIQUE NOT NULL,
    password VARCHAR2(100) NOT NULL,
    isAdmin NUMBER(1,0) NOT NULL
    CONSTRAINT PK_User PRIMARY KEY (user_id)
);
CREATE TABLE history(
    user_id INTEGER NOT NULL,
    history_date date DEFAULT SYSDATE NOT NULL,
    action VARCHAR2(10) NOT NULL,
    history_data VARCHAR2(4000) NOT NULL,
    CONSTRAINT FK_History FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
)
CREATE TABLE plans(
    id INTEGER GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1) NOT NULL,
    plan_version INT DEFAULT 0 NOT NULL,
    code_rlp VARCHAR2(4) UNIQUE NOT NULL,
    ordre_jour INT NOT NULL,
    ordre_lecture_paquet INT UNIQUE NOT NULL,
    tournée_debut VARCHAR2(9) UNIQUE NOT NULL,
    tournée_fin VARCHAR2(9) UNIQUE NOT NULL,
    PRIMARY KEY (id)
)
INSERT INTO users (username,email,password,isAdmin) VALUES ('admin','admin@gmail.com',1234,1)