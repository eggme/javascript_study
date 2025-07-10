import * as basicFx from './fx.js';
import {customMap} from "./fx.js";
export const module = await import("./fx.js");
let { log } = await import("./fx.js");

export const products = [
    { idx: 1, name: '반팔티', price: 15000, quantity: 1, isSelected: false },
    { idx: 2, name: '긴팔티', price: 20000, quantity: 2, isSelected: true },
    { idx: 3, name: '핸드폰케이스', price: 15000, quantity: 3, isSelected: false },
    { idx: 4, name: '후드티', price: 30000, quantity: 4, isSelected: true },
    { idx: 5, name: '바지', price: 25000, quantity: 5, isSelected: false },
]

// iterable map, filter, reduce

log(module.customReduce((a,b) => a + b, 0, module.customMap(p => p.price, module.customFilter(p => p.price > 20000, products))));

log(products.filter(p => p.price > 20000).reduce((a, b) => a + b.price));

log('test~~ log')
module.log("test~");
module.log(...basicFx.customMap(p => p.name + ", ",products));

const clazz = new module.TestClz("jun")
clazz.func("hi");
log(typeof module.TestClz);
log(typeof clazz);
log(module.TestClz === module.TestClz.prototype.constructor); // 클래스는 생성자 메서드와 동일함
log(module.TestClz.prototype.func); // 클래스 내부에서 정의한 메서드는 prototype 에 저장됨
log(Object.getOwnPropertyNames(module.TestClz.prototype)); // 현재 프로토 타입에서 두개의 메서드가 존재 [ 생성자, func ]

function foo(name) {
    this.name = name;
}
foo.field1 = 1;
log("foo.field1 ->", foo.field1);
log("foo.prototype ->", foo.prototype);
log("foo.prototype ->", foo.prototype.constructor === foo);

// go, pipe
// go 함수는 즉시 함수들과 인자를 전달해서 즉시 값을 평가하는데 사용
export const go = (...args) => module.customReduce((v, f) => f(v), args);
/// pipe 함수는 go 함수와 다르게,나열되어 있는 합성된 함수를 만드는 함수
const pipe  = (...fs) => (a) => (go(a, ...fs))
const f = pipe(
    a => a + 1,
    a => a + 10,
    a => a + 100,
);

log(f(0));
go (0, a => a + 1, a => a + 10, a => a + 100, log);
log("=====")
log("=====")
go(products,
    module.customFilter(p => p.price > 20000),
    module.customMap(p => p.price),
    module.customReduce((v, p) => v + p),
    log
)

// curry => 함수를 받아서 내가 원하는 시점에서 함수를 평가하는

const curry = f => (a, ..._) => _.length ? f(a, ..._) : (..._) => f(a, ..._);
const multi = curry((a, b) => a * b);
const multi3 = multi(3)
log(multi3(5));

// 함수 조합으로 함수 만들기
const totalPrice = pipe(
    module.customMap(p => p.price),
    module.customReduce((v, p) => v + p)
)

const basedTotalPrice = f => pipe(
    module.customFilter(f),
    totalPrice
)

const showLog = f => log(f)

log("==================== combine function")
go(products, basedTotalPrice(p => p.price > 20000), showLog);


log("총 수량 =>", products.map(p => p.quantity).reduce((a, b) => a + b), "개");

const sumOf = v => pipe(
    module.customMap(v),
    module.customReduce((v, p) => v + p)
)

const multiply = p => p.price * p.quantity

export const totalQuantity = products => go(products, sumOf(p => p.quantity))
export const totalPrice1 = products => go(products, sumOf(multiply))

export function comma(a) {
    if (typeof a === "number") {
        const text = a.toString();
        return text.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    } else if (typeof a === "string") {
        return a.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }else {
        return a
    }
}

log("총 수량 =>", totalQuantity(products), "개", "총 가격 =>", comma(totalPrice1(products)), "원")


const range = l => {
    const result = [];
    for(let i = 0; i<l; i++) {
        result.push(i)
    }
    return result;
}
log(range(5))
log(range(3))

const L = {};
L.range = function *(l) {
    for (let i = 0; i<l; i++) {
        yield i;
    }
}
log("=============== iterator")
log(...L.range(5));
log(...L.range(3));


function test(name, time, f) {
    console.time(name);
    while(time--) f();
    console.timeEnd(name);
}
const add = (a, b) =>  a + b;

