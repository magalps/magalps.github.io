'''
Os dicionários em Python são estruturas de dados que armazenam pares de chave-valor. 
Cada chave no dicionário é única e pode ser usada para acessar seu valor correspondente. 
Dicionários são definidos pela classe dict.
'''
'''
1 - Criando Dicionários
'''
#1.1 - Dicionário Vazio:
dicionario = {}
# ou
dicionario = dict()

#1.2 - Dicionário com Valores:
dicionario = {"nome": "João", "idade": 30, "profissao": "Engenheiro"}

#1.3 - dicionario = dict(nome="Ana", idade=25, profissao="Médica")
dicionario = dict(nome="Ana", idade=25, profissao="Médica")

#1.4 - Usando uma Lista de Tuplas:
dicionario = dict([("nome", "Carlos"), ("idade", 28)])

#1.5 - Usando Compreensão de Dicionário:
quadrados = {x: x**2 for x in range(1, 6)}
print(quadrados)  # {1: 1, 2: 4, 3: 9, 4: 16, 5: 25}

'''
2 - Acessando Dados em um Dicionário
'''
#2.1 - Acesso por Chave:
dicionario = {"nome": "João", "idade": 30}
print(dicionario["nome"])  # "João"
print(dicionario["idade"])  # 30

#⚠️ Erro se a chave não existir:
print(dicionario["endereco"])  # KeyError

#2.2 - Usando o Método get():
print(dicionario.get("nome"))       # "João"
print(dicionario.get("endereco"))   # None (não gera erro)
print(dicionario.get("endereco", "Não encontrado"))  # "Não encontrado"

#2.3 - Verificando Existência de Chaves:
if "nome" in dicionario:
    print("A chave 'nome' está presente.")
if "endereco" not in dicionario:
    print("A chave 'endereco' não está presente.")

'''
3 - Modificando Dicionários
'''
#3.1 - Adicionar ou Atualizar Valores:
dicionario = {"nome": "João", "idade": 30}
dicionario["profissao"] = "Engenheiro"  # Adiciona
dicionario["idade"] = 31               # Atualiza
print(dicionario)  # {'nome': 'João', 'idade': 31, 'profissao': 'Engenheiro'}

#3.2 - Remover Itens:
#pop(chave): Remove e retorna o valor associado à chave.
dicionario.pop("idade")  # 30
print(dicionario)        # {'nome': 'João'}

#del dicionario[chave]: Remove a chave e o valor associado.
del dicionario["nome"]
print(dicionario)  # {}

#popitem(): Remove e retorna o último par inserido (no Python 3.7+).
item = dicionario.popitem()
print(item)  # ('profissao', 'Engenheiro')

#clear(): Remove todos os itens do dicionário.
dicionario.clear()
print(dicionario)  # {}

#del: Deletar Itens de um Dicionário: Você pode remover pares chave-valor de um dicionário.
dicionario = {"a": 1, "b": 2, "c": 3}
del dicionario["b"]
print(dicionario)  # {'a': 1, 'c': 3}


'''
4 - Iterando sobre Dicionários
'''
#4.1 - Iterar pelas Chaves:
for chave in dicionario:
    print(chave)

#4.2 - Iterar pelos Valores:
for valor in dicionario.values():
    print(valor)

#4.3 - Iterar pelos Pares Chave-Valor:
for chave, valor in dicionario.items():
    print(f"{chave}: {valor}")


'''
5 - Outros metodos
'''
#5.1 - setdefault():
d = {"a": 1}
print(d.setdefault("a", 5))  # 1 (já existe, retorna o valor atual)
print(d.setdefault("b", 5))  # 5 (não existe, insere a chave 'b' com valor 5)
print(d)  # {'a': 1, 'b': 5}

#5.2 - copy - novo_dicionario = dicionario.copy()
#copia simples
d = {"a": 1, "b": 2, "c": 3}
copia = d.copy()
print(copia)  # {'a': 1, 'b': 2, 'c': 3}

#Diferença entre Cópia Superficial e Profunda:
import copy

d = {"a": [1, 2, 3], "b": 4}
copia_superficial = d.copy()  # Shallow copy
copia_profunda = copy.deepcopy(d)  # Deep copy

# Alterando o valor da lista no dicionário original
d["a"].append(4)

print(d)                # {'a': [1, 2, 3, 4], 'b': 4}
print(copia_superficial)  # {'a': [1, 2, 3, 4], 'b': 4} (Aponta para a mesma lista)
print(copia_profunda)     # {'a': [1, 2, 3], 'b': 4} (Cópia independente)

#5.3 - fromkeys() - dicionario = dict.fromkeys(iteravel, valor_padrao)
#Criando um dicionário com chaves e valores padrão:
chaves = ["a", "b", "c"]
d = dict.fromkeys(chaves, 0)
print(d)  # {'a': 0, 'b': 0, 'c': 0}

#Sem especificar valor padrão:
chaves = ["x", "y", "z"]
d = dict.fromkeys(chaves)
print(d)  # {'x': None, 'y': None, 'z': None}

#Cuidado com valores mutáveis como valor padrão: Se o valor padrão for um objeto mutável, 
# como uma lista, todas as chaves apontarão para o mesmo objeto.
chaves = ["a", "b", "c"]
d = dict.fromkeys(chaves, [])
d["a"].append(1)

print(d)  # {'a': [1], 'b': [1], 'c': [1]} (mesma lista compartilhada entre as chaves)

#Solução: Para evitar isso, você pode usar compreensão de dicionário:
chaves = ["a", "b", "c"]
d = {chave: [] for chave in chaves}
d["a"].append(1)

print(d)  # {'a': [1], 'b': [], 'c': []}


'''
Métodos Úteis
Método	                    Descrição
get(chave, valor_padrao)	    Retorna o valor associado à chave ou valor padrão.
keys()	                        Retorna as chaves do dicionário.
values()	                    Retorna os valores do dicionário.
items()	                        Retorna pares (chave, valor) do dicionário.
pop(chave)	                    Remove e retorna o valor associado à chave.
popitem()	                    Remove e retorna o último par inserido.
update(outro_dict)	            Atualiza o dicionário com outro dicionário.
clear()	                        Remove todos os itens do dicionário.
setdefault(chave, valor_padrao)	Retorna o valor de uma chave. Se a chave não existir, 
                                insere-a com o valor padrão.
copy()	                        Retorna uma cópia superficial do dicionário.
fromkeys()	                    Cria um novo dicionário a partir de chaves fornecidas.
del dicionario["chave"]         Remove a chave especificada
'''
#Exemplo Completo
dicionario = {"nome": "João", "idade": 30, "profissao": "Engenheiro"}

# Acessando dados
print(dicionario["nome"])      # João
print(dicionario.get("idade")) # 30

# Modificando dados
dicionario["idade"] = 31
dicionario["endereco"] = "Rua ABC"

# Removendo dados
dicionario.pop("profissao")

# Iterando
for chave, valor in dicionario.items():
    print(f"{chave}: {valor}")

# Métodos úteis
print(dicionario.keys())    # dict_keys(['nome', 'idade', 'endereco'])
print(dicionario.values())  # dict_values(['João', 31, 'Rua ABC'])
print(dicionario.items())   # dict_items([('nome', 'João'), ('idade', 31), ('endereco', 'Rua ABC')])

'''
Os dicionários são extremamente flexíveis e ideais para representar dados estruturados e 
relacionamentos chave-valor, sendo amplamente usados em Python para manipulação de dados! 🚀
'''