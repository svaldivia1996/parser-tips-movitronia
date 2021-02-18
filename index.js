const excelToJson = require('convert-excel-to-json');
const fs = require('fs');

const main = async () => {
    let auxPhase = 0
    let lastPhase = ""
    let res = JSON.parse('{"level": null,"number": null,"phase": [{"phaseName": "CALENTAMIENTO","excercicesAndQuestions": []},{"phaseName": "FLEXIBILIDAD","excercicesAndQuestions": []},{"phaseName": "DESARROLLO","excercicesAndQuestions": []},{"phaseName": "VUELTA A LA CALMA","excercicesAndQuestions": []}],"pauses":[]}')
    let resFinal = []

    const result = excelToJson({
        sourceFile: 'Copia de NIVEL 8 CON TIPS(6626).xlsx'
    })

    // console.log(res.phase[0].phaseName)
    // console.log(result.Hoja1[0])

    result.Hoja1.forEach((el, i)=>{

        // console.log(el.A)

        if(el.A){
            if(el.A.trim().toUpperCase() === "MACRO PAUSA"){
                // break NOO EXISTE :C
                lastPhase = ""
                if (el.C){
                    res.pauses.push({"macro":el.B, "tipId":el.C})
                }
                else{
                    res.pauses.push({"macro":el.B})
                }
            }
            if(el.A.toUpperCase().indexOf("NIVEL 4") !== -1 || el.A.toUpperCase().indexOf("NIVEL 5") !== -1 || el.A.toUpperCase().indexOf("NIVEL 6") !== -1 || el.A.toUpperCase().indexOf("NIVEL 7") !== -1 || el.A.toUpperCase().indexOf("NIVEL 8") !== -1){
                res.level = el.A.toUpperCase().substring(0, 7)
                res.number = el.A.toUpperCase().substring(7, el.A.length).match(/\d+/)[0]
            }
            else if (el.A.toUpperCase().indexOf("NIVEL") !== -1) {
                res.level = el.A.toUpperCase()
            }
            if (lastPhase==="" && (el.A.toUpperCase()=== "CALENTAMIENTO" || el.A.toUpperCase()=== "FLEXIBILIDAD" || el.A.toUpperCase()=== "DESARROLLO" || el.A.toUpperCase()=== "VUELTA A LA CALMA" )){
                lastPhase = el.A.toUpperCase()
                if(el.A.toUpperCase()!== "CALENTAMIENTO" && auxPhase < 3){
                    auxPhase++
                }
                if(el.A.toUpperCase()=== "VUELTA A LA CALMA" && auxPhase < 3){
                    auxPhase = 0
                }
            }
            if (el.A.trim().toUpperCase() == "MICRO PAUSA"){
                if(el.C){
                    res.pauses.push({"micro":el.B, "tipId":el.C})
                }
                else {
                    res.pauses.push({"micro":el.B})
                }
            }

            if (el.A !== "fin" && el.A !==lastPhase && lastPhase === res.phase[auxPhase].phaseName && el.A.trim().toUpperCase().indexOf("PAUSA") === -1 ){
                res.phase[auxPhase].excercicesAndQuestions.push({"nameExcercise": el.A, "duration": el.B})

            }
            if (el.A === "fin"){
                resFinal.push(res)
                res = JSON.parse('{"level": null,"number": null,"phase": [{"phaseName": "CALENTAMIENTO","excercicesAndQuestions": []},{"phaseName": "FLEXIBILIDAD","excercicesAndQuestions": []},{"phaseName": "DESARROLLO","excercicesAndQuestions": []},{"phaseName": "VUELTA A LA CALMA","excercicesAndQuestions": []}],"pauses":[]}')
                lastPhase = ""
                auxPhase = 0

            }



        }
        if(el.B){
            // console.log("explota "+ el.B)
            if(Number.isInteger(el.B)){


            }
            else if (el.B.toUpperCase().indexOf("SESION") !== -1 && el.B.trim().length < 10)  {
                res.number = el.B.toUpperCase().match(/\d+/)[0]
            }
            else if (el.B.toUpperCase().indexOf("CLASE") !== -1 && el.B.trim().length < 10)  {
                res.number = el.B.toUpperCase().match(/\d+/)[0]
            }

        }
    })

    console.log(resFinal)
    var myJSON = JSON.stringify(resFinal);
    fs.writeFileSync('Nivel-8.json', myJSON);
}

main()