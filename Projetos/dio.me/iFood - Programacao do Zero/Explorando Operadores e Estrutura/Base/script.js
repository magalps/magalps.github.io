// Operadores Aritméticos
// sinal de + usado para concatenar string
let idade = 30
console.log("valor da minha variavel " + idade)

// '+' realizando somas
idade = 30 + 6
console.log("operação de adição " + idade)

// '-' realizando subtrações
let primeiroNumero = 1023
let secundoNumero = 23
console.log(primeiroNumero - secundoNumero)

// '*' realizando multiplicações
let multiplicador = 4
let multiplicando = 12
let produto = multiplicador * multiplicando
console.log("resultado da multiplicação é " + produto)

multiplicador = 8
produto = multiplicador * multiplicando
console.log("resultado da multiplicação é " + produto)

// '/' realizando divisões
let notaDoMercado = 50
let pessoasParaDividir = 2
console.log("operação de divisão :" + notaDoMercado / pessoasParaDividir)

// '%' pegando o resto de uma divisão
let calculo = 10 % 3
console.log("operação de módulo " + calculo)

// Operadores de Incremento e Decremento
let valor = 0
console.log("valor inicial " + valor)

// incremento
valor++ // valor = valor + 1
console.log("valor após incremento " + valor)

// decremento  
valor-- // valor = valor - 1
console.log("valor após decremento " + valor)   

// Operadores de Atribuição
let valorA = 10
let valorB = 5
console.log("valorA " + valorA)
console.log("valorB " + valorB)
// atribuição de adição
valorA += valorB // valorA = valorA + valorB
console.log("valorA após atribuição de adição " + valorA)
// atribuição de subtração
valorA -= valorB // valorA = valorA - valorB
console.log("valorA após atribuição de subtração " + valorA)
// atribuição de multiplicação
valorA *= valorB // valorA = valorA * valorB
console.log("valorA após atribuição de multiplicação " + valorA)    
// atribuição de divisão
valorA /= valorB // valorA = valorA / valorB
console.log("valorA após atribuição de divisão " + valorA)  
// atribuição de módulo
valorA %= valorB // valorA = valorA % valorB
console.log("valorA após atribuição de módulo " + valorA)

// Operadores de Comparação
let numero1 = 10
let numero2 = 20
console.log("numero1 " + numero1)
console.log("numero2 " + numero2)   
// operador de igualdade (==)
console.log("resultado da comparação de igualdade " + (numero1 == numero2))
// operador de diferença (!=)
console.log("resultado da comparação de diferença " + (numero1 != numero2))
// operador de maior que (>)
console.log("resultado da comparação de maior que " + (numero1 > numero2))
// operador de menor que (<)
console.log("resultado da comparação de menor que " + (numero1 < numero2))
// operador de maior ou igual que (>=)
console.log("resultado da comparação de maior ou igual que " + (numero1 >= numero2))
// operador de menor ou igual que (<=)
console.log("resultado da comparação de menor ou igual que " + (numero1 <= numero2))
// operador de identidade (===)
console.log("resultado da comparação de identidade " + (numero1 === numero2))
// operador de não identidade (!==)
console.log("resultado da comparação de não identidade " + (numero1 !== numero2))


// comparando valores com tipos diferentes
let numero3 = 10
let texto = "10"
console.log("numero3 " + numero3)
console.log("texto " + texto)
console.log("resultado da comparação de igualdade com tipos diferentes " + (numero3 == texto))
console.log("resultado da comparação de identidade com tipos diferentes " + (numero3 === texto))
// comparando valores com tipos diferentes
let numero4 = 10
let texto2 = "10"
console.log("numero4 " + numero4)
console.log("texto2 " + texto2)
console.log("resultado da comparação de diferença com tipos diferentes " + (numero4 != texto2))
console.log("resultado da comparação de não identidade com tipos diferentes " + (numero4 !== texto2))


// Operadores Lógicos
let IdadePessoa = 18
let possuiCarteiraDeTrabalho = true
console.log("idadePessoa " + IdadePessoa)
console.log("possuiCarteiraDeTrabalho " + possuiCarteiraDeTrabalho)
// operador lógico E (&&)
let podeAplicarParaVaga = IdadePessoa >= 18 && possuiCarteiraDeTrabalho == true
console.log("podeAplicarParaVaga " + podeAplicarParaVaga)
// operador lógico OU (||)
let podeAplicarParaVaga2 = IdadePessoa >= 18 || possuiCarteiraDeTrabalho == true
console.log("podeAplicarParaVaga2 " + podeAplicarParaVaga2)
// operador lógico de negação (!)
let candidatoInvalido = !podeAplicarParaVaga
console.log("candidatoInvalido " + candidatoInvalido)
// operador lógico de negação (!)
let candidatoInvalido2 = !podeAplicarParaVaga2
console.log("candidatoInvalido2 " + candidatoInvalido2)

