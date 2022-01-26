let linesModule = require('./line_of_code')

let a = require("./tests/invalid.json");
console.log(a)

let resultOK =[]                    // Array z poprawnymi danymi
let resultIncorrectString=[]        // Array z niepoprawnymi stringami
let resultObj = []
let resultEmptyObject = []          // Array z pustymi obiektami
let resultOfArrays = []             // Niepoprwne arrays

function checkSchema(obj) {

   for (let key in obj) {

       let value = obj[key]

      // jeżeli value jest "String" / "Number" / "Boolean" to dane są poprawne"
      if (value==="String"||value==="Number"||value==="Boolean" ){
         resultOK.push("Dane poprawne  " + key + " : " + value)
      }
      // jeżeli wartością jest pusty obiekt
      else if(typeof value === 'object'&& Object.keys(value).length===0 && Array.isArray(value)===false)
      {
         resultEmptyObject.push("Pusty obiekt " +key + ":" + value)
      }
      //jeżeli wartością jest obiekt to rekursja
      else if (typeof value === 'object' && !Array.isArray(value)) {
         checkSchema(value)
      }
      // jeżeli niepoprawny string
      else if(
          typeof value !== 'object' &&
          !Array.isArray(value) &&
          value!=="String" &&
          value!=="Number" &&
          value!=="Boolean"
      ){
         resultIncorrectString.push("Niepoprawny string  " + key + ":" + value)
      }
      //jeżeli array []
      else if(Array.isArray(value)===true && Object.keys(value).length===1 ){
         console.log(Object.keys(value).length )
         console.log(value)

         value.forEach((element)=>{
            // jeżeli w array jest obiekt to rekursja
            if(typeof element==='object'){
               checkSchema(value)
            } // jeżeli w array jest string to rekursja
            else if(typeof element==='string'){
               console.log("element strng")
               console.log(element)
               checkSchema(value)
            }

         })

      } // jeżeli w array jest więcej niż jeden obiekt
      else if(Array.isArray(value)===true && Object.keys(value).length!==1){
         resultOfArrays.push("Niepoprawny array  " + key + ":" + value)
      }
   }
   return resultObj;

}

console.log(checkSchema(a.testCase8))


console.log(resultOK)
console.log(resultIncorrectString)
console.log(resultEmptyObject)
console.log(resultOfArrays)


// dopisać sprwadzenie jeżeli __v && valu !== 'object'  to wyrzucaj błąd
// dopisać sprawdzanie czy na tym samym poziomie nie powtarza się nazwa klucza

