'''
Em Python, conjuntos são estruturas de dados que armazenam elementos únicos (sem duplicatas) 
e são baseados na teoria dos conjuntos da matemática. Eles são não ordenados e podem ser usados
para operações como união, interseção e diferença.

A classe utilizada para representar conjuntos é a set.
'''
'''
1 - Criando conjuntos
'''
#1.1 - Conjunto Vazio:
conjunto_vazio = set()  # Não use {} para conjuntos vazios (isso cria um dicionário)

#1.2 - Conjunto com Elementos:
conjunto = {1, 2, 3, 4, 5}

#1.3 - Usando o Construtor set():
conjunto = set([1, 2, 2, 3])  # Elementos duplicados serão removidos
print(conjunto)  # {1, 2, 3}

conjunto_strings = set("Python")  # {'P', 'y', 't', 'h', 'o', 'n'}

'''
2 - Características dos Conjuntos
'''
#2.1 Elementos Únicos: Conjuntos não permitem duplicatas.
conjunto = {1, 2, 2, 3}
print(conjunto)  # {1, 2, 3}

#2.2 - Não Ordenado: Conjuntos não têm ordem definida. O acesso direto por índice não é possível.
conjunto = {3, 1, 2}
print(conjunto)  # A ordem pode variar: {1, 2, 3}

#2.3 - Conjuntos podem conter qualquer tipo de dado imutável (como números, strings ou tuplas), 
# mas não listas ou dicionários.
conjunto = {1, "Python", (2, 3)}

'''
3 - Operações Básicas com Conjuntos
'''
#3.1 - Adicionar Elemento: add(elemento): Adiciona um elemento ao conjunto.
conjunto = {1, 2, 3}
conjunto.add(4)
print(conjunto)  # {1, 2, 3, 4}

#3.2 - Remover Elemento: 
# remove(elemento): Remove um elemento (gera erro se não existir).
conjunto.remove(3)

#discard(elemento): Remove um elemento (não gera erro se não existir).
conjunto.discard(5)

#pop(): Remove e retorna um elemento arbitrário (útil apenas para conjuntos pequenos).
elemento = conjunto.pop()
print(elemento, conjunto)

#clear(): Remove todos os elementos do conjunto.
conjunto.clear()
print(conjunto)  # set()

'''
4 - Operações entre Conjuntos
'''
#4.1 - União (| ou union()): 
# Combina todos os elementos de dois conjuntos.
a = {1, 2, 3}
b = {3, 4, 5}
print(a | b)         # {1, 2, 3, 4, 5}
print(a.union(b))    # {1, 2, 3, 4, 5}

#4.2 - Interseção (& ou intersection()): 
# Retorna os elementos comuns aos dois conjuntos.
print(a & b)         # {3}
print(a.intersection(b))  # {3}

#4.3 - Diferença (- ou difference()): 
# Retorna os elementos que estão no primeiro conjunto, mas não no segundo.
print(a - b)         # {1, 2}
print(a.difference(b))  # {1, 2}

#4.4 - Diferença Simétrica (^ ou symmetric_difference()):
# Retorna os elementos que estão em um conjunto ou no outro, mas não em ambos.
print(a ^ b)         # {1, 2, 4, 5}
print(a.symmetric_difference(b))  # {1, 2, 4, 5}

'''
Métodos Úteis de Conjuntos
Método	                        Descrição
add(elemento)	                Adiciona um elemento ao conjunto
remove(elemento)	            Remove um elemento (erro se não existir)
discard(elemento)	            Remove um elemento (sem erro se não existir)
clear()	                        Remove todos os elementos
union(outra)	                Retorna a união de dois conjuntos
intersection(outra)	            Retorna a interseção
difference(outra)	            Retorna a diferença
symmetric_difference(outra)	    Retorna a diferença simétrica
issubset(outra)	                Verifica se o conjunto é um subconjunto
issuperset(outra)	            Verifica se o conjunto é um superconjunto
isdisjoint(outra)	            Verifica se dois conjuntos são disjuntos
'''

'''
5 - Verificando Relações entre Conjuntos
'''
#5.1 - Subconjunto
a = {1, 2, 3}
b = {1, 2}
print(b.issubset(a))  # True

#5.2 - Superconjunto:
print(a.issuperset(b))  # True

#5.3 - Disjunto (sem interseção):
c = {4, 5}
print(a.isdisjoint(c))  # True

#Exemplo completo
a = {1, 2, 3}
b = {3, 4, 5}

# Operações
print(a | b)  # União: {1, 2, 3, 4, 5}
print(a & b)  # Interseção: {3}
print(a - b)  # Diferença: {1, 2}
print(a ^ b)  # Diferença simétrica: {1, 2, 4, 5}

# Métodos
a.add(6)
a.remove(2)
print(a)  # {1, 3, 6}

'''
Os conjuntos são úteis em situações onde é importante:

Garantir unicidade.
Realizar operações matemáticas (união, interseção, etc.).
Comparar coleções rapidamente. 🚀
'''