// Operador Condicional (Ternário)
let idadeCondicional = 18
console.log("idadeCondicional " + idadeCondicional)
let mensagem = idadeCondicional >= 18 ? "pode tirar carteira de motorista" : "não pode tirar carteira de motorista"
console.log(mensagem) 
// Operador de String
let nome = "André"
console.log("nome " + nome)
let sobrenome = "Santos"
console.log("sobrenome " + sobrenome)
let nomeCompleto = nome + " " + sobrenome
console.log("nomeCompleto " + nomeCompleto)

// comprimento de uma string
console.log("comprimento de nomeCompleto " + nomeCompleto.length)
// acesso a um caractere específico em uma string
console.log("primeiro caractere de nomeCompleto " + nomeCompleto[0])
console.log("último caractere de nomeCompleto " + nomeCompleto[nomeCompleto.length - 1])
// divisão de uma string em um array de substrings
let frase = "JavaScript é uma linguagem de programação"
console.log("frase " + frase)
let palavras = frase.split(" ")
console.log("palavras " + palavras)
console.log("segunda palavra da frase " + palavras[1])
// substituição de parte de uma string por outra
let novaFrase = frase.replace("JavaScript", "TypeScript")
console.log("novaFrase " + novaFrase)
// conversão de uma string para maiúsculas ou minúsculas
console.log("frase em maiúsculas " + frase.toUpperCase())
console.log("frase em minúsculas " + frase.toLowerCase())
// verificação se uma string contém outra string
console.log("frase contém 'linguagem' ? " + frase.includes("linguagem"))
console.log("frase contém 'Python' ? " + frase.includes("Python"))
// concatenação de strings
let saudacao = "Olá"
let NomePessoa = "Maria"
let mensagemSaudacao = saudacao + ", " + NomePessoa + "!"
console.log("mensagemSaudacao " + mensagemSaudacao)
// template literals (template strings)
let mensagemTemplate = `${saudacao}, ${NomePessoa}! Seja bem-vinda ao curso de JavaScript.`
console.log("mensagemTemplate " + mensagemTemplate)


// Operadores de Tipo
let numeroTipo = 42
let textoTipo = "42"
let booleanoTipo = true
let objetoTipo = { nome: "André", idade: 30 }
let arrayTipo = [1, 2, 3, 4, 5]
let funcaoTipo = function() { return "Olá, mundo!" }
console.log("tipo de numeroTipo " + typeof numeroTipo)
console.log("tipo de textoTipo " + typeof textoTipo)
console.log("tipo de booleanoTipo " + typeof booleanoTipo)
console.log("tipo de objetoTipo " + typeof objetoTipo)
console.log("tipo de arrayTipo " + typeof arrayTipo)
console.log("tipo de funcaoTipo " + typeof funcaoTipo)

