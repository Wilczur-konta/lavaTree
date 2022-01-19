let d = function (schema, state) {

}

let bla = {
    key__v: {
        variant1: {
            key1: "String",
            key2: "String"
        },
        variant2: {
            key1: "String",
            key2: "String",
            key3: {
                key3_1: "String",
                key3_2: "String",
                key3_3: "String"
            }
        }
    }
}


console.log(JSON.stringify(bla, 0, 2))