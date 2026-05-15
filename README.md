# 📖 Zine

> Rabisque o mundo. Dobre o resto. Uma ferramenta web minimalista para transformar suas fotos em fanzines físicos de 8 páginas.

O **Zine** nasceu do amor pela cultura DIY (Do It Yourself) e pelas publicações independentes. Ele resolve o maior problema de quem quer criar um zine em casa: **a matemática da impressão**. Em vez de quebrar a cabeça calculando quais páginas ficam de cabeça para baixo em um editor de imagens tradicional, o Zine posiciona, rotaciona e formata tudo automaticamente. Você só precisa escolher as fotos, imprimir e dobrar.

A aplicação abraça uma estética lo-fi, brutalista e texturizada na interface, utilizando efeitos orgânicos gerados via código, enquanto mantém a integridade e qualidade das suas fotografias originais no arquivo final.

---

## ⚡ O que ele faz (Features)

* **Upload Flexível & Edição In-Browser:** Envie até 8 fotos (limite de 5MB por imagem). Um editor embutido permite aplicar zoom, reposicionar (pan), girar e espelhar as imagens para que o enquadramento fique perfeito antes da geração.
* **Engenharia de Layout Automática:** Desenvolvido com `jsPDF`, o sistema calcula as coordenadas matemáticas no plano cartesiano do PDF. As imagens da fileira superior são automaticamente rotacionadas em 180°. O resultado? Uma folha A4 que, ao ser cortada e dobrada, gera um livreto sequencial sem nenhuma página de ponta-cabeça.
* **Wiggly UI:** A interface ganha vida com um visual de "rabisco em stop-motion". Esse efeito é criado de forma nativa e performática manipulando SVG (`feTurbulence` e `feDisplacementMap`), aplicado aos botões, bordas e modais, sem poluir suas fotos.
* **Client-Side Puro:** Todo o processamento de imagens (crop, canvas) e a geração do PDF acontecem localmente no navegador do usuário, garantindo privacidade e velocidade.

---

## ✂️ Como montar seu Zine

O PDF gerado possui marcações visuais pontilhadas para guiar a montagem. O processo é simples:

1. Imprima a folha A4 gerada (sem bordas, se possível).
2. Dobre a folha ao meio na horizontal e depois na vertical.
3. Faça um único corte na linha pontilhada central.
4. Dobre tudo para formar o livreto. Pronto.

---

## 📸 Interface do Usuário

A experiência visual é guiada pela tipografia monoespaçada `Martian Mono` e uma paleta de contraste focada no Azul Monocromático (`#0038a8`).

### 💻 Splashscreen
<img src="/src/assets/readme-images/1-splash.jpeg" width="30%" alt="SplashScreen (tela de introdução)" />

### 🔔 Tela de Upload e Ajustes
<img src="/src/assets/readme-images/2-upload.jpeg" width="30%" alt="Tela de Upload" />

### ⚡ Tela de Download
<img src="/src/assets/readme-images/3-download.jpeg" width="30%" alt="Tela de Download" />

---

## 🛠️ Tecnologias Utilizadas

* **React & TypeScript:** Tipagem estática e arquitetura baseada em componentes.
* **Framer Motion:** Orquestração de animações de entrada/saída de rotas e modais (`AnimatePresence`), transições fluidas e controle de caminhos SVG (`pathLength`).
* **jsPDF:** Geração do documento no lado do cliente.
* **HTML Canvas API:** Manipulação de pixels para o sistema de crop, escala e rotação no modal de edição de imagem.
* **SVG Filters:** Criação do efeito visual principal da interface, dispensando a necessidade de bibliotecas externas pesadas ou GIFs/Vídeos para as animações orgânicas.
* **Web Share API:** Tratamento responsivo para download e compartilhamento nativo em dispositivos móveis, contornando bloqueios de navegadores in-app (como o do Instagram).
