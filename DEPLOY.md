# Publicação da VAELITH Beta

## Teste local no Windows
1. Extraia o ZIP.
2. Execute `start.bat`.
3. Aguarde a instalação das dependências.
4. Abra `http://localhost:8080`.

## Docker
```bash
docker build -t vaelith-beta .
docker run --rm -p 8080:8080 vaelith-beta
```

## Render
1. Envie esta pasta para um repositório privado no GitHub.
2. No Render, crie um Blueprint usando `render.yaml`.
3. Publique primeiro em um subdomínio de teste, como `beta.vaelithlabs.com.br`.

## Antes do uso com clientes reais
Esta beta usa SQLite e armazenamento local. Para produção, migrar para PostgreSQL e armazenamento privado de objetos, configurar HTTPS, backups, recuperação de senha, perfis de acesso, antivírus de upload, limites por arquivo e política LGPD.
