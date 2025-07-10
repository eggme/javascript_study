export const log = console.log;
export let name1, name2;
export let name3 = 3, name4 = 4;
export function testFunc(){
    return "test func call~~"
}


const curry = f => (a, ..._) => _.length ? f(a, ..._) : (..._) => f(a, ..._);

export class TestClz {
    constructor(name) {
        this.name = name;
    }

    func(b) {
        log(b + " " + this.name);
    }
}

export const customMap = curry((func, iter) => {
    let names = [];
    for(const p of iter) {
        names.push(func(p));
    }
    return names
})



export const customFilter = curry((func, iter) => {
    let result = [];
    for(const tmp of iter) {
        if( func(tmp) ) result.push(tmp)
    }
    return result;
})

export const customReduce = curry((func, acc, iter) => {
    // log("!iter ->", !iter)
    if( !iter ) {
        iter = acc[Symbol.iterator]();
        acc = iter.next().value;
        // log("acc =>", acc)
    }
    for(const t of iter) {
        acc = func(acc, t);
    }
    return acc
})