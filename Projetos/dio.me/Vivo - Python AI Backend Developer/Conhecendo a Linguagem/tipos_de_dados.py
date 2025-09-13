print(11*10*1000) #Tipo de dado int
print(1.5 + 1 + 0.5) #Tipo de dado float
print(True) #Tipo de dado boolean
print(1 == 1) #Tipo de dado boolean
print(False) #Tipo de dado boolean
print("Python") #Tipo de dado string

age = 23
name = 'Guilherme'
print(f'Meu nome é {name} e tenho {age} anos.') #Mistura tipos de dados

age, name = (23, 'Guilherme')
print(f'Meu nome é {name} e tenho {age} anos.') #Mistura tipos de dados

nome = input("Informe o seu nome: ")
print(f'Seu nome é {nome}') #Input

nome = "Guilherme"
sobrenome = "Carvalho"

print(nome, sobrenome) #impressão padrão
print(nome, sobrenome, end="...\n") #adiciona no final do print ... e uma quebra de linha (\n)
print(nome, sobrenome, sep='#') #adiciona # entre os valores
print(nome, sobrenome, sep='#', end="...\n") #adiciona # entre os valores e ... com a quebra de linha no final
