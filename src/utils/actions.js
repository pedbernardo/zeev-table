import { HELPER_CLASSES } from '../constants'
import { getLastRow, getTableBtnInsert } from './dom'

export function reset (table) {
  const btnInsert = getTableBtnInsert(table)

  // use existent mechanism to insert a new row at end
  btnInsert.click()

  // clear all rows, except the last new added row
  table
    .querySelectorAll('tr:not(.header):not(:last-child')
    .forEach(row => row.remove())
}

export function appendData (table, data, config = {}) {
  const keepData = config.keepData || false
  const btnInsert = getTableBtnInsert(table)

  if (!keepData) {
    reset(table, btnInsert)
  }

  data.forEach((row, index) => {
    // avoid insert a new row for the first occurrence
    // cause after table reset the table already has one
    // empty row, or ignore when using keepData option
    if (index > 0 || keepData) {
      btnInsert.click()
    }

    const currentRow = getLastRow(table)

    Object.entries(row).forEach(([id, value]) => {
      const field = currentRow.querySelector(`[xname=inp${id}]`)
      if (field) field.value = value
    })
  })
}

export function enable (table) {
  table
    .classList
    .remove(HELPER_CLASSES.disabledClass)
}

export function disable (table) {
  table
    .classList
    .add(HELPER_CLASSES.disabledClass)
}
