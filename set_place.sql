UPDATE PlaceData SET Type=UUID_TO_BIN('9fc1ac38-8b7f-11ed-a7c9-b025aa3cb740') WHERE PlaceID=0 OR PlaceID=1;
UPDATE PlaceData SET Type=UUID_TO_BIN('9fc2018d-8b7f-11ed-a7c9-b025aa3cb740') WHERE PlaceID=2 OR PlaceID=3;
UPDATE PlaceData SET Type=UUID_TO_BIN('9fc25bb9-8b7f-11ed-a7c9-b025aa3cb740') WHERE PlaceID=4;
UPDATE PlaceData SET Type=UUID_TO_BIN('9fc29a96-8b7f-11ed-a7c9-b025aa3cb740') WHERE PlaceID=5;
UPDATE PlaceData SET Type=UUID_TO_BIN('9fc2df6c-8b7f-11ed-a7c9-b025aa3cb740') WHERE PlaceID=6 OR PlaceID=7;
UPDATE PlaceData SET Type=UUID_TO_BIN('9fc31e7b-8b7f-11ed-a7c9-b025aa3cb740') WHERE PlaceID=8 OR PlaceID=9;
SELECT PlaceID, BIN_TO_UUID(Type) AS Type FROM PlaceData;