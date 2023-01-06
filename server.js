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
        case '/db/add_place':
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
            break;
        case '/db/add_type':
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
            break;
        case '/db/add_meatbut':
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
                        connection.query(`INSERT MeatBut VALUES(UUID_TO_BIN(UUID()), UUID_TO_BIN('${data["type"]}'), ${data["number"]}, CAST('${data["start_time"]}' AS DATETIME), ADDTIME(CAST('${data["start_time"]}' AS DATETIME), (SELECT Time FROM MeatButType WHERE ID=UUID_TO_BIN('${data["type"]}'))));`, function(error, results, fields) {
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
            break;
        case '/db/update_place':
            data = '';
            request.on('data', function(chunk) { data += chunk })
                .on('end', function() {
                    data = JSON.parse(data);
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
                });
            break;
        case '/db/update_meatbut':
            data = '';
            request.on('data', function(chunk) { data += chunk })
                .on('end', function() {
                    data = JSON.parse(data);
                    connection.query(`UPDATE MeatBut SET Number=${data["number"]}, Layer=${data["layer"]} WHERE ID=${data["id"]} Type=UUID_TO_BIN('${data["type"]}');`, function(error, results, fields) {
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
            break;
        case '/db/delete_place':
            data = '';
            request.on('data', function(chunk) { data += chunk })
                .on('end', function() {
                    data = JSON.parse(data);
                    connection.query(`DELETE FROM PlaceData WHERE PlaceID=${data["place"]}`, function(error, results, fields) {
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
            break;
        case '/db/delete_type':
            data = '';
            request.on('data', function(chunk) { data += chunk })
                .on('end', function() {
                    data = JSON.parse(data);
                    connection.query(`DELETE FROM MeatbutType WHERE ID=UUID_TO_BIN('${data["type"]}')`, function(error, results, fields) {
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
            break;
        case '/db/delete_meatbut':
            data = '';
            request.on('data', function(chunk) { data += chunk })
                .on('end', function() {
                    data = JSON.parse(data);
                    connection.query(`DELETE FROM Meatbut WHERE ID=UUID_TO_BIN('${data["id"]}') AND Type=UUID_TO_BIN('${data["type"]}')`, function(error, results, fields) {
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
            break;
        case '/db/manual_control':
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
            break;
    }
}).listen(HTTP_PORT);
console.log(`HTTPサーバをポート${HTTP_PORT}番に立てたよ!!!!!`);
console.log(`http://localhost:${HTTP_PORT}/index`);