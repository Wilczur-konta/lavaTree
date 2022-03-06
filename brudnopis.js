function withoutDestructors(x) {

    if (x.job_unemployed) {
        return `${x.name} ${x.surname} jest bezrobotny`
    } else if (x.job_employed) {
        return `${x.name} ${x.surname} jest zatrudniowy w firmie ${x.job_employed.companyName}`
    }

}

console.log(withoutDestructors({
        "name": "Marcin Jan",
        "surname": "Grzybowski",
        "job_employed": {
            "companyName": "e-Orzecznik"
        }
    }
));

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