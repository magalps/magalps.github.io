# titulo
# input do chat
# a cada mensagem eenviada:
#  - mostra a mensagem que o usuario enviou no chat
#  - enviar essa mensagem para a IA responder
#  - mostra a resposta da IA no chat

# Vamos utilizar streeamlit para criar a interface do chat
# bibliotecas a instalar: 
    # Flask – pip install flask
    # OpenIA – pip install openai
    # OpenIA – pip install streamlit
    # Socketio – pip install python-socketio / pip install flask-socketio
    # Simple Websocket – pip install simple-websocket
# todas as bibliotecas: pip install streamlit openai flask python-socketio simple-websocket flask-socketio
# existem outras bibliotecas para criar interfaces web, mas o streamlit é bem simples de usar
# e a api da mistral para enviar mensagens para a IA (Opção gratuita) e a lib openai para facilitar o uso da API
# https://platform.openai.com/docs/api-reference/chat/create
# aqui vamos usar dicionarios para enviar as mensagens que é dicionario = {chave: valor, chave2: valor2}
#role = quem enviou a mensagem = "função" (sistema), "usuário" (user) ou "assistente" (assistant)
# content = conteudo da mensagem
#mensagem = {"role": "user", "content": "Olá, IA!"}


import streamlit as st
import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
api_key = os.getenv("MISTRAL_API_KEY")

# 👉 usar o endpoint da Mistral com a lib openai
client = OpenAI(api_key=api_key, base_url="https://api.mistral.ai/v1")

st.write("## Chat com IA usando OpenAI (lib), Mistral (API) e Streamlit (Site)") # markdown

if not "lista_mensagens" in st.session_state:
    st.session_state.lista_mensagens = []

# adicionar uma mensagem
# st.session_state["lista_mensagens"].append(mensagem)
# exibir o histórico de mensagens

# exibir as mensagens na tela
for mensagem in st.session_state["lista_mensagens"]:
    st.chat_message(mensagem["role"]).write(mensagem["content"])

mensagem_usuario = st.chat_input("Digite sua mensagem aqui...")

if mensagem_usuario:
    st.chat_message("user").write(mensagem_usuario)
    #st.chat_message("user").write("Resposta da IA") # user -> ser humano
    mensagem = {"role": "user", "content": mensagem_usuario}
    st.session_state["lista_mensagens"].append(mensagem)

    #resposta da IA
    resposta_modelo = client.chat.completions.create(
        messages=st.session_state["lista_mensagens"],
        model="open-mistral-7b"
    )
    
    resposta_ia = resposta_modelo.choices[0].message.content

    #exibir a respoasta da IA na tela
    st.chat_message("assistant").write(resposta_ia) # assistant -> inteligencia artificial
    mensagem_ia = {"role": "assistant", "content": resposta_ia}
    st.session_state["lista_mensagens"].append(mensagem_ia)

    print(st.session_state["lista_mensagens"])
