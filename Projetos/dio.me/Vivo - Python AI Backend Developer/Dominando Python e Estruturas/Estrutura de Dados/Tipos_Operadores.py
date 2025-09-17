#1.0 Operadores Matematicos

#1.1 Adição
resultado = 3 + 5  # 8 

#1.2 Subtração
resultado = 10 - 4  # 6 

#1.3 Multiplicação
resultado = 6 * 7  # 42 

#1.4 Divisão
resultado = 15 / 4  # 3.75 

#1.5 Divisão Inteira
resultado = 15 // 4  # 3 

#1.6 Módulo ou Resto da Divisão
resultado = 15 % 4  # 3 

#1.7 Exponenciação
resultado = 2 ** 3  # 8 

#1.8 negativo
numero = 5
negativo = -numero  # -5

#1.9 adição de string (Concatenação)
texto = "Olá, " + "mundo!"  # "Olá, mundo!"

#1.10 Multiplicação de String
texto = "Oi" * 3  # "OiOiOi"

#1.11 Na matemática a ordem correta é: Parêntesis, Expoentes, Multiplicação e divisão (da esquerda para a direita) 
# e por fim a adição e subtração (da esquerda para a direita)
print(10 - 5 * 2) #0
print ((10 - 5) *2) #10
print (10 ** 2 * 2) #200
print (10 ** (2 * 2)) #10000
print (10 / 2 * 4) #20.0

#2.0 Operadores de Comparação
#Igual a (==) - Verifica se dois valores são iguais.
5 == 5  # True
5 == 3  # False

#2.1 Diferente de (!=) - Verifica se dois valores são diferentes.
5 != 3  # True
5 != 5  # False

#2.2 Maior que (>) - Verifica se o valor à esquerda é maior que o valor à direita.
7 > 3  # True
3 > 7  # False

#2.3 Menor que (<) - Verifica se o valor à esquerda é menor que o valor à direita.
3 < 7  # True
7 < 3  # False

#2.4 Maior ou igual a (>=) - Verifica se o valor à esquerda é maior ou igual ao valor à direita.
7 >= 7  # True
7 >= 3  # True

#2.5 Menor ou igual a (<=) - Verifica se o valor à esquerda é menor ou igual ao valor à direita.
3 <= 7  # True
7 <= 7  # True

#2.6 Uso com Strings - Os operadores de comparação também funcionam com strings, comparando-as lexicograficamente
# (ordem alfabética com base nos valores ASCII).
"abc" == "abc"  # True
"abc" < "abd"   # True
"z" > "a"       # True

#2.7 Uso com Tipos Diferentes - Comparar tipos diferentes (exemplo: string com número) geralmente gera um erro:
5 == "5"  # False
5 < "5"   # TypeError

#3.0 Operadores de Atribuição
#3.1 Atribuição Simples (=) - Atribui o valor à variável.
x = 10  # Atribui 10 à variável x

#3.2 Adição e Atribuição (+=) - Soma o valor à variável e atualiza seu valor.
x = 10
x += 5  # x agora é 15

#3.3 Subtração e Atribuição (-=) - Subtrai o valor da variável e atualiza seu valor.
x = 10
x -= 3  # x agora é 7

#3.4 Multiplicação e Atribuição (*=) - Multiplica o valor da variável e atualiza seu valor.
x = 10
x *= 2  # x agora é 20

#3.5 Divisão e Atribuição (/=) - Divide o valor da variável e atualiza seu valor (resultado em ponto flutuante).
x = 10
x /= 2  # x agora é 5.0

#3.6 Divisão Inteira e Atribuição (//=) - Realiza uma divisão inteira (sem parte decimal) e atualiza o valor.
x = 10
x //= 3  # x agora é 3

#3.7 Módulo e Atribuição (%=) - Calcula o resto da divisão e atualiza o valor.
x = 10
x %= 3  # x agora é 1

#3.8 Exponenciação e Atribuição (**=) - Eleva o valor da variável a uma potência e atualiza o valor.

#3.9 itwise E e Atribuição (&=) - Realiza um "E" bit a bit e atualiza o valor.
x = 5  # 0101 em binário
x &= 3  # 3 é 0011 em binário, então x agora é 1 (0001)

#3.10 Bitwise Ou e Atribuição (|=) - Realiza um "OU" bit a bit e atualiza o valor.
x = 5  # 0101 em binário
x &= 3  # 3 é 0011 em binário, então x agora é 1 (0001)

#3.11 Bitwise XOR e Atribuição (^=) - Realiza um "OU Exclusivo" bit a bit e atualiza o valor.
x = 5  # 0101 em binário
x ^= 3  # x agora é 6 (0110)

#3.12 Deslocamento à Esquerda e Atribuição (<<=) - Desloca os bits para a esquerda e atualiza o valor.
x = 2  # 0010 em binário
x <<= 1  # x agora é 4 (0100)

#3.13 Deslocamento à Direita e Atribuição (>>=) - Desloca os bits para a direita e atualiza o valor.
x = 8  # 1000 em binário
x >>= 2  # x agora é 2 (0010)

#4.0 Operador Lógico
#4.1 and (E lógico) - Retorna True se ambas as condições forem verdadeiras.
a = True
b = False
print(a and b)  # False
print(True and True)  # True

