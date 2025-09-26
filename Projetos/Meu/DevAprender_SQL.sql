/*SELECT
SQL SERVER, Postgres, Oracle, mySql

Obs.: Por convens�o o SELECT, FROM, WHERE, etc utilizamos sempre em maiusculo para difer�ncias das tabelas

O comando select voc� declara as colunas que desaja no select e no FROM de qual tabela ela vai puxar
SELECT coluna1, coluna2
FROM tabela


Quando voc� quer selecionar todas as colunas de uma tabela voc� n�o precisa digitar todos os nomes voc� coloca *
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
nome e sobrenome de todos os clientes que est�o cadastras no sistema*/

--Resposta
SELECT FirstName, LastName
FROM Person.Person
/*
Obs.: utilizei apenas o FirstName e LastName como nome e sobrenome mas a tabela tamb�m entrega o midle name, ai vai da sua necessidade
      � muito importante entender a necessidade para fazer sua melhor escolha das tabelas, pois informa��es desnecessarias vai pesar o
	  processamento e pode atrapalhar o entendimento e descobrir o padr�o para uma tomada de decis�o
	  */

/*
DISTINCT
Utilizamos o DISTINCT quando queremos omitir os dados duplicados de uma ou mais colunas

Padr�o:
SELECT DISTINCT coluna1, coluna2
FROM tabela
*/

-- Segue alguns exemplos:
SELECT FirstName
FROM Person.Person
-- Sem o distinct tivemos 19.972 linhas de informa��es
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
Utilizamos o WHERE quando queremos algumas informa��es especificas de uma tabela

SELECT coluna1, coluna2, coluna_n
FROM tabela
WHERE tabela operador_l�gico 'item_desejado';

no WHERE utilizamos os operados logicos abaixo:
OPERADOR -	DESCRI��O
=			IGUAL
>			MAIOR QUE
<			MENOR QUE
>=			MAIOR QUE OU IGUAL
<=			MENOR QUE OU IGUAL
<>			DIFERENTE DE
AND			OPERADOR L�GICO E
OR			OPERADOR L�GICO OU
*/

-- Segue alguns exemplos
-- Se a gente estiver procurando todas as pessoas com LastName Miller
SELECT *
FROM Person.Person
WHERE LastName = 'Miller'
-- Quero mais condi��es para esse filtro ai utilizamos geralmente o and ou or
SELECT *
FROM Person.Person
WHERE LastName = 'Miller' and FirstName = 'Anna'
-- Um exemplo que utilizamos direto, quero apenas os produtos entre uma determinada faixa de pre�o ou menor/igual que
SELECT *
FROM Production.Product
WHERE ListPrice > 100 and ListPrice < 200

SELECT *
FROM Production.Product
WHERE ListPrice <= 100

-- Digamos que n�o quero nenhum produto que seja vermelhor (red)
SELECT *
FROM Production.Product
WHERE Color = 'Red'
-- Nesse caso ele n�o � case sensiteve, ent�o o resultado do acima e do debaixo � igual
SELECT *
FROM Production.Product
WHERE Color = 'red'

/*
O entendimento das tabelas e estruturas do banco de dados que estiver utilizando � um ponto crucial para o desenvolvimento, pois ningu�m
vai chegar em voc� pedindo: Queria que voc� verificasse na tabela x.x quais pessoas tem filhos, ele simplesmente vai te pedir para
verificar no banco de dados quais pessoas tem filhos
*/

/*
Exercicio 3
1 - A equipe de produtos precisa do nome de todas as pe�as que pesam mais que 500kg mas n�o mais que 700kg
2 - A equipe de Marketing pediu a rela��o de todos os empregados (employess) que s�o casados (married) e s�o asalariados (salaried)
Obs.:	� muito comum utilizar o ingl�s para titulo das colunas e nomes das tabelas, ent�o o ingl�s de nivel t�cnico � muito importante
		Coloquei a tradu��o, por�m, como dito anteriormente n�o � comum quem fez a solicita��o passar esse nivel de detalhamento.
*/
-- 1
SELECT *
FROM Production.Product
WHERE Weight > 500 and Weight<= 700

-- 2
SELECT *
FROM HumanResources.Employee
WHERE MaritalStatus = 'M' and SalariedFlag = 1
