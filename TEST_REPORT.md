# Relatório de testes — VAELITH v4

## Resultado
- **27/27 testes funcionais de backend aprovados**.
- **20/20 verificações estáticas de interface aprovadas**.
- Sintaxe de `server.py`, `assets/app.js` e `assets/ifc-viewer.js` validada.
- Inicialização real do servidor validada em porta alternativa: landing, login e listagem de projetos responderam HTTP 200.

## Fluxo funcional validado
- site e página de login;
- autenticação e sessão;
- listagem de projeto;
- upload e processamento de sete arquivos;
- IFC, Excel, PDF e Word processados;
- comparação IFC entre arquitetura R00 e R01;
- 1 elemento adicionado e 2 modificados detectados;
- itens orçamentários relacionados, total preliminar de **R$ 1.435,60**;
- atividades relacionadas no cronograma, maior duração de **2 dias**;
- maquete marcada como pronta com três IFCs;
- linha de raciocínio gerada;
- exportações JSON, Excel, Word e PDF válidas.

## Verificações estáticas
- HTML analisado sem IDs duplicados;
- todos os recursos locais referenciados existem;
- marca e proposta principal presentes;
- login, upload, mudança, análise, maquete, revisões e relatório presentes;
- CSS balanceado;
- três grupos de regras responsivas.

## Limitação do teste visual automatizado
O Chromium headless do ambiente de execução travou por falhas de DBus e não produziu captura confiável. A aplicação respondeu HTTP 200 e os recursos foram verificados estaticamente, mas a aprovação visual final deve ser feita no Chrome ou Edge do usuário.

## Observação técnica
O pré-clash atual é uma triagem por caixas envolventes. Ele não deve ser tratado como laudo ou validação geométrica final.
