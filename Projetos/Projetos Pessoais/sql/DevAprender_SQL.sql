/*SELECT
SQL SERVER, Postgres, Oracle, mySql

Obs.: Por convensão o SELECT, FROM, WHERE, etc utilizamos sempre em maiusculo para diferências das tabelas

O comando select você declara as colunas que desaja no select e no FROM de qual tabela ela vai puxar
SELECT coluna1, coluna2
FROM tabela


Quando você quer selecionar todas as colunas de uma tabela você não precisa digitar todos os nomes você coloca *
SELECT *
FROM tabela
*/

--Aqui vamos pegar todas as colunas da tabela person.Person
SELECT *
FROM person.Person;

--Aqui vamos pegar a tabela Title da tabela person.Person
SELECT Title
FROM Person.Person

--Antecipando eu gosto de utilizar o comando top 100 * que mostra as 100 primeiras linhas da tabela para entender como ela funciona

SELECT TOP 100 *
FROM PERSON.Person

/*Exercicio 1

1 A equipe de marketing precisa de fazer uma pesquisa sobre nome mais comuns de seus clientes e precisa do 
nome e sobrenome de todos os clientes que estão cadastras no sistema*/

--Resposta
SELECT FirstName, LastName
FROM Person.Person
/*
Obs.: utilizei apenas o FirstName e LastName como nome e sobrenome mas a tabela também entrega o midle name, ai vai da sua necessidade
      é muito importante entender a necessidade para fazer sua melhor escolha das tabelas, pois informações desnecessarias vai pesar o
	  processamento e pode atrapalhar o entendimento e descobrir o padrão para uma tomada de decisão
	  */

/*
DISTINCT
Utilizamos o DISTINCT quando queremos omitir os dados duplicados de uma ou mais colunas

Padrão:
SELECT DISTINCT coluna1, coluna2
FROM tabela
*/

-- Segue alguns exemplos:
SELECT FirstName
FROM Person.Person
-- Sem o distinct tivemos 19.972 linhas de informações
SELECT DISTINCT FirstName
FROM Person.Person
-- Agora tivemos 1018 linhas

/*
Exercicio 2
Quantos sobrenomes unicos temos em nossa tabela person.person
*/
SELECT DISTINCT LastName
FROM Person.Person

/*
WHERE
Utilizamos o WHERE quando queremos algumas informações especificas de uma tabela

SELECT coluna1, coluna2, coluna_n
FROM tabela
WHERE tabela operador_lógico 'item_desejado';

no WHERE utilizamos os operados logicos abaixo:
OPERADOR -	DESCRIÇÃO
=			IGUAL
>			MAIOR QUE
<			MENOR QUE
>=			MAIOR QUE OU IGUAL
<=			MENOR QUE OU IGUAL
<>			DIFERENTE DE
AND			OPERADOR LÓGICO E
OR			OPERADOR LÓGICO OU
*/

-- Segue alguns exemplos
-- Se a gente estiver procurando todas as pessoas com LastName Miller
SELECT *
FROM Person.Person
WHERE LastName = 'Miller'
-- Quero mais condições para esse filtro ai utilizamos geralmente o and ou or
SELECT *
FROM Person.Person
WHERE LastName = 'Miller' and FirstName = 'Anna'
-- Um exemplo que utilizamos direto, quero apenas os produtos entre uma determinada faixa de preço ou menor/igual que
SELECT *
FROM Production.Product
WHERE ListPrice > 100 and ListPrice < 200

SELECT *
FROM Production.Product
WHERE ListPrice <= 100

-- Digamos que não quero nenhum produto que seja vermelhor (red)
SELECT *
FROM Production.Product
WHERE Color = 'Red'
-- Nesse caso ele não é case sensiteve, então o resultado do acima e do debaixo é igual
SELECT *
FROM Production.Product
WHERE Color = 'red'

/*
O entendimento das tabelas e estruturas do banco de dados que estiver utilizando é um ponto crucial para o desenvolvimento, pois ninguém
vai chegar em você pedindo: Queria que você verificasse na tabela x.x quais pessoas tem filhos, ele simplesmente vai te pedir para
verificar no banco de dados quais pessoas tem filhos
*/

/*
Exercicio 3
1 - A equipe de produtos precisa do nome de todas as peças que pesam mais que 500kg mas não mais que 700kg
2 - A equipe de Marketing pediu a relação de todos os empregados (employess) que são casados (married) e são asalariados (salaried)
Obs.:	É muito comum utilizar o inglês para titulo das colunas e nomes das tabelas, então o inglês de nivel técnico é muito importante
		Coloquei a tradução, porém, como dito anteriormente não é comum quem fez a solicitação passar esse nivel de detalhamento.
*/
-- 1
SELECT *
FROM Production.Product
WHERE Weight > 500 and Weight<= 700

-- 2
SELECT *
FROM HumanResources.Employee
WHERE MaritalStatus = 'M' and SalariedFlag = 1

