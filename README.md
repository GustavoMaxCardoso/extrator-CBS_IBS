# 📄 Extrator NF-e — IBS & CBS

Ferramenta **100% local** para extrair os valores de **IBS** (`vIBSUF`) e **CBS** (`vCBS`) de XMLs de NF-e, item por item, com soma total ao final.

Desenvolvida no contexto da **Reforma Tributária brasileira**, sem necessidade de instalação ou internet.

---

## ✨ Funcionalidades

- 📂 **Upload por clique ou arrastar e soltar** (drag & drop) de arquivos `.xml`
- ✏️ **Cole o XML diretamente** na caixa de texto
- 📊 **Tabela detalhada** por item: `vBC`, `vIBSUF`, `vCBS` e total do item
- 🔢 **Cards de resumo** com soma total de IBS, CBS e IBS+CBS
- 📥 **Exportar para XLSX** (Excel) com formatação de moeda BRL
- 📋 **Copiar CSV** para colar direto no Excel ou Google Sheets
- 🌙 **Tema claro / escuro** com preferência salva no navegador
- 🔒 **Privacidade total** — nenhum dado é enviado a servidores

---

## 📁 Estrutura do projeto

```
nfe_extrator/
├── index.html           ← Interface principal
├── style.css            ← Estilos (tema claro e escuro)
├── script.js            ← Lógica de extração e exportação
├── Abrir_Extrator.bat   ← Atalho para Windows
├── abrir_extrator.sh    ← Atalho para Linux / macOS
└── README.md            ← Este arquivo
```

---

## 🚀 Como usar

### Windows
Dê dois cliques em **`Abrir_Extrator.bat`**

### Linux / macOS
No terminal, execute:
```bash
chmod +x abrir_extrator.sh
./abrir_extrator.sh
```

### Ou simplesmente
Abra o arquivo `index.html` diretamente no navegador (Chrome, Edge ou Firefox).

---

## 🔍 Como funciona

1. **Selecione** o arquivo XML da NF-e (clique na área de upload ou arraste o arquivo) **ou cole** o conteúdo XML na caixa de texto
2. Clique em **Extrair valores**
3. A tabela exibirá cada item com `vBC`, `vIBSUF`, `vCBS` e o total do item
4. Os cards de resumo mostram a **soma total** de cada campo
5. Use **Exportar XLSX** para baixar uma planilha formatada, ou **Copiar CSV** para colar em qualquer planilha

---

## 🧾 Campos extraídos

| Campo     | Descrição                                      |
|-----------|------------------------------------------------|
| `vBC`     | Base de Cálculo do item                        |
| `vIBSUF`  | Imposto sobre Bens e Serviços — parcela UF     |
| `vCBS`    | Contribuição sobre Bens e Serviços             |
| Total     | Soma de `vIBSUF` + `vCBS` por item             |

---

## ⚙️ Requisitos

- Qualquer navegador moderno: **Chrome**, **Edge** ou **Firefox**
- Não requer instalação, servidor ou conexão com internet

---

## 👤 Autor

**DevGustavoMaxCardoso** · [github.com/GustavoMaxCardoso](https://github.com/GustavoMaxCardoso)
