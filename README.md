# 📖 Rabisco Zine Generator

> Transforme suas fotos em um zine físico dobrável com estética lo-fi, traços imperfeitos e efeitos orgânicos gerados via código.

O **Rabisco Zine Generator** é uma ferramenta web minimalista criada para quem ama fotografia, fanzines e a cultura de publicações independentes. O projeto combina o analógico e o digital, permitindo que você selecione suas imagens, visualize uma prévia estilizada com filtros dinâmicos de distorção e gere um layout em PDF perfeitamente formatado para impressão em folha A4.

---

## 🎨 Proposta do Projeto

A essência do projeto está na celebração da imperfeição. Em um cenário digital dominado por layouts simétricos e linhas perfeitas, o gerador resgata o visual texturizado e "sujo" dos fanzines fotocopiados e desenhados à mão através do **Wiggly Effect** (filtros SVG dinâmicos combinados com `feTurbulence` e `feDisplacementMap`).

### Como Funciona a Mágica:

1. **Upload Flexível:** Envie até 8 fotos para preencher as páginas do seu zine (com validação robusta para garantir a performance).
2. **Navegação Condicional:** O fluxo protege a experiência do usuário através de validações interativas com avisos customizados em formato de _toast texturizado_.
3. **Engenharia de Layout (jsPDF):** Ao clicar em gerar, o sistema calcula as coordenadas matemáticas exatas no plano cartesiano do PDF, aplicando rotações automáticas de 180° nas páginas superiores. Isso garante que, após apenas uma dobra horizontal, uma vertical e um corte central, a folha A4 se transforme magicamente em um livreto com as páginas na orientação correta.

---

## 📸 Interface do Usuário (Screenshots)

Aqui está um vislumbre da experiência visual do aplicativo, construída com tipografia monoespaçada `Martian Mono` e paleta com forte contraste azul-monocromático.

### 💻 Splashscreen

<img src="/src/assets/readme-images/1-splash.jpeg" width="30%" alt="SplashScreen (tela de introdução)" />

### 🔔 Tela de Upload

<img src="/src/assets/readme-images/2-upload.jpeg" width="30%" alt="Tela de Upload" />

### ⚡ Tela de Download

<img src="/src/assets/readme-images/3-download.jpeg" width="30%" alt="Tela de Download" />

---

## 🛠️ Tecnologias Utilizadas

- **React & TypeScript:** Arquitetura de componentes tipada e escalável.
- **Framer Motion:** Animações fluidas de transição de estados e ciclo de vida de montagem/desmontagem de elementos via `AnimatePresence`.
- **Filtros SVG (`feTurbulence`):** Criação do efeito orgânico de tremulação (Wiggly Effect) sem uso de pacotes pesados de terceiros.
- **jsPDF:** Manipulação de canvas em tempo real e compilação do arquivo de impressão final no lado do cliente (Client-side rendering).
- **React Router DOM:** Gerenciamento de rotas SPA dinâmicas com injeção de estados históricos.
