import { get_request, post_request } from "./database.js";

let least_data;
const meatbuts = window.document.getElementById("meatbuts");
function loop() {
    get_request("/db/get_place", place_data => {
        get_request("/db/get_fastest_mb", (objects) => {
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
                    }
                    else if (element["TimeLeft"] === 0) {
                        state = `<div class="edit-item"><div class="item-name">${element["TypeName"]}</div><div class="item-time">${element["Count"]}個調理済み</div></div>`;
                    } else {
                        state = `<div class="edit-item"><div class="item-name">${element["TypeName"]}</div><div class="item-time">あと${element["TimeLeft"]}分後に<br>${element["Count"]}個調理完了</div></div>`;
                    }
                    meatbuts.insertAdjacentHTML("beforeend", `${state}`);
                });
                least_data = JSON.stringify(objects);
            } else {
                //
            }
        });
    });

}
loop();
setInterval(() => {
    loop();
}, 1000);
