import { get_request, post_request } from "./database.js";

let least_data;
const meatbuts = window.document.getElementById("meatbuts");
let row_offset = 50;
let row_margin = 300;

document.addEventListener('keydown', keyEvent);

function keyEvent(e) {
    switch (e.key) {
        case "ArrowUp":
            row_offset += 5;
            break;
        case "ArrowDown":
            row_offset -= 5;
            break;
        case "ArrowRight":
            row_margin++;
            break;
        case "ArrowLeft":
            row_margin--;
            break;
    }
    meatbuts.style.marginTop = `${row_offset}px`;
    meatbuts.style.gridTemplateRows = `repeat(5, ${row_margin}px)`;
}

function loop() {
    get_request("/db/get_place", place_data => {
        get_request("/db/get_fastest_mb", (objects) => {
            if (objects.length) {
                if (JSON.stringify(objects) != least_data) {
                    place_data.sort((a, b) => { return a["PlaceID"] - b["PlaceID"] });
                    meatbuts.innerHTML = "";
                    const place_obj_data = place_data.map(data => {
                        const target_obj = objects.find(obj => obj["TypeID"] === data["Type"]);
                        if (target_obj === undefined) return null;

                        objects = objects.filter(obj => obj["TypeID"] !== target_obj["TypeID"]);
                        return target_obj;
                    });
                    place_obj_data.forEach((element) => {
                        let state;
                        if (element === null) {
                            state = `<div class="edit-item"><div class="item-name"></div><div class="item-time"></div></div>`;
                        } else {
                            let count_block = ``;
                            for (let i = 0; i < element["Cooked"]; i++) {
                                count_block += `<img src="media/icon/mb_icon.svg" height="30px" width="30px">`;
                            }
                            let cooking = ``;
                            if (element["Cooking"] === null) cooking = `調理中　：`;
                            else {
                                cooking += `調理中　：`
                                for (let i = 0; i < element["Cooking"]; i++) {
                                    cooking += `<img src="media/icon/mb_icon.svg" height="30px" width="30px">`;
                                }
                            }
                            let time_left = ``;
                            if (element["FC"] > 0) time_left = `あと${Math.ceil(Number(element["TimeLeft"].replaceAll(":",""))/100)}分後に${element["FC"]}個調理完了`;

                            if (element["IsCooked"] === 1) {
                                state = `<div class="edit-item"><div class="item-name">${element["TypeName"]}</div><div class="price">${element["TypePrice"]}円(税込み)</div><div class="item-time">調理済み：${count_block}</div><div class="item-time">${cooking}</div><div class="item-time">${time_left}</div></div>`;
                            } else {
                                state = `<div class="edit-item"><div class="item-name">${element["TypeName"]}</div><div class="price">${element["TypePrice"]}円(税込み)</div><div class="item-time">調理済み：</div><div class="item-time">${cooking}</div><div class="item-time">${time_left}</div></div>`;
                            }
                        }
                        meatbuts.insertAdjacentHTML("beforeend", `${state}`);
                    });
                    least_data = JSON.stringify(objects);
                }
            } else {
                meatbuts.innerHTML = "";
                least_data = "";
            }
        });
    });

}
loop();
setInterval(() => {
    loop();
}, 1000);