#4.2 or (OU lógico) - Retorna True se pelo menos uma das condições for verdadeira.
a = True
b = False
print(a or b)  # True
print(False or False)  # False

#4.3 not (Negação lógica) - Inverte o valor lógico. Se for True, retorna False, e vice-versa.
a = True
print(not a)  # False
print(not False)  # True

#4.4 Combinando and, or e not
a = True
b = False
c = True
resultado = a and (b or not c)
print(resultado)  # False


#4.5 Em uma estrutura condicional:
idade = 20
tem_carteira = True

if idade >= 18 and tem_carteira:
    print("Pode dirigir")
else:
    print("Não pode dirigir")

# 4.6 Precedência dos Operadores Lógicos
# A precedência é a ordem em que os operadores são avaliados:

# not (mais forte)
# and
# or (mais fraco)
# Use parênteses para controlar a ordem de avaliação, se necessário.
resultado = not True or False and True  # False
resultado = not (True or (False and True))  # False

#5.0 Operadores de Identidade
# Os operadores de identidade em Python são usados para verificar se dois objetos ocupam a mesma 
# posição na memória (isto é, se são realmente o mesmo objeto, não apenas têm o mesmo valor).

# 5.1 is - Retorna True se dois objetos forem o mesmo objeto (ocuparem o mesmo endereço na memória).
a = [1, 2, 3]
b = a  # b é a mesma referência que a
c = [1, 2, 3]  # c tem o mesmo valor, mas é um objeto diferente

print(a is b)  # True (a e b são o mesmo objeto)
print(a is c)  # False (a e c são objetos diferentes, mesmo valor)

#5.2 is not - Retorna True se dois objetos não forem o mesmo objeto.
a = [1, 2, 3]
b = [1, 2, 3]

print(a is not b)  # True (a e b não são o mesmo objeto)
print(a is not a)  # False (é o mesmo objeto)

#5.3 Diferença entre is e ==
# is: Verifica se dois objetos são o mesmo objeto (identidade de objeto).
# ==: Verifica se dois objetos têm o mesmo valor (igualdade de valor).
a = [1, 2, 3]
b = [1, 2, 3]

print(a == b)  # True (os valores de a e b são iguais)
print(a is b)  # False (a e b são objetos diferentes na memória)

#5.4 Casos Especiais com Objetos Imutáveis
# Para objetos imutáveis (como inteiros, strings e tuplas), o Python pode 
# otimizar e reutilizar objetos na memória, o que pode levar a resultados inesperados:
a = 1000
b = 1000
print(a is b)  # False (para números maiores, objetos diferentes)

c = 10
d = 10
print(c is d)  # True (pequenos inteiros podem ser reutilizados)

e = "hello"
f = "hello"
print(e is f)  # True (strings podem ser reutilizadas se imutáveis)

#5.5 Resumo
# is	Verifica se dois objetos são o mesmo objeto.	a is b
# is not	Verifica se dois objetos são diferentes.	a is not b

#6.0 Operadores de Associação
# Os operadores de associação em Python são usados para verificar se um valor ou objeto 
# está presente em uma sequência (como strings, listas, tuplas, dicionários, etc.). 
# Eles retornam um valor booleano: True ou False.

#6.1 in
# Verifica se um elemento está presente em uma sequência.
# Retorna True se o elemento estiver presente.
# Retorna False caso contrário.
# Exemplo com lista
frutas = ["maçã", "banana", "laranja"]
print("maçã" in frutas)  # True
print("uva" in frutas)   # False

# Exemplo com string
texto = "Python é incrível"
print("Python" in texto)  # True
print("java" in texto)    # False

#6.2 not in
# Verifica se um elemento não está presente em uma sequência.
# Retorna True se o elemento não estiver presente.
# Retorna False caso contrário.
# Exemplo com lista
frutas = ["maçã", "banana", "laranja"]
print("uva" not in frutas)  # True
print("maçã" not in frutas) # False

# Exemplo com string
texto = "Python é incrível"
print("java" not in texto)  # True
print("Python" not in texto) # False

#6.3 Uso em Dicionários - Em dicionários, os operadores de associação 
# verificam apenas as chaves, não os valores.
meu_dicionario = {"a": 1, "b": 2, "c": 3}

print("a" in meu_dicionario)      # True (verifica chave)
print(1 in meu_dicionario)        # False (valores não são verificados)
print("d" not in meu_dicionario)  # True

#Se for necessário verificar valores, você pode usar o método values():
print(1 in meu_dicionario.values())  # True

#6.4 Exemplos
#6.4.1 - Checar presença em listas:
numeros = [1, 2, 3, 4, 5]
if 3 in numeros:
    print("Número encontrado!")

#6.4.2 - Verificar substring:
frase = "Aprendendo Python"
if "Python" in frase:
    print("A palavra está na frase!")

#6.4.3 - Usar com condicionais:
frutas = ["maçã", "banana", "laranja"]
if "uva" not in frutas:
    print("Uva não está na lista.")

#6.5 - Resumo
# in	Verifica se um elemento está presente.	"a" in "abc"
# not in	Verifica se um elemento não está presente.	"x" not in "abc"