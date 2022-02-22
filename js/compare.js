let linesModule = require('../line_of_code')

let testFile = require("../tests/fileExample.json");
let testSchema = require("../tests/schemaExample.json")

let stringOk = ["poprawne string", []]
let numberOk = ["poprawne number", []]
let booleanOk = ["poprawne boolean", []]

let emptyObjects = ["empty object", []]

let keyInFileZwykle = ["FILE - Klucze zwykłe"]
let keyInFileWersjonowane = ["FILE - Klucze wersjonowane"]

let keyInSchemaZwykle = ["SCHEMAT - Klucze zwykłe"]
let keyInSchemaWersjonowane = ["SCHEMAT - Klucze wersjonowane"]

let keyOfError = []
console.log(testFile)
exports.compare= compare = (file, schema, param) => {
    console.log(param)
    console.log(file)
    console.log(schema)
    console.log(keyOfError)



    // if atomic
    if (typeof file !== 'object' && !Array.isArray(file) && !Array.isArray(schema)) {
        if (typeof file === "string" && schema === "String") {
            stringOk[1].push(file + ":" + schema)
        }else if(typeof file === "number" && schema === "Number"){
            numberOk[1].push(file + ":" + schema)
        }else if(typeof file === "boolean" && schema === "Boolean"){
            booleanOk[1].push(file + ":" + schema)
        } else {throw `Error -In schema type of value:${typeof schema} {${param}:"${schema}"}, in file type of value: ${typeof file} {${param}:${file}}`}
    } // jeśli jest obiektem, nie jest arrayem i nie jest pustym obiektem
    else if (typeof file === 'object' && typeof schema === 'object' && !Array.isArray(file) && !Array.isArray(schema) && Object.keys(file).length !== 0 && Object.keys(schema).length !== 0) {
        console.log("pliki sa obiektem")
        console.log("__________________________________________________")
        //console.log(file)
        //console.log(schema)

        for (let keyInFile in file) {
            console.log("key in File  " + keyInFile)

            let valueOfKeyInFile = file[keyInFile]
            console.log(valueOfKeyInFile)

            if (!keyInFile.includes("_")) {

                console.log("------ BEZ --------")
                console.log(keyInFile)

                let deepSearch = (obj, searchedKey) => {

                    console.log(Object.keys(obj))
                    if (Object.keys(obj).includes(searchedKey)) {  //if "klucze schematu" zawieraja szukany "klucz z pliku"

                        let valueOfKeyInSchema = obj[searchedKey]
                        console.log(valueOfKeyInSchema)                         // wartość znalezionego klucza ze schematu

                        console.log("****************")
                        //keyOfError.push(keyInFile)

                        compare(valueOfKeyInFile, valueOfKeyInSchema,keyInFile)           // wartosc klucza z pliku / wartosc klucza schematu
                    } else {
                        throw `Error - this key is in file, and is missing in schema  ${JSON.stringify(searchedKey)}`
                    }
                }
                deepSearch(schema, keyInFile,)

            } else if (keyInFile.includes("_")) {

                console.log("------ Z --------")
                console.log("key in File  " + keyInFile)
                let prefix = (keyInFile.substring(0, keyInFile.indexOf("_"))) + "__v"
                let sufix = (keyInFile.substring(keyInFile.lastIndexOf("_")).replace("_", ""))
                console.log(prefix)
                console.log(sufix)

                let deepSearchII = (obj, searchedKey) => {

                    console.log(Object.keys(obj))                  // klucze w schemacie
                    if (Object.keys(obj).includes(searchedKey)) {  //if "klucze schematu" zawieraja szukany "klucz z pliku"

                        let valueOfKeyInSchema = obj[searchedKey] // wartość znalezionego klucza w schemacie
                        console.log(valueOfKeyInSchema)  //tu brać teraz drugi człon - osobowe      //   wartość znalezionego klucza ze schematu
                        // wyznaczyc sufix !!! osobowe i dalej szukać
                        // za wczesnie teraz jest compare

                        //
                        let deepSearch = (obj, searchedKey) => {

                            let keyInSchema=Object.keys(obj)
                            if (Object.keys(obj).includes(searchedKey)) {  //if "klucze schematu" zawieraja szukany "klucz z pliku"

                                let valueOfKeyInSchema = obj[searchedKey]
                                console.log(valueOfKeyInSchema)                         // wartość znalezionego klucza ze schematu



                                console.log("****************")
                                compare(valueOfKeyInFile, valueOfKeyInSchema, param)           // wartosc klucza z pliku / wartosc klucza schematu
                            } else {
                                throw `Error - in file: ${keyInFile}, in schema in ${prefix} - missing: "${sufix}"  `
                            }
                        }
                        deepSearch(valueOfKeyInSchema, sufix)
                        //

                        console.log("****************")
                        //compare(valueOfKeyInFile,valueOfKeyInSchema)           // wartosc klucza z pliku / wartosc klucza schematu
                    }
                                  }
                deepSearchII(schema, prefix)
            }
        }
    } // jeśli jest obiektem, nie jest arrayem jest pustym obiektem
    else if (typeof file === 'object' && typeof schema === 'object' && Object.keys(file).length === 0 && Object.keys(schema).length === 0) {
        emptyObjects[1].push(file + ":" + schema)
    } //jesli są obiektami, obiekt w pliku jest 0 a obiekt w schemacie jest >0 i plik nie jest arrayem
    else if(typeof file === 'object' && typeof schema === 'object' && Object.keys(file).length === 0 && Object.keys(schema).length !== 0 && !Array.isArray(file) ){
        throw `Error - for key: ${param} in file value is ${JSON.stringify(file)}, in schema value is ${JSON.stringify(schema)}`
    }

    //jest arrayem i jest pustym obiektem
    else if(Array.isArray(file) && Array.isArray(schema) && file.length===0 && schema.length===0){
        emptyObjects[1].push(file + ":" + schema)

    }
    //jeśli jest arrayem
    else if (Array.isArray(file) && Array.isArray(schema)) {
        console.log(param)
        console.log("obiekt jest arrayem")
        console.log(file)
        console.log(file.length)
        console.log(schema)

        console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%")

        file.forEach(arrayElement=>{
            console.log("-----------")
            console.log(arrayElement)

            if(typeof arrayElement==='string'|| typeof arrayElement==='number' ||typeof arrayElement==='boolean'){
                if (typeof arrayElement === "string" && schema[0] === "String") {
                    stringOk[1].push(arrayElement + ":" + schema)
                }else if(typeof arrayElement === "number" && schema[0] === "Number"){
                    numberOk[1].push(arrayElement + ":" + schema)
                }else if(typeof arrayElement === "boolean" && schema[0] === "Boolean"){
                    booleanOk[1].push(arrayElement + ":" + schema)
                }else {throw `Error in array: In schema {key:${JSON.stringify(param)} value:${JSON.stringify(schema)}}, in json {key:${JSON.stringify(param)} value:${JSON.stringify(file)}}, wrong item in file: ${JSON.stringify(arrayElement)}`}
            } else if(typeof arrayElement==='object'){
                console.log("element w array")

                console.log(arrayElement)

                console.log(file)
                console.log(schema)
                console.log(schema[0])
                compare(arrayElement,schema[0])
            }
        })
        if(file.length===0){
            console.log("zero")
            console.log(file)
            console.log(schema)

            stringOk[1].push("[]"+ ":" +schema)
        }
    }

    if (typeof schema === "object" && !Array.isArray(schema)) {

            for (let keyInSchema in schema) {
                console.log("klkl")
                console.log(keyInSchema)
                if (!keyInSchema.includes("_")) {
                    console.log("lllllllllllllllllllllllllll")
                    console.log(keyInSchema)
                    keyInSchemaZwykle.push(keyInSchema)
                } else if (keyInSchema.includes("_")) {
                    keyInSchemaWersjonowane.push(keyInSchema)
                }
            }


    }
    if (typeof file === "object" && !Array.isArray(file)) {
        for (let keyInFile in file)
            if (!keyInFile.includes("_")) {
                keyInFileZwykle.push(keyInFile)
            } else if (keyInFile.includes("_")) {
                keyInFileWersjonowane.push(keyInFile)
            }
    }
/* if(keyInSchemaZwykle.length!==keyInFileZwykle.length){
     let differenceI = keyInSchemaZwykle.filter(x=>!keyInFileZwykle.includes(x)) //key is in schema - key is not in file, tego klucza nie ma w pliku a jest w schemacie
     let differenceII= keyInFileZwykle.filter(x=>!keyInSchemaZwykle.includes(x)) //key is in file - key is not in schema

     console.log(differenceI)
     console.log(differenceII)

     if (differenceI.length !== 0 || differenceII.length!==0){

     console.log("różnica")
     console.log(differenceI)
     throw `Error divergent keys names- in schema :"${differenceI}", key in file :"${differenceII}"`

 }
 }*/
if(keyInSchemaWersjonowane.length!==0 || keyInFileWersjonowane.length!==0){

    let arrSchema = []
keyInSchemaWersjonowane.forEach(e=>{
    let wynikSchema = e.substring(0,e.indexOf("_"))
    arrSchema.push(wynikSchema)
})
    let arrFile = []
    keyInFileWersjonowane.forEach(e=>{
        let wynikFile = e.substring(0,e.indexOf("_"))
        arrFile.push(wynikFile)
    })

    console.log(arrSchema)
    console.log(keyInSchemaWersjonowane)
    console.log(arrFile)
    console.log(keyInFileWersjonowane)

    let differenceIII = arrSchema.filter(x=>!arrFile.includes(x)) //key is in schema - key is not in file, tego klucza nie ma w pliku a jest w schemacie
    let differenceIV = arrFile.filter(x=>!arrSchema.includes(x)) //key is in schema - key is not in file, tego klucza nie ma w pliku a jest w schemacie

    console.log(differenceIII)
    console.log(differenceIV)

    if(differenceIII.length!==0){
        throw `Error - In schema: versioned key: ${keyInSchemaWersjonowane}
              No newly created key in file based on this from schema`

    }if(differenceIV.length!==0){
        throw `Error - newly created versioned key in file: ${keyInFileWersjonowane}
               Versioned key ${differenceIV+"__v"} is missing in schema`
    }
}
}

compare(testFile, testSchema, [])

console.log("-----------------------------WYNIKI-----------------------------")
console.log()
console.log(stringOk)
console.log(emptyObjects)

console.log("----------------------------DODATKOWE----------------------------")
console.log()
console.log(keyInFileZwykle)
console.log(keyInFileWersjonowane)

console.log(keyInSchemaZwykle)
console.log(keyInSchemaWersjonowane)

// zatrzymywanie programu w kolejnych elsach
// 4 tablice porównujące klucze i zaliczające
// jeżeli jest arrayem i w arrayu jest atomic obiektc
// //jeżeli w ogóle nic nie będzie w pliku - pierwszy warunek przed atomo wikiem ?
// // linijka 119 - dopisać if file = empty & schemy != emptyj , to tedy? co jeśli w schemacie w obiekcie jest coś a w pliku pusty obiekt