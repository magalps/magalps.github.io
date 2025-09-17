'''
A classe string em Python possui vários métodos úteis para manipulação de strings. 
Aqui estão os principais métodos organizados por categoria:
'''

'''
1 - Métodos de modificação
'''
#1.1 upper(): Converte a string para letras maiúsculas.
texto = "python"
print(texto.upper())  # PYTHON

#1.2 lower(): Converte a string para letras minúsculas.
print("PYTHON".lower())  # python

#1.3 capitalize(): Converte o primeiro caractere para maiúsculo e o restante para minúsculo.
print("python linguagem".capitalize())  # Python linguagem

#1.4 title(): Converte a string para letras maiúsculas e minúsculas
print("python linguagem de programação".title())  # Python Linguagem De Programação

#1.5 strip(): Remove espaços em branco no início e no final da string.
print("  python  ".strip())  # "python"

#1.6 lstrip(): Remove espaços à esquerda.
print("  python".lstrip())  # "python"

#1.7 rstrip(): Remove espaços à direita.
print("python  ".rstrip())  # "python"

#1.8 replace(old, new): Substitui partes da string.
print("olá mundo".replace("mundo", "Python"))  # olá Python

''' 
2 - Métodos de Consulta
'''
#2.1 startswith(substring): Verifica se a string começa com a substring.
print("python".startswith("py"))  # True

#2.2 endswith(substring): Verifica se a string termina com a substring.
print("python".endswith("on"))  # True

#2.3 find(substring): Retorna o índice da primeira ocorrência de uma substring (ou -1 se não for encontrada).
print("python".find("th"))  # 2
print("python".find("z"))   # -1

#2.4 count(substring): Conta quantas vezes uma substring aparece na string.
print("banana".count("a"))  # 3

''' 
3 - Métodos de Validação
Retornam True ou False dependendo do conteúdo da string.
'''
#3.1 isalpha(): Verifica se a string contém apenas letras.
print("Python".isalpha())  # True
print("Python3".isalpha())  # False

#3.2 isdigit(): Verifica se a string contém apenas dígitos.
print("12345".isdigit())  # True

#3.3 isalnum(): Verifica se a string contém apenas letras e números.
print("Python3".isalnum())  # True

#3.4 isspace(): Verifica se a string contém apenas espaços em branco.
print("   ".isspace())  # True

#3.5 islower(): Verifica se a string está em letras minúsculas.
print("python".islower())  # True

#3.6 isupper(): Verifica se a string está em letras maiúsculas.
print("PYTHON".isupper())  # True


''' 
4 - Métodos de Divisão e Junção
'''
#4.1 split(sep): Divide a string em uma lista usando o separador fornecido.
print("a,b,c".split(","))  # ['a', 'b', 'c']

#4.2 splitlines(): Divide a string em linhas.
print("linha1\nlinha2".splitlines())  # ['linha1', 'linha2']

#join(iterável): Junta os elementos de um iterável em uma única string, usando a string como separador.
print(",".join(["a", "b", "c"]))  # "a,b,c"

''' 
5 - Outros Métodos
'''
#5.1 len() (função embutida): Retorna o tamanho da string.
print(len("Python"))  # 6

#5.2 zfill(width): Adiciona zeros à esquerda até atingir o tamanho especificado.
print("42".zfill(5))  # "00042"

#5.3 center(width): Centraliza a string dentro de um campo de largura especificada.
print("Python".center(10, "-"))  # "--Python--"

'''
Resumo dos Principais Métodos
Método	        Descrição	                        Exemplo
upper()	        Converte para maiúsculas	        "py".upper() → "PY"
lower()	        Converte para minúsculas	        "PY".lower() → "py"
replace()	    Substitui parte da string	        "abc".replace("a", "z")
strip()	        Remove espaços em branco	        " abc ".strip() → "abc"
split()	        Divide a string em uma lista	    "a,b".split(",")
join()	        Junta elementos com separador	    " ".join(["a", "b"])
find()	        Retorna o índice da substring	    "abc".find("b") → 1
startswith()	Verifica o início da string	        "abc".startswith("a")
count()	        Conta ocorrências de uma substring	"aa".count("a") → 2
'''