test('range', 10, () => module.customReduce(add, range(1000000)));
test('L.range', 10, () => module.customReduce(add, L.range(1000000)));

const take = curry((l, iter) => {
    let res = [];

    for(const a of iter) {
        res.push(a)
        if( res.length === l ) return res;
    }
    return res;
})
// 제너레이터를 쓰면 일반 반복보다는 좀 더 느리지만, filter, skip 등... 메모리 절약이나 지연처리가 핵심
console.time('range');
log(take(5, range(10000000)));
console.timeEnd('range');
console.time('L.range');
log(take(5, L.range(1000000)));
console.timeEnd('L.range');

// 평가를 미루는 성질을 가지고 평가 순서를 달리 조작할 수 있는 이터레이터?
L.map = curry(function *(f, iter) {
    for(const a of iter) {
        yield f(a);
    }
})

var it = L.map(a => a + 10, [1,2,3]);
log([...it])
// log(it.next());
// log(it.next());
// log(it.next());

L.filter = curry(function *(f, iter) {
    for(const a of iter) {
        if( f(a) ) yield a;
    }
})

log([...L.filter(a => a > 2, [1,2,3,4])])


go(
    L.range(10),
    L.map(n => n + 10),
    L.filter(n => !(n % 2)),
    take(2),
    log
)

const queryStr = (obj) => {
    return go(
        obj,
        Object.entries,
        module.customMap(([k, v]) => `${k}=${v}`),
        module.customReduce((v, p) => `${v}&${p}`)
    )
}

L.entries = function *(obj) {
    for(const a in obj) yield [a, obj[a]];
}

const pipeQueryStr = pipe(
    L.entries,
    p => {
        log(p)
        return p
    },
    module.customMap(([k, v]) => `${k}=${v}`),
    module.customReduce((v, p) => `${v}&${p}`)
)


log(queryStr({limit: 10, page: 0, type: 'notice'}));
log(pipeQueryStr({limit: 10, page: 0, type: 'notice'}));


const joinToString = curry((sep = ',', iter) => {
    return module.customReduce((a, b) => `${a}${sep}${b}`, iter)
})

go(products,
    customMap(m => m.name),
    joinToString(),
    log
)

const first = curry((f, iter) => {
    let data;
    for(const a of iter) {
        if( f(a) ) {
            data = a;
            break;
        }
    }
    return data
})

const firstOrNull = (f, iter) => go(
    iter,
    first(f)
)

const users = [
    {age: 32},
    {age: 31},
    {age: 37},
    {age: 28},
    {age: 25},
    {age: 32},
    {age: 31},
    {age: 37},
    {age: 40},
]

const takeAll = (iter) => {
    let result = [];
    for(const a of iter) {
        result.push(a);
    }
    return result;
}

const find = (f, iter) => go(
    iter,
    module.customFilter(f),
    take(1),
    ([a]) => a
)

log(find(u => u.age > 35, users));
log(firstOrNull(u => u.age === 40, users));

const isIterable = v => v && v[Symbol.iterator];

// flatten
L.flatten = function *(iter) {
    for(const a of iter) {
        if( isIterable(a) ) {
            // for(const b of a) { // 아래의 yield *a; 와 로직이 같음
            //     yield b;
            // }
            yield *a;
        } else {
            yield a;
        }
    }
}

// deepFlatten
L.deepFlatten = function *f(iter) {
    for(const a of iter) {
        if( isIterable(a) ) {
            // for(const b of a) { // 아래의 yield *a; 와 로직이 같음
            //     yield b;
            // }
            yield *f(a);
        } else {
            yield a;
        }
    }
}

let list2 = [[1,2], 3, 4, [5, 6], [7, 8, 9]];
let list3 = [[1,2], 3, 4, [5, 6], [7, 8, 9], [10, [11, 12, [13, 14]]]];
let result2 = L.flatten(list2)

const flatten = pipe(L.flatten, takeAll)
const deepFlatten = pipe(L.deepFlatten, takeAll)
log(...flatten(list2));
log(...deepFlatten(list3));
log(take(3, result2));

// flatMap
let flatList = [[1,2], [4,5], [6,7,8], 9, 10, [11]];
log(...flatList.flatMap(a => a));
log(...flatList.flatMap(a => a).map(a => a + 10));

L.flatMap = curry(L.deepFlatten)
log(flatList)
go(flatList, L.deepFlatten, log)

const it2 = L.flatMap(a => a, flatList)
log([...it2])
















