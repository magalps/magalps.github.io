#O pass em Python é uma instrução que não realiza nenhuma ação. 
# Ele é usado como um placeholder em blocos de código onde você precisa 
# de uma estrutura sintaticamente válida, mas ainda não implementou o conteúdo.

#Por que usar pass?Python exige que os blocos de código dentro de estruturas como 
# if, for, while, funções, ou classes contenham algum código válido. Se você ainda 
# não decidiu o que implementar, pode usar o pass para evitar erros de sintaxe enquanto 
# mantém a estrutura.

#Exemplo de uso do Pass
#Em um if sem implementação (temporário):
x = 10
if x > 5:
    pass  # Placeholder, nada acontece por enquanto
else:
    print("x é menor ou igual a 5")

#Em um loop vazio (temporário):
for i in range(5):
    pass  # Nenhuma ação será realizada neste momento

#Em uma função ainda não implementada:
def minha_funcao():
    pass  # A função existe, mas ainda não faz nada

#Em uma classe como placeholder:
class MinhaClasse:
    pass  # Implementação futura


#Quando usar pass?
# Durante o desenvolvimento: Quando você está construindo a estrutura do código e ainda não implementou certas partes.
# Para manter o código sintaticamente correto: Quando precisa de blocos vazios, mas o Python exige algum conteúdo.

#Alternativas ao pass
#... (Reticências): Também funciona como placeholder em Python.
def minha_funcao():
    ...  # Placeholder válido

#Comentários: Útil para indicar o propósito do bloco, mas um comentário sozinho não resolve o erro de bloco vazio.
if x > 5:
    # Ainda vou implementar essa parte
    pass

#O pass é útil principalmente durante o desenvolvimento inicial, ajudando a estruturar o código antes de implementar todos os detalhes.
