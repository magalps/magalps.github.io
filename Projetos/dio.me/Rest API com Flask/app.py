from flask import Flask

app = Flask(__name__) # A variável PRECISA se chamar 'app'

@app.route("/")
def hello():
    return "Olá Mundo!"

if __name__ == "__main__":
    app.run(debug=True)