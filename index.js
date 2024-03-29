import { get_request, post_request } from "./database.js"

const synchronizing_element = document.getElementById("synchronizing");
const date_element = document.getElementById("date");
const WEEK = ["日", "月", "火", "水", "木", "金", "土"];
const EDIT_TAB_COLOR = ["#E3FF93", "#FFF493", "#7EF4FC", "#D4ADCF", "#EF959D"];

let meatbut_count = 0;

/**
 * @type {[{
 *  id: string,
 *  name: string,
 *  price: number,
 *  time: number,
 *  description: string,
 *  img: string,
 *  place: [number],
 * }]}
 */
let registered_nikuman = [];

function set_meatbut_field(object) {
    field = [
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        []
    ];
    meatbut_count = 0;
    if (object.length > 0) {
        object.forEach(element => {
            field[element.Layer][element.Number] = {
                id: (registered_nikuman.map(element => element["id"])).indexOf(element.Type),
                uuid: element.ID,
                create_time: toMinutes(new Date(element.StartTime)),
                finish_time: toMinutes(new Date(element.EndTime))
            };
            meatbut_count++;
        });
    }
}

function get_meatbut_data(object) {
    set_meatbut_field(object);
    synchronizing_element.style.visibility = "hidden";
    loop();
    setInterval(() => { loop(); }, 1000);
}

function set_place_data(object) {
    if (object.length > 0) {
        object.forEach(element => {
            if (element["Type"] != null) {
                registered_nikuman[(registered_nikuman.map(element => element["id"])).indexOf(element.Type)].place.push(element.PlaceID);
            }
        });
    }
    //setInterval(() => { loop(); }, 1000);
    get_request("/db/get_meatbut", get_meatbut_data);
}

function set_registered_type(object) {
    registered_nikuman = [];
    if (object.length > 0) {
        object.forEach(element => {
            let time = element["Time"];
            let imgsrc = "";
            if (element["ImageSrc"] === null) {
                imgsrc = "";
            } else {
                imgsrc = "./media/" + element["ImageSrc"];
            }
            registered_nikuman.push({
                id: element["ID"],
                name: element["Name"],
                price: element["Price"],
                time: Number(time.substring(0, time.indexOf(":"))) * 60 + Number(time.substring(time.indexOf(":") + 1, time.indexOf(":") + 3)),
                description: element["Description"],
                img: imgsrc,
                place: []
            });
        });
    }
    get_request("/db/get_place", set_place_data);
}

/**
 * @type {[[{
 *  create_time: date,
 *  finish_time: date,
 *  id: number,
 *  uuid: string,
 * }]]}
 */
let field = [
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    []
];

function initialize_item_selector() {
    let item_selectors = window.document.getElementById("item-selectors");
    let selectors_size = 5;
    let row_size = 3;
    let column_size = 2;
    for (let ss = 1; ss <= selectors_size; ss++) {
        item_selectors.insertAdjacentHTML("beforeend", `<div id="selector-${ss}" class="item-selector"></div>`);
        let selector = window.document.getElementById(`selector-${ss}`);
        for (let rs = 0; rs < row_size; rs++) {
            for (let cs = 0; cs < column_size; cs++) {
                selector.insertAdjacentHTML("beforeend", `<div class="edit-item column${cs + ((ss - 1) * column_size)} row${rs}" onclick="clickItem(${rs},${cs + ((ss - 1) * column_size)});"><div class="edit-item-title"></div><div class="edit-item-time"></div></div>`);
            }
            if (rs + 1 != row_size) selector.insertAdjacentHTML("beforeend", `<div class="flex-br"></div>`);
        }
    }
}

let nowdate;

window.panel_bg = document.getElementById('panel-bg');

function loop() {
    nowdate = new Date();
    updateRender();
}

