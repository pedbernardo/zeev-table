import { BUTTONS_REFS } from '../constants'
import { getFieldId, getFieldValue } from './helpers'

// ---------------------------------
// 🔒 Private Helpers
// reserved for internal usage
// ---------------------------------

export const getTableBtnInsert = table =>
  table.querySelector(BUTTONS_REFS.btnInsert)

export const getRowBtnDelete = row =>
  row.querySelector(BUTTONS_REFS.btnDelete)

// ---------------------------------
// 🔑 Public Helpers
// ---------------------------------

export function getRows (table) {
  return [...table.querySelectorAll('tr:not(.header)')]
}

export function getLastRow (table) {
  return table.querySelector('tr:last-child')
}

export function getLength (table) {
  return getRows(table)?.length || 0
}

export function getData (table, config = {}) {
  getRows(table).map(row => getRowData(row, config))
}

export function getRowData (row, config = {}) {
  const fields = [...row.querySelectorAll('[xname]')]

  return fields.reduce((rowData, field) => {
    const id = getFieldId(field)

    return {
      ...rowData,
      [id]: getFieldValue(field, config.getOptionText)
    }
  }, {})
}
