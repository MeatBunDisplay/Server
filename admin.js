import { get_request, post_request } from "./database.js";

let nowdate;
let least_type_data;
let least_place_data;
const type_list = window.document.getElementById("type_list");
const place_list = window.document.getElementById("place_list");
const date_element = window.document.getElementById("date");
const WEEK = ["日", "月", "火", "水", "木", "金", "土"];

function test_console_log(object) {
    console.log(object);
}

window.add_type = () => {
    if(
    window.document.getElementById("type_name").value != "" &&
    window.document.getElementById("type_price").value != "" &&
    window.document.getElementById("type_time").value != "" &&
    window.document.getElementById("type_description").value != ""){
        window.document.getElementById("caution").innerText = "";
        post_request("db/add_type", {
            "name": window.document.getElementById("type_name").value,
            "price": window.document.getElementById("type_price").value,
            "time": window.document.getElementById("type_time").value+"00",
            "description": window.document.getElementById("type_description").value
        }, test_console_log);
    }
    else{
        window.document.getElementById("caution").innerText = "空白の箇所があります!";
    }
}

window.add_place = (uuid) => {
    post_request("db/update_place", {
        "place": window.document.getElementById(uuid).value,
        "type": uuid
    }, test_console_log);
}

window.remove_place = (placeid) => {
    post_request("db/update_place", {
        "place": placeid,
        "type": "NULL"
    }, test_console_log);
}

window.delete_type = (uuid) => {
    post_request("db/delete_type", {
        "type": uuid,
    }, test_console_log);
}

function loop() {
    nowdate = new Date();
    date_element.innerText = `${nowdate.getFullYear()}年${nowdate.getMonth() + 1}月${nowdate.getDate()}日(${WEEK[nowdate.getDay()]}) ${nowdate.getHours().toString().padStart(2, "0")}:${nowdate.getMinutes().toString().padStart(2, "0")}:${nowdate.getSeconds().toString().padStart(2, "0")}`;
    get_request("/db/get_type", object => {
        if (JSON.stringify(object) != least_type_data) {
            type_list.innerHTML = "";
            object.forEach(element => {
                type_list.insertAdjacentHTML('beforeend', `<div class="edit-item">${element["Name"]}<br><!--${element["Price"]}円<br>--><input id=\"${element["ID"]}\" placeholder="場所（例：0）"><br><input type="button" onclick="add_place('${element["ID"]}');" value="場所追加"><input type="button" onclick="delete_type('${element["ID"]}');" value="種類削除"></div>`);
            });
            least_type_data = JSON.stringify(object);
        } else {
            //
        }
    });
    get_request("/db/get_place", object => {
        if (JSON.stringify(object) != least_place_data) {
            place_list.innerHTML = "";
            let ltd = JSON.parse(least_type_data);
            object.sort((a, b) => a.PlaceID-b.PlaceID);
            object.forEach(element => {
                let mdata = ltd[(ltd.map(element => element["ID"])).indexOf(element["Type"])];
                if (mdata === undefined) {
                    mdata = "空き";
                    place_list.insertAdjacentHTML('beforeend', `<div class="edit-place">${element["PlaceID"]}<br>${mdata}<br><input disabled type="button" value="削除" onclick="remove_place(${element["PlaceID"]});"></div>`);
                } else{
                    mdata = mdata.Name;
                    place_list.insertAdjacentHTML('beforeend', `<div class="edit-place">${element["PlaceID"]}<br>${mdata}<br><input type="button" value="削除" onclick="remove_place(${element["PlaceID"]});"></div>`);
                }
            });
            least_place_data = JSON.stringify(object);
        } else {
            //
        }
    });
}
loop();
setInterval(() => {
    loop();
}, 1000);