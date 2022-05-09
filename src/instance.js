import { NAME } from './constants'

import {
  isFunction,
  isTable,
  isMultiValueTable,
  reappendClick
} from './utils/helpers'

import * as UtilsDom from './utils/dom'
import * as UtilsActions from './utils/actions'

const INSTANCE_ALIAS = `_${NAME}`

export function createTable (element, onRowMount) {
  try {
    inspectElement(element)
  } catch (error) {
    return console.warn(`[${NAME}]: ${error}`)
  }

  if (element[INSTANCE_ALIAS]) return element[INSTANCE_ALIAS]

  return TableMvFactory(element, onRowMount)
}

function inspectElement (element) {
  const elementTag = element.tagName.toLowerCase()

  if (!isTable(element)) {
    throw new Error(`o elemento ${elementTag} precisa ser uma tabela`)
  }

  if (!isMultiValueTable(element)) {
    throw new Error('a tabela precisa ser multi-valorada, portanto possuir o atributo mult="S"')
  }
}

function TableMvFactory (table, onRowMount) {
  const instance = {
    table: null,
    btnInsert: null,
    onMount: null,
    getRows,
    getLastRow,
    getLength,
    getData,
    reset,
    appendData,
    enable,
    disable,
    on
  }

  mount()

  table[INSTANCE_ALIAS] = instance

  return instance

  // ---------------------------------
  // 🔒 Private Methods
  // ---------------------------------

  function mount () {
    instance.table = table
    instance.btnInsert = UtilsDom.getTableBtnInsert(table)
    instance.onMount = isFunction(onRowMount) ? onRowMount : null

    addTriggers()

    if (instance.onMount) {
      getRows().forEach(onRowMount)
    }
  }

  function addTriggers () {
    getRows().forEach(addRowTriggers)

    reappendClick({
      element: instance.btnInsert,
      oldCallback: window.InsertNewRow,
      newCallback: onInsertRow
    })
  }

  function addRowTriggers (row) {
    reappendClick({
      element: UtilsDom.getRowBtnDelete(row),
      oldCallback: window.DeleteRow,
      newCallback: onDeleteRow
    })
  }

  function onInsertRow () {
    const btnInsert = this

    instance.table.dispatchEvent(
      new CustomEvent('beforeInsert', getEventConfig())
    )

    window.InsertNewRow(btnInsert, true)

    const newestRow = getLastRow()

    addRowTriggers(newestRow)

    if (instance.onMount) {
      instance.onMount(newestRow)
    }

    instance.table.dispatchEvent(
      new CustomEvent('afterInsert', getEventConfig())
    )
  }

  function onDeleteRow () {
    const btnDelete = this
    const previousLength = getLength()
    const deletedRow = btnDelete.closest('tr')

    instance.table.dispatchEvent(
      new CustomEvent('beforeDelete', getEventConfig({ deletedRow }))
    )

    window.DeleteRow(btnDelete)

    // rows aren't deleted when table has only one row
    const wasRowDeleted = getLength() < previousLength

    if (!wasRowDeleted) return

    instance.table.dispatchEvent(
      new CustomEvent('afterDelete', getEventConfig({ deletedRow }))
    )
  }

  function getEventConfig (data) {
    return {
      detail: {
        table: instance.table,
        length: getLength(),
        lastRow: getLastRow(),
        ...data
      }
    }
  }

  // ---------------------------------
  // 🔑 Public Methods
  // ---------------------------------

  function getRows () {
    return UtilsDom.getRows(instance.table)
  }

  function getLastRow () {
    return UtilsDom.getLastRow(instance.table)
  }

  function getLength () {
    return UtilsDom.getLength(instance.table)
  }

  function getData (config) {
    return UtilsDom.getData(instance.table, config)
  }

  function reset () {
    UtilsActions.reset(instance.table)
  }

  function appendData (data, config = {}) {
    UtilsActions.appendData(instance.table, data, config)
  }

  function enable () {
    UtilsActions.enable(instance.table)
  }

  function disable () {
    UtilsActions.disable(instance.table)
  }

  function on (event, callback) {
    instance.table
      .addEventListener(event, callback)
  }
}
