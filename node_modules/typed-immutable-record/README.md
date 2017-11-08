# typed-immutable-record

[![CircleCI](https://circleci.com/gh/rangle/typed-immutable-record/tree/master.svg?style=svg)](https://circleci.com/gh/rangle/typed-immutable-record/tree/master)
[![npm version](https://img.shields.io/npm/v/typed-immutable-record.svg)](https://www.npmjs.com/package/typed-immutable-record)

`typed-immutable-record` lets you combine the advantages of [Typescript](https://github.com/Microsoft/TypeScript) interfaces with [Immutable Records](https://facebook.github.io/immutable-js/docs/#/Record), offering an easy and clean way to build immutable objects from plain Javascript objects ensuring types assertion.
 
## Table of Contents
 
 - [Installation](#installation)
 - [Quick Start](#quick-start)
 - [Usage](#usage)
 
## Installation
 
The module is on NPM and has a dependency of Immutable.js [package](https://www.npmjs.com/package/immutable) version 3.x.x. Thus you need to install both in order to use this library.

```sh
npm install --save immutable
npm install --save typed-immutable-record
```

## Quick Start

This module exposes a called `TypedRecord<T>` interface. This interface is an implementation of [Immutable.Map](https://facebook.github.io/immutable-js/docs/#/Map) that adjusts the return type of each function to the provided `<T>` type. In other words, all mutating operations in the Immutable.Record that would return a new version of itself is going to return a new version of `<T>` instead.

The following example shows how it looks in practice. The first step is import the interface from `typed-immutable-record` package and extend it.

```typescript
import {TypedRecord} from 'typed-immutable-record';

interface IAnimalRecord extends TypedRecord<IAnimalRecord> {}
```

This is half of everything you need to do. The only important thing to note is that there is still no benefit since the shape of the object you want to make Immutable is not yet defined. Thus, for the sake of simplicity, suppose our model can be described with two attributes:

```typescript
interface IAnimal {
  type: string;
  age: number;
}  
```
 
Lastly we have the shape of an acceptable javascript object (`Animal`) and a `TypedRecord<T>`, but they are isolated and have no relationship with each other. Basically, we want the shape to be part of the Record so that its properties can be accessed. This can be easily done with a simple change in the `AnimalRecord` interface:

```typescript
interface IAnimalRecord extends TypedRecord<IAnimalRecord>, IAnimal {} 
```

The difference is that now the `IAnimalRecord` is also an `IAnimal` and an Immutable.Record.

## Usage

`typed-immutable-record` also exposes a factory function, used to make Immutable.Records from a plain Javascript object. The usage is pretty straightforward and requires the user to provide the generic information to the Typescript compiler.

Based on both animals interfaces created above, we could generate a record in the following way: 

```typescript
import {makeTypedFactory} from 'typed-immutable-record';
 
/*
 create a plain javascript object that meets the requirements of the IAnimal interface 
 and represents the default values of the Immutable.Record
 */
const defaultAnimal = {
  type: null,
  age: 0
};

/*
 make the factory to enable the generation of animal records
 */
const AnimalFactory = makeTypedFactory<IAnimal, IAnimalRecord>(defaultAnimal);

/* 
 create a plain javascript animal object
 */
const cat = {
  type: 'Cat',
  age: 9
};

/* 
 create the typed record!
 */
const catRecord = AnimalFactory(cat);

/*
 performing updates on the record returns another IAnimalRecord
 and it will still be assignable to functions that requires 
 IAnimal or IAnimalRecord
 */
const dogRecord = catRecord.set('type', 'Dog');
console.log(dogRecord.type); // 'Dog'
console.log(dogRecord.age); // 9

/*
 It will also keep the original record factory properties, so that
 whenever you remove a property it defaults to the value when the 
 factory was created
 */
const puppyRecord = dogRecord.remove('age');
console.log(puppyRecord.age); // 0
console.log(puppyRecord.type); // 'Dog'

```

Remember that [Immutable.Records](https://facebook.github.io/immutable-js/docs/#/Record) have a default value for every property and deleting that property sets its value to the default value, and not `undefined`. In the example above, deleting the property `age` from the `catRecord` will make its value `0`.

Sometimes we don't care about the default state of an Immutable.Record, we just want that a plain object becomes a Record with the values it currently has. To support that, another function is exposed from `typed-immutable-record` that can generate a Immutable.Record in a one step operation.

Let us take a look how we can do that using the same `IAnimalRecord`: 

```typescript
import {recordify} from 'typed-immutable-record';

const dogRecord = recordify<IAnimal, IAnimalRecord>({
  type: 'Dog',
  age: 5
});
```
