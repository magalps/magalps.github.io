'''
Em Python, uma tupla é uma estrutura de dados semelhante a uma lista, mas com uma diferença 
fundamental: tuplas são imutáveis. Isso significa que, uma vez criada, uma tupla não pode 
ser alterada (não é possível adicionar, remover ou modificar elementos).
'''

'''
1 -  Criando Tuplas
'''
#1.1 - Tupla Vazia:
tupla_vazia = ()

#1.2 - Tupla com Elementos:
tupla = (1, 2, 3, 4, 5)

#1.3 - Tupla Sem Parênteses (Empacotamento Implícito):
tupla = 1, 2, 3, 4

#1.4 - Tupla com Um Elemento:
#⚠️ Atenção: Para criar uma tupla com apenas um elemento, é necessário adicionar uma 
# vírgula , após o valor.
tupla_unica = (1,)  # Correto
nao_tupla = (1)     # Isso é um int

#1.5 - Usando o Construtor tuple():
lista = [1, 2, 3]
tupla = tuple(lista)  # Converte lista em tupla

'''
2 - Acessando Elementos da Tupla
'''
#2.1 - Índice Positivo:
tupla = (10, 20, 30, 40)
print(tupla[0])  # 10
print(tupla[2])  # 30

#2.2 - Índice Negativo (de trás para frente):
print(tupla[-1])  # 40
print(tupla[-2])  # 30

#2.3 - Fatiamento (Slicing):
print(tupla[1:3])  # (20, 30)
print(tupla[:2])   # (10, 20)
print(tupla[::-1]) # (40, 30, 20, 10) (inverte a tupla)

#Desempacotamento de Tuplas
tupla = (1, 2, 3)
a, b, c = tupla
print(a)  # 1
print(b)  # 2
print(c)  # 3

#Desempacotamento Parcial:
tupla = (1, 2, 3, 4)
a, *resto = tupla
print(a)      # 1
print(resto)  # [2, 3, 4]

#Iterando sobre Tuplas
tupla = ("Python", "Java", "C++")
for linguagem in tupla:
    print(linguagem)

'''
Métodos Disponíveis para Tuplas
Embora as tuplas sejam imutáveis, alguns métodos úteis estão disponíveis:

Método	    Descrição
count(x)	Conta quantas vezes x aparece na tupla.
index(x)	Retorna o índice da primeira ocorrência de x.
len(tupla)	Retorna o número de elementos na tupla.
max(tupla)	Retorna o maior elemento.
min(tupla)	Retorna o menor elemento.
sum(tupla)	Retorna a soma de todos os elementos (se forem números).
'''

#Exemplos:
tupla = (1, 2, 3, 2, 5)
print(tupla.count(2))  # 2
print(tupla.index(3))  # 2
print(len(tupla))      # 5
print(max(tupla))      # 5
print(sum(tupla))      # 13


#Tuplas Aninhadas
#Tuplas podem conter outras tuplas, criando estruturas aninhadas:

tupla = ((1, 2), (3, 4), (5, 6))
print(tupla[1])     # (3, 4)
print(tupla[1][0])  # 3

'''
Vantagens das Tuplas
Imutabilidade – Dados em tuplas são protegidos contra modificações acidentais.
Eficiência – Tuplas são mais rápidas do que listas para armazenamento e acesso a dados.
Segurança – Ideal para armazenar dados que não devem ser alterados.
Chaves de Dicionários – Tuplas podem ser usadas como chaves em dicionários, pois são imutáveis.
'''

#Exemplo Completo
pessoa = ("João", 30, "Engenheiro")
print(f"Nome: {pessoa[0]}")
print(f"Idade: {pessoa[1]}")
print(f"Profissão: {pessoa[2]}")

'''
Resumo Rápido
Operação	                Exemplo	                Resultado
Criar tupla	tupla =         (1, 2, 3)	            (1, 2, 3)
Criar tupla de 1 elemento	tupla = (1,)	        (1,)
Acessar elemento	        tupla[1]	            2
Fatiar tupla	            tupla[1:3]	            (2, 3)
Desempacotar	            a, b, c = (1, 2, 3)	    a=1, b=2, c=3
Iterar	                    for x in tupla:	        Itera sobre cada elemento
Contar elemento	            tupla.count(2)	        1
Índice do elemento	        tupla.index(3)	        2
As tuplas são simples, seguras e eficientes para manipular dados imutáveis! 🚀
'''