function updateRender() {
    date_element.innerText = `${nowdate.getFullYear()}年${nowdate.getMonth() + 1}月${nowdate.getDate()}日(${WEEK[nowdate.getDay()]}) ${nowdate.getHours().toString().padStart(2, "0")}:${nowdate.getMinutes().toString().padStart(2, "0")}:${nowdate.getSeconds().toString().padStart(2, "0")}`;
    let add_items = document.getElementById('add-items');
    let sale_items = document.getElementById('sale-items');
    let add_item = document.getElementsByClassName('add-item');
    let sale_item = document.getElementsByClassName('sale-item');
    let len = add_item.length;
    for (let i = 0; i < len; i++) {
        add_items.removeChild(add_item[0]);
        sale_items.removeChild(sale_item[0]);
    }
    for (let i = 0; i < registered_nikuman.length; i++) {
        let render_item = document.createElement('div');
        render_item.className = 'add-item';
        let render_image = document.createElement('div');
        render_image.className = 'add-item-image';
        if (registered_nikuman[i].img != "") render_image.style.backgroundImage = `url(${registered_nikuman[i].img})`;
        else render_image.style.backgroundImage = `url("media/icon/mb_icon.svg")`;
        render_item.appendChild(render_image);
        let render_name = document.createElement('div');
        render_name.className = 'add-item-name';
        render_name.innerText = registered_nikuman[i].name;
        render_item.appendChild(render_name);
        let number = i;
        render_item.onclick = () => { clickAddItem(number, nowdate); }
        add_items.appendChild(render_item);
    }

    for (let i = 0; i < registered_nikuman.length; i++) {
        let render_item = document.createElement('div');
        render_item.className = 'sale-item';
        let render_image = document.createElement('div');
        render_image.className = 'sale-item-image';
        if (registered_nikuman[i].img != "") render_image.style.backgroundImage = `url(${registered_nikuman[i].img})`;
        else render_image.style.backgroundImage = `url("media/icon/mb_icon.svg")`;
        render_item.appendChild(render_image);
        let render_name = document.createElement('div');
        render_name.className = 'sale-item-name';
        render_name.innerText = registered_nikuman[i].name;
        render_item.appendChild(render_name);
        let number = i;
        render_item.onclick = () => { clickSaleItem(number); }
        sale_items.appendChild(render_item);
    }
    for (let column = 0; column < 10; column++) {
        for (let row = 0; row < 3; row++) {
            let item = document.getElementsByClassName(`column${column} row${row}`)[0];
            if (row >= field[column].length) {
                item.childNodes[0].innerText = "";
                item.childNodes[1].innerText = "";
                //item.innerText = ``;
                continue;
            }
            if (field[column][row] === undefined) { console.log("ソート後の順番が更新されていない可能性あり。"); continue; }
            if (toMinutes(nowdate) >= field[column][row].finish_time) {
                item.childNodes[0].innerText = `${registered_nikuman[field[column][row].id].name}`;
                item.childNodes[1].innerText = "調理済み!";
            } else {
                let lefttime = toDate(field[column][row].finish_time) - nowdate;
                item.childNodes[0].innerText = `${registered_nikuman[field[column][row].id].name}`;
                item.childNodes[1].innerText = `${Math.floor(lefttime / 1000 / 60)}:${(Math.floor(lefttime / 1000) % 60).toString().padStart(2, "0")}`;
            }
        }
    }
}

let adding = {
    cooking: 0,
    cooked: 0,
    cook: 1,
    id: 1,
    item_count: 0,
    cook_minutes: toMinutes(new Date()),
    start_datetime: new Date()
};

function clickAddItem(id, date) {
    console.log("onclick(AddItem)");
    adding = {
        cooking: 0,
        cooked: 0,
        cook: 1,
        id: id,
        item_count: 0,
        cook_minutes: toMinutes(date),
        start_datetime: `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")} ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`
    };
    let panel = document.getElementById('additem-panel');
    let render_image = document.getElementById('additem-image');
    if (registered_nikuman[id].img != "") render_image.style.backgroundImage = `url(${registered_nikuman[id].img})`;
    else render_image.style.backgroundImage = `url("media/icon/mb_icon.svg")`;
    let description = document.getElementById('additem-description');
    description.innerText = `${registered_nikuman[id].description}`;
    let price = document.getElementById('additem-price');
    price.innerText = `価格:${registered_nikuman[id].price}円`;
    let time = document.getElementById('additem-time');
    time.innerText = `${registered_nikuman[id].time}分`;
    for (let i = 0; i < field.length; i++) {
        for (let j = 0; j < field[i].length; j++) {
            if (field[i][j].id == id) {
                adding.item_count++;
                if (toMinutes(nowdate) >= field[i][j].finish_time) {
                    adding.cooked++;
                } else {
                    adding.cooking++;
                }
            }
        }
    }
    let start_time = document.getElementById('additem-start');
    start_time.innerText = `${Math.floor(adding.cook_minutes / 60 % 24).toString().padStart(2, "0")}:${Math.floor(adding.cook_minutes % 60).toString().padStart(2, "0")}`;
    let end_time = document.getElementById('additem-end');
    end_time.innerText = `${Math.floor((adding.cook_minutes + registered_nikuman[id].time) / 60 % 24).toString().padStart(2, "0")}:${Math.floor((adding.cook_minutes + registered_nikuman[id].time) % 60).toString().padStart(2, "0")}`;
    let cooking_count = document.getElementById('additem-cooking');
    cooking_count.innerText = `蒸し中の個数:${adding.cooking}`;
    let cooked_count = document.getElementById('additem-cooked');
    cooked_count.innerText = `蒸しあがった個数:${adding.cooked}`;
    let cook_count = document.getElementById('additem-cook');
    if (registered_nikuman[adding.id].place.length * 3 - adding.item_count <= 0) {
        document.getElementById('additem-decide').disabled = true;
        cook_count.innerText = `これ以上追加できません!`;
    } else {
        document.getElementById('additem-decide').disabled = false;
        document.getElementById('additem-minus').disabled = false;
        document.getElementById('additem-plus').disabled = false;
        cook_count.innerText = `追加する個数:${adding.cook}`;
    }
    let name = document.getElementById('additem-name');
    name.innerText = registered_nikuman[adding.id].name;
    panel.style.display = "block";
    panel_bg.style.display = "block";
}

