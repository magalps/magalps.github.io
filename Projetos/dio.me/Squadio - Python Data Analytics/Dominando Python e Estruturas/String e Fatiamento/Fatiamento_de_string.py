''' O fatiamento de string em Python permite extrair partes de uma string usando a notação de 
    colchetes [] com índices. É uma ferramenta poderosa para manipulação de strings.

Sintaxe do Fatiamento. A sintaxe básica é:'''
#string[início:fim:passo]

'''
início: Índice inicial (inclusive).
fim: Índice final (exclusivo).
passo: Determina o incremento entre os índices.
'''

'''
Observações:
Os índices em Python começam em 0.
Índices negativos começam do final da string, sendo -1 o último caractere.
O início, fim e passo são opcionais.
'''

#Exemplos Práticos de Fatiamento
'''
1. Fatiamento simples
'''
texto = "Python"

# Fatiar do índice 0 ao 2 (exclusivo)
print(texto[0:2])  # "Py"

# Fatiar do índice 2 até o final
print(texto[2:])  # "thon"

# Fatiar do início até o índice 4 (exclusivo)
print(texto[:4])  # "Pyth"

'''
2 - Uso do passo
O parâmetro passo define o intervalo entre os caracteres.
'''
texto = "Python"

# Pular caracteres (passo = 2)
print(texto[::2])  # "Pto"

# Fatiar em ordem inversa (passo = -1)
print(texto[::-1])  # "nohtyP"

# Fatiar de trás para frente com um intervalo de 2
print(texto[::-2])  # "nhy"

'''
3 - Índices negativos
Você pode usar índices negativos para acessar caracteres a partir do final da string.
'''
texto = "Python"

# Último caractere
print(texto[-1])  # "n"

# Penúltimo caractere
print(texto[-2])  # "o"

# Fatiamento do 2º até o penúltimo caractere
print(texto[1:-1])  # "ytho"

'''
4 - Fatiamento vazio
Se os parâmetros forem deixados vazios:

: sem valores indica "do início ao fim".
[::-1] inverte toda a string.
'''
texto = "Python"

# Toda a string
print(texto[:])  # "Python"

# String invertida
print(texto[::-1])  # "nohtyP"
'''
5 - Combinando fatiamento
Você pode combinar índices e passos para obter resultados específicos.
'''
texto = "abcdef"

# Fatiar do índice 1 ao 5, pulando de 2 em 2
print(texto[1:5:2])  # "bd"

# Fatiar apenas as 3 primeiras letras invertidas
print(texto[2::-1])  # "cba"

''''
Resumo Rápido
Expressão	    Resultado	Descrição
texto[1:4]	    "yth"	    Índices de 1 a 3
texto[:3]	    "Pyt"	    Do início até índice 3 (exclusivo)
texto[2:]	    "thon"	    Do índice 2 até o final
texto[::2]	    "Pto"	    Pula de 2 em 2
texto[::-1]	    "nohtyP"	Inverte a string
texto[-3:-1]	"ho"	    Usa índices negativos
'''

''''
O fatiamento é uma ferramenta simples e poderosa para manipular strings em Python. 
Pratique combinando início, fim e passo para dominar essa técnica! 🚀
'''