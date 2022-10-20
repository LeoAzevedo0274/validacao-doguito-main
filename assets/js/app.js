import { valida } from "./validacao-nova.js"

const inputs = document.querySelectorAll("input")
inputs.forEach((input, indice) => {
    const args = {
        //afterFormat(e) { console.log('afterFormat', e); },
        allowNegative: false,
        //beforeFormat(e) { console.log('beforeFormat', e); },
        //negativeSignAfter: false,
        prefix: 'R$ ',
        suffix: '',
        fixed: true,
        fractionDigits: 2,
        decimalSeparator: ',',
        thousandsSeparator: '.',
        cursor: 'end'
    }

    if (input.dataset.tipo == "preco") {
        SimpleMaskMoney.setMask(input, args)    
    }

    input.addEventListener("blur", (evento) =>{
        valida(evento.target)
    })
})

document.getElementById("descricao").value = "";
const campoNome = document.querySelector("#nome")
campoNome.focus({focusVisible: true})