// conversão de tipos
let numeroParaTexto = String(numeroTipo)
console.log("numeroParaTexto " + numeroParaTexto + ", tipo: " + typeof numeroParaTexto)
let textoParaNumero = Number(textoTipo)
console.log("textoParaNumero " + textoParaNumero + ", tipo: " + typeof textoParaNumero)
let booleanoParaTexto = String(booleanoTipo)
console.log("booleanoParaTexto " + booleanoParaTexto + ", tipo: " + typeof booleanoParaTexto)
let textoParaBooleano = Boolean(textoTipo)
console.log("textoParaBooleano " + textoParaBooleano + ", tipo: " + typeof textoParaBooleano)
let numeroParaBooleano = Boolean(0)
console.log("numeroParaBooleano " + numeroParaBooleano + ", tipo: " + typeof numeroParaBooleano)
let booleanoParaNumero = Number(booleanoTipo)
console.log("booleanoParaNumero " + booleanoParaNumero + ", tipo: " + typeof booleanoParaNumero)
// verificação de instância
console.log("objetoTipo é instância de Object ? " + (objetoTipo instanceof Object))
console.log("arrayTipo é instância de Array ? " + (arrayTipo instanceof Array))
console.log("funcaoTipo é instância de Function ? " + (funcaoTipo instanceof Function))
// Operadores Bitwise
let a = 5 // em binário: 0101
let b = 3 // em binário: 0011
console.log("a " + a)
console.log("b " + b)
// operador AND bit a bit (&)
let andBitwise = a & b // resultado em binário: 0001 (1 em decimal)
console.log("a & b " + andBitwise)
// operador OR bit a bit (|)
let orBitwise = a | b // resultado em binário: 0111 (7 em decimal)
console.log("a | b " + orBitwise)
// operador XOR bit a bit (^)
let xorBitwise = a ^ b // resultado em binário: 0110 (6 em decimal)
console.log("a ^ b " + xorBitwise)
// operador NOT bit a bit (~)
let notBitwise = ~a // resultado em binário: 1010 (-6 em decimal, considerando complemento de dois)
console.log("~a " + notBitwise)
// operador de deslocamento à esquerda (<<)
let deslocamentoEsquerda = a << 1 // resultado em binário: 1010 (10 em decimal)
console.log("a << 1 " + deslocamentoEsquerda)
// operador de deslocamento à direita (>>)
let deslocamentoDireita = a >> 1 // resultado em binário: 0010 (2 em decimal)
console.log("a >> 1 " + deslocamentoDireita)
// operador de deslocamento à direita sem sinal (>>>)
let deslocamentoDireitaSemSinal = a >>> 1 // resultado em binário: 0010 (2 em decimal)
console.log("a >>> 1 " + deslocamentoDireitaSemSinal)
// Operadores de Exponenciação
let base = 2
let expoente = 3
console.log("base " + base)
console.log("expoente " + expoente)
// operador de exponenciação (**)
let resultadoExponenciacao = base ** expoente // 2^3 = 8
console.log("base ** expoente " + resultadoExponenciacao)
// operador de atribuição de exponenciação (**=)
base **= expoente // base = base ** expoente, agora base é 8
console.log("base após atribuição de exponenciação " + base)
// Operadores de Agrupamento
let resultadoAgrupamento = (2 + 3) * 4 // sem parênteses seria 2 + (3 * 4) = 14
console.log("resultado com agrupamento (2 + 3) * 4 " + resultadoAgrupamento)
let resultadoSemAgrupamento = 2 + 3 * 4 // sem parênteses, a multiplicação tem precedência
console.log("resultado sem agrupamento 2 + 3 * 4 " + resultadoSemAgrupamento)
// Operadores de Desestruturação
let pessoa = { nome: "Ana", idade: 25, cidade: "São Paulo" }
console.log("pessoa " + JSON.stringify(pessoa))
// desestruturação de objeto
let { nome: nomePessoa, idade: idadePessoa, cidade: cidadePessoa } = pessoa
console.log("nomePessoa " + nomePessoa)
console.log("idadePessoa " + idadePessoa)
console.log("cidadePessoa " + cidadePessoa)
// desestruturação de array
let numeros = [10, 20, 30, 40, 50]
console.log("numeros " + numeros)
let [primeiroNumeroArray, segundoNumeroArray, ...restoNumeros] = numeros
console.log("primeiroNumeroArray " + primeiroNumeroArray)
console.log("segundoNumeroArray " + segundoNumeroArray)
console.log("restoNumeros " + restoNumeros)
// Operadores de Coalescência Nula
let valorNulo = null
let valorIndefinido = undefined 
let valorPadrao = "Valor Padrão"
console.log("valorNulo " + valorNulo)
console.log("valorIndefinido " + valorIndefinido)
console.log("valorPadrao " + valorPadrao)
// operador de coalescência nula (??)
let resultadoCoalescenciaNula1 = valorNulo ?? valorPadrao
console.log("resultadoCoalescenciaNula1 " + resultadoCoalescenciaNula1) // retorna "Valor Padrão"
let resultadoCoalescenciaNula2 = valorIndefinido ?? valorPadrao
console.log("resultadoCoalescenciaNula2 " + resultadoCoalescenciaNula2) // retorna "Valor Padrão"
let valorNaoNulo = "Valor Não Nulo"
let resultadoCoalescenciaNula3 = valorNaoNulo ?? valorPadrao
console.log("resultadoCoalescenciaNula3 " + resultadoCoalescenciaNula3) // retorna "Valor Não Nulo"
// Operadores de Encadeamento Opcional
let usuario = {
    nome: "Carlos",
    endereco: {
        rua: "Rua A",
        cidade: "Rio de Janeiro"
    }
}
console.log("usuario " + JSON.stringify(usuario))
// acesso seguro a propriedades com encadeamento opcional (?.)
let nomeUsuario = usuario?.nome
console.log("nomeUsuario " + nomeUsuario) // retorna "Carlos"
let cidadeUsuario = usuario?.endereco?.cidade
console.log("cidadeUsuario " + cidadeUsuario) // retorna "Rio de Janeiro"
let cepUsuario = usuario?.endereco?.cep
console.log("cepUsuario " + cepUsuario) // retorna undefined, sem erro
let telefoneUsuario = usuario?.contato?.telefone
console.log("telefoneUsuario " + telefoneUsuario) // retorna undefined, sem erro
// chamada segura de métodos com encadeamento opcional (?.)
let resultadoChamadaMetodo = usuario?.getIdade?.()
console.log("resultadoChamadaMetodo " + resultadoChamadaMetodo) // retorna undefined, sem erro
// acesso seguro a elementos de array com encadeamento opcional (?.)
let numerosArray = [1, 2, 3]
console.log("numerosArray " + numerosArray)
let primeiroNumeroArrayOpcional = numerosArray?.[0]
console.log("primeiroNumeroArrayOpcional " + primeiroNumeroArrayOpcional) // retorna 1
let quartoNumeroArrayOpcional = numerosArray?.[3]
console.log("quartoNumeroArrayOpcional " + quartoNumeroArrayOpcional) // retorna undefined, sem erro

