''' 
Em Python, é possível criar strings de múltiplas linhas usando aspas triplas (" " " ou ' ' '). 
Isso permite escrever textos longos que ocupam várias linhas sem precisar quebrar a string 
manualmente.
'''

#Criando Strings de Múltiplas Linhas
'''
1 - Aspas triplas duplas (""")
Você pode usar três aspas duplas para definir uma string que ocupa várias linhas:
'''
texto = """Este é um exemplo
de uma string que ocupa
múltiplas linhas."""
print(texto)

'''
2 - Aspas triplas simples (' ' ')
Alternativamente, você pode usar três aspas simples para o mesmo efeito:
'''
texto = '''Python suporta strings
de múltiplas linhas usando
aspas triplas simples.'''
print(texto)

#Saída:
#Python suporta strings
#de múltiplas linhas usando
#aspas triplas simples.

'''
Características Importantes
Preservação de quebras de linha
Ao usar aspas triplas, as quebras de linha são preservadas na string.

Espaços são mantidos
Os espaços e indentação dentro das aspas triplas serão mantidos.
'''
texto = """Linha 1
    Linha 2 com indentação
Linha 3 sem indentação"""
print(texto)

#Saída
#Linha 1
#    Linha 2 com indentação
#Linha 3 sem indentação

'''
Docstrings
Strings de múltiplas linhas são frequentemente usadas como 
docstrings para documentar funções, classes e módulos.
'''
def funcao():
    """
    Esta função não faz nada.
    Apenas um exemplo de docstring.
    """
    pass

print(funcao.__doc__)

#Saída:
#Esta função não faz nada.
#Apenas um exemplo de docstring.

'''
Strings de Múltiplas Linhas com Quebras Manuais
Caso você não queira usar aspas triplas, pode quebrar a string manualmente usando o caractere \:
'''
texto = "Esta é uma string que " \
        "quebra a linha, mas " \
        "ainda é contínua."
print(texto)

#Saída:
#Esta é uma string que quebra a linha, mas ainda é contínua.

'''
Strings Raw (Mantendo \ como texto)
Se você estiver trabalhando com múltiplas linhas e quiser evitar que caracteres especiais como 
\n (nova linha) sejam interpretados, use strings raw (r"""..."""):
'''
texto = r"""C:\novo\diretorio
Linha com barra invertida."""
print(texto)

#Saída:
#C:\novo\diretorio
#Linha com barra invertida.

#Resumo:
#Use """ ou ''' para strings de múltiplas linhas.
#As quebras de linha e indentação são mantidas.
#Ideal para docstrings e textos longos.