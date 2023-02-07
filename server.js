const HTTP_PORT = 80;

const http = require('http');
const fs = require('fs');
const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'mokemoke',
    database: 'MeatButDB'
});

let data = '';

http.createServer((request, response) => {
    switch (request.url.split('?')[0]) {
        case '/index':
            fs.readFile('./index.html', 'UTF-8', (error, data) => {
                response.writeHead(200, { 'Content-Type': 'text/html' });
                response.write(data);
                response.end();
            })
            break;
        case '/index.js':
            fs.readFile('./index.js', 'UTF-8', (error, data) => {
                response.writeHead(200, { 'Content-Type': 'text/javascript' });
                response.write(data);
                response.end();
            })
            break;
        case '/index.css':
            fs.readFile('./index.css', 'UTF-8', (error, data) => {
                response.writeHead(200, { 'Content-Type': 'text/css' });
                response.write(data);
                response.end();
            })
            break;
        case '/database.js':
            fs.readFile('./database.js', 'UTF-8', (error, data) => {
                response.writeHead(200, { 'Content-Type': 'text/javascript' });
                response.write(data);
                response.end();
            })
            break;
            /* FOR DATABASE */
        case '/db/get_place':
            connection.query('SELECT PlaceID, BIN_TO_UUID(Type) AS Type FROM PlaceData;', function(error, results, fields) {
                if (error) {
                    response.writeHead(500, { 'Content-Type': 'application/json' });
                    response.end(JSON.stringify(error));
                } else {
                    response.writeHead(200, { 'Content-Type': 'application/json' });
                    response.end(JSON.stringify(results));
                }
            });
            break;
        case '/db/get_type':
            connection.query('SELECT BIN_TO_UUID(ID) AS ID, Name, Price, Time, Description, ImageSrc, CreateTime, UpdateTime FROM MeatButType;', function(error, results, fields) {
                if (error) {
                    response.writeHead(500, { 'Content-Type': 'application/json' });
                    response.end(JSON.stringify(error));
                } else {
                    response.writeHead(200, { 'Content-Type': 'application/json' });
                    response.end(JSON.stringify(results));
                }
            });
            break;
        case '/db/get_meatbut':
            connection.query('SELECT BIN_TO_UUID(ID) AS ID, BIN_TO_UUID(Type) AS Type, Number, Layer, StartTime, EndTime FROM MeatBut;', function(error, results, fields) {
                if (error) {
                    response.writeHead(500, { 'Content-Type': 'application/json' });
                    response.end(JSON.stringify(error));
                } else {
                    response.writeHead(200, { 'Content-Type': 'application/json' });
                    response.end(JSON.stringify(results));
                }
            });
            break;
        case '/db/get_fastest_mb':
            connection.query('SELECT MBL.TypeName, COUNT(MBL.TypeName) AS Count, (IF(TIMESTAMPDIFF(MINUTE, MBL.EndTime, CAST(NOW() AS DATETIME))>=0, 0, ABS(TIMESTAMPDIFF(MINUTE, MBL.EndTime, CAST(NOW() AS DATETIME))))) AS TimeLeft, (IF(TIMEDIFF(MBL.EndTime, CAST(NOW() AS DATETIME))<0, TRUE, FALSE)) AS Cooked FROM (SELECT (SELECT Name FROM MeatButType AS MBT WHERE ID = Type) AS TypeName, EndTime FROM MeatBut AS MB WHERE (TIMEDIFF(EndTime, CAST(NOW() AS DATETIME))<0) OR (EndTime = (SELECT MIN(EndTime) FROM MeatBut WHERE Type = MB.Type))) AS MBL GROUP BY TypeName ORDER BY Cooked DESC;', function(error, results, fields) {
                if (error) {
                    response.writeHead(500, { 'Content-Type': 'application/json' });
                    response.end(JSON.stringify(error));
                } else {
                    response.writeHead(200, { 'Content-Type': 'application/json' });
                    response.end(JSON.stringify(results));
                }
            });
            break;
        case '/db/add_place':
            console.log(`${new Date().toLocaleString()} : "/db/add_place" WAS ACCESSED WITH ${request.method}`);
            if (request.method === "POST") {
                data = '';
                request.on('data', function(chunk) { data += chunk })
                    .on('end', function() {
                        data = JSON.parse(data);
                        if (data["type"] === undefined) {
                            connection.query(`INSERT PlaceData VALUES(${data["place"]}, NUll);`, function(error, results, fields) {
                                if (error) {
                                    response.writeHead(500, { 'Content-Type': 'application/json' });
                                    response.end(JSON.stringify(error));
                                } else {
                                    response.writeHead(200, { 'Content-Type': 'text/plain' });
                                    response.write("{\"status\": \"SUCESS\"}");
                                    response.end();
                                }
                            });
                        } else {
                            connection.query(`INSERT PlaceData VALUES(${data["place"]}, UUID_TO_BIN('${data["type"]}'));`, function(error, results, fields) {
                                if (error) {
                                    response.writeHead(500, { 'Content-Type': 'application/json' });
                                    response.end(JSON.stringify(error));
                                } else {
                                    response.writeHead(200, { 'Content-Type': 'text/plain' });
                                    response.write("{\"status\": \"SUCESS\"}");
                                    response.end();
                                }
                            });
                        }
                    });
            } else {
                response.writeHead(404, { 'Content-Type': 'text/plain' });
                response.end("UNKNOWN REQUEST");
            }

            break;
        case '/db/add_type':
            console.log(`${new Date().toLocaleString()} : "/db/add_type" WAS ACCESSED WITH ${request.method}`);
            if (request.method === "POST") {
                data = '';
                request.on('data', function(chunk) { data += chunk })
                    .on('end', function() {
                        data = JSON.parse(data);
                        connection.query(`INSERT MeatButType VALUES(UUID_TO_BIN(UUID()), "${data["name"]}", ${data["price"]}, CAST("${data["time"]}" AS TIME), "${data["description"]}", NULL, CAST(NOW() AS DATETIME), CAST(NOW() AS DATETIME));`, function(error, results, fields) {
                            if (error) {
                                response.writeHead(500, { 'Content-Type': 'application/json' });
                                response.end(JSON.stringify(error));
                            } else {
                                response.writeHead(200, { 'Content-Type': 'text/plain' });
                                response.write("{\"status\": \"SUCESS\"}");
                                response.end();
                            }
                        });
                    });
            } else {
                response.writeHead(404, { 'Content-Type': 'text/plain' });
                response.end("UNKNOWN REQUEST");
            }

            break;
        case '/db/add_meatbut':
            console.log(`${new Date().toLocaleString()} : "/db/add_meatbut" WAS ACCESSED WITH ${request.method}`);
            if (request.method === "POST") {
                data = '';
                request.on('data', function(chunk) { data += chunk })
                    .on('end', function() {
                        data = JSON.parse(data);
                        if (data["start_time"] === undefined) {
                            connection.query(`INSERT MeatBut VALUES(UUID_TO_BIN(UUID()), UUID_TO_BIN('${data["type"]}'), ${data["number"]}, ${data["layer"]}, CAST(NOW() AS DATETIME), ADDTIME(CAST(NOW() AS DATETIME), (SELECT Time FROM MeatButType WHERE ID=UUID_TO_BIN('${data["type"]}'))));`, function(error, results, fields) {
                                if (error) {
                                    response.writeHead(500, { 'Content-Type': 'application/json' });
                                    response.end(JSON.stringify(error));
                                } else {
                                    response.writeHead(200, { 'Content-Type': 'text/plain' });
                                    response.write("{\"status\": \"SUCESS\"}");
                                    response.end();
                                }
                            });
                        } else {
                            connection.query(`INSERT MeatBut VALUES(UUID_TO_BIN(UUID()), UUID_TO_BIN('${data["type"]}'), ${data["number"]}, ${data["layer"]}, CAST('${data["start_time"]}' AS DATETIME), ADDTIME(CAST('${data["start_time"]}' AS DATETIME), (SELECT Time FROM MeatButType WHERE ID=UUID_TO_BIN('${data["type"]}'))));`, function(error, results, fields) {
                                if (error) {
                                    response.writeHead(500, { 'Content-Type': 'application/json' });
                                    response.end(JSON.stringify(error));
                                } else {
                                    response.writeHead(200, { 'Content-Type': 'text/plain' });
                                    response.write("{\"status\": \"SUCESS\"}");
                                    response.end();
                                }
                            });
                        }
                    });
            } else {
                response.writeHead(404, { 'Content-Type': 'text/plain' });
                response.end("UNKNOWN REQUEST");
            }

            break;
        case '/db/update_place':
            console.log(`${new Date().toLocaleString()} : "/db/update_place" WAS ACCESSED WITH ${request.method}`);
            if (request.method === "POST") {
                data = '';
                request.on('data', function(chunk) { data += chunk })
                    .on('end', function() {
                        data = JSON.parse(data);
                        if (data["type"] === "NULL") {
                            connection.query(`UPDATE PlaceData SET Type=NULL WHERE PlaceID=${data["place"]};`, function(error, results, fields) {
                                if (error) {
                                    response.writeHead(500, { 'Content-Type': 'application/json' });
                                    response.end(JSON.stringify(error));
                                } else {
                                    response.writeHead(200, { 'Content-Type': 'text/plain' });
                                    response.write("{\"status\": \"SUCESS\"}");
                                    response.end();
                                }
                            });
                        } else {
                            connection.query(`UPDATE PlaceData SET Type=UUID_TO_BIN('${data["type"]}') WHERE PlaceID=${data["place"]};`, function(error, results, fields) {
                                if (error) {
                                    response.writeHead(500, { 'Content-Type': 'application/json' });
                                    response.end(JSON.stringify(error));
                                } else {
                                    response.writeHead(200, { 'Content-Type': 'text/plain' });
                                    response.write("{\"status\": \"SUCESS\"}");
                                    response.end();
                                }
                            });
                        }
                    });
            } else {
                response.writeHead(404, { 'Content-Type': 'text/plain' });
                response.end("UNKNOWN REQUEST");
            }

            break;
        case '/db/update_meatbut':
            console.log(`${new Date().toLocaleString()} : "/db/update_meatbut" WAS ACCESSED WITH ${request.method}`);
            if (request.method === "POST") {
                data = '';
                request.on('data', function(chunk) { data += chunk })
                    .on('end', function() {
                        data = JSON.parse(data);
                        connection.query(`UPDATE MeatBut SET Number=${data["number"]}, Layer=${data["layer"]} WHERE ID=UUID_TO_BIN('${data["id"]}');`, function(error, results, fields) {
                            if (error) {
                                response.writeHead(500, { 'Content-Type': 'application/json' });
                                response.end(JSON.stringify(error));
                            } else {
                                response.writeHead(200, { 'Content-Type': 'text/plain' });
                                response.write("{\"status\": \"SUCESS\"}");
                                response.end();
                            }
                        });
                    });
            } else {
                response.writeHead(404, { 'Content-Type': 'text/plain' });
                response.end("UNKNOWN REQUEST");
            }

            break;
        case '/db/delete_place':
            console.log(`${new Date().toLocaleString()} : "/db/delete_place" WAS ACCESSED WITH ${request.method}`);
            if (request.method === "POST") {
                data = '';
                request.on('data', function(chunk) { data += chunk })
                    .on('end', function() {
                        data = JSON.parse(data);
                        connection.query(`DELETE FROM PlaceData WHERE PlaceID=${data["place"]};`, function(error, results, fields) {
                            if (error) {
                                response.writeHead(500, { 'Content-Type': 'application/json' });
                                response.end(JSON.stringify(error));
                            } else {
                                response.writeHead(200, { 'Content-Type': 'text/plain' });
                                response.write("{\"status\": \"SUCESS\"}");
                                response.end();
                            }
                        });
                    });
            } else {
                response.writeHead(404, { 'Content-Type': 'text/plain' });
                response.end("UNKNOWN REQUEST");
            }

            break;
        case '/db/delete_type':
            console.log(`${new Date().toLocaleString()} : "/db/delete_type" WAS ACCESSED WITH ${request.method}`);
            if (request.method === "POST") {
                data = '';
                request.on('data', function(chunk) { data += chunk })
                    .on('end', function() {
                        data = JSON.parse(data);
                        connection.query(`DELETE FROM MeatbutType WHERE ID=UUID_TO_BIN('${data["type"]}');`, function(error, results, fields) {
                            if (error) {
                                response.writeHead(500, { 'Content-Type': 'application/json' });
                                response.end(JSON.stringify(error));
                            } else {
                                response.writeHead(200, { 'Content-Type': 'text/plain' });
                                response.write("{\"status\": \"SUCESS\"}");
                                response.end();
                            }
                        });
                    });
            } else {
                response.writeHead(404, { 'Content-Type': 'text/plain' });
                response.end("UNKNOWN REQUEST");
            }

            break;
        case '/db/delete_meatbut':
            console.log(`${new Date().toLocaleString()} : "/db/delete_meatbut" WAS ACCESSED WITH ${request.method}`);
            if (request.method === "POST") {
                data = '';
                request.on('data', function(chunk) { data += chunk })
                    .on('end', function() {
                        data = JSON.parse(data);
                        connection.query(`DELETE FROM Meatbut WHERE ID=UUID_TO_BIN('${data["id"]}');`, function(error, results, fields) {
                            if (error) {
                                response.writeHead(500, { 'Content-Type': 'application/json' });
                                response.end(JSON.stringify(error));
                            } else {
                                response.writeHead(200, { 'Content-Type': 'text/plain' });
                                response.write("{\"status\": \"SUCESS\"}");
                                response.end();
                            }
                        });
                    });
            } else {
                response.writeHead(404, { 'Content-Type': 'text/plain' });
                response.end("UNKNOWN REQUEST");
            }

            break;
        case '/db/manual_control':
            console.log(`★★ ${new Date().toLocaleString()} : "/db/manual_control" WAS ACCESSED  WITH ${request.method}★★`);
            if (request.method === "POST") {
                data = '';
                request.on('data', function(chunk) { data += chunk })
                    .on('end', function() {
                        data = JSON.parse(data);
                        connection.query(`${data["sql"]}`, function(error, results, fields) {
                            if (error) {
                                response.writeHead(500, { 'Content-Type': 'application/json' });
                                response.end(JSON.stringify(error));
                            } else {
                                response.writeHead(200, { 'Content-Type': 'application/json' });
                                response.end(JSON.stringify(results));
                            }
                        });
                    });
            } else {
                response.writeHead(404, { 'Content-Type': 'text/plain' });
                response.end("UNKNOWN REQUEST");
            }
            break;
        default:
            console.log(`${new Date().toLocaleString()} : "${request.url.split('?')[0]}" IS 404`);
            response.writeHead(404, { 'Content-Type': 'text/plain' });
            response.end("NOT FOUND");
            break;
    }
}).listen(HTTP_PORT);
console.log(`HTTPサーバをポート${HTTP_PORT}番に立てたよ!!!!!`);
console.log(`http://localhost:${HTTP_PORT}/index`);