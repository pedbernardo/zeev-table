<h1 align="center">
  <br>
  <img
    src="./img/zeev-table-badge.png"
    alt="Zeev Table Badge - Table-tennis racket and ball emoji inside a glowing purple hexagon"
  >
  <p>Zeev Table</p>

  [![CDN](https://data.jsdelivr.com/v1/package/gh/pedbernardo/zeev-table/badge)](https://www.jsdelivr.com/package/gh/pedbernardo/zeev-table)
  [![NPM](https://img.shields.io/npm/v/zeev-table)](https://www.npmjs.com/package/zeev-table)
  [![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)
</h1>

<p align="center">
  Biblioteca <em>não-oficial</em> para facilitar a interação com <strong>Tabelas Multi-Valoradas</strong> no <a href="http://zeev.it" target="_blank">Zeev</a>.<br>
  Observe novos <strong>eventos</strong> na tabela e <strong>(re)adicione</strong> eventos e funções para qualquer linha da tabela.
</p>

<p align="center">
  <a href="#instalação">Instalação</a> |
  <a href="#como-utilizar">Como Utilizar</a> |
  <a href="#instância">Instância</a> |
  <a href="#funções">Funções</a> |
  <a href="#Roadmap">Roadmap</a>
</p>

<br>

## Instalação
### Usar via NPM

```bash
npm install zeev-table

# ou com yarn

yarn add zeev-table
```

### Usar via CDN
Apenas adicione a script tag ao cabeçalho do processo e inicialize a tabela  através do _construtor_ `TableMv.createTable` ou utilize as funções auxiliares do objeto `TableMv`
```html
<script src="https://cdn.jsdelivr.net/gh/pedbernardo/zeev-table@latest/dist/table-mv.js"></script>

<!-- ou minificado -->

<script src="https://cdn.jsdelivr.net/gh/pedbernardo/zeev-table@latest/dist/table-mv.min.js"></script>
```

<br>
<br>
<br>

## Como Utilizar

```js
// importe todas as funções com namespace
import TableMv from 'zeev-table'

// ou use somente as funções desejadas
import { createTable, getRows } from 'zeev-table'
```

### Utilizando via script tag e CDN
```js
const tabela = document.querySelector('#minha-tabela')

// após adicionar a tag script, apenas utilize o objeto global TableMv
TableMv.createTable(tabela)

// ou use somente as funções utilitárias
TableMv.getData(tabela)
```

<br>
<br>
<br>

## Instância

Você pode utilizar o Zeev Table através da criação de uma instância da sua tabela multi-valorada. Desta forma, o uso das funções auxiliares é facilitado, não sendo necessário informar em cada função o elemento da tabela.

Além disso, com o uso do construtor é possível observar uma série de novos eventos da tabela, como também informar uma função para ser executada em cada linha existente (parâmetro `onRowMount`), inclusive quando novas linhas forem inseridas.

**Função** `onRowMount`

Esta função resolve um problema recorrente ao trabalhar com tabelas multi-valoradas: **adicionar eventos e ações**, seja em linhas pré-existentes (quando a tabela já estiver preenchida) ou quando novas linhas forem adicionadas.

**Eventos**

Ao utilizar o construtor a tabela passará a emitir os seguintes eventos, isto sem que o comportamento da tabela em si seja alterado:
- afterInsert
- beforeInsert
- afterDelete
- beforeDelete


### Construtor
### `createTable`
Cria uma nova instância do Zeev Table

> _createTable( HTMLElement, Function )_

**Exemplo de uso**
```js
const tabela = document.querySelector('#minha-tabela')

const minhaInstanciaMv = TableMv.createTable(tabela, (row) => {
  // essa função é executada para cada linha existante tabela
  // no momento da criação da tabela e para cada nova linha adicionada,
  // sendo o primeiro parâmetro do callback a linha atual
  console.log(row)
})

// exibe todas as linhas da tabela, ignorando o cabeçalho da tabela
console.log(
  minhaInstanciaMv.getRows()
)
```

### Eventos

#### `beforeInsert`
Disparado **antes** que uma nova linha seja inserida, assim que clicado no botão `Inserir` da tabela multi-valorada.

**Propriedades**
- event.detail.table `HTML Element` : tabela multi-valorada
- event.detail.length `Number` : quantidade de linhas da tabela antes da inserção
- event.detail.lastRow `HTML Element` : última linha da tabela antes da inserção

<br>

#### `afterInsert`
Disparado **depois** que uma nova linha é inserida, quando clicado no botão `Inserir` da tabela multi-valorada.

**Propriedades**
- event.detail.table `HTML Element` : tabela multi-valorada
- event.detail.length `Number` : quantidade de linhas da tabela após a inserção
- event.detail.lastRow `HTML Element` : linha recém adicionada na tabela

<br>

#### `beforeDelete`
Disparado **antes** que linha seja excluída, quando clicado no botão `Excluir` de uma linha da tabela multi-valorada.

**Propriedades**
- event.detail.table `HTML Element` : tabela multi-valorada
- event.detail.length `number` : quantidade de linhas da tabela antes da exclusão da linha
- event.detail.lastRow `HTML Element` : última linha da tabela antes da exclusão
- event.detail.deletedRow `HTML Element` : linha onde foi clicado o botão `Excluir`, ainda não removida

<br>

#### `afterDelete`
Disparado **depois** que linha é excluída, quando clicado no botão `Excluir` de uma linha da tabela multi-valorada.

_Este evento só será disparado quando a linha de fato for excluída. A função nativa do Zeev pode ser interrompida em alguns casos, como quando a tabela possui apenas uma linha_

**Propriedades**
- event.detail.table `HTML Element` : tabela multi-valorada
- event.detail.length `Number` : quantidade de linhas da tabela após a exclusão da linha
- event.detail.lastRow `HTML Element` : última linha da tabela após a exclusão
- event.detail.deletedRow `HTML Element` : linha onde foi clicado o botão `Excluir`, sendo a linha já removida

### Métodos

#### `on`
Adiciona um event listener a tabela multi-valorada. Na prática apenas faz uso da função nativa `addEventListener`, podendo este ser utilizado diretamente.

> minhaInstanciaMv.on( string, function )

**Exemplo de uso**

```js
const tabela = document.querySelector('#minha-tabela')

const minhaInstanciaMv = TableMv.createTable(tabela)

minhaInstanciaMv.on('afterInsert', ({ detail }) => {
  console.log('após a inserção da linha')
  console.log(detail.lastRow)
  console.log(detail.length)
})
```

<br>

#### `getRows`
Retorna todas as linhas da tabela multi-valorada, exceto o cabeçalho.

_Não é necessário parâmetros_

[Ver Detalhes](#getRows-1)

<br>

#### `getLastRow`
Retorna a última linha da tabela multi-valorada.

_Não é necessário parâmetros_

[Ver Detalhes](#getLastRow-1)

<br>

#### `getLength`
Retorna a quantidade de linhas da tabela-multi-valorada, desconsiderando o cabeçalho.

_Não é necessário parâmetros_

[Ver Detalhes](#getLength-1)

<br>

#### `getData`
Retorna o valor de todos os campos de formulário do Zeev presentes na tabela multi-valorada.

_Não é necessário parâmetros_

[Ver Detalhes](#getData-1)

<br>

#### `reset`
Remove todas as linhas da tabela multi-valorada deixando apenas uma linha sem nenhum campo preenchido, respeitando o comportamento nativo do Zeev.

_Não é necessário parâmetros_

[Ver Detalhes](#reset-1)

<br>

#### `appendData`
Adiciona dados (e novas linhas, caso necessário) aos campos da tabela multi-valorada a partir de um array de objetos chave-valor, conforme os identificadores dos campos de formulário.

> TableMv.appendData( Array - Dados , Object [optional] - Configuração )_

**Propriedades**
`config.keepData` (Default: `false`): mantém as linhas presentes na tabela, e todos os dados adicionados são inseridos em novas linhas.

[Ver Detalhes](#appendData-1)

<br>

#### `enable`
Remove a classe auxiliar `-disabled` ao elemento da tabela.

_Não é necessário parâmetros_

[Ver Detalhes](#enable-1)

<br>

#### `disable`
Adiciona a classe auxiliar `-disabled` ao elemento da tabela.

_Não é necessário parâmetros_

[Ver Detalhes](#disable-1)

<br>
<br>
<br>

## Funções

<br>

#### Actions
- [reset](#reset-1)
- [appendData](#appendData-1)
- [enable](#enable-1)
- [disable](#disable-1)

#### DOM
- [getRows](#getRows-1)
- [getLastRow](#getLastRow-1)
- [getLength](#getLength-1)
- [getData](#getData-1)
- [getRowData](#getRowData)

<br>

### `reset`
Remove todas as linhas da tabela multi-valorada deixando apenas uma linha sem nenhum campo preenchido, respeitando o comportamento nativo do Zeev.

> TableMv.reset( HTMLElement - Tabela )_

**Exemplo de uso**
```js
const tabela = document.querySelector('#minha-tabela')
TableMv.reset(tabela)
```

<br>

### `appendData`
Adiciona dados (e novas linhas, caso necessário) aos campos da tabela multi-valorada a partir de um array de objetos chave-valor, conforme os identificadores dos campos de formulário.

> TableMv.appendData( HTMLElement - Table, Array - Dados , Object [optional] - Configuração )_

**Propriedades**
`config.keepData` (Default: `false`): mantém as linhas presentes na tabela, e todos os dados adicionados são inseridos em novas linhas.

**Exemplo de uso**
```js
const tabela = document.querySelector('#minha-tabela')
const meusDados = [
  // 1ª linha
  {
    idDeUmCampo: 'valor do campo',
    idDeOutroCampo: 'valor do outro campo',
  },
  // 2ª linha
  {
    idDeUmCampo: 'valor do campo, diferente',
    idDeOutroCampo: 'valor do outro campo, diferente',
  }
]
TableMv.appendData(tabela, meusDados)

// ou mantenha os dados existentes na tabela,
// adicionado os novos dados pela inserção de novas linhas
TableMv.appendData(tabela, meusDados, { keepData: true })
```

<br>

### `enable`
Remove a classe auxiliar `-disabled` ao elemento da tabela.

_Você pode combinar a utilização desta classe com regras de CSS que alterem o comportamento da tabela em si._

> TableMv.enable( HTMLElement - Tabela )_

**Exemplo de uso**
```js
const tabela = document.querySelector('#minha-tabela')
TableMv.enable(tabela)
```

<br>

### `disable`
Adiciona a classe auxiliar `-disabled` ao elemento da tabela.

_Você pode combinar a utilização desta classe com regras de CSS que alterem o comportamento da tabela em si._

> TableMv.disable( HTMLElement - Tabela )_

**Exemplo de uso**
```js
const tabela = document.querySelector('#minha-tabela')
TableMv.disable(tabela)
```

<br>

### `getRows`
Retorna todas as linhas da tabela multi-valorada, exceto o cabeçalho.

> TableMv.getRows( HTMLElement - Tabela )_

**Exemplo de uso**
```js
const tabela = document.querySelector('#minha-tabela')
TableMv.getRows(tabela) // [tr, tr, tr]
```

<br>

### `getLastRow`
Retorna a última linha da tabela multi-valorada.

> TableMv.getLastRow( HTMLElement - Tabela )_

**Exemplo de uso**
```js
const tabela = document.querySelector('#minha-tabela')
TableMv.getLastRow(tabela) // tr
```

<br>

### `getLength`
Retorna a quantidade de linhas da tabela-multi-valorada, desconsiderando o cabeçalho.

> TableMv.getLength( HTMLElement - Tabela )_

**Exemplo de uso**
```js
const tabela = document.querySelector('#minha-tabela')
TableMv.getLastRow(tabela) // 3
```

<br>

### `getData`
Retorna o valor de todos os campos de formulário do Zeev presentes na tabela multi-valorada.
Os dados são retornados no formato chave-valor, sendo o identificador do campo de formulário como chave e o valor do campo como valor.

> TableMv.getData( HTMLElement - Tabela )_

**Exemplo de uso**
```js
const tabela = document.querySelector('#minha-tabela')
TableMv.getData(tabela) // [{...}, {...}, {...}]
```

**Exemplo de retorno**
```js
[
  {
    idDoCampoA: 'valor do campo, linha 1',
    idDoCampoB: 'valor do campo, linha 1'
  },
  {
    idDoCampoA: 'valor do campo, linha 2',
    idDoCampoB: 'valor do campo, linha 2'
  }
]
```

<br>

### `getRowData`
Retorna o valor de todos os campos de formulário do Zeev presentes na linha informada.
Os dados são retornados no formato chave-valor, sendo o identificador do campo de formulário como chave e o valor do campo como valor.

> TableMv.getRowData( HTMLElement - Linha )_

**Exemplo de uso**
```js
const tabela = document.querySelector('#minha-tabela')
TableMv.getRowData(tabela) // {...}
```

**Exemplo de retorno**
```js
{
  idDoCampoA: 'valor do campo A, linha informada',
  idDoCampoB: 'valor do campo B, linha informada'
}
```

<br>
<br>
<br>

## Roadmap

**Versão 1.0.0**
- Alterar definição de tipos de JSDocs para TypeScript
- Adicionar testes unitários
- Avaliar estratégias alternativas ao `createTable`, como event delegation
- Finalizar documentação no README
- Construir documentação utilizando Vitepress
- Automatizar build com uso de Github Actions
