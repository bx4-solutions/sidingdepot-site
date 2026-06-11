# Guia de Edição — Nick

## Antes de começar (só na primeira vez)

Instale:
- **Node.js**: https://nodejs.org (botão "LTS")
- **Git**: https://git-scm.com
- **Claude Code**: https://claude.ai/code

---

## 1. Baixar o projeto (só na primeira vez)

Abra o Terminal e rode:

```bash
git clone https://github.com/bx4-solutions/sidingdepot-site.git
cd sidingdepot-site
npm install
```

---

## 2. Abrir o Claude Code no projeto

```bash
claude
```

O Claude abre dentro da pasta e te ajuda com tudo.

---

## 3. Fazer as alterações

Fale para o Claude o que quer mudar. Exemplos:

> "Muda o texto da seção hero para..."
> "Troca a cor do botão de contato para..."
> "Adiciona um novo serviço na lista..."

O Claude edita o arquivo certo automaticamente.

---

## 4. Ver o resultado antes de publicar

```bash
npm run dev
```

Acesse **http://localhost:8080** no navegador e confira como ficou.

---

## 5. Salvar e publicar

Quando estiver satisfeito, fale para o Claude:

> **"Faz o commit e sobe para o GitHub"**

O Claude roda os comandos e o Vercel publica automaticamente em 1-2 minutos.

---

## Regras

- ✅ Sempre veja o resultado local **antes** de subir
- ✅ Faça **uma coisa por vez**
- ✅ Se algo parecer errado: **"Desfaz a última alteração"**
- ❌ Nunca rode `git push --force`
- ❌ Nunca delete arquivos `.env`

---

## Se algo der errado

Fale para o Claude: *"Algo deu errado, volta como estava antes"*

Ou no terminal:
```bash
git checkout .
```

---

**Dúvidas? Fala com Severino.**
