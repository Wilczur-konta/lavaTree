#Install
```$ npm install lava-tree```

#How to use
package consists of two functions

```js
// Function checkSchema - validate structural correctness of your JSON Schema 
checkSchema(schema)

where shema - is your JSON Schema file

//Function compare JSON file and schema
compare(file,schema,[])

where:
file - is your JSON file 
shema - is your JSON Schema file
[] - empty array to pass data to error



import {checkSchema} from "lava-tree/testCases"

import {compare} from "lava-tree"

