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

const add_type_button = document.getElementById('add_type_button');
const esubmit_button = document.getElementById('esubmit');
const image_input = document.getElementById('type_image');
const preview_image = document.getElementById('preview-image');
const eimage_input = document.getElementById('timage_input');
const epreview_image = document.getElementById('epreview-image');
const reader = new FileReader();
const ereader = new FileReader();
let file_data;
let efile_data;
let efile_update = false;

reader.onload = function(e) {
    const imageUrl = e.target.result;
    const img = document.createElement("img");
    img.src = imageUrl;
    img.style.width = "100px";
    img.style.height = "100px";
    preview_image.innerHTML = "";
    preview_image.appendChild(img);
    file_data = e.currentTarget.result;
}

ereader.onload = function(e) {
    const imageUrl = e.target.result;
    const img = document.createElement("img");
    img.src = imageUrl;
    img.style.width = "100px";
    img.style.height = "100px";
    epreview_image.innerHTML = "";
    epreview_image.appendChild(img);
    efile_data = e.currentTarget.result;
}

window.clear_finput = () => {
    image_input.value = "";
    file_data = "";
    preview_image.innerHTML = "";
}

window.file_selected = () => {
    reader.readAsDataURL(image_input.files[0]);
}

window.eclear_finput = () => {
    eimage_input.value = "";
    efile_data = "";
    efile_update = true;
    epreview_image.innerHTML = "";
}

window.efile_selected = () => {
    ereader.readAsDataURL(eimage_input.files[0]);
    efile_update = true;
}

function test_console_log(object) {
    console.log(object);
    switch (object.errno) {
        case 1451:
            warning("肉まんを削除する前に配置から削除してください!");
    }
}

window.add_type = () => {
    if (window.document.getElementById("type_name").value != "" &&
        window.document.getElementById("type_price").value != "" &&
        window.document.getElementById("type_time").value != "" &&
        window.document.getElementById("type_description").value != "") {
        add_type_button.disabled = true;
        window.document.getElementById("caution").innerText = "";
        if (image_input.files.length > 0 && file_data != "") {
            const formData = new FormData();
            formData.append("image", file_data);
            fetch("http://localhost/upload/image", { method: "POST", body: formData }).then((data) => {
                data.text().then(text => {
                    post_request("db/add_type", {
                        "name": window.document.getElementById("type_name").value,
                        "price": window.document.getElementById("type_price").value,
                        "time": window.document.getElementById("type_time").value + "00",
                        "description": window.document.getElementById("type_description").value,
                        "img": text
                    }, object => {
                        add_type_button.disabled = false;
                        test_console_log(object);
                    });
                });
            });
        } else {
            post_request("db/add_type", {
                "name": window.document.getElementById("type_name").value,
                "price": window.document.getElementById("type_price").value,
                "time": window.document.getElementById("type_time").value + "00",
                "description": window.document.getElementById("type_description").value,
                "img": "NULL"
            }, object => {
                add_type_button.disabled = false;
                test_console_log(object);
            });
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

window.esubmit = () => {
    if (window.document.getElementById("tname_input").value != "" &&
        window.document.getElementById("tprice_input").value != "" &&
        window.document.getElementById("ttime_input").value != "" &&
        window.document.getElementById("tdesc_input").value != "") {
        esubmit_button.disabled = true;
        selected_id = item_selector.value;
        const ltd = JSON.parse(least_type_data);
        const type_data = ltd[(ltd.map(element => element["ID"])).indexOf(selected_id)];
        if ((efile_update && efile_data == "") || (!efile_update && type_data["ImageSrc"] == null)) {
            post_request("/db/update_type", {
                id: selected_id,
                name: window.document.getElementById("tname_input").value,
                price: window.document.getElementById("tprice_input").value,
                time: window.document.getElementById("ttime_input").value + "00",
                description: window.document.getElementById("tdesc_input").value,
                img: "NULL"
            }, object => {
                efile_update = false;
                esubmit_button.disabled = false;
                test_console_log(object);
            });
        } else {
            if (efile_update && efile_data != "") {
                const formData = new FormData();
                formData.append("image", efile_data);
                fetch("http://localhost/upload/image", { method: "POST", body: formData }).then((data) => {
                    data.text().then(text => {
                        post_request("/db/update_type", {
                            id: selected_id,
                            name: window.document.getElementById("tname_input").value,
                            price: window.document.getElementById("tprice_input").value,
                            time: window.document.getElementById("ttime_input").value + "00",
                            description: window.document.getElementById("tdesc_input").value,
                            "img": text
                        }, object => {
                            efile_update = false;
                            esubmit_button.disabled = false;
                            test_console_log(object);
                        });
                    });
                });
            } else if (!efile_update && type_data["ImageSrc"] != null) {
                post_request("/db/update_type", {
                    id: selected_id,
                    name: window.document.getElementById("tname_input").value,
                    price: window.document.getElementById("tprice_input").value,
                    time: window.document.getElementById("ttime_input").value + "00",
                    description: window.document.getElementById("tdesc_input").value,
                    img: type_data["ImageSrc"]
                }, object => {
                    efile_update = false;
                    esubmit_button.disabled = false;
                    test_console_log(object);
                });
            }
        }
    } else {
        warning("空白の箇所があります!");
    }
}

function changeItem() {
    selected_id = item_selector.value;
    if (selected_id != "") {
        delete_type_button.removeAttribute("disabled");
        const ltd = JSON.parse(least_type_data);
        const type_data = ltd[(ltd.map(element => element["ID"])).indexOf(selected_id)];
        const type_time = type_data["Time"].split(":");
        window.document.getElementById("tname_input").value = type_data["Name"];
        window.document.getElementById("tprice_input").value = type_data["Price"];
        window.document.getElementById("ttime_input").value = (Number(type_time[0]) * 60) + Number(type_time[1]);
        window.document.getElementById("tdesc_input").value = type_data["Description"];
        if (type_data["ImageSrc"] != null) {
            const img = document.createElement("img");
            img.src = `./media/${type_data["ImageSrc"]}`;
            img.style.width = "100px";
            img.style.height = "100px";
            epreview_image.innerHTML = "";
            epreview_image.appendChild(img);
        } else {
            eclear_finput();
        }
        efile_update = false;
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
            least_type_data = JSON.stringify(object);
            changeItem();
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

clear_finput();
loop();
setInterval(() => {
    loop();
}, 1000);