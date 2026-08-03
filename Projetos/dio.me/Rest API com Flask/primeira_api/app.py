from flask import Flask, jsonify, request
import json

app = Flask(__name__) # A variável PRECISA se chamar 'app'

@app.route('/<int:id>', methods=["POST", "GET"])
def pessoa(id):
    return jsonify({'id':id,'nome':'Rafael', 'idade':26,'profissao':'Desenvolvedor'})

#@app.route('/soma/<int:num1>/<int:num2>', methods=["GET"])
#def soma_get(num1, num2):
#    return jsonify({'soma': num1 + num2})


@app.route('/soma', methods=['POST', 'GET'])
def soma():
    if request.method =='POST':
        dados = json.loads(request.data)
        total = sum(dados['valores'])
        print(dados)
    elif request.method == 'GET':
        total = 10+10
    return {'soma':total}

if __name__ == "__main__":
    app.run(debug=True)