#Imports que vão ser usados, nenhum foi adicionado com antecedência a medida que é preciso é adicionado
import textwrap

menu_geral = 0
while menu_geral != 15:
    print("""\n
          1  - Tipos de Operadores com Python
          2  - Estruturas Condicionais e de Repetição em Python
          3  - 
          4  - 
          5  - 
          6  - 
          7  - 
          8  - 
          9  - 
          10 - 
          11 - 
          12 - 
          13 - 
          15 - """)
    menu_geral = int(input("Digite a atividade que deseja: "))
'''
1. Tipos de Operadores com Python
Básico:
Crie um programa que receba dois números inteiros do usuário e exiba:

A soma.
A subtração.
A multiplicação.
A divisão.

Avançado:
Implemente uma calculadora que:

Permita o usuário escolher a operação (soma, subtração, multiplicação, divisão, módulo ou potência).
Continue solicitando operações até o usuário digitar "sair".
'''
#Basico
num1 = int(input("Digite o primeiro número: "))
num2 = int(input("Digite o segundo número:"))
print("Soma: " + str(num1 + num2))
print("Subtração: " + str(num1 - num2))
print("Multiplicação: " + str(num1 * num2))
print("Divisão: " + str(num1 / num2))

#Avançado
menu1 = 0
print("\nAtividade 1 - Avançado\n")
while menu1 != 7:
    num1 = int(input("Digite o primeiro Valor: "))
    num2 = int(input("Digite o segundo Valor: "))
    menu = int(input("1 - Soma\n2 - Subtração\n3 - Multiplicação\n4 - Divisão\n5 - Módulo\n6 - potência\n7 - Sair\nEscolha a operação:"))
    if menu1 == 1:
        print("\nSoma: " + str(num1 + num2))
    elif menu1 == 2:
        print("\nSubtração: " + str(num1 - num2))
    elif menu1 == 3:
        print("\nMultiplicação: " + str(num1 * num2))
    elif menu1 == 4:
        print("\nDivisão" + str(num1 / num2))
    elif menu1 == 5:
        print("\nMódulo: " + str(num1 % num2))
    elif menu1 == 6:
        print("\nPotência: " + str(num1 ** num2))
    elif menu1 == 7:
        print("\nSaindo...")
        break
    else:
        print("\nOpção inválida, tente novamente!")


'''
2. Estruturas Condicionais e de Repetição em Python
Básico:
Escreva um programa que leia um número inteiro e diga se ele é par ou ímpar.

Avançado:
Modifique o programa para verificar se o número é primo.
'''
num = int(input("Digite um número: "))
menu2 = 0
while menu2 != 3:
    menu2 = int(input("1 - Verificar se o número é par ou ímpar\n2 - Verifica se o número é primo: \n3 - Sair\nEscolha a opção: "))
    if menu2 == 1:
        if num1 % 2 == 0:
            print("\né par")
        else:
            print("\né impar")
    elif menu2 == 2:
        print ("\nPrimo")
    elif menu2 == 3:
        print("\nSaindo...")
        break
    else:
        print("\nopção inválida, tente novamente!")

'''
3. Básico:
Faça um programa que leia um número inteiro positivo e exiba todos os números de 1 até o número informado.

Avançado:
Adicione uma condição para exibir apenas os números divisíveis por 3 ou 5 no intervalo.

4. Médio:
Crie um programa que solicite uma senha do usuário e permita até 3 tentativas para acertar a senha correta (predefinida no código).

Avançado:
Após o limite de tentativas, bloqueie o acesso, mas permita que o administrador (com uma senha especial) possa desbloquear o programa.

3. Manipulando Strings com Python
5. Básico:
Solicite o nome completo do usuário e:

Exiba o nome em letras maiúsculas.
Exiba o nome em letras minúsculas.
Conte quantas letras (sem espaços) o nome possui.
Avançado:
Modifique o programa para exibir também:

A primeira letra de cada palavra em maiúscula.
O nome invertido.

6.Médio:
Peça ao usuário para digitar uma frase e informe:

Quantas palavras a frase contém.
Quantas vezes a letra "a" aparece (maiúscula e minúscula devem contar).
Avançado:
Adicione ao programa a contagem de vogais e consoantes na frase.

4. Trabalhando com Listas, Tuplas e Conjuntos
7. Básico:
Crie uma lista com 5 números informados pelo usuário e exiba:

O maior número.
O menor número.
A soma de todos os números.
Avançado:
Ordene a lista em ordem crescente e exiba também a mediana dos números.

8. Médio:
Faça um programa que leia duas listas de 5 elementos cada e:

Exiba os números que estão em ambas as listas.
Exiba os números que estão apenas na primeira lista.
Avançado:
Crie uma terceira lista com os números que estão em pelo menos uma das duas listas (união).

9. Médio:
Crie um programa que leia 10 números e exiba apenas os números únicos (sem repetições).

Avançado:
Exiba também a quantidade de vezes que cada número apareceu na entrada.

5. Dicionários em Python
10. Básico:
Crie um dicionário para armazenar os nomes e idades de 3 pessoas. Depois, exiba cada nome e idade na tela.

Avançado:
Adicione uma funcionalidade para permitir que o usuário busque uma pessoa pelo nome e exiba sua idade.

11. Médio:
Faça um programa que receba informações de 5 alunos (nome e nota) e armazene em um dicionário. Ao final, exiba:

O aluno com a maior nota.
A média das notas.
Avançado:
Adicione uma opção para o usuário pesquisar um aluno e exibir sua nota, ou exibir a lista de todos os alunos em ordem alfabética.

6. Funções em Python
12. Básico:
Crie uma função que receba um número e retorne "positivo", "negativo" ou "zero".

Avançado:
Modifique a função para lidar com listas, retornando uma lista com os rótulos correspondentes ("positivo", "negativo", "zero") para cada número.

13. Médio:
Escreva uma função que receba uma lista de números e retorne a soma apenas dos números pares.

Avançado:
Adicione uma funcionalidade para contar quantos números pares e ímpares existem na lista e exiba os resultados.

14. Médio:
Crie uma função que receba uma frase e devolva a mesma frase, mas com as palavras em ordem inversa.

Avançado:
Altere a função para permitir que o usuário escolha se deseja inverter:

A ordem das palavras.
A ordem das letras dentro de cada palavra.

'''