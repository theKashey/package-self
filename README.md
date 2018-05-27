# package-self

[![NPM](https://nodei.co/npm/package-self.png?downloads=true&stars=true)](https://nodei.co/npm/package-self/) [![Greenkeeper badge](https://badges.greenkeeper.io/theKashey/package-self.svg)](https://greenkeeper.io/)

The common mistake for any library is quite simple, but hard to spot.

> As a library creator you are testing you library __NOT__ as a library. 

Usually - one will run tests against /src folder. Usually - no one will test how 
final customer will use and consume your library.

This includes:
1. Your package was broken on build
2. Typing, you provided, is wrong
3. Babel magic wont work
4. You forget to write down a new file into your package.json
5. .....

## Solution

```js
npm install package-self

npm run package-self
```    
This will install a package as local dependency, next you can use in in your test

##### Before
```js
import myFunction from '../src/index.js'
declare('lets test it!'....)
```
You should not test yourself in as your self.

##### After
```js
import myFunction from 'myLibrary'
declare('lets test it!'....)
```
Not you can test yourself as your final user will use you.

### Hint
Not all tests could and should be run using the `real` bundle code.
But you shall test your public API using the code, you will ship to a customer, not local sources.

### PS
As we test this library.

PPS: Inspired by [React tooling bloppost](https://reactjs.org/blog/2017/12/15/improving-the-repository-infrastructure.html#simulating-package-publishing),
also some code has origins from that article. 

# Licence
MIT