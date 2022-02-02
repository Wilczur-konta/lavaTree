let linesModule = require('./line_of_code')

let testSchema = require("./tests/schemaExample.json")
let testFile = require("./tests/fileExample.json");

let resultString = ["Poprawne dane String key/schema/file:  "]
let resultNumber = ["Poprawne dane Number key/schema/file:  "]
let resultBoolean = ["Poprawne dane Boolean key/schema/file:  "]
let result = []

let resultInCorrString = ["Błędne dane String key/schema/file:  "]
let resultInCorrNumber = ["Błędne dane Number key/schema/file:  "]
let resultInCorrBoolean = ["Błędne dane Boolean key/schema/file:  "]
let resultEmptyObject = ["Błędne dane pusty obiekt key/schema/file:  "]
let resultCompareKeys = ["Różnica kluczy schema/file:  "]
let resultArray = ["Błędny array:  "]
let resultV = ["Błąd w wersjonowaniu:  "]



let compare = (schema, file)=> {

    for (let key in schema) {

        let valueSchema= schema[key]
        let valueFile= file[key]

        let keyOfSchema = Object.keys(schema)
        let keyOfFile = Object.keys(file)
//primitives
        if(valueSchema==="String" && typeof valueFile==='string' ){
            //console.log(valueFile)
            //console.log(valueSchema)
            resultString.push(key + ": " + valueSchema + " : "+ valueFile)
        }else if(valueSchema==="String" && typeof valueFile!=='string'){
            resultInCorrString.push(key + ": " + valueSchema + " : "+ valueFile)
        }else if (valueSchema==="Number" && typeof valueFile==='number'){
            resultNumber.push(key + ": " + valueSchema + " : "+ valueFile)
        }else if(valueSchema==="Number" && typeof valueFile!=='number'){
            resultInCorrNumber.push(key + ": " + valueSchema + " : "+ valueFile)
        }else if(valueSchema==="Boolean" && typeof valueFile==='boolean'){
            resultBoolean.push(key + ": " + valueSchema + " : "+ valueFile)
        }else if(valueSchema==="Boolean" && typeof valueFile!=='boolean'){
            resultInCorrBoolean.push(key + ": " + valueSchema + " : "+ valueFile)
// objects
//jeżeli pusty obiekt
        }else if(Object.keys(valueFile).length===0 && Array.isArray(valueSchema)===false){
            resultEmptyObject.push(key + ": " + valueSchema + " : "+ valueFile)
        }
//rekursja
        else if (typeof valueSchema === 'object' && typeof valueFile=== 'object' && !Array.isArray(valueSchema) && !Array.isArray(valueFile)&& key.includes("__v")===false &&Object.keys(valueSchema).length===Object.keys(valueFile).length) {

            compare(valueSchema,valueFile)
        }
//jezeli array
        else if(Array.isArray(valueFile)===true && Object.keys(valueFile).length===1 ){
            valueFile.forEach((element)=>{

                // jeżeli w array jest obiekt
                if(typeof element==='object'){
                    compare(valueSchema,valueFile)
                } // jeżeli w array jest string
                else if(typeof element==='string'){
                    compare(valueSchema,valueFile)
                }
            })
        }
// jeżeli w array jest inna liczba elementów niż jeden
        else if(Array.isArray(valueFile)===true && Object.keys(valueFile).length!==1){
            resultArray.push(key + ":" + valueFile)
        }
// jeżeli nazwa klucza zakończona na __v && valu !== 'object'  to błąd
        else if(key.includes("__v")  && typeof valueFile !== 'object' ){
            resultV.push( key + ":" + valueFile)
        }
// jeżeli nazwa klucza zakończona na __v && valu === 'object' i jest mniej niż jeden element
        else if(key.includes("__v")  && typeof valueFile === 'object' && Object.keys(valueFile).length<2 ){
            resultV.push(key + ":" + valueFile)
        }
// jeżeli nazwa klucza zakończona na __v && valu === 'object'
        else if (typeof valueSchema === 'object' && typeof valueFile=== 'object' && !Array.isArray(valueSchema) && !Array.isArray(valueFile)&& key.includes("__v")===true &&Object.keys(valueSchema).length===Object.keys(valueFile).length) {
            console.log("jest dobrze")
            compare(valueSchema, valueFile)
        }



//jezeli ilośc kluczy nie jest taka sama (niewersjonowane)
        else if (typeof valueSchema === 'object' && typeof valueFile=== 'object'&& Object.keys(valueSchema).length!==Object.keys(valueFile).length && !key.includes("__v")){

            let differenceSchemaFile = Object.keys(valueSchema).filter(x=>!Object.keys(valueFile).includes(x));
            let differenceFileSchema = Object.keys(valueFile).filter(x=>!Object.keys(valueSchema).includes(x));

            resultCompareKeys.push(`
            Ilość kluczy w schemacie ${Object.keys(valueSchema).length},
            Ilość kluczy w pliku ${Object.keys(valueFile).length}
            rozbieżności:
            schemat: ${differenceSchemaFile}, 
            plik: ${differenceFileSchema}  `)
        }
//jezeli ilośc kluczy nie jest taka sama (wersjonowane)
        else if (typeof valueSchema === 'object' && typeof valueFile=== 'object'&& Object.keys(valueSchema).length!==Object.keys(valueFile).length && key.includes("__v")){

            console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")

        }
    }
    return result
}

console.log(compare(testSchema.testCase3,testFile.testCase3))


console.log(resultString)
console.log(resultNumber)
console.log(resultBoolean)
console.log(resultArray)

console.log(resultInCorrString)
console.log(resultInCorrNumber)
console.log(resultInCorrBoolean)
console.log(resultEmptyObject)
console.log(resultCompareKeys)
console.log(resultV)