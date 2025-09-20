#Regra de ouro, anotar em português o que você quer fazer

#Obs.: caso não tenha o pyautogui instalado, rode o comando abaixo no terminal:
#pip install pyautogui pandas os

"""
Vamos fazer um sistema que cadastre produtos em um sistema web
O sistema é fictício, mas vamos imaginar que é um sistema de uma empresa
Essa empresa quer automatizar o cadastro de produtos, que é algo que eles fazem todo dia
E eles tem uma base de dados com os produtos que precisam ser cadastrados
Sugestão para fazer a automação utilize sempre a tela principal (caso de 2 telas ou mais, use apenas 1)
automação é sempre indicado usar o mesmo computador, com a mesma resolução de tela
e o mesmo navegador (nesse caso, vamos usar o edge)
"""

#Passo 1 - entrar no sistema da empresa
#Passo 2 - fazer login
#Passo 3 - abrir a base de produtos
#Passo 4 - cadastrar um produto
#Passo 5 - repetir o cadastro para todos os produtos da base

#Sistema da empresa - https://dlp.hashtagtreinamentos.com/python/intensivao/login

import pyautogui
import pandas as pd #usei o as pd para facilitar a escrita
import time
import os #o meu estava com problema para achar o arquivo csv, ai usei o os
# para garantir que o python vai achar o arquivo csv, independente de onde esteja rodando o script

# pyautogui.write -> escrever um texto
# pyautogui.press -> apertar 1 tecla
# pyautogui.click -> clicar em algum lugar da tela
# pyautogui.hotkey -> combinação de teclas

pyautogui.PAUSE = 0.3

# abrir o navegador (edge)
pyautogui.press("win")
pyautogui.write("edge")
pyautogui.press("enter")

# entrar no link 
pyautogui.write("https://dlp.hashtagtreinamentos.com/python/intensivao/login")
pyautogui.press("enter")
time.sleep(3)

"""
vamos precisar capturar as coordenadas x e y de alguns pontos da tela
para isso, rode o código abaixo (descomente ele) e depois passe o mouse
pyautogui.position() -> vai mostrar as coordenadas do mouse tem o código (pegar_posicao.py) rode o código ele vai esperar 5 
segundos para você posicionar o mouse no local desejado e depois vai imprimir as coordenadas no terminal
"""

# Passo 2: Fazer login
# selecionar o campo de email
#pyautogui.click(x=685, y=451) da aula o meu foi melhor com o tab
pyautogui.press("tab")
# escrever o seu email
pyautogui.write("pythonimpressionador@gmail.com")
pyautogui.press("tab") # passando pro próximo campo
pyautogui.write("sua senha")
#pyautogui.click(x=955, y=638) # clique no botao de login da aula o meu foi melhor com o tab
pyautogui.press("tab")
pyautogui.press("enter")

#tempo de 3 segundos para o sistema logar
time.sleep(3)

"""
# Passo 3: abrir a base de produtos vamos usar o pandas esse foi o da aula, mas precisei fazer um ajusste com o os para abirr em qualquer lugar
pd.read_csv("produtos.csv") # lendo a base de dados
tabela = pd.read_csv("produtos.csv") # lendo a base de dados
print(tabela) # mostrando a base de dados
"""

# Passo 3: abrir a base de produtos vamos usar o pandas e o os nesse caso
base_dir = os.path.dirname(os.path.abspath(__file__))  # pasta do script
csv_path = os.path.join(base_dir, "produtos.csv")

tabela = pd.read_csv(csv_path)
print(tabela.head()) # mostrando as 5 primeiras linhas da base de dados

"""
#dica importante:
#antes de criar o código verifique o arquivo e padronize os dados
#ex.: se o campo preço_unitario tiver R$ 10,00, o python pode entender como texto
#então padronize para 10.00 (sem R$ e com ponto ao invés de vírgula)
#se tiver campo vazio, deixe vazio mesmo, não coloque "n/a" ou "null" ou "nenhum"
#se tiver campo numérico, não coloque texto junto, ex.: 10 unidades, coloque só 10
#se tiver campo texto, não coloque números, ex.: 1234, coloque texto mesmo
"""

#antes de cadastrar os produtos, sugiro fazer um teste com 1 produto só
# depois que tiver certeza que está funcionando, ai sim faça o loop para todos os produtos


# Passo 4: cadastrar um produto
#pyautogui.click(x=613, y=328) # clicar no menu produtos esse é o comando da aula o meu foi melhor com o tab
"""
#usei para fazer um teste se está escrevendo certo
pyautogui.press("tab")
pyautogui.write("produtos")
pyautogui.press("tab")
pyautogui.write("marca")
pyautogui.press("tab")
pyautogui.write("tipo")
pyautogui.press("tab")
pyautogui.write("categoria")
pyautogui.press("tab")
pyautogui.write("preco_unitario")
pyautogui.press("tab")
pyautogui.write("custo")
pyautogui.press("tab")
pyautogui.write("obs")
pyautogui.press("tab")
pyautogui.press("enter") # clicar no botao novo produto
"""

#5 repetir para todos os produtos da base vou colocar todo o passo 4 dentro de um loop
pyautogui.press("tab")
for linha in tabela.index: #para cada linha na tabela
    #pega da tabela o valor do campo que a gente quer preencher
    codigo = tabela.loc[linha, "codigo"]
    #preencher o campo
    pyautogui.write(str(codigo))
    pyautogui.press("tab")
    pyautogui.write(str(tabela.loc[linha, "marca"]))
    pyautogui.press("tab")
    pyautogui.write(str(tabela.loc[linha, "tipo"]))
    pyautogui.press("tab")
    pyautogui.write(str(tabela.loc[linha, "categoria"]))
    pyautogui.press("tab")
    pyautogui.write(str(tabela.loc[linha, "preco_unitario"]))   
    pyautogui.press("tab")
    pyautogui.write(str(tabela.loc[linha, "custo"]))
    pyautogui.press("tab")
    obs = tabela.loc[linha, "obs"]
    if pd.isna(obs): #se o campo estiver vazio
        pyautogui.write("") #escreve vazio
    else:
        pyautogui.write(str(obs)) #senão escreve o valor do campo
    pyautogui.press("tab")
    pyautogui.press("enter") # clicar no botao novo produto
    time.sleep(2) #espera 2 segundos para o sistema cadastrar o produto
    #ai o loop volta para o começo e cadastra o próximo produto
    #se eu estivesse utilizando o .click, aqui eu teria que dar um scroll para cima
    #pyautogui.scroll(5000) #dar scroll de tudo pra cima
    #mas como estou usando o tab, não preciso dar o scroll e rodar o código abaixo
    #
    for i in range(7): #7 vezes
        pyautogui.hotkey("shift","tab") #aperta o shift+tab 7 vezes para voltar pro começo