window.changeCookCount = (num) => {
    if (registered_nikuman[adding.id].place.length * 3 - adding.item_count <= 0) {
        return;
    }
    adding.cook = Math.min(Math.max(1, adding.cook + num), registered_nikuman[adding.id].place.length * 3 - adding.item_count);
    let cook_count = document.getElementById('additem-cook');
    cook_count.innerText = `追加する個数:${adding.cook}`;
}

window.changeCookTime = (num) => {
    adding.cook_minutes += num;
    let start_time = document.getElementById('additem-start');
    start_time.innerText = `${Math.floor(adding.cook_minutes / 60 % 24).toString().padStart(2, "0")}:${Math.floor(adding.cook_minutes % 60).toString().padStart(2, "0")}`;
    let end_time = document.getElementById('additem-end');
    end_time.innerText = `${Math.floor((adding.cook_minutes + registered_nikuman[adding.id].time) / 60 % 24).toString().padStart(2, "0")}:${Math.floor((adding.cook_minutes + registered_nikuman[adding.id].time) % 60).toString().padStart(2, "0")}`;
}

window.decideAddItem = () => {
    let panel = document.getElementById('additem-panel');
    panel.style.display = "none";
    panel_bg.style.display = "none";
    let finish = adding.cook_minutes;
    finish += registered_nikuman[adding.id].time;
    let left = adding.cook;
    synchronizing_element.style.visibility = "visible";
    for (let j = 0; j < 3; j++) {
        for (let k = 0; k < registered_nikuman[adding.id].place.length; k++) {
            if (field[registered_nikuman[adding.id].place[k]].length <= j) {
                left--;
                let d = toDate(adding.cook_minutes);
                if (left <= 0) {
                    post_request("/db/add_meatbut", {
                        "type": registered_nikuman[adding.id].id,
                        "number": j,
                        "layer": registered_nikuman[adding.id].place[k],
                        "start_time": `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")} ${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`
                    }, object => {
                        get_request("/db/get_meatbut", object => {
                            set_meatbut_field(object);
                            sortField();
                            let cnt = 0;
                            field.forEach((layer, layer_index) => {
                                layer.forEach((meatbut, number_index) => {
                                    cnt++;
                                    if (cnt === meatbut_count) {
                                        post_request("/db/update_meatbut", {
                                            "id": meatbut.uuid,
                                            "number": number_index,
                                            "layer": layer_index
                                        }, object => {
                                            synchronizing_element.style.visibility = "hidden";
                                            updateRender();
                                        });
                                    } else {
                                        post_request("/db/update_meatbut", {
                                            "id": meatbut.uuid,
                                            "number": number_index,
                                            "layer": layer_index
                                        }, object => {});
                                    }
                                });
                            });
                        });
                    });
                    return;
                } else {
                    post_request("/db/add_meatbut", {
                        "type": registered_nikuman[adding.id].id,
                        "number": j,
                        "layer": registered_nikuman[adding.id].place[k],
                        "start_time": `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")} ${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`
                    }, object => {});
                }
            }
        }
    }
}

window.changeTab = (tabname) => {
    console.log("onclick(ChangeTab)");
    let tab_selector = document.getElementsByClassName("tab-selector");
    let panel = document.getElementsByClassName("panel");
    for (let i = 0; i < tab_selector.length; i++) {
        if (tab_selector[i].id == tabname) {
            tab_selector[i].style.backgroundColor = "#428BCA";
            panel[i].style.display = "block";
        } else {
            tab_selector[i].style.backgroundColor = "transparent";
            panel[i].style.display = "none";
        }
    }
}

