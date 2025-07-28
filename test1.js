import {log, go, customMap, LazyTake} from "./fx.js";

go([Promise.resolve(1),Promise.resolve(2),Promise.resolve(3)],
    customMap(a => a + 10),
    LazyTake(a => a > 11),
    log);

console.log('test');

// C.reduce = (f, acc, iter) => iter ? reduce(f, acc, iter) : acc


function delay(a) {
    return new Promise(resolve => setTimeout(() => resolve(a), 500));
}

async function a1() {
    const a = await delay(10)
    const b = await delay(5)

    log("a1:", a + b);
    return a + b;
}

const s = a1();
log("s =", s)
s.then(log)