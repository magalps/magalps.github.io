#As estruturas de repetição em Python permitem executar blocos de código várias vezes, 
# dependendo de uma condição. Python oferece duas estruturas principais de repetição:

#for (laço controlado)
#O for é usado para iterar sobre sequências (listas, strings, tuplas, dicionários, etc.) ou objetos iteráveis.
#for variável in sequência:
    # Bloco de código a ser repetido

#Iterando sobre uma lista:
frutas = ["maçã", "banana", "laranja"]
for fruta in frutas:
    print(fruta)

#Iterando sobre uma string:
for letra in "Python":
    print(letra)

#Usando range() para gerar uma sequência numérica:
for i in range(5):  # Gera os números de 0 a 4
    print(i)

# range() com início e passo
for i in range(1, 10, 2):  # Gera números de 1 a 9, com passo 2
    print(i)

#while (laço condicional)
#O while é usado quando a repetição depende de uma condição ser verdadeira.
#while condição:
    # Bloco de código a ser repetido

#Contagem com while:
contador = 0
while contador < 5:
    print(contador)
    contador += 1

#Repetindo até uma condição ser atendida:
senha = ""
while senha != "1234":
    senha = input("Digite a senha: ")
print("Senha correta!")

#Controle de Fluxo em Estruturas de Repetição
#break - Encerra o laço imediatamente, mesmo que a condição ainda seja verdadeira.
for i in range(10):
    if i == 5:
        break
    print(i)  # Imprime de 0 a 4

#continue - Pula para a próxima iteração, ignorando o código restante no bloco.
for i in range(5):
    if i == 2:
        continue
    print(i)  # Imprime 0, 1, 3, 4

#else com for ou while - O bloco else é executado quando o laço termina sem ser 
# interrompido por um break.
for i in range(5):
    print(i)
else:
    print("Laço concluído!")

# Exemplo com `break`:
for i in range(5):
    if i == 3:
        break
    print(i)
else:
    print("Nunca será executado porque houve um 'break'")

#Escolhendo a Estrutura Correta
# Use for: Quando você sabe o número de iterações ou está iterando sobre uma sequência.
# Use while: Quando as iterações dependem de uma condição que pode mudar dinamicamente.
numeros = [1, 2, 3, 4, 5]
soma = 0

for num in numeros:
    soma += num
    if soma > 10:
        break
print("Soma interrompida:", soma)

i = 0
while i < len(numeros):
    print("Número:", numeros[i])
    i += 1




