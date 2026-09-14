# Publicação e revisão de imagens

Novas notícias só entram no site com uma aprovação em `lib/image-overrides.json`.
O campo `externalImageUrl` sozinho NÃO libera publicação. O carregamento do CMS,
o acervo de emergência e as páginas individuais usam a mesma política.

Antes de publicar:

1. Ler a fonte e identificar o fato, obra, pessoa ou estudo exatos.
2. Abrir a imagem atual no navegador. URL, nome do arquivo, alt text e HTTP 200
   não comprovam o conteúdo visual. Fontes podem trocar uma foto por um aviso.
3. Confirmar direito de reutilização e crédito. Preferir um ativo próprio no
   Sanity quando a licença permitir; links externos podem mudar ou parar de funcionar.
4. Comparar com todas as imagens existentes para evitar duplicatas.
5. Registrar no manifesto, pela chave slug: `status: approved`, `title` exato,
   `url`, `alt`, `caption`, `credit`, `sourceUrl`, `licenseUrl`, `reviewedAt` ISO
   e `reason` explicando a ligação factual. Para autorização específica, usar
   `licenseUrl` como endereço da evidência de permissão. Nunca inventar licença.
6. Executar `node --test tests/*.test.js`, publicar o manifesto pelo Git e aguardar
   o deploy READY. Publicar a matéria no Sanity com os mesmos dados da imagem.
7. Abrir a página individual e sua listagem. Conferir o conteúdo visual, o
   carregamento da foto, o crédito e a legenda. Se falhar, corrigir ou rejeitar
   a entrada antes de encerrar a atualização.

Não aprovar fotos por semelhança temática, logos, avisos, notas institucionais,
placeholders ou imagens geradas como registro factual. Figuras científicas
precisam pertencer ao estudo e ter licença compatível. Fotografias de arquivo
precisam mostrar o mesmo objeto e declarar a data/condição na legenda.

`lib/image-legacy.json` é um inventário congelado, NÃO uma lista de aprovações.
Preserva URLs das 57 matérias antigas enquanto a revisão é concluída. Não
adicionar matérias nem alterar URLs nesse arquivo para contornar a revisão.
Uma troca de URL ou título exige aprovação no manifesto. Rejeições no manifesto
prevalecem sobre qualquer imagem que volte do CMS ou dos dados de emergência.
O arquivo `data/image-audit.json` acompanha pendências e não deve chamar uma
imagem de validada apenas porque existe uma URL.

Auditar primeiro as pendências do acervo e as imagens que falham ao carregar,
depois buscar novas pautas. Não retirar matérias antigas do acervo para encobrir
pendências. Não restaurar newsletter, briefing ou mensagens de indisponibilidade
de assinatura. O radar de links RSS é textual porque suas capas não passam pela
revisão editorial.
