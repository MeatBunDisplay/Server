DROP DATABASE IF EXISTS MeatButDB;
CREATE DATABASE MeatButDB;
ALTER DATABASE MeatButDB CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE MeatButDB;

CREATE TABLE MeatButType(
	ID BINARY(16) PRIMARY KEY,
	Name VARCHAR(256) NOT NULL,
	Price INTEGER NOT NULL,
	Time TIME NOT NULL,
	Description VARCHAR(256),
	ImageSrc VARCHAR(256),
    Priority INTEGER,
	CreateTime DATETIME NOT NULL,
	UpdateTime DATETIME NOT NULL
);

CREATE TABLE PlaceData(
	PlaceID INTEGER PRIMARY KEY,
	Type BINARY(16),
	FOREIGN KEY (Type) REFERENCES MeatButType (ID) ON DELETE RESTRICT ON UPDATE RESTRICT
);

CREATE TABLE MeatBut(
	ID BINARY(16), 
	Type BINARY(16),
    Number INTEGER,
	Layer INTEGER,
	StartTime DATETIME NOT NULL,
	EndTime DATETIME NOT NULL,
	FOREIGN KEY (Type) REFERENCES MeatButType (ID) ON DELETE RESTRICT ON UPDATE RESTRICT,
	FOREIGN KEY (Layer) REFERENCES PlaceData (PlaceID) ON DELETE RESTRICT ON UPDATE RESTRICT
);

INSERT PlaceData VALUES (0, NULL);
INSERT PlaceData VALUES (1, NULL);
INSERT PlaceData VALUES (2, NULL);
INSERT PlaceData VALUES (3, NULL);
INSERT PlaceData VALUES (4, NULL);
INSERT PlaceData VALUES (5, NULL);
INSERT PlaceData VALUES (6, NULL);
INSERT PlaceData VALUES (7, NULL);
INSERT PlaceData VALUES (8, NULL);
INSERT PlaceData VALUES (9, NULL);