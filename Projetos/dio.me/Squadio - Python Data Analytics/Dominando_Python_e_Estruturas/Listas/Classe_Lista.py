'''
Em Python, listas são objetos da classe list. A classe list fornece uma 
ampla variedade de métodos para manipular, organizar e trabalhar com 
coleções de dados de forma eficiente.
'''

'''
1 - Criando Listas (Classe list)
'''

#1.1 - Usando Colchetes [] (Forma Comum):
lista1 = [1, 2, 3, 4, 5]

#1.2 - Usando o Construtor list():
lista2 = list((1, 2, 3))  # A partir de uma tupla
lista3 = list("Python")   # A partir de uma string
lista_vazia = list()      # Lista vazia

'''
2 - Principais Métodos da Classe list
'''
#2.1 - Adicionar Elementos
#append(x) – Adiciona um elemento ao final da lista.
lista = [1, 2, 3]
lista.append(4)
# [1, 2, 3, 4]

#insert(i, x) – Insere um elemento x na posição i
lista.insert(1, 10)
# [1, 10, 2, 3, 4]

#extend(iterável) – Adiciona elementos de outro iterável 
# (como lista ou tupla).
lista.extend([5, 6])
# [1, 10, 2, 3, 4, 5, 6]

#2.2 - Remover Elementos
#remove(x) – Remove a primeira ocorrência do valor x.
lista.remove(10)
# [1, 2, 3, 4, 5, 6]

#pop(i) – Remove e retorna o elemento no índice i (ou o último elemento 
# se i não for especificado).
lista.pop(2)  # Remove o elemento de índice 2 (número 3)
# [1, 2, 4, 5, 6]

#clear() – Remove todos os elementos da lista.
lista.clear()
# []

'''
3 - Ordenar e Inverter
'''
#sort() – Ordena a lista em ordem crescente
lista = [3, 1, 4, 2]
lista.sort()
# [1, 2, 3, 4]

#reverse() – Inverte a ordem dos elementos.
lista.reverse()
# [4, 3, 2, 1]

#sort(reverse=True) – Ordena em ordem decrescente.
lista.sort(reverse=True)
# [4, 3, 2, 1]

'''
4 - Copiar Listas
'''
#copy() – Retorna uma cópia da lista.
lista_copia = lista.copy()

'''
5 - Contar e Localizar
'''
#count(x) – Conta quantas vezes o valor x aparece na lista.
lista = [1, 2, 2, 3, 4]
print(lista.count(2))  # 2

#index(x) – Retorna o índice da primeira ocorrência do valor x.
print(lista.index(3))  # 3

'''
6 - Fatiamento de Lista (list slicing)
'''
#Permite extrair sublistas.
lista = [1, 2, 3, 4, 5]
print(lista[1:4])  # [2, 3, 4]
print(lista[:3])   # [1, 2, 3]
print(lista[::-1]) # [5, 4, 3, 2, 1]  (Inverter a lista)

'''
7 - List Comprehension
'''
quadrados = [x**2 for x in range(5)]
print(quadrados)  # [0, 1, 4, 9, 16]

'''
Exemplo Completo
'''
lista = list(range(1, 6))  # [1, 2, 3, 4, 5]
lista.append(6)            # [1, 2, 3, 4, 5, 6]
lista.insert(2, 10)        # [1, 2, 10, 3, 4, 5, 6]
lista.remove(10)           # [1, 2, 3, 4, 5, 6]
lista.pop()                # [1, 2, 3, 4, 5]
lista.sort(reverse=True)   # [5, 4, 3, 2, 1]
copia = lista.copy()       # [5, 4, 3, 2, 1]
print(lista.count(3))      # 1

'''
Resumo dos Métodos da Classe list
Método	            Descrição
append(x)	        Adiciona x ao final da lista
insert(i, x)	    Insere x na posição i
extend(iterável)	Adiciona elementos de outro iterável
remove(x)	        Remove a primeira ocorrência de x
pop([i])	        Remove e retorna o elemento em i (último por padrão)
clear()	            Remove todos os elementos da lista
sort()	            Ordena a lista em ordem crescente
reverse()	        Inverte a ordem dos elementos
copy()	            Retorna uma cópia superficial da lista
count(x)	        Conta quantas vezes x aparece na lista
index(x)	        Retorna o índice da primeira ocorrência de x
'''

'''
Observações:
'''
#A lista aceita elementos duplicados.
#O tipo da lista é dinâmico e pode armazenar diferentes tipos de dados 
# simultaneamente.
mista = [1, "Python", 3.14, True]
print(mista)  # [1, 'Python', 3.14, True]

#A classe list é uma das estruturas de dados mais versáteis e essenciais
# para manipulação de coleções em Python. 🚀