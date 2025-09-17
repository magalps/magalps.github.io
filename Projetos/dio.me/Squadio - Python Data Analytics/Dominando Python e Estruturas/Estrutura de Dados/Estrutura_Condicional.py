#As estruturas condicionais em Python são usadas para tomar decisões no 
# código com base em condições avaliadas como verdadeiras (True) ou falsas (False). 
# A estrutura principal é o if, que pode ser combinado com elif e else para 
# criar lógicas mais complexas.

#Estrutura Básica de Condicional
#if condição:
    # Bloco de código executado se a condição for verdadeira
#elif outra_condição:
    # Bloco de código executado se a outra_condição for verdadeira
#else:
    # Bloco de código executado se nenhuma condição anterior for verdadeira

#if Simples
x = 10
if x > 5:
    print("x é maior que 5")

#if com else
x = 3
if x > 5:
    print("x é maior que 5")
else:
    print("x é menor ou igual a 5")

#if com elif e else
x = 8
if x > 10:
    print("x é maior que 10")
elif x == 10:
    print("x é igual a 10")
else:
    print("x é menor que 10")

#Operadores em Condicionais - Você pode usar operadores de comparação, 
# operadores lógicos e operadores de associação dentro das condições.
# Operadores de comparação
if x > 5:
    print("Maior que 5")

# Operadores lógicos
if x > 5 and x < 10:
    print("Entre 5 e 10")

# Operadores de associação
if "a" in "python":
    print("A letra está na palavra")

#Condicional em Linha Única (Ternário) - Python permite usar uma 
# estrutura condicional em linha única, útil para expressões simples.
x = 10
mensagem = "Maior que 5" if x > 5 else "Menor ou igual a 5"
print(mensagem)

#Boas Práticas
#Identação obrigatória:
#O Python exige quatro espaços (ou um tab) para o bloco de código dentro de cada condicional.
#Exemplo:
if True:
    print("Correto")  # Correto
# print("Errado")  # Este código está fora do bloco
#Mantenha as condições claras:
# Use nomes de variáveis autoexplicativas para tornar o código mais legível.

#Evite blocos vazios:
# Se precisar de um bloco condicional vazio, use pass:
if True:
    pass  # Placeholder
