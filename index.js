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
    }
];

/**
 * @type {[[{
 *  create_time: date,
 *  id: number,
 * }]]}
 */
let field = [[]];

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
    let date = new Date();
    date_element.innerText = `${date.getFullYear()}年${date.getMonth()+1}月${date.getDate()}日(${WEEK[date.getDay()]}) ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}`;
}

function updateRender() {
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
        render_item.onclick = () => { clickAddItem(number, new Date()); }
        add_items.appendChild(render_item);
    }

}

function clickAddItem(id, date) {
    console.log("onclick(AddItem)");
    let panel = document.getElementById('additem-panel');
    let description = document.getElementById('additem-description');
    description.innerText = `商品説明\n${registered_nikuman[id].description}`;
    let time = document.getElementById('additem-time');
    time.innerText = `必要蒸し時間:${registered_nikuman[id].time}分`;
    panel.style.display = "block";
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