window.changeEditTab = (row) => {
    let item_selectors = document.getElementsByClassName("item-selector");
    let edit_tab_selector = document.getElementsByClassName("edit-tab-selector");
    for (let i = 0; i < item_selectors.length; i++) {
        if (row == i) {
            edit_tab_selector[i].style.backgroundColor = EDIT_TAB_COLOR[i];
            edit_tab_selector[i].style.borderBottomColor = "transparent";
            item_selectors[i].style.display = "flex";
            item_selectors[i].style.backgroundColor = EDIT_TAB_COLOR[i];

        } else {
            edit_tab_selector[i].style.backgroundColor = "transparent";
            edit_tab_selector[i].style.borderBottomColor = "#428BCA";
            item_selectors[i].style.display = "none";
        }
    }
}

let selling = {
    cooking: 0,
    cooked: 0,
    sale: 1,
    id: 1,
    item_count: 0
};

window.clickSaleItem = (id) => {
    console.log("onclick(SaleItem)");
    selling = {
        cooking: 0,
        cooked: 0,
        sale: 1,
        id: id,
        item_count: 0
    };
    let panel = document.getElementById('saleitem-panel');
    let render_image = document.getElementById('saleitem-image');
    if (registered_nikuman[id].img != "") render_image.style.backgroundImage = `url(${registered_nikuman[id].img})`;
    else render_image.style.backgroundImage = `url("media/icon/mb_icon.svg")`;
    let description = document.getElementById('saleitem-description');
    description.innerText = `${registered_nikuman[id].description}`;
    let price = document.getElementById('saleitem-price');
    price.innerText = `価格:${registered_nikuman[id].price}円`;
    for (let i = 0; i < field.length; i++) {
        for (let j = 0; j < field[i].length; j++) {
            if (field[i][j].id == id) {
                selling.item_count++;
                if (toMinutes(nowdate) >= field[i][j].finish_time) {
                    selling.cooked++;
                } else {
                    selling.cooking++;
                }
            }
        }
    }
    let cooking_count = document.getElementById('saleitem-cooking');
    cooking_count.innerText = `蒸し中の個数:${selling.cooking}`;
    let cooked_count = document.getElementById('saleitem-cooked');
    cooked_count.innerText = `蒸しあがった個数:${selling.cooked}`;
    let sale_count = document.getElementById('saleitem-sale');
    if (selling.cooked <= 0) {
        document.getElementById('saleitem-decide').disabled = true;
        sale_count.innerText = `売れる肉まんがありません!`;
    } else {
        document.getElementById('saleitem-decide').disabled = false;
        document.getElementById('saleitem-minus').disabled = false;
        document.getElementById('saleitem-plus').disabled = false;
        sale_count.innerText = `売った個数:${selling.sale}`;
    }
    let name = document.getElementById('saleitem-name');
    name.innerText = registered_nikuman[selling.id].name;

    panel.style.display = "block";
    panel_bg.style.display = "block";
}

window.decideSaleItem = () => {
    let panel = document.getElementById('saleitem-panel');
    panel.style.display = "none";
    panel_bg.style.display = "none";
    let finish = adding.cook_minutes;
    finish += registered_nikuman[adding.id].time;
    let left = selling.sale;
    synchronizing_element.style.visibility = "visible";
    for (let j = 2; j >= 0; j--) {
        for (let k = registered_nikuman[selling.id].place.length - 1; k >= 0; k--) {
            if (field[registered_nikuman[selling.id].place[k]].length > j) {
                left--;
                if (left <= 0) {
                    post_request("/db/delete_meatbut", {
                        id: (field[registered_nikuman[selling.id].place[k]].pop()).uuid
                    }, object => {
                        synchronizing_element.style.visibility = "hidden";
                        updateRender();
                    });
                    return;
                } else {
                    post_request("/db/delete_meatbut", {
                        id: (field[registered_nikuman[selling.id].place[k]].pop()).uuid
                    }, object => {
                        synchronizing_element.style.visibility = "hidden";
                    });
                }
            }
        }
    }
}

window.changeSaleCount = (num) => {
    if (selling.cooked != 0) {
        selling.sale = Math.max(1, Math.min(selling.sale + num, selling.cooked));
        let sale_count = document.getElementById('saleitem-sale');
        sale_count.innerText = `売った個数:${selling.sale}`;
    }
}

