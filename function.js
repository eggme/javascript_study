const log = console.log;

// 변하지 않는 값은 const
// 변하는 값 let
const name = "seungjun lee"
const text = `hello ${name}`;

console.log(text);

// NaN => Not a Number

const a = 1;
const b = "1";
log("===================");
console.log(a == b); // 동급 연산자, 값만 비교함
console.log(a === b); // 일치 연산자, 타입까지 비교함
log("===================");
for(let i = 0; i< 10; i++) {
    console.log(`index[${i}]`);
}
log("===================");
// ES6 에서의 리스트 순회
// 기존 방식
const list = [1, 2, 3];
for(var i = 0; i < list.length; i++) {
    log(list[i]);
}
log("===================");
for(const i of list) {
    log(i);
}
log("===================");
// array, set, map
const array = [1, 2, 3];
for(const i of array) { log("array:", i); }
log("=================== array 는 index 로 접근이 가능함");
log(array[0]);
log(array[1]);
log("===================");
const set = new Set([1, 2, 3]);
for(const i of set) { log("set:", i); }
log("=================== set 은 index 로 접근이 불가능함");
log(set[0]);
log(set[1]);
log("===================");
const map = new Map([['a', 1], ['b', 2], ['c', 3]]);
for(const i of map) { log("map: ", i); }
log("=================== map 은 key 로 접근이 불가능함");
log(map['a']);
log(map['b']);
log("=================== 이런식으로 foreach 처럼 접근이 가능한것은 iterable / iterator 으로 가능함");
const iteratorMap = map[Symbol.iterator]()
log(iteratorMap.next());
log(iteratorMap.next());
log("===================");
log(map.values());
log(map.keys());
log(map.get('a'));
log("===================");
// iterable : 이터레이터를 리턴하는 [Symbol.iterator]() 를 가진 값
// iterator : { value, done } 객체를 리턴하는 next() 를 가진 값
// iterable / iterator protocol : iterable 을 for...of , 전개 연산자 등과 함께 동작하도록 한 규약

const iterator = map[Symbol.iterator]();
log("iterator:", iterator.next());
log("iterator:", iterator.next());
log("iterator:", iterator.next());

log("===================");
const customIterable = {
    [Symbol.iterator]() {
        let i = 3;
        return {
            next() {
                return i == 0 ? { done: true} : { value: i--, done: false };
            },
            [Symbol.iterator]() { return this; }
        }
    }
}
const customIterator = customIterable[Symbol.iterator]();
log(customIterator.next());
log(customIterator.next());
log(customIterator.next());
log(customIterator.next());
log(customIterator.next());
log("===================");

const arr2 = [1, 2, 3];
let iter2 = arr2[Symbol.iterator]();
iter2.next();
log(iter2[Symbol.iterator]() == iter2)
// iterator 가 자기 자신을 반환하는 Symbol iterator 메서드를 가지고 있을 때 iterator 를 welcomedIterator 라고 함
for(const i of iter2) { log(i); }


log("===================");
const arr3 = [1, 2];
console.log(...arr3);
// arr3[Symbol.iterator] = null; // 모두 iterator를 사용하여, 이렇게 선언하면 아래에서 에러가 남
console.log([...arr3, ...[3,4]]); // 합칠 수도 있음
log("===================");
// 제너레이터 / 이터레이터
// - 제너레이터: 이터레이터이자 이터러블을 생성하는 함수, 함수 앞에 *를 붙임

function *gen() {
    yield 1;
    yield 2;
    yield 3;
    return 100; // return 값은... 마지막 done을 했을 때의 값
}

let iter5 = gen()
log(iter5[Symbol.iterator]() == iter5);
log(iter5.next());
log(iter5.next());
log(iter5.next());
log(iter5.next());

// yield → 제너레이터 함수를 중지하거나 재개하는데 사용 됌

function *infinity(i = 0) {
    while(true) yield i++;
}

function *limit(l, iter) {
    for(const a of iter) {
        yield a;
        if( a == l ) return;
    }
}

function *odds2(l) {
    for (const a of limit(l, infinity(1))) {
        if( a % 2 ) yield a;
        if( a == l ) return
    }
}

let iter6 = odds2(10);
log(iter6.next());
log(iter6.next());
log(iter6.next());
log(iter6.next());
log(iter6.next());
log(iter6.next());
log(iter6.next());


for(const a of odds2(40)) { log(a) }

// map
const products = [
    { name: '반팔티', price: 15000 },
    { name: '긴팔티', price: 20000 },
    { name: '핸드폰케이스', price: 15000 },
    { name: '후드티', price: 30000 },
    { name: '바지', price: 25000 },
]


let nameList = [];
let priceList = [];
for(const p of products) {
    nameList.push(p.name);
    priceList.push(p.price);
}

const mapList = (f, iter) => {
    let names = [];
    for(const p of iter) {
        names.push(f(p));
    }
    return names
}

log(mapList(p => p.name, products));
log(mapList(p => p.price, products));




// 다형성
// log(document.querySelectorAll('*'));
log([1,2,3].map(a => a + 1));

let m1 = new Map();
m1.set('a', 10);
m1.set('b', 20);
const it = m1[Symbol.iterator]();
log(it.next());
log(it.next());
log(it.next());
log(mapList(([k,a]) => [k, a*2], m1));

// filter
log("====================== foreach")
let under20000 = [];
for(const p  of products) {
    if(p.price < 20000) under20000.push(p);
}
log(...under20000);

let over20000 = [];
for(const p  of products) {
    if(p.price > 20000) over20000.push(p);
}
log(...over20000);

const filter = (condition, iter) => {
    let result = [];
    for(const tmp of iter) {
        if( condition(tmp) ) result.push(tmp)
    }
    return result;
}
log("====================== customer filter");
log(...filter (p => p.price > 20000, products));
log(...filter(p => p.price < 20000, products));
log("====================== built-in filter");
log(...products.filter( p => p.price > 20000));
log(...products.filter( p => p.price < 20000));
log("====================== anonymous filter");
log(...filter(condition = p => p % 2 === 1, iter = function*() {
    yield 1;
    yield 2;
    yield 3;
    yield 4;
    yield 5;
}()));

// reduce 값을 축약하는 함수
const nums = [1,2,3,4,5];
log(...nums);
let total = 0;
for( const q of nums ) {
    total = total + q;
}
log(total);

const reduce = (func, acc, iter) => {
    for(const t of iter) {
        acc = func(acc, t);
    }
    return acc
};
const add = (a, b) =>  a + b;
log(reduce(add, 0, [1,2,3,4,5]));
log(add(add(add(add(add(0, 1),2),3),4), 5));
log("====================== built-in reduce");
log(nums.reduce((a,b) => a + b));
log(nums.reduce((a,b, idx) => {
    log("idx =>", idx, a, b)
    if(idx > 0) {
        return a + b
    } else {
        return 0
    }
}));

log(reduce((totalPrice, product) => totalPrice + product.price, 0, products));
log(products.reduce((totalPrice, product) => totalPrice + product.price, 0));































































