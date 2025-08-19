import axios from "axios";
import { sum } from "./math.js";
import './app.css';
import nyancat from './nyancat.jpg'

console.log(sum(1,2));

document.addEventListener('DOMContentLoaded', async () => {
    document.body.innerHTML = `
        <img src="${nyancat}" />
        
    `


    const res = await axios.get("/api/users")
    console.log("axios res =>", res)

    let html = ``;
    (res.data || []).map( user => {
        html += `<div>${user.id} : ${user.name}</div>`
    })
    console.log("innerHtml =>", html)
    document.body.innerHTML += html;
});