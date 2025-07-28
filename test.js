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

function add10(a, callback) {
    setTimeout(() => callback(a + 10), 1000)
}

var a = add10(5, res => {
    log(res);
})
log("test~");
log(a);
function add20(a) {
    return new Promise(resolve => setTimeout(() => resolve(a + 20), 1000));
}

var b = add20(5) // promise <-> callback function , promise 는 대기와 성공과 실패를 다루는 일급 값으로 이루어져 있음, 비동기 적인 것을 값으로 만들어서
    .then(add20)
    .then(add20)
    .then(res => {
        log(res);
        return res
    })
    .then(a => a)
    .catch(a => a)
    .finally(() => {
        log('try catch finally~~');
    })
;

log(b); // 코드를 평가 했을 때 즉시 promise 가 리턴됨, 비동기 상황을 값으로 가지고 있어서, 다른 함수에 전달이나 여러가지가 작업이 가능함
// Promise 는 비동기 작업의 성공 또는 실패를 처리할 수 있는 자바스크립트 객체, 주로 서버 통신, 파일 읽기, 타이머 같은 시간이 걸리는 작업에서 사용됩니다.
// 상태
// pending -> 대기 중 (아직 결과가 없음)
// fulfilled -> 성공적으로 완료됨 (resolve)
// rejected -> 실패함 (reject)

// 자주쓰이는 static 메서드
// Promise.resolve(val) -> 이미 성공된 Promise 생성
// Promise.reject(err) -> 이미 실패된 Promise 생성
// Promise.all([...]) -> 모든 Promise가 성공해야 완료됨
// Promise.race([...]) -> 가장 먼저 끝난 Promise로 결과 결정
// Promise.allSettled([...]) -> 모든 결과를 성공/실패 구분 없이 반환




b.then(res => {
    log("중간점검 : ", res)
    return res;
}).then(add20)
    .then(res => {
    log("res => ", res)
});

const delay100 = a => new Promise(resolve => {setTimeout(() => resolve(a), 100)})

const go1 = (a, f) => a instanceof Promise ? a.then(f) : f(a);
const add5 = a => a + 5
var r1 = go1(go1(10, add5), log);
var r2 = go1(go1(delay100(10), add5), log);
log(r1)
log(r2)
// 비동기 상황에서 함수 합성을 안전하게 하려는 모나드
// f . g
// f(g(x));

const g = a => a + 1;
const ff = a => a * a;
log(ff(g(1)));
log(ff(g())); // 빈값이 들어오면 빈 값으로 처리를 해버림...
[1].map(g).map(ff).forEach(r => log(r));
[].map(g).map(ff).forEach(r => log(r)); // 값이 없으면 아예 실행을 안하니까...
[1, 2, 3].map(g).filter(r => r % 2).map(ff).forEach(r => log(r)); // 값이 없으면 아예 실행을 안하니까...

Array.of(1).map(g).map(ff).forEach(r => log(r));
Promise.resolve(1).then(g).then(ff).then(r => log(r));
// 함수를 합성하는 시점을 안전하게 만듦

// kleisli composition -> 오류가 있을 수 있는 상황에서 함수 합성을 안전하게 하는 하나의 규칙
// 들어오는 인자가 아예 잘못된 값이라서 함수에서 오류가 나는 상황이라든지...
// f1 . g1
// f1(g1(x)) = f1(g1(x));

var users3 = [
    {id : 1, name : 'aa'},
    {id : 2, name : 'bb'},
    {id : 3, name : 'cc'}
]

const getUserByIdWithAwait = (id) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            log('setTimeout 실행~');
            const user = users3.find(u => u.id === id);
            if ( user ) {
                resolve(user);
            } else {
                reject("찾을 수 없음");
            }
        }, 1000);
    })
}

getUserByIdWithAwait(1) // try ~ catch 방식
    .then(user => {
        log('then 사용자:', user.name)
    })
    .catch(err => {
        log('에러:', err)
    })

const run = async () => {
    try {
        const user = await getUserByIdWithAwait(1);
        log('await 사용자:', user.name)
    }catch (err) {
        log('찾을 수 없음')
    }
}

run();

const getUserById = id => users3.find(u => u.id === id) || Promise.reject('없음~~')
const f3 = ({name}) => name;
const g3 = getUserById;

const fg = id => f3(g3(id))
const fg2 = id => Promise.resolve(id).then(g3).then(f3).catch(a => a);

log(fg(2) === fg(2));
users3.pop();
users3.pop();
log(users3);

// log(fg(2));

log(fg2[2]);

fg2(2).then(log);
// console.clear()
log("======================================================");
go(Promise.resolve(1),
    a => a + 10,
    a => a + 100,
    a => Promise.reject("실패요~!!!"),
    a => Promise.resolve(a + 1000),
    a => a + 10000,
    a => {
        log('끝~~~', a);
        return a
    }
).catch(a => console.log(a));

// promise.then 의 중요한 규칙
log("========================================== ~_~ ==========================================")
Promise.resolve(Promise.resolve(Promise.resolve(1))).then(log);
// promise 가 중첩이된다해도 원하는 곳에서 한번에 then으로 꺼내서 쓸 수 있음


















