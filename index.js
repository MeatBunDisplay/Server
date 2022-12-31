const date_element = document.getElementById("date");
const WEEK = ["日", "月", "火", "水", "木", "金", "土"];
const EDIT_TAB_COLOR = ["#E3FF93", "#FFF493", "#7EF4FC", "#D4ADCF", "#EF959D"];

/**
 * @type {[{
 *  name: string,
 *  price: number,
 *  time: number,
 *  description: string,
 *  place: [number],
 * }]}
 */
let registered_nikuman = [
    {
        name: "肉まん",
        price: 100,
        time: 50,
        description: "この肉まんは非常にいい香りを発している．",
        place: [0, 1]
    },
    {
        name: "抹茶まん",
        price: 140,
        time: 50,
        description: "甘々ベーキング",
        place: [2, 3]
    },
    {
        name: "ピザまん",
        price: 120,
        time: 50,
        description: "人気",
        place: [4]
    },
    {
        name: "あんまん",
        price: 100,
        time: 50,
        description: "元気100倍",
        place: [5]
    },
    {
        name: "黒豚まん",
        price: 200,
        time: 50,
        description: "高いよ",
        place: [6, 7]
    },
    {
        name: "テストまん",
        price: 200,
        time: 1,
        description: "1分で出来ます",
        place: [8, 9]
    }
];

/**
 * @type {[[{
 *  create_time: date,
 *  finish_time: date,
 *  id: number,
 * }]]}
 */
let field = [[],[],[],[],[],[],[],[],[],[]];

let nowdate;

class Nikuman{
    /**
     * 
     * @param {date} time 
     * @param {number} nikuman_id 
     */
    constructor(time, nikuman_id){
        this.create_time = time;
        this.id = nikuman_id;
        let place = registered_nikuman[nikuman_id].place;
        let is_pushed = false;
        for(let i = 1;i < place.length;i++){
            if(field[place[i-1]].length > field[place[i]].length){
                field[place[i]].push(this);
                is_pushed = true;
                break;
            }
        }
        if(!is_pushed){
            field[place[0]].push(this);
        }
    }
}

function loop(){
    nowdate = new Date();
    updateRender();
}

function updateRender() {
    date_element.innerText = `${nowdate.getFullYear()}年${nowdate.getMonth()+1}月${nowdate.getDate()}日(${WEEK[nowdate.getDay()]}) ${nowdate.getHours().toString().padStart(2, "0")}:${nowdate.getMinutes().toString().padStart(2, "0")}:${nowdate.getSeconds().toString().padStart(2, "0")}`;
    let add_items = document.getElementById('add-items');
    let add_item = document.getElementsByClassName('item');
    let len = add_item.length;
    for (let i = 0; i < len; i++){
        add_items.removeChild(add_item[0]);
    }
    for (let i = 0; i < registered_nikuman.length; i++){
        let render_item = document.createElement('div');
        render_item.className = 'item';
        let render_image = document.createElement('div');
        render_image.className = 'item-image';
        render_item.appendChild(render_image);
        let render_name = document.createElement('div');
        render_name.className = 'item-name';
        render_name.innerText = registered_nikuman[i].name;
        render_item.appendChild(render_name);
        let number = i;
        render_item.onclick = () => { clickAddItem(number, nowdate); }
        add_items.appendChild(render_item);
    }
    for (let column = 0; column < 10; column++){
        for (let row = 0; row < 3; row++){
            let item = document.getElementsByClassName(`column${column} row${row}`)[0];
            if (row >= field[column].length) {
                item.innerText = ``;
                continue;
            }
            if (nowdate > field[column][row].finish_time) {
                item.innerText = `${registered_nikuman[field[column][row].id].name}\n調理済み!`
            }
            else {
                let lefttime = field[column][row].finish_time - nowdate;
                item.innerText = `${registered_nikuman[field[column][row].id].name}\n${Math.floor(lefttime/1000/60)}:${(Math.floor(lefttime/1000)%60).toString().padStart(2, "0")}`
            }
        }
    }
}

let cook = 1;
let cook_date = new Date();
let add_id = -1;
let item_count = 0;

function clickAddItem(id, date) {
    console.log("onclick(AddItem)");
    cook = 1;
    cook_date = date;
    add_id = id;
    let panel = document.getElementById('additem-panel');
    let description = document.getElementById('additem-description');
    description.innerText = `商品説明\n${registered_nikuman[id].description}`;
    let time = document.getElementById('additem-time');
    time.innerText = `必要蒸し時間:${registered_nikuman[id].time}分`;
    let cooking = 0;
    let cooked = 0;
    for (let i = 0; i < field.length; i++){
        for (let j = 0; j < field[i].length; j++){
            if (field[i][j].id == id) {
                item_count++;
                if (nowdate >= field[i][j].finish_time) {
                    cooked++;
                }
                else {
                    cooking++;
                }
            }
        }
    }
    let cooking_count = document.getElementById('additem-cooking');
    cooking_count.innerText = `蒸し中の個数:${cooking}`;
    let cooked_count = document.getElementById('additem-cooked');
    cooked_count.innerText = `蒸しあがった個数:${cooked}`;
    let cook_count = document.getElementById('additem-cook');
    cook_count.innerText = `追加する個数:${cook}`;
    let name = document.getElementById('additem-name');
    name.innerText = registered_nikuman[id].name;
    panel.style.display = "block";
}

function changeCookCount(num) {
    cook = Math.min(Math.max(1, cook + num), registered_nikuman[add_id].place.length * 3 - item_count);
    let cook_count = document.getElementById('additem-cook');
    cook_count.innerText = `追加する個数:${cook}`;
}

function decideAddItem() {
    let panel = document.getElementById('additem-panel');
    panel.style.display = "none";
    let finish = cook_date;
    finish.setMinutes(finish.getMinutes() + registered_nikuman[add_id].time);
    let left = cook;
    for (let j = 0; j < 3; j++){
        for (let k = 0; k < registered_nikuman[add_id].place.length; k++){
            if (field[registered_nikuman[add_id].place[k]].length <= j) {
                field[registered_nikuman[add_id].place[k]][j] = {
                    id: add_id,
                    create_time: cook_date,
                    finish_time: finish
                }
                left--;
                if (left <= 0) {
                    updateRender();
                    return;
                }
            }
        }
    }
}

function changeTab(tabname){
    console.log("onclick(ChangeTab)");
    let tab_selector = document.getElementsByClassName("tab-selector");
    let panel = document.getElementsByClassName("panel");
    for(let i = 0;i < tab_selector.length;i++){
        if(tab_selector[i].id == tabname){
            tab_selector[i].style.backgroundColor = "#428BCA";
            panel[i].style.display = "block";
        }
        else{
            tab_selector[i].style.backgroundColor = "transparent";
            panel[i].style.display = "none";
        }
    }
}

function changeEditTab(row){
    let item_selectors = document.getElementsByClassName("item-selector");
    let edit_tab_selector = document.getElementsByClassName("edit-tab-selector");
    for(let i = 0;i < item_selectors.length;i++){
        if(row == i){
            edit_tab_selector[i].style.backgroundColor = EDIT_TAB_COLOR[i];
            edit_tab_selector[i].style.borderBottomColor = "transparent";
            item_selectors[i].style.display = "flex";
            item_selectors[i].style.backgroundColor = EDIT_TAB_COLOR[i];
            
        }
        else{
            edit_tab_selector[i].style.backgroundColor = "transparent";
            edit_tab_selector[i].style.borderBottomColor = "#428BCA";
            item_selectors[i].style.display = "none";
        }
    }
}