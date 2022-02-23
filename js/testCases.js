/*let resultOK =[]                    // correct "String" "Number" "Boolean"
let resultIncorrectString=[]        // wrong "String" "Number" "Boolean"
let resultEmptyObject = []          // array with empty objects
let resultOfArrays = []             // wrong array
let resultOfIncorrectVersion = []   // array with wrong versioned keys
let resultObj = []*/

exports.checkSchema = checkSchema=(obj)=> {

   for (let key in obj) {

       let value = obj[key]


      // if value jest "String" / "Number" / "Boolean" this atomic data are correct"
      if (!key.includes("_") && typeof value==='string'&& value==="String"||value==="Number"||value==="Boolean"){
         //resultOK.push("Correct data  " + key + " : " + value)
      } // wrong atomic data:
      else if(typeof value==='string' && value!=="String" && value!=="Number" && value!=="Boolean"){
         //resultIncorrectString.push("Wrong data  " + key + ":" + value)
         throw `Error : key: ${key} value: ${value}, value must be "String", "Number" or "Boolean"`
      }
      // if value is empty object
      else if(typeof value === 'object'&& Object.keys(value).length===0 && Array.isArray(value)===false && !key.includes("_") )
      {
         //resultEmptyObject.push("Pusty obiekt " +key + ":" + value)
      }
      //if value is object ,not array & key !includes "_"
      else if (typeof value === 'object' && !Array.isArray(value) && !key.includes("_")) {
         //console.log(Object.keys(value).length)
         //console.log(value)
         checkSchema(value)
      }else if(key.includes("_")){
         let keyWithUnderline = key
         // if key has less than 1 or more than 3 "_"
         if (keyWithUnderline.match(/_/g).length < 2 || keyWithUnderline.match(/_/g).length >= 3){
            //console.log("wrong number of _")
            //console.log(keyWithUnderline)
            throw `Error : Key name: ${keyWithUnderline}, Key name should contain __v`
         } else {
            //console.log(Object.keys(value).length)
            //console.log(value)
            let arrOfKeysOfValueWithUnderline =[]
            let keysOfValue = Object.keys(value)
            keysOfValue.forEach(element=>{
               if(element.indexOf("_")!==-1){
                  arrOfKeysOfValueWithUnderline.push(element)
               }
            })
            //console.log(arrOfKeysOfValueWithUnderline)

            /*if (key.includes("__v")  && typeof value === 'object' && Object.keys(value).length<2){

               //console.log("Wrong value of versioned key  " + key + ":" + value)
               //resultOfIncorrectVersion.push("Key is versioned, value is incorrect  " + key + ":" + value)
               throw `Error : Key name: ${key}, this is versioned key and it's value must contain at least two pairs of key:value`
            }*/if(key.includes("__v")  && typeof value !== 'object'){
               throw `Error : Key name: ${key}, this is versioned key and it's value must be object not ${value} `
            } else if(key.includes("__v") && arrOfKeysOfValueWithUnderline.length>0){
               throw `Error : key ${key} is versioned key and it's key must be a schema - can't be versioned, wrong key: ${JSON.stringify(arrOfKeysOfValueWithUnderline)}`
            }
            else if(key.includes("__v") && typeof value === 'object' && arrOfKeysOfValueWithUnderline.length===0){
               checkSchema(value)
            }
         }
   }  //if value is array
      else if(Array.isArray(value) && Object.keys(value).length===1){

            value.forEach((element)=>{
            // if object in array -> resursion
            if(typeof element==='object'){
               checkSchema(value)
            } // if type of value is string ->resursion
            else if(typeof element==='string'){
               checkSchema(value)
            }
         })
      } // if array contains other number of elements than 1
      else if(Array.isArray(value) && Object.keys(value).length!==1){
         //resultOfArrays.push("Wrong array  " + key + ":" + value)
         throw `Error : array must contain only one value in your schema ${key} : ${JSON.stringify(value)} includes ${JSON.stringify(value.length)}`
      }
      // if key name anded with __v && value !== 'object'  than error
      else if(key.includes("__v")  && typeof value !== 'object' ){
         throw `Error : Key name: ${key}, this is versioned key and it's value must object `
         //resultOfIncorrectVersion.push("Key is versioned, value is incorrect" + key + ":" + value)
      }
   }
   //return resultObj;
}

//console.log(checkSchema(b.testCase8))


/*console.log(resultOK)
console.log(resultIncorrectString)
console.log(resultEmptyObject)
console.log(resultOfArrays)
console.log(resultOfIncorrectVersion)*/



