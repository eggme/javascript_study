import axios from "axios";
import { sum } from "./math.js";
import './app.css';
import nyancat from './nyancat.jpg'
import result from './result';


console.log(sum(1,2));

document.addEventListener('DOMContentLoaded', async () => {
    document.body.innerHTML = `
        <img src="${nyancat}" />
        
    `


    // const res = await axios.get("/api/users")
    // console.log("axios res =>", res)

    let html = ``;
    // (res.data || []).map( user => {
    //     html += `<div>${user.id} : ${user.name}</div>`
    // })

    html += await result.render()
    console.log("innerHtml =>", html)
    document.body.innerHTML += html;
});

if( module.hot ) {
    console.log("핫 모듈 켜짐");

    module.hot.accept("./result", () => {
        console.log("result 모듈 변경됨");
    })
}