/*
COUNT
Serve para contar alguma informação
SELECT COUNT(coluna1)
FROM TABELA
*/
SELECT COUNT(*)
FROM Person.Person

SELECT COUNT(Title)
FROM Person.Person

SELECT COUNT(DISTINCT Title)
FROM Person.Person

/*
EXERCICIO 4
1 - eu quero saber quantos produtos temos cadastrados em nossa tabela de produtos
2 - eu quero saber quantos tamanhos de produtos temos em nossas tabela
3 - eu quero saber quantos tamanhos diferentes de produtos eu tenho cadastra em nossa tabela
*/
--1
SELECT COUNT(*) AS produtos
FROM Production.Product

--2
SELECT COUNT(size) AS tamanho
FROM Production.Product

--3
SELECT COUNT(DISTINCT size) AS tamanhos_unicos
FROM Production.Product

/*
TOP
Ele serve para limitar a quantidade de linhas que vai retornar, é muito interessante para verificar a estrutura da tabela

SELECT TOP 10 coluna1
FROM tabela
*/
SELECT TOP 100 *
FROM person.Person

/*
ORDER BY
serve para ordenar a coluna por ordem crescente ou decrescente

SELECT coluna1, coluna2
FROM tabela
ORDER BY coluna1 asc/desc
*/
SELECT *
FROM Person.Person
ORDER BY FirstName asc, LastName desc

/*
EXERCICIO 5
1 - Obter o ProductId dos 10 produtos mais caros cadastrados no sistema, listando do mais caro para o mais barato
2 - Obter o nome e número do produto dos produtos que tem o ProductID entre 1~4
*/
--1
SELECT TOP 10 *
FROM Production.Product
ORDER BY ListPrice desc

--2
SELECT ProductNumber, Name
FROM Production.Product
WHERE ProductID >= 1 and ProductID <= 4

/*

BETWEEN
O Between é usado para encontrar valor entre um mínimo e um máximo

SELECT coluna1, coluna2
FROM tabela
WHERE coluna1 between valor >= xx AND valor <= xx

*/
SELECT *
FROM Production.Product
WHERE ListPrice NOT BETWEEN 1000 and 1500;

SELECT *
FROM HumanResources.Employee
WHERE HireDate BETWEEN '2009/01/01' and '2010/01/01'
ORDER BY HireDate

/*

IN
Usamos para verificar se um valor corresponde com qualquer valor passado na lista de valores

SELECT coluna1, coluna2
FROM tabela
WHERE valor IN (valor1, valor2)

Também podemos fazer por subselect/subquery

valor IN (SELECT valor FROM nomeDaTabela)
*/
SELECT *
FROM Person.Person
WHERE BusinessEntityID IN (2,7,13)

--Como seria o comando acima sem o IN
SELECT *
FROM Person.Person
WHERE BusinessEntityID = 2
OR BusinessEntityID = 7
OR BusinessEntityID = 13

--Também podemos utilizar o NOT
SELECT *
FROM Person.Person
WHERE BusinessEntityID NOT IN (2,7,13)

--Outro ponto importante é que o IN é mais rápido

/*

LIKE
Utilizamos ele para encontrar dados que você sabe parte do nome se fosse ovi... alguma coisa vamos utilizar ovi%
se sabe que termina com berto utilizamos %berto, e se for o meio de um código xx98320xxx utilizamos %98320%

SELECT coluna1, coluna2
FROM tabela
WHERE coluna LIKE 'ovi%'

*/
SELECT *
FROM person.person
WHERE FirstName LIKE '%to'

SELECT *
FROM person.Person
WHERE FirstName LIKE '%ro'

--quando temos apenas uma letra que queremos depois de um trecho colocamos o _
SELECT *
FROM Person.Person
WHERE FirstName LIKE '%ro_'
--nesse caso acima ele trouxe como FirstName Cameron, Aaron, Carol, etc. queria qualquer coisa antes de ro e apenas uma letra após o ro

/*
EXERCICIO 6
1 - Quantos produtos temos cadastrado no sistema que custam mais que 1500 dolares?
2 - Quantas pessoas temos com o sobrenome que inicia com a letra P?
3 - Em quantas cidades unicas estão cadastrados nossos clientes
4 - Quais cidades únicas temos cadastrados em nosso sistema?
5 - Quantos produtos vermelhos tem preço entre 500 e 1000 dolares
*/
SELECT COUNT (ListPrice)
FROM Production.Product
WHERE ListPrice > 1500

SELECT COUNT(FirstName)
FROM Person.Person
WHERE FirstName LIKE 'P%'

SELECT COUNT(DISTINCT City)
FROM Person.Address

SELECT DISTINCT (City)
FROM Person.Address

SELECT COUNT(*)
FROM Production.Product
WHERE ListPrice BETWEEN 500 and 1000 and Color  = 'red'