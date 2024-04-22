# Projeto

Teste técnico WPLEX

#### Intalation
```
git clone git@github.com:jhonfaccin/wplex.git
npm install
```

#### Execution
```
 node src/index.js --location <location> --file <file>
```
exemplo:
``` 
node src/index.js --location="-23.70041,-46.53713" 
```
or:
```
node src/index.js --location="-23.70041,-46.53713" --file="path/eventlog.csv"
```

## Funcionalidades Implementadas
- Leitura do arquivo CSV de com eventos de rastreadores.
- Filtragem dos eventos próximos a uma coordenada geográfica informada, considerando um raio de 50 metros.
- Agrupamento e ordenação cronológica dos eventos dentro de cada grupo.
- Exibição dos resultados no formato CSV.

## Decisões de Implementação
- Utilização do módulo csv-parser para realizar a leitura e análise do arquivo CSV.
- Uso do módulo geolib para calcular a distância entre as coordenadas dos eventos e a coordenada informada na linha de comando.
- Organização do código em funções modulares para facilitar a manutenção e adição de novas funcionalidades no futuro.
Consideração da possibilidade de futura disponibilização da funcionalidade através de uma API HTTP.

## Estratégia de Manipulação de Arquivos
O projeto utiliza a estratégia de streaming para manipulação de arquivos CSV. Isso significa que a leitura e processamento dos dados são realizados de forma assíncrona, em pequenos pedaços (chunks), o que permite lidar eficientemente com arquivos de grandes volumes, minimizando o uso de memória e garantindo um desempenho otimizado.