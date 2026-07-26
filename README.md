# VAELITH LABS — Soluções em Engenharia
## Plataforma de teste v4

Aplicação local com site, login, projetos, upload, comparação de revisões, análise preliminar de custos e cronograma, maquete IFC e exportação de relatórios.

## Início rápido no Windows
1. Extraia o pacote.
2. Execute `start.bat`.
3. Acesse `http://localhost:8080`.

### Login de teste
- E-mail: `demo@vaelithlabs.com.br`
- Senha: `vaelith`

O projeto piloto já vem carregado com sete arquivos de demonstração. Também estão disponíveis separadamente em `sample_files/`.

## Roteiro de teste
1. Entre com o login acima.
2. Abra **Arquivos** e confira arquitetura R00/R01, estrutura, orçamento, cronograma, PDF e Word.
3. Abra **Mudança** e confira a solicitação da porta P-034.
4. Clique em **Executar análise**.
5. Confira **Análise**, **Revisões** e **Relatório**.
6. Em **Maquete 3D**, clique em **Carregar IFCs** e depois em **Executar pré-clash**.
7. Exporte o relatório em PDF, Word, Excel ou JSON.

## Processamento implementado
- **IFC:** inventário, GUIDs, comparação de revisões e visualização 3D no navegador.
- **Excel/CSV:** identificação de tabelas de orçamento e cronograma.
- **PDF/Word:** extração de conteúdo e comparação textual.
- **RVT/DWG:** recebimento, armazenamento e classificação; precisam ser convertidos para IFC para a análise geométrica desta beta.
- **Compatibilização:** matriz de versões, alertas documentais, comparação de elementos IFC e pré-clash geométrico por caixas envolventes.

## Regra de confiabilidade
A plataforma não cria custo ou prazo quando não encontra dados suficientes. Resultados por similaridade são exibidos como preliminares e precisam de validação profissional.

## Limite desta beta
O pré-clash usa caixas envolventes como triagem e pode gerar falsos positivos. O visualizador 3D carrega suas bibliotecas pela internet. A versão de produção deve usar um motor geométrico de servidor, dependências locais e armazenamento privado.
