
let testFile = require("../tests/fileExample.json");
let testSchema = require("../tests/schemaExample.json")

let stringOk = ["correct string", []]
let numberOk = ["correct number", []]
let booleanOk = ["correct boolean", []]

let emptyObjects = ["empty object", []]

let keyInFileRegular = []
let keyInFileVersioned = []

let keyInSchemaRegular = []
let keyInSchemaVersioned = []


exports.compare= compare = (file, schema, param) => {

    // if atomic
    if (typeof file !== 'object' && !Array.isArray(file) && !Array.isArray(schema)) {
        if (typeof file === "string" && schema === "String") {
            stringOk[1].push(file + ":" + schema)
        }else if(typeof file === "number" && schema === "Number"){
            numberOk[1].push(file + ":" + schema)
        }else if(typeof file === "boolean" && schema === "Boolean"){
            booleanOk[1].push(file + ":" + schema)
        } else {throw `Error -In schema type of value:${typeof schema} {${param}:"${schema}"}, in file type of value: ${typeof file} {${param}:${file}}`}
    } // if object, not array & not empty object
    else if (typeof file === 'object' && typeof schema === 'object' && !Array.isArray(file) && !Array.isArray(schema) && Object.keys(file).length !== 0 && Object.keys(schema).length !== 0) {

        for (let keyInFile in file) {

            let valueOfKeyInFile = file[keyInFile]

            if (!keyInFile.includes("_")) {

                let deepSearch = (obj, searchedKey) => {

                    if (Object.keys(obj).includes(searchedKey)) {  //if "keys in schema" includes searched key-"key from file"

                        let valueOfKeyInSchema = obj[searchedKey]

                        compare(valueOfKeyInFile, valueOfKeyInSchema,keyInFile)
                    } else {
                        throw `Error - this key is in file, and is missing in schema  ${JSON.stringify(searchedKey)}`
                    }
                }
                deepSearch(schema, keyInFile,)

            } else if (keyInFile.includes("_")) {


                let prefix = (keyInFile.substring(0, keyInFile.indexOf("_"))) + "__v"
                let sufix = (keyInFile.substring(keyInFile.lastIndexOf("_")).replace("_", ""))


                let deepSearchII = (obj, searchedKey) => {

                    if (Object.keys(obj).includes(searchedKey)) {

                        let valueOfKeyInSchema = obj[searchedKey]

                        let deepSearch = (obj, searchedKey) => {

                            let keyInSchema=Object.keys(obj)
                            if (Object.keys(obj).includes(searchedKey)) {

                                let valueOfKeyInSchema = obj[searchedKey]

                                compare(valueOfKeyInFile, valueOfKeyInSchema, param)

                            } else {
                                throw `Error - in file: ${keyInFile}, in schema in ${prefix} - missing: "${sufix}"  `
                            }
                        }
                        deepSearch(valueOfKeyInSchema, sufix)
                                           }
                                  }
                deepSearchII(schema, prefix)
            }
        }
    } // if empty object, not array
    else if (typeof file === 'object' && typeof schema === 'object' && Object.keys(file).length === 0 && Object.keys(schema).length === 0) {
        emptyObjects[1].push(file + ":" + schema)
    } //if objects,not array, object value in file is empty, object value in schema is not empty
    else if(typeof file === 'object' && typeof schema === 'object' && Object.keys(file).length === 0 && Object.keys(schema).length !== 0 && !Array.isArray(file) ){
        throw `Error - for key: ${param} in file value is ${JSON.stringify(file)}, in schema value is ${JSON.stringify(schema)}`
    }
    //if empty array
    else if(Array.isArray(file) && Array.isArray(schema) && file.length===0 && schema.length===0){
        emptyObjects[1].push(file + ":" + schema)
    }
    //if array
    else if (Array.isArray(file) && Array.isArray(schema)) {

        file.forEach(arrayElement=>{

            if(typeof arrayElement==='string'|| typeof arrayElement==='number' ||typeof arrayElement==='boolean'){
                if (typeof arrayElement === "string" && schema[0] === "String") {
                    stringOk[1].push(arrayElement + ":" + schema)
                }else if(typeof arrayElement === "number" && schema[0] === "Number"){
                    numberOk[1].push(arrayElement + ":" + schema)
                }else if(typeof arrayElement === "boolean" && schema[0] === "Boolean"){
                    booleanOk[1].push(arrayElement + ":" + schema)
                }else {throw `Error in array: In schema {key:${JSON.stringify(param)} value:${JSON.stringify(schema)}}, in json {key:${JSON.stringify(param)} value:${JSON.stringify(file)}}, wrong item in file: ${JSON.stringify(arrayElement)}`}
            } else if(typeof arrayElement==='object'){

                compare(arrayElement,schema[0])
            }
        })
        if(file.length===0){
            stringOk[1].push("[]"+ ":" +schema)
        }
    }
    //compare keys
    if (typeof schema === "object" && !Array.isArray(schema)) {

            for (let keyInSchema in schema) {
                if (!keyInSchema.includes("_")) {
                    keyInSchemaRegular.push(keyInSchema)
                } else if (keyInSchema.includes("_")) {
                    keyInSchemaVersioned.push(keyInSchema)
                }
            }
    }
    if (typeof file === "object" && !Array.isArray(file)) {
        for (let keyInFile in file)
            if (!keyInFile.includes("_")) {
                keyInFileRegular.push(keyInFile)
            } else if (keyInFile.includes("_")) {
                keyInFileVersioned.push(keyInFile)
            }
    }
 if(keyInSchemaRegular.length!==keyInFileRegular.length){
     let differenceI = keyInSchemaRegular.filter(x=>!keyInFileRegular.includes(x)) //key is in schema - key is not in file, tego klucza nie ma w pliku a jest w schemacie
     let differenceII= keyInFileRegular.filter(x=>!keyInSchemaRegular.includes(x)) //key is in file - key is not in schema

     if(differenceI.length !== 0){
         throw `Error - Key name: ${differenceI} is missing in file`
     }if(differenceII.length !== 0){
         throw `Error - Key name: ${differenceII} is missing in file`
     }
 }
if(keyInSchemaVersioned.length!==0 || keyInFileVersioned.length!==0){
    let arrSchema = []
keyInSchemaVersioned.forEach(e=>{
    let wynikSchema = e.substring(0,e.indexOf("_"))
    arrSchema.push(wynikSchema)
})
    let arrFile = []
    keyInFileVersioned.forEach(e=>{
        let wynikFile = e.substring(0,e.indexOf("_"))
        arrFile.push(wynikFile)
    })
    let differenceIII = arrSchema.filter(x=>!arrFile.includes(x)) //key is in schema - key is not in file, tego klucza nie ma w pliku a jest w schemacie
    let differenceIV = arrFile.filter(x=>!arrSchema.includes(x)) //key is in schema - key is not in file, tego klucza nie ma w pliku a jest w schemacie

    if(differenceIII.length!==0){
        throw `Error - In schema: versioned key: ${keyInSchemaVersioned}
              No newly created key in file based on this from schema`

    }if(differenceIV.length!==0){
        throw `Error - newly created versioned key in file: ${keyInFileVersioned}
               Versioned key ${differenceIV+"__v"} is missing in schema`
    }
}
}

/*compare(testFile, testSchema, [])

console.log("-----------------------------Results-----------------------------")
console.log()
console.log(stringOk)
console.log(emptyObjects)

console.log("----------------------------Additional Info----------------------------")
console.log()
console.log(keyInFileRegular)
console.log(keyInFileVersioned)

console.log(keyInSchemaRegular)
console.log(keyInSchemaVersioned)*/
