""""Em Python, listas são estruturas de dados que armazenam múltiplos valores em uma única 
variável. Elas são mutáveis, o que significa que podem ser modificadas após a criação. 
As listas são ordenadas e podem conter valores de diferentes tipos 
(inteiros, strings, objetos, etc.)."""

'''
1 - Criando Listas
'''

#1.1 - Lista Vazia:
lista = []


#1.2 - Lista com Valores:
numeros = [1, 2, 3, 4, 5]
nomes = ["Ana", "João", "Carlos"]
misto = [1, "Python", 3.14, True]


#1.3 - Usando list():
lista = list("Python")  # ['P', 'y', 't', 'h', 'o', 'n']

'''
2 - Acessando Elementos da Lista
'''
#2.1 - Acesso por Índice (começa em 0):
numeros = [10, 20, 30, 40]
print(numeros[0])  # 10 (primeiro elemento)
print(numeros[2])  # 30 (terceiro elemento)


#2.2 - Índices Negativos (de trás para frente):
print(numeros[-1])  # 40 (último elemento)
print(numeros[-2])  # 30 (penúltimo elemento)

#2.3 - Fatiamento:
print(numeros[1:3])  # [20, 30] (do índice 1 ao 2)
print(numeros[:2])   # [10, 20] (do início até o índice 1)
print(numeros[::2])  # [10, 30] (pula de 2 em 2)


'''
3 - Modificando Listas
'''
#3.1 - Alterar um Elemento:
numeros[1] = 25
print(numeros)  # [10, 25, 30, 40]

#3.2 - Inserir um Elemento:
#append() – Adiciona um elemento ao final da lista.
numeros.append(50)

#insert() – Insere um elemento em um índice específico.
numeros.insert(1, 15)  # Insere 15 na posição 1

#extend() – Adiciona vários elementos de outra lista.
numeros.extend([60, 70])

#3.3 - Remover Elementos:
#remove(valor) – Remove a primeira ocorrência do valor especificado.
numeros.remove(30)

#pop() – Remove e retorna o último elemento (ou o de um índice específico).
numeros.pop()  # Remove o último elemento
numeros.pop(1)  # Remove o elemento no índice 1

#del – Remove elementos por índice.
del numeros[0]  # Remove o primeiro elemento

'''
4 - Ordenar Listas:
'''
#sort() – Ordena a lista em ordem crescente.
numeros.sort()  # [10, 15, 25, 40, 50, 60, 70]

#reverse() – Inverte a ordem da lista.
numeros.reverse()

'''
5 - Funções Úteis com Listas
'''
#len() – Retorna o tamanho da lista.
print(len(numeros))  # 6

#min() – Retorna o menor valor.
print(min(numeros))  # 10

#max() – Retorna o maior valor.
print(max(numeros))  # 70

#sum() – Retorna a soma de todos os elementos (se forem números).
print(sum(numeros))  # 230

#Iterar sobre Listas
for numero in numeros:
    print(numero)

#Compreensão de Listas (List Comprehension)
quadrados = [x**2 for x in range(5)]
print(quadrados)  # [0, 1, 4, 9, 16]

#Exemplo Completo
numeros = [1, 2, 3]
numeros.append(4)
numeros.insert(0, 0)  # [0, 1, 2, 3, 4]
numeros.remove(2)     # [0, 1, 3, 4]
numeros.pop()         # [0, 1, 3]
numeros.extend([5, 6])  # [0, 1, 3, 5, 6]
numeros.sort(reverse=True)  # [6, 5, 3, 1, 0]

'''
Resumo Rápido:

Operação	                    Método	Exemplo
Adicionar elemento	            append()	lista.append(10)
Inserir elemento em posição	    insert()	lista.insert(1, 20)
Concatenar listas	            extend()	lista.extend([30, 40])
Remover elemento (valor)	    remove()	lista.remove(10)
Remover elemento (índice)	    pop()	    lista.pop(2)
Ordenar lista	                sort()	    lista.sort()
Inverter lista	                reverse()	lista.reverse()
Tamanho da lista	            len()	    len(lista)
Menor elemento	                min()	    min(lista)
Maior elemento	                max()	    max(lista)
As listas são extremamente flexíveis e fundamentais para trabalhar com coleções de dados 
em Python! 🚀
'''