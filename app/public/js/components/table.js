"use strict";

module.exports = function(){
    let test = 'table component';
    console.log('>>',test,'<<');
    let promise = new Promise((resolve) => {
        setTimeout(resolve, 500, 'promise resolved after 500 ms');
    });
    promise.then(console.log.bind(console))
};