window.clickItem = (row, column) => {
    let panel = document.getElementById('checkitem-panel');
    let id = field[column][row].id;
    let name = document.getElementById('checkitem-name');
    name.innerText = `${registered_nikuman[id].name}`;
    let render_image = document.getElementById('checkitem-image');
    if (registered_nikuman[id].img != "") render_image.style.backgroundImage = `url(${registered_nikuman[id].img})`;
    else render_image.style.backgroundImage = `url("media/icon/mb_icon.svg")`;
    let description = document.getElementById('checkitem-description');
    description.innerText = `${registered_nikuman[id].description}`;
    let price = document.getElementById('checkitem-price');
    price.innerText = `価格:${registered_nikuman[id].price}円`;
    let checkitem_status = document.getElementById('checkitem-status');
    let lefttime = toDate(field[column][row].finish_time) - nowdate;
    if (toMinutes(nowdate) >= field[column][row].finish_time) {
        checkitem_status.innerText = `調理後経過時間:${Math.floor(-lefttime / 1000 / 3600)}時間${Math.floor(-lefttime / 1000 / 60) % 60}分${(Math.floor(-lefttime / 1000) % 60).toString().padStart(2, "0")}秒`;
    } else {
        checkitem_status.innerText = `残り調理時間:${Math.floor(lefttime / 1000 / 60)}分${(Math.floor(lefttime / 1000) % 60).toString().padStart(2, "0")}秒`;
    }
    let button = document.getElementById('checkitem-destroy');
    button.onclick = () => { destroyItem(row, column); }
    panel.style.display = "block";
}

window.destroyItem = (row, column) => {
    let result = window.confirm(`${registered_nikuman[field[column][row].id].name}を廃棄します！よろしいですか？`);
    if (result) {
        synchronizing_element.style.visibility = "visible";
        post_request("/db/delete_meatbut", {
            id: field[column][row].uuid
        }, object => {
            meatbut_count--;
            field[column][row].create_time = -999999999;
            sortField();
            let index = -1;
            let max = -999999999;
            for (let j = registered_nikuman[field[column][row].id].place.length - 1; j >= 0; j--) {
                if (max < field[registered_nikuman[field[column][row].id].place[j]].length) {
                    index = registered_nikuman[field[column][row].id].place[j];
                    max = field[registered_nikuman[field[column][row].id].place[j]].length;
                }
            }
            field[index].pop();
            let cnt = 0;
            field.forEach((layer, layer_index) => {
                layer.forEach((meatbut, number_index) => {
                    cnt++;
                    if (cnt === meatbut_count) {
                        post_request("/db/update_meatbut", {
                            "id": meatbut.uuid,
                            "number": number_index,
                            "layer": layer_index
                        }, object => {
                            synchronizing_element.style.visibility = "hidden";
                        });
                    } else {
                        post_request("/db/update_meatbut", {
                            "id": meatbut.uuid,
                            "number": number_index,
                            "layer": layer_index
                        }, object => {});
                    }
                });
            });
            synchronizing_element.style.visibility = "hidden";
            let panel = document.getElementById('checkitem-panel');
            panel.style.display = "none";
        });
    }
}

function toMinutes(date) {
    let minutes = Math.floor(date.getTime() / 1000 / 60);
    minutes += 60 * 9; //日本時間にする
    return minutes;
}

function toDate(minutes) {
    let date = new Date();
    minutes -= 60 * 9; //日本時間にする
    date.setTime(minutes * 60 * 1000);
    return date;
}

window.sortField = () => {
    for (let i = 0; i < registered_nikuman.length; i++) {
        let arr = [];
        for (let row = 0; row < 3; row++) {
            for (let column = 0; column < registered_nikuman[i].place.length; column++) {
                if (field[registered_nikuman[i].place[column]].length > row) {
                    arr.push(field[registered_nikuman[i].place[column]][row]);
                }
            }
        }
        arr.sort(function(a, b) {
            return (a.create_time > b.create_time ? -1 : 1);
        });
        let j = 0;
        for (let row = 0; row < 3; row++) {
            if (j >= arr.length) {
                break;
            }
            for (let column = 0; column < registered_nikuman[i].place.length; column++) {
                if (j >= arr.length) {
                    break;
                }
                field[registered_nikuman[i].place[column]][row] = arr[j];
                j++;
            }
        }
    }
}

initialize_item_selector();
loop();
updateRender();
changeTab("add");
changeEditTab(0);
synchronizing_element.visibility = "visible";
get_request("/db/get_type", set_registered_type);