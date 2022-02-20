let linesModule = require('../line_of_code')

let b = require('../tests/invalid.json')

let resultOK =[]                    // Array z poprawnymi danymi
let resultIncorrectString=[]        // Array z niepoprawnymi stringami
let resultObj = []
let resultEmptyObject = []          // Array z pustymi obiektami
let resultOfArrays = []             // Niepoprawne arrays
let resultOfIncorrectVersion = []   // Array z danymi z niepoprawnych elementów wersjonowanych __v


exports.checkSchema = checkSchema=(obj)=> {

   for (let key in obj) {

      console.log(key)
       let value = obj[key]

      console.log(value)

      // jeżeli value jest "String" / "Number" / "Boolean" to dane są poprawne"
      if (!key.includes("_") && typeof value==='string'&& value==="String"||value==="Number"||value==="Boolean"){
         //console.log(value)
         resultOK.push("Dane poprawne  " + key + " : " + value)
      } // jeżeli jest niepoprawny string:
      else if(typeof value==='string' && value!=="String" && value!=="Number" && value!=="Boolean"){
         //console.log(value)
         //resultIncorrectString.push("Niepoprawny string  " + key + ":" + value)
         throw `Error : value: ${value}, value must be "String", "Number" or "Boolean"`
      }
      // jeżeli wartością jest pusty obiekt
      else if(typeof value === 'object'&& Object.keys(value).length===0 && Array.isArray(value)===false && !key.includes("_") )
      {
         //resultEmptyObject.push("Pusty obiekt " +key + ":" + value)
      }
      //jeżeli wartością jest obiekt, nie jest arrayem, i klucz nie zawiera podkreślnika
      else if (typeof value === 'object' && !Array.isArray(value) && !key.includes("_")) {
         console.log(Object.keys(value).length)
         console.log(value)
         checkSchema(value)
      }else if(key.includes("_")){
         let keyWithUnderline = key
         //jeśli mniej niż 2 i więcej niż 3 podkreślniki w nazwie klucza to błąd
         if (keyWithUnderline.match(/_/g).length < 2 || keyWithUnderline.match(/_/g).length >= 3){
            console.log("klucz z nieodpowiednia liczbą podkreslników ")
            console.log(keyWithUnderline)
            throw `Error : Key name: ${keyWithUnderline}, Key name should contain __v`
         } else {
            console.log(Object.keys(value).length)
            console.log(value)
            let arrOfKeysOfValueWithUnderline =[]
            let keysOfValue = Object.keys(value)
            keysOfValue.forEach(element=>{
               if(element.indexOf("_")!==-1){
                  arrOfKeysOfValueWithUnderline.push(element)
               }
            })
            console.log(arrOfKeysOfValueWithUnderline)

            if (key.includes("__v")  && typeof value === 'object' && Object.keys(value).length<2){
               console.log(value)
               console.log(key)
               console.log("Niepoprawna value wersjonowanego klucza  " + key + ":" + value)
               resultOfIncorrectVersion.push("Klucz jest wersją, value jest niepoprawna  " + key + ":" + value)
               throw `Error : Key name: ${key}, this is versioned key and it's value must contain at least two pairs of key:value`
            } else if(key.includes("__v")  && typeof value !== 'object'){
               throw `Error : Key name: ${key}, this is versioned key and it's value must be object not ${value} `
            } else if(key.includes("__v") && arrOfKeysOfValueWithUnderline.length>0){
               throw `Error : key ${key} is versioned key and it's key must be a schema - can't be versioned, wrong key: ${JSON.stringify(arrOfKeysOfValueWithUnderline)}`
            }
            else if(key.includes("__v") && typeof value === 'object' && arrOfKeysOfValueWithUnderline.length===0){
               console.log("jestem tu")
               checkSchema(value)
            }
         }
   }  //jeżeli array []
      else if(Array.isArray(value) && Object.keys(value).length===1){

         console.log("array value")
         console.log(value)


         value.forEach((element)=>{
            console.log("to jest element array")
            console.log(element)
            // jeżeli w array jest obiekt to rekursja
            if(typeof element==='object'){
               checkSchema(value)
            } // jeżeli w array jest string to rekursja
            else if(typeof element==='string'){
               console.log("element string")
               console.log(element)
               checkSchema(value)
            }
         })
      } // jeżeli w array jest inna liczba elementów niż jeden
      else if(Array.isArray(value) && Object.keys(value).length!==1){
         resultOfArrays.push("Niepoprawny array  " + key + ":" + value)
         throw `Error : array must contain only one value in your schema ${key} : ${JSON.stringify(value)} includes ${JSON.stringify(value.length)}`
      }
      // jeżeli nazwa klucza zakończona na __v && valu !== 'object'  to błąd
      else if(key.includes("__v")  && typeof value !== 'object' ){
         throw `Error : Key name: ${key}, this is versioned key and it's value must object`
         resultOfIncorrectVersion.push("Klucz jest wersją, value jest niepoprawna  " + key + ":" + value)
      }
/*      // jeżeli nazwa klucza zakończona na __v && value === 'object' i jest mniej niż jeden element
      else if(key.includes("__v")  && typeof value === 'object' && Object.keys(value).length<2 ){
         console.log(value)
         console.log(key)

      }*/
   }
   return resultObj;

}

console.log(checkSchema(b.testCase8))


console.log(resultOK)
console.log(resultIncorrectString)
console.log(resultEmptyObject)
console.log(resultOfArrays)
console.log(resultOfIncorrectVersion)



// dopisać sprawdzanie czy na tym samym poziomie nie powtarza się nazwa klucza

// wszystko w jedna funkcję - jedna główna funkcja kßóra nie jst reskurencyjna,
// duzo malych przykładów niepoprawnych testcasów,
//