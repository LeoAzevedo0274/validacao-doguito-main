const dataNascimento = document.querySelector("#nascimento")
dataNascimento.addEventListener("blur", (evento) => {
    validarDataNascimento(evento.target)
})

// const formularioCadastro = document.querySelector("#formCadastro")

// formularioCadastro.addEventListener("submit", (evento) => {
//     const dataNascimento = document.querySelector("#nascimento")
//     let validacao = validarDataNascimento(dataNascimento)
//     //evento.target.setCustomValidity(validacao)
//     // if (!evento.target.checkValidity()) {
//     //     evento.target.stopPropagation()
//     //     evento.target.preventDefault()
//     // }
// })

const validarDataNascimento = (input) => {
    let dataInformada = new Date(input.value)
    let mensagem = ""

    if (!maiorQue18Anos(dataInformada)) {
        mensagem = "Para se cadastrar deve ser mais de 18 anos"
    }
    input.setCustomValidity(mensagem)
    return mensagem
}

const maiorQue18Anos = (dataNascimento) => {
    let dataAtual = new Date()
    let dataMais18 = new Date(dataNascimento.getUTCFullYear() + 18, dataNascimento.getUTCMonth(), dataNascimento.getUTCDate())

    return dataMais18 <= dataAtual
}

console.log("carreguei")
