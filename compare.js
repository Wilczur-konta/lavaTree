let linesModule = require('./line_of_code')

let testFile = require("./tests/fileExample.json");
let testSchema = require("./tests/schemaExample.json")

let stringOk = ["poprawne stringi", []]
let emptyObjects = ["empty object", []]

let keyInFileZwykle = ["Klucze zwykłe"]
let keyInFileWersjonowane = ["Klucze wersjonowane"]


let compare = (file, schema) => {
    console.log(file)
    console.log(schema)

    // jeśli jest atomic  - tu dopisać jeszcze number i boolean
    if (typeof file !== 'object') {
        if (typeof file === "string" && schema === "String") {
            stringOk[1].push(file + ":" + schema)
        }
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
                        compare(valueOfKeyInFile, valueOfKeyInSchema)           // wartosc klucza z pliku / wartosc klucza schematu
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

                            console.log(Object.keys(obj))
                            if (Object.keys(obj).includes(searchedKey)) {  //if "klucze schematu" zawieraja szukany "klucz z pliku"

                                let valueOfKeyInSchema = obj[searchedKey]
                                console.log(valueOfKeyInSchema)                         // wartość znalezionego klucza ze schematu

                                console.log("****************")
                                compare(valueOfKeyInFile, valueOfKeyInSchema)           // wartosc klucza z pliku / wartosc klucza schematu
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

            if (!keyInFile.includes("_")) {
                keyInFileZwykle.push(keyInFile)
            } else if (keyInFile.includes("_")) {
                keyInFileWersjonowane.push(keyInFile)
            }


        }
    } // jeśli jest obiektem, nie jest arrayem i nie jest pustym obiektem
    else if (typeof file === 'object' && typeof schema === 'object' && Object.keys(file).length === 0 && Object.keys(schema).length === 0) {
        emptyObjects[1].push(file + ":" + schema)
    } //jest arrayem i nie jest pustym obiektem
    else if(Array.isArray(file) && Array.isArray(schema) && file.length===0 && schema.length===0){
        emptyObjects[1].push(file + ":" + schema)

    }
    //jeśli jest arrayem
    else if (Array.isArray(file) && Array.isArray(schema)) {
        console.log("obiekt jest arrayem")
        compare(file[0],schema[0])
    }
}

compare(testFile, testSchema)

console.log("-----------------------------WYNIKI-----------------------------")
console.log()
console.log(stringOk)
console.log(emptyObjects)

console.log("----------------------------DODATKOWE----------------------------")
console.log()
console.log(keyInFileZwykle)
console.log(keyInFileWersjonowane)


// zatrzymywanie programu w kolejnych elsach
// 4 tablice porównujące klucze i zaliczające
// jeżeli jest arrayem i w arrayu jest atomic obiekt
//jeżeli w ogóle nic nie będzie w pliku - pierwszy warunek przed atomikiem ?