# Python Power Up

![Capa do Projeto](https://www.hashtagtreinamentos.com/wp-content/themes/hashtag/desenvolvimento_hashtag/assets/imgs/Global/logo-hashtag.webp)

Programação do Evento:
dia 1 - Python PowerUp
- Automação de Tarefas - Utilização de Pyautogui (permite a utitlização do mouse e teclado)
- Criação de Bots
- Economizar horas de trabalho
- RPA e Web-Scraping

Dia 2 - Python Insights - utilizando jupiter (.ipynb)
- Análise e Tratamentos de Dados
- Tabelas (DataFrames)
- Gráficos em Python
- Tirar insights valiosos

Dia 3 - Python IA
- Inteligência Artificial
- Projeto Completo de Previsão
- ciência de Dados
- Criação e Análise de Modelos

Dia 4 - Python Dev
- Criação de Sites e Sistemas
- Frameworks Python (streamlit)
- Desenvolvimento de um Chat
- Frontend e Backend

progress: 100%

Abaixo um passo a passo para utilizar GPU em vez de CPU, lembrando que cada computador vai precisar de uma adaptação devido a versão de processadores, placas de vídeo, SO, etc

# Usando GPU no Jupyter (VS Code) em vez de CPU
Guia prático para rodar seus notebooks usando **GPU** — seja **NVIDIA (CUDA)**, **AMD/Intel (DirectML/ONNX Runtime)** ou **Intel iGPU/Arc (oneAPI/XPU)** — no **Windows** e no **Linux/WSL2**. Inclui comandos, verificação e dicas de troubleshooting.

> TL;DR: Se você tem **NVIDIA (ex.: RTX 2060)**, o caminho mais simples é **PyTorch + CUDA** no Windows ou no WSL2/Ubuntu. Para AMD/Intel (ou quando quer algo cross‑vendor no Windows), use **ONNX Runtime com DirectML**. Para scikit‑learn “GPU‑like”, use **RAPIDS cuML** (NVIDIA).

---

## 0) Pré‑requisitos e decisões rápidas
1. **Identifique sua GPU:**
   - **NVIDIA GeForce/RTX** → use **CUDA** (PyTorch, JAX, RAPIDS) ou DirectML (alternativo no Windows).
   - **AMD Radeon** → no Windows use **DirectML (ONNX Runtime)**; no Linux veja **ROCm** (suporte varia por modelo).
   - **Intel iGPU / Arc** → no Windows use **DirectML (ONNX Runtime)**; no Linux/Windows (mais técnico) use **oneAPI + PyTorch XPU**.
2. **Escolha o ambiente:**
   - **Windows puro (VS Code + Jupyter)** → bom para PyTorch CUDA (NVIDIA) e ONNX Runtime/DirectML (todas).
   - **WSL2 + Ubuntu** → geralmente o caminho mais estável para **TensorFlow GPU** e stacks de ciência de dados.
3. **Crie um ambiente isolado** (recomendado `venv` ou `conda`) e selecione **esse kernel** no Jupyter (ícone de kernel no topo do notebook no VS Code).

---

## 1) PyTorch com GPU (NVIDIA/CUDA) — Windows e WSL2/Ubuntu
### Instalação rápida (pip, sem instalar CUDA separadamente)
> Para muitas versões, o PyTorch já vem com o **CUDA runtime** empacotado no wheel certo. Assim você **não precisa** instalar o CUDA Toolkit manualmente.

**Windows (PowerShell/Terminal do VS Code)**
```bash
# Novo venv (opcional, mas recomendado)
python -m venv .venv
.\.venv\Scripts\activate

# PyTorch + CUDA (ajuste cu12x conforme disponível)
pip install --upgrade pip
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121
```

**WSL2/Ubuntu (Terminal Linux)**
```bash
python3 -m venv .venv
source .venv/bin/activate

pip install --upgrade pip
# CUDA no Linux: escolha o índice de cu11x/cu12x compatível conforme a doc do PyTorch
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121
```

### Verificação no notebook
```python
import torch
print("CUDA disponível?", torch.cuda.is_available())
if torch.cuda.is_available():
    print("GPU:", torch.cuda.get_device_name(0))
    x = torch.rand((1000,1000), device="cuda")
    y = torch.mm(x, x)
    print("OK, rodou na GPU:", y.is_cuda)
```

> Dica: No VS Code, confira que o **Kernel** do Jupyter está usando o **mesmo venv** onde você instalou o PyTorch.

---

## 2) TensorFlow com GPU
- **Windows nativo:** o caminho mais simples costuma ser **TensorFlow‑DirectML** (Microsoft) para usar GPU via DirectX (AMD/Intel/NVIDIA).  
- **WSL2/Ubuntu:** preferido quando você quer **TensorFlow oficialmente com CUDA**.

### Windows (TensorFlow via DirectML)
```bash
python -m venv .venv
.\.venv\Scripts\activate

pip install --upgrade pip
pip install tensorflow-directml
```
Verificação:
```python
import tensorflow as tf
print(tf.__version__)
print(tf.config.list_physical_devices("GPU"))  # deve listar um 'GPU' via DML
```

### WSL2/Ubuntu (TensorFlow com CUDA)
1. Instale drivers NVIDIA no Windows e ative suporte a GPU no WSL2.
2. No Ubuntu/WSL2, crie venv e:
```bash
python3 -m venv .venv
source .venv/bin/activate

pip install --upgrade pip
pip install tensorflow  # versão com suporte a GPU via CUDA no Linux
```
Verificação:
```python
import tensorflow as tf
print(tf.__version__)
print(tf.config.list_physical_devices("GPU"))
```

> Observação: O suporte a TensorFlow + GPU no **Windows nativo** mudou ao longo do tempo; WSL2 é via de regra mais previsível para CUDA.

---

## 3) JAX com GPU (NVIDIA/CUDA)
```bash
# venv ativado
pip install --upgrade pip
# Escolha o wheel correto p/ CUDA da sua máquina (ex.: cu12x)
pip install --upgrade "jax[cuda12_local]"  # exemplo genérico; consulte a doc da versão local
```
Verificação:
```python
import jax, jax.numpy as jnp
print(jax.devices())   # deve mostrar GPU(s)
x = jnp.ones((1000,1000))
print((x @ x).block_until_ready())
```

---

## 4) ONNX Runtime com DirectML (Windows, AMD/Intel/NVIDIA)
Se você está no **Windows** e quer algo que rode **em várias GPUs** (NVIDIA/AMD/Intel) sem depender de CUDA/ROCm, use **ONNX Runtime (ORT) com DirectML**:

```bash
python -m venv .venv
.\.venv\Scripts\activate

pip install --upgrade pip
pip install onnxruntime-directml onnx onnxruntime-tools
```
Verificação (inferencia simples em ONNX):
```python
import onnxruntime as ort
print(ort.get_device())  # 'CPU' ou 'GPU'
sess = ort.InferenceSession("modelo.onnx", providers=["DmlExecutionProvider"])
print("Providers:", sess.get_providers())
```

> Ecossistema ótimo para **inferência**. Para treino, verifique suporte no seu framework (geralmente PyTorch/TensorFlow treinam; ORT acelera inferência).

---

## 5) Intel iGPU / Intel Arc — oneAPI + PyTorch XPU (Linux/Windows, avançado)
Para usar **GPU Intel** com PyTorch:
- Instale **oneAPI** (drivers/runtime) e a extensão **PyTorch XPU**.
- O suporte evolui rápido; verifique a combinação **versão GPU + driver + PyTorch XPU**.
Verificação básica (quando instalado):
```python
import torch
print(getattr(torch, "xpu", None) is not None)
# E.g. mover tensores: torch.ones(3, device="xpu")
```

> Se quiser algo simples no Windows, prefira **ONNX Runtime + DirectML** para **inferência** cross‑vendor.

---

## 6) Scikit‑learn “no estilo GPU”: RAPIDS cuML (NVIDIA)
Para algoritmos tipo k‑NN, RandomForest, PCA etc. acelerados em GPU (NVIDIA):
- Use **RAPIDS cuML** (biblioteca com API parecida com scikit‑learn).
- Requer NVIDIA + CUDA; instalação recomendada via **conda/mamba**.

Exemplo (conda):
```bash
# no Windows, considere WSL2/Ubuntu para ambiente mais estável
mamba create -n rapids -c rapidsai -c conda-forge rapids=24.04 python=3.10
mamba activate rapids

python -c "import cuml; import cupy; print('OK CUDA:', cupy.cuda.runtime.getDeviceProperties(0)['name'])"
```
Uso k‑NN com cuML (no notebook):
```python
from cuml.neighbors import KNeighborsClassifier
from cuml.preprocessing.model_selection import train_test_split
import cupy as cp

X = cp.asarray(...); y = cp.asarray(...)
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2, random_state=42)
knn = KNeighborsClassifier(n_neighbors=5)
knn.fit(X_tr, y_tr)
pred = knn.predict(X_te)
```

---

## 7) Configurando o Jupyter/VS Code para usar o **venv correto**
1. Crie o ambiente (`.venv`, `conda env`, etc.).  
2. Instale os pacotes GPU **dentro** desse ambiente.  
3. Abra o notebook no VS Code → canto superior direito → **Kernel** → selecione seu **.venv**.  
4. Teste com `torch.cuda.is_available()` ou `tf.config.list_physical_devices('GPU')`.

> Se aparecer `False`/vazio, quase sempre é porque o **kernel do Jupyter não está no mesmo ambiente** onde você instalou as libs GPU.

---

## 8) Troubleshooting rápido
- **PyTorch diz `cuda.is_available() == False`:**
  - Kernel errado (não é o venv certo) → selecione o kernel correto.
  - Driver NVIDIA desatualizado → atualize no Windows (GeForce Experience) ou no Linux (nvidia-driver).
  - Instalou PyTorch **CPU‑only** por engano → reinstale com o **wheel CUDA** adequado.
- **TensorFlow no Windows não enxerga GPU:**
  - Tente **tensorflow‑directml** (Windows) ou use **WSL2** com CUDA.
- **Conflitos de versão (CUDA/cuDNN):**
  - Prefira **wheels oficiais** do PyTorch/JAX que já embutem o runtime.
- **AMD/Intel no Windows (treino):**
  - Dê preferência a **ONNX Runtime (DirectML)** para **inferência**. Para treino, verifique suporte atual do seu framework.
- **Notebook usa CPU mesmo com GPU visível:**
  - Em PyTorch, mova tensores/modelo para `device="cuda"` (**ou `"xpu"` em Intel**, `"mps"` em Apple).
  - Em TensorFlow, verifique as mensagens de log: às vezes certas operações não possuem kernel GPU e caem na CPU.

---

## 9) Exemplos‑mínimos de seleção de dispositivo
### PyTorch
```python
import torch
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = MyNet().to(device)
x = torch.randn(32, 3, 224, 224, device=device)
y = model(x)
```

### TensorFlow
```python
import tensorflow as tf
print(tf.config.list_physical_devices("GPU"))
with tf.device("/GPU:0"):
    a = tf.random.normal((1024,1024))
    b = tf.matmul(a, a)
```

### ONNX Runtime (DirectML)
```python
import onnxruntime as ort
sess = ort.InferenceSession("model.onnx", providers=["DmlExecutionProvider"])
```

---

## 10) Qual caminho escolher para seu caso (RTX 2060 + VS Code + Jupyter)
- **Treino PyTorch**: instale `torch` com o **wheel CUDA** e use `device="cuda"`.
- **TensorFlow**: prefira **WSL2/Ubuntu** com CUDA; no Windows puro use **tensorflow‑directml**.
- **k‑NN/algos estilo scikit‑learn em GPU**: experimente **RAPIDS cuML** (ideal no WSL2/Linux).
- **Inferência rápida e compatível com várias GPUs**: **ONNX Runtime DirectML** no Windows.

Se quiser, posso adaptar esse README para o *seu* setup exato (Windows 10/11, VS Code, RTX 2060) e já incluir um `requirements.txt` + um notebook de verificação.
