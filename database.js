//POSTリクエスト用関数
function post_request(url, json_data, cf) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 200) {
                cf(JSON.parse(xmlhttp.responseText));
            } else {
                cf(JSON.parse(xmlhttp.responseText));
            }
        }
    }
    xmlhttp.open("POST", url);
    xmlhttp.setRequestHeader('Content-Type', 'application/json');
    xmlhttp.send(JSON.stringify(json_data));
}

//GETリクエスト用関数
function get_request(url, cf) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 200) {
                cf(JSON.parse(xmlhttp.responseText));
            } else {
                cf(JSON.parse(xmlhttp.responseText));
            }
        }
    }
    xmlhttp.open("GET", url);
    xmlhttp.send();
}

/*//取得データのコールバック用関数例(Objectにはjsonが入っています)
function test_console_log(object) {
    console.log(object);
}*/

/*//リスト取得例
function test_request1() {
    get_request("db/get_place", test_console_log);
    get_request("db/get_type", test_console_log);
    get_request("db/get_meatbut", test_console_log);
}*/

/*//作成例
function test_request2() {
    post_request("db/update_place", {
        "place": 1,
        "type": "a35c314d-8b40-11ed-a7c9-b025aa3cb740",
    }, test_console_log);
    post_request("db/add_type", {
        "name": "ダミー肉まんⅡ",
        "price": 150,
        "time": "0500",
        "description": "ダミー肉まん２です"
    }, test_console_log);
    post_request("db/add_meatbut", {
        "type": "a35c314d-8b40-11ed-a7c9-b025aa3cb740",
        "number": 1
    }, test_console_log);
}*/

/*//削除例
function test_request3() {
    post_request("db/delete_meatbut", {
        "id": "c0bc61cc-8b40-11ed-a7c9-b025aa3cb740",
        "type": "a35c314d-8b40-11ed-a7c9-b025aa3cb740"
    }, test_console_log);
    post_request("db/delete_type", {
        "type": "a35c314d-8b40-11ed-a7c9-b025aa3cb740"
    }, test_console_log);
}*/