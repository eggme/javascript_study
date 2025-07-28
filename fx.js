export const log = console.log;
export let name1, name2;
export let name3 = 3, name4 = 4;
export function testFunc(){
    return "test func call~~"
}

const go1 = (a, f) => a instanceof Promise ? a.then(f) : f(a);

export const go = (...args) => customReduce((v, f) => f(v), args);

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
        const data = go1(p, func)
        names.push(data);
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
    } else {
        iter = iter[Symbol.iterator]();
    }
    return go1(acc, function reucr(acc) { // 유명함수
        let cur;
        while(!(cur = iter.next()).done) {
            const a = cur.value;
            acc = func  (acc, a);
            if( acc instanceof Promise) return acc.then(reucr);
        }
        return acc;
    });
})

export const LazyMap = curry((f, iter) => {
    let res = [];
    iter = iter[Symbol.iterator]();
    let cur;
    while(!(cur = iter.next()).done) {
        res.push(f(cur.value));
    }
    return res;

})

export const LazyFilter = curry((f, iter) => {
    let res = [];
    iter = iter[Symbol.iterator]();
    let cur;
    while(!(cur = iter.next()).done) {
        const v = cur.value
        if( f(v) ) res.push(v);
    }
    return res;
})

export const LazyReduce = curry((f, acc, iter) => {
    if( !iter ) {
        iter = acc[Symbol.iterator]();
        acc = iter.next().value;
        // log("acc =>", acc)
    } else {
        iter = iter[Symbol.iterator]();
    }
    let res = [];
    let cur;
    while(!(cur = iter.next()).done) {
        const v = cur.value
        acc = f(acc, v);
    }
    return res;
})

export const LazyTake = curry((f, iter) => {
    let res = [];
    iter = iter[Symbol.iterator]();
    return function recur() {
        let cur;
        while(!(cur = iter.next()).done) {
            const v = cur.value
            if ( v instanceof Promise ) return v.then(a => {
                res.push(a)
                return f(a) ? res : recur();
            });
            res.push(v);
            if( f(v) ) return res;
        }
        return res;
    }();
})