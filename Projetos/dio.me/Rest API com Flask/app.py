from flask import Flask

app = Flask(__name__) # A variável PRECISA se chamar 'app'

@app.route("/<numero>", methods=["POST", "GET"])
def hello(numero):
    return "Olá Mundo! {}".format(numero)

if __name__ == "__main__":
    app.run(debug=True)