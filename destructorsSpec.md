Example without destructors

    {
    "name": "String",
    "surname": "String",
    "job__v": {
    "unemployed": {},
    "employed": {
    "companyName": "String"
         }
        }
    }

    function withoutDestructors(x) {

    if (x.job_unemployed) {
        return `${x.name} ${x.surname} jest bezrobotny`
    
    } else if (x.job_employed) {
        return `${x.name} ${x.surname} jest zatrudniowy w firmie ${x.job_employed.companyName}`
        }
    }

Example with destructors

    destruct(function (name, surname) {
    return [
    [{
    job: "unemployed",
    },
    function () {
    return `${name} ${surname} jest bezrobotny`
    }
    ],
    [{
    job: "employed",
    },
    function (companyName){
    return `${name} ${surname} jest zatrudniowy w firmie ${companyName}`
    }
    ]
    ]
    })(x)