''' 
Em Python temos 3 formas de interpolar variáveis em strings, a primeira é usando o sinal %, 
a segunda é utilizando o método format e a última é utilizando f strings. a primeira forma 
não é atualmente recomendada e seu uso em Python 3 é raro, por esse motivos iremos focar 
nas 2 últimas.
'''

'''
1 - F-strings (f"") – Python 3.6+
As f-strings são a maneira mais moderna e recomendada de interpolar 
variáveis em Python. Elas permitem inserir variáveis diretamente 
dentro da string usando chaves {}.
'''

#Sintaxe:
nome = "João"
idade = 25
print(f"Meu nome é {nome} e eu tenho {idade} anos.")

#Exemplo com expressões:
a = 5
b = 3
print(f"A soma de {a} e {b} é {a + b}.")  # A soma de 5 e 3 é 8.

'''
2 - Método format()
O método str.format() permite substituir marcadores {} por variáveis ou valores.
'''

#Sintaxe:
nome = "Maria"
idade = 30
print("Meu nome é {} e eu tenho {} anos.".format(nome, idade))

#Usando índices de posição:
print("Meu nome é {0} e eu tenho {1} anos.".format("Carlos", 40))

#Usando nomes de variáveis:
print("Meu nome é {nome} e eu tenho {idade} anos.".format(nome="Ana", idade=22))

'''
3 - Sinal de percentagem (%) – Python 2.x e 3.x
Este método é inspirado no estilo do C. Ele usa o operador % para formatar strings.
'''

#Sintaxe: 
nome = "Pedro"
idade = 28
print("Meu nome é %s e eu tenho %d anos." % (nome, idade))

# %s: String
# %d: Inteiro
# %f: Float (números de ponto flutuante)

#Exemplo com float formatado:
altura = 1.75
print("Minha altura é %.2f metros." % altura)  # Minha altura é 1.75 metros

# ⚠️Nota: Embora ainda funcione, essa abordagem é considerada menos legível e não é recomendada 
# em novos projetos.

''' 
4 - Concatenação Manual
'''
#    Você pode concatenar strings usando o operador + e convertendo variáveis, quando necessário, 
# para str.

#Sintaxe:
nome = "Lucas"
idade = 20
print("Meu nome é " + nome + " e eu tenho " + str(idade) + " anos.")
# ⚠️Desvantagem: Pode ser menos eficiente e mais difícil de ler, especialmente com várias 
# variáveis.

'''
Comparação das Abordagens
Método	        Exemplo	                                    Recomendações
F-strings	    f"Nome: {nome}, Idade: {idade}"	            ✅ Recomendado (Python 3.6+)
format()	    "Nome: {}, Idade: {}".format(nome, idade)	✅ Usado em Python 3.x
% operador	    "Nome: %s, Idade: %d" % (nome, idade)	    ⚠️ Obsoleto, não recomendado
Concatenação	"Nome: " + nome + ", Idade: " + str(idade)	⚠️ Pode ser difícil de ler

Melhor Prática
A abordagem f-strings é a mais moderna e legível. Sempre que possível, 
use f-strings para interpolar variáveis em Python, pois são concisas, rápidas e flexíveis.
'''