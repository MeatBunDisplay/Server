import { get_request, post_request } from "./database.js";

let nowdate;
let least_type_data;
let least_place_data;
const item_selector = window.document.getElementById("item_selector");
item_selector.addEventListener('change', changeItem);
const type_list = window.document.getElementById("type_list");
const place_list = window.document.getElementById("place_list");
const date_element = window.document.getElementById("date");
const delete_type_button = window.document.getElementById("delete_type_button");
const toast = window.document.getElementById("toast");
const WEEK = ["日", "月", "火", "水", "木", "金", "土"];
let selected_id = "";

const image_input = document.getElementById('type_image');
const preview_image = document.getElementById('preview-image');
const reader = new FileReader();
let file_data;

reader.onload = function(e) {
    const imageUrl = e.target.result;
    const img = document.createElement("img");
    img.src = imageUrl;
    img.style.width = 100;
    img.style.height = 100;
    preview_image.innerHTML = "";
    preview_image.appendChild(img);
    file_data = e.currentTarget.result;
}

window.file_selected = () => {
    reader.readAsDataURL(image_input.files[0]);
}

function test_console_log(object) {
    console.log(object);
    switch (object.errno) {
        case 1451:
            warning("肉まんを削除する前に配置から削除してください!");
    }
}

window.add_type = () => {
    if (
        window.document.getElementById("type_name").value != "" &&
        window.document.getElementById("type_price").value != "" &&
        window.document.getElementById("type_time").value != "" &&
        window.document.getElementById("type_description").value != "") {
        window.document.getElementById("caution").innerText = "";
        if (image_input.files.length > 0) {
            const formData = new FormData();
            formData.append("image", file_data);
            fetch("http://localhost/upload/image", { method: "POST", body: formData }).then((data) => {
                console.log(data.text());
                /*post_request("db/add_type", {
                    "name": window.document.getElementById("type_name").value,
                    "price": window.document.getElementById("type_price").value,
                    "time": window.document.getElementById("type_time").value + "00",
                    "description": window.document.getElementById("type_description").value,
                    "img": data
                }, test_console_log);*/
            });
        } else {
            post_request("db/add_type", {
                "name": window.document.getElementById("type_name").value,
                "price": window.document.getElementById("type_price").value,
                "time": window.document.getElementById("type_time").value + "00",
                "description": window.document.getElementById("type_description").value,
                "img": "NULL"
            }, test_console_log);
        }
        loop();
    } else {
        warning("空白の箇所があります!");
    }
}

window.add_place = (place, uuid) => {
    post_request("db/update_place", {
        "place": place,
        "type": uuid
    }, test_console_log);
    changeItem();
    loop();
}

window.add_place_selectedType = (place) => {
    post_request("db/update_place", {
        "place": place,
        "type": selected_id
    }, test_console_log);
    changeItem();
    loop();
}

window.remove_place = (placeid) => {
    post_request("db/update_place", {
        "place": placeid,
        "type": "NULL"
    }, test_console_log);
    loop();
}

window.delete_type = (uuid) => {
    post_request("db/delete_type", {
        "type": uuid,
    }, test_console_log);
    loop();
}

window.delete_selectedType = () => {
    post_request("db/delete_type", {
        "type": selected_id,
    }, test_console_log);
    loop();
}

function changeItem() {
    selected_id = item_selector.value;
    if (selected_id != "") {
        delete_type_button.removeAttribute("disabled");
    } else {
        delete_type_button.setAttribute("disabled", true);
    }
    const edit_item = document.getElementsByClassName("edit-item");
    for (let i = 0; i < edit_item.length; i++) {
        if (edit_item[i].classList.contains(selected_id)) {
            edit_item[i].style.display = "block";
        } else {
            edit_item[i].style.display = "none";
        }
    }
}

function warning(text) {
    toast.style.display = "block";
    toast.innerText = text;
    setTimeout(() => {
        toast.style.display = "none";
    }, 5000)
}

function loop() {
    nowdate = new Date();
    date_element.innerText = `${nowdate.getFullYear()}年${nowdate.getMonth() + 1}月${nowdate.getDate()}日(${WEEK[nowdate.getDay()]}) ${nowdate.getHours().toString().padStart(2, "0")}:${nowdate.getMinutes().toString().padStart(2, "0")}:${nowdate.getSeconds().toString().padStart(2, "0")}`;
    get_request("/db/get_type", object => {
        if (JSON.stringify(object) != least_type_data) {
            //type_list.innerHTML = "";
            item_selector.innerHTML = "";
            object.forEach(element => {
                //type_list.insertAdjacentHTML('beforeend', `<div class="edit-item ${element["ID"]}">${element["Name"]}<br><!--${element["Price"]}円<br>--><input type="button" onclick="delete_type('${element["ID"]}');" value="種類削除"></div>`);
                item_selector.insertAdjacentHTML('beforeend', `<option value=${element["ID"]}>${element["Name"]}</option>`);
            });
            changeItem();
            least_type_data = JSON.stringify(object);
        } else {
            //
        }
    });
    get_request("/db/get_place", object => {
        if (JSON.stringify(object) != least_place_data) {
            place_list.innerHTML = "";
            let ltd = JSON.parse(least_type_data);
            object.sort((a, b) => a.PlaceID - b.PlaceID);
            object.forEach(element => {
                let mdata = ltd[(ltd.map(element => element["ID"])).indexOf(element["Type"])];
                if (mdata === undefined) {
                    mdata = "空き";
                    place_list.insertAdjacentHTML('beforeend', `<div class="edit-place">${element["PlaceID"]}<br>${mdata}<br><input type="button" value="追加" onclick="add_place_selectedType(${element["PlaceID"]});"></div>`);
                } else {
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