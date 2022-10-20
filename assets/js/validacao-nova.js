export function valida(input) {
    const tipoDeInput = input.dataset.tipo
    if (validadores[tipoDeInput]) {
        validadores[tipoDeInput](input)
    }

    if (input.validity.valid) {
        input.parentElement.classList.remove("input-container--invalido")
        input.parentElement.querySelector(".input-mensagem-erro").innerHTML = ""
    } else {
        input.parentElement.classList.add("input-container--invalido")
        input.parentElement.querySelector(".input-mensagem-erro").innerHTML = mostraMensagemDeErro(tipoDeInput, input)
    }
}

const mostraMensagemDeErro = (tipoDeInput, input) => {
    let mensagem = ""

    tiposDeErro.forEach(tipoDeErro => {
        if (input.validity[tipoDeErro]) {
            mensagem = mensagensDeErro[tipoDeInput][tipoDeErro]
        }
    })

    return mensagem
}

const tiposDeErro = ["valueMissing", "typeMismatch", "patternMismatch", "customError"]

const mensagensDeErro = {
    // ValidityState
    // badInput
    // customError
    // patternMismatch
    // rangeOverflow
    // rangeUnderflow
    // stepMismatch
    // tooLong
    // tooShort
    // typeMismatch
    // valid
    // valueMissing

    nome: {
        valueMissing: "Campo obrigatório"
    },
    email: {
        valueMissing: "Campo obrigatório",
        typeMismatch: "Email inválido"
    },
    senha: {
        valueMissing: "Campo obrigatório",
        patternMismatch: "Deve conter uma letra minúscula, uma maiúscula e um número"
    },
    dataNascimento: {
        valueMissing: "Campo obrigatório",
        customError: "Para se cadastrar deve ter mais de 18 anos"
    },
    cpf: {
        valueMissing: "Campo obrigatório",
        customError: "CPF inválido"
    },
    cep: {
        valueMissing: "Campo obrigatório",
        patternMismatch: "Cep inválido. Deve estar no formato 99999-999 ou 99999999"
    },
    logradouro: {
        valueMissing: "Campo obrigatório"
    },
    cidade: {
        valueMissing: "Campo obrigatório"
    },
    estado: {
        valueMissing: "Campo obrigatório"
    },
    preco: {
        valueMissing: "Campo obrigatório",
        customError: "Valor inválido"
    }
}

const validadores = {
    dataNascimento:input => validarDataNascimento(input),
    cpf:input => validarCPF(input),
    cep:input => recuperarCEP(input),
    preco:input => validarPreco(input)
}

const validarDataNascimento = (input) => {
    let dataInformada = new Date(input.value)
    let mensagem = ""

    if (!maiorQue18Anos(dataInformada)) {
        mensagem = "Para se cadastrar deve ter mais de 18 anos"
    }
    input.setCustomValidity(mensagem)
    return mensagem
}

const maiorQue18Anos = (dataNascimento) => {
    let dataAtual = new Date()
    let dataMais18 = new Date(dataNascimento.getUTCFullYear() + 18, dataNascimento.getUTCMonth(), dataNascimento.getUTCDate())

    return dataMais18 <= dataAtual
}

const validarCPF = (input) => {
    let mensagem = ""
    let cpf = input.value.replace(/[^\d]+/g,'');	
	if(cpf == '') return false;	
	// Elimina CPFs invalidos conhecidos	
	if (cpf.length != 11 || 
		cpf == "00000000000" || 
		cpf == "11111111111" || 
		cpf == "22222222222" || 
		cpf == "33333333333" || 
		cpf == "44444444444" || 
		cpf == "55555555555" || 
		cpf == "66666666666" || 
		cpf == "77777777777" || 
		cpf == "88888888888" || 
		cpf == "99999999999") {
            input.setCustomValidity("CPF inválido")
			return false;		
        }
	// Valida 1o digito	
	let add = 0;	
    let rev
	for (let i=0; i < 9; i ++)		
		add += parseInt(cpf.charAt(i)) * (10 - i);	
		rev = 11 - (add % 11);	
		if (rev == 10 || rev == 11)		
			rev = 0;	
		if (rev != parseInt(cpf.charAt(9)))		
			return false;		
	// Valida 2o digito	
	add = 0;	
	for (let i = 0; i < 10; i ++)		
		add += parseInt(cpf.charAt(i)) * (11 - i);	
	rev = 11 - (add % 11);	
	if (rev == 10 || rev == 11)	
		rev = 0;	
	if (rev != parseInt(cpf.charAt(10))) {
        input.setCustomValidity("CPF com dígito verificador inválido")
        return false;		
    }	
    input.setCustomValidity("")	
	return true;   
}

function recuperarCEP(input) {
    let mensagem = ""
    let cep = input.value.replace(/\D/g, "") //(/[^\d]+/g,'');	
    const url = `https://viacep.com.br/ws/${cep}/json/`
    const options = {
        method: "GET",
        mode: "cors",
        headers: {
            "content-type": "application/json;charset=utf-8"
        }
    }

    if (!input.validity.patternMismatch && !input.validity.valueMissing) {
        fetch(url, options)
        .then(response => response.json())
        .then(data => {
            if (data.erro) {
                input.setCustomValidity("Erro ao consultar o CEP")
                return
            }
            input.setCustomValidity("")
            preencherCamposEndereco(data)
        })
    }
}

const preencherCamposEndereco = (data) => {
    // let arrayData = Object.keys(data).map(key => {
    //     return {key: data[key]}
    // })

    // arrayData.forEach(atributo => {
    //     let campo =  document.querySelector(`[data-tipo=${atributo}`)
    //     if (!!campo) {
    //         campo.value = data[atributo]
    //     }
    // })

    // Object.entries(data).forEach(dado => {
    //     console.log(dado)
    //     const dado[0] = document.querySelector(`"[data-tipo='logradouro']"`)
    // })
    
    const logradouro = document.querySelector("[data-tipo='logradouro']")
    const cidade = document.querySelector("[data-tipo='cidade']")
    const estado = document.querySelector("[data-tipo='estado']")

    logradouro.value = data.logradouro
    cidade.value = data.localidade
    estado.value = data.uf
}

const validarPreco = (input) => {
    let mensagem = ""
    if (input.formatToNumber() == 0) {
        mensagem = "Valor inválido"
    }

    input.setCustomValidity(mensagem)
}
