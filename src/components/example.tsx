
function genericFunction<T>(something: T): T {
    console.log(something);
    return something;
}

let x = genericFunction<string>("Hello");
let y = genericFunction("Hello");

class GenericCollection<T extends Vehicle>{
    private collection: T[] = [];

    constructor(...item:T[]){
        item.forEach(element=>this.collection.push(element));
    }

    getCollection(){
        return this.collection;
    }

    findBrand(brand: string){
        return this.collection.filter(element=>element.brand === brand)
    }
}

interface Vehicle{
    make: string;
    brand: string;
}

//let numberCollection = new  GenericCollection<number>(1,3,5);
//let stringCollection = new  GenericCollection<string>("A", "B", "C");
let vehicleCollection = new GenericCollection<Vehicle>({make: 'Camry', brand:'Toyota'}, {make: 'Accord', brand:'Honda'});

//------------------------------------------------

/*
interface Item {
    id: string;
}

interface ItemConstructor {
    new(id: string): Item
}
*/

//------------------------------------------------

export interface Item {
    id: string;
}

interface ItemConstructor<T extends Item> {
    new(id: string): T
}

interface IdToItemMap<T extends Item> {
    [id: string]: T;
}

class ItemsCache<T extends Item> {
    private itemsCache: IdToItemMap<T>;

    constructor( private itemsConstructor: ItemConstructor<T> ) {
        this.itemsCache = {}
    }

    public createItem(id: string): T {
        if(!!this.itemsCache[id]){
            return this.itemsCache[id];
        }

        const item: T = new this.itemsConstructor(id);
        this.itemsCache[id] = item;

        return item;

    }

}

class Person implements Item {
    constructor ( public id: string) {

    }

}


const ItemCache = new ItemsCache<Person>(Person);

const person1 = ItemsCache.createItem();

//------------------------------------------------



function flip<A, B, R>(f: (a: A, b: B) => R): (b: B, a: A) => R {
    return (b, a) => f(a, b);
}

function id<T>(x: T): T {
    return x;
}

function fconst<X, Y>(x: X, y: Y): X {
    return x;
}

function fconst2<X, Y>(x: X, y: Y) {
    return x;
}

function addStr(x: number, y: string) {
    return x + y;
}

function tagged<T extends string, Q>(tag: T, value: Q): { tag: T, value: Q } {
    return { tag, value };
}

// it was working before
const f1 = flip(addStr); // (b: string, a: number) => string
const v1 = f1("hello", 3);
const v2 = id(id)("3"); // `3`

// working now
const f2 = flip(id);     // <T>(b: {}, a: T): T
const f3 = flip(fconst); // <Y, X>(b: Y, a: X) => X

const v3 = f3(1, "qw") // `"qw"`
const v4 = f3([], {})  // `{}`

const f4 = flip(tagged);   // <Q, T extends string>(b: Q, a: T) => { tag: T, value: Q }
const v5 = f4(5, "hello"); // { tag: "hello", value: number }
const v6 = f4(5, 5);       // Error as expected

declare function compose<A, B, C>(f: (b: B) => C, g: (a: A) => B): (a: A) => C;

declare const f: <T>(x:number) => T;
declare const g: (x:boolean) => number;
const f5 = compose(f, g)      // OUCH! this gets type `<T>(a: boolean) => T`

declare const g_2: <T>(x: T) => boolean;
declare const f_2: (x: boolean) => number;
const f6 = compose(f_2, g_2)  // <T> (a: T) => number
const f7 = compose(id, x => String(x)) // (a: {}) => string

// Was working, now not:
declare function h<R>(f: (x: number) => R): R;
var z: number = h(id);  // number ~ T, R ~ T
                        // backpropagation is now broken

const arr = [1, 2, 3].map(id); // T[]     Snap :(