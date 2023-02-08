DELIMITER //

CREATE FUNCTION BIN_TO_UUID(b BINARY(16))
RETURNS CHAR(36)
BEGIN
   DECLARE hexStr CHAR(32);
   SET hexStr = HEX(b);
   RETURN LOWER(CONCAT(
        SUBSTR(hexStr, 1, 8), '-',
        SUBSTR(hexStr, 9, 4), '-',
        SUBSTR(hexStr, 13, 4), '-',
        SUBSTR(hexStr, 17, 4), '-',
        SUBSTR(hexStr, 21)
    ));
END//

CREATE FUNCTION UUID_TO_BIN(uuid CHAR(36))
RETURNS BINARY(16)
BEGIN
    RETURN UNHEX(REPLACE(uuid, '-', ''));
END//

DELIMITER ;
INSERT MeatButType VALUES(UUID_TO_BIN(UUID()), "肉まん", 100, CAST("5000" AS TIME), "とても肉汁がすばらしくジューシーで，食べ応えのある素晴らしい肉まん!", NULL, CAST(NOW() AS DATETIME), CAST(NOW() AS DATETIME));
INSERT MeatButType VALUES(UUID_TO_BIN(UUID()), "抹茶まん", 140, CAST("5000" AS TIME), "甘々ベーキング", NULL, CAST(NOW() AS DATETIME), CAST(NOW() AS DATETIME));
INSERT MeatButType VALUES(UUID_TO_BIN(UUID()), "ピザまん", 120, CAST("5000" AS TIME), "人気", NULL, CAST(NOW() AS DATETIME), CAST(NOW() AS DATETIME));
INSERT MeatButType VALUES(UUID_TO_BIN(UUID()), "あんまん", 100, CAST("5000" AS TIME), "元気100倍", NULL, CAST(NOW() AS DATETIME), CAST(NOW() AS DATETIME));
INSERT MeatButType VALUES(UUID_TO_BIN(UUID()), "黒豚まん", 200, CAST("5000" AS TIME), "高いよ", NULL, CAST(NOW() AS DATETIME), CAST(NOW() AS DATETIME));
INSERT MeatButType VALUES(UUID_TO_BIN(UUID()), "テストまん", 200, CAST("0100" AS TIME), "1分で出来ます", NULL, CAST(NOW() AS DATETIME), CAST(NOW() AS DATETIME));
SELECT BIN_TO_UUID(ID) AS ID, Name, Price, Time, Description, ImageSrc, CreateTime, UpdateTime FROM MeatButType;