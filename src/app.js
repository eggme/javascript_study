import { sum } from "./math.js";
import './app.css';
import nyancat from './nyancat.jpg'

console.log(sum(1,2));

document.addEventListener('DOMContentLoaded', () => {
    document.body.innerHTML = `
        <img src="${nyancat}" />
    `
});