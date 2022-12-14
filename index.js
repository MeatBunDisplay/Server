const date_element = document.getElementById("date");
const WEEK = ["日", "月", "火", "水", "木", "金", "土"];

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

function test(){
    alert("Hello world");
}

function changeTab(tabname){
    console.log("onclick");
    let tab_selector = document.getElementsByClassName("tab-selector");
    let panel = document.getElementsByClassName("panel");
    for(let i = 0;i < tab_selector.length;i++){
        if(tab_selector[i].id == tabname){
            tab_selector[i].style.backgroundColor = "#428bca";
            panel[i].style.display = "block";
        }
        else{
            tab_selector[i].style.backgroundColor = "transparent";
            panel[i].style.display = "none";
        }
    }
}