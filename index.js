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
let registered_nikuman = [];

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

function changeTab(tabname){
    console.log("onclick");
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