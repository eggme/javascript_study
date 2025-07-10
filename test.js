import * as basicFx from './fx.js';
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
log(L.range(5).reduce((a, b) => a + b));
log(...L.range(3));