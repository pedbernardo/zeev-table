export const isFunction = value =>
  typeof value === 'function'

export const isTable = element =>
  element.tagName.toLowerCase() === 'table'

export const isMultiValueTable = element =>
  element.getAttribute('mult') === 'S'

export const reappendClick = ({ element, oldCallback, newCallback }) => {
  if (!element) return

  element.removeAttribute('onclick')
  element.removeEventListener('click', oldCallback)
  element.addEventListener('click', newCallback)
}

export const getFieldId = field =>
  field.getAttribute('xname').substring(3)

export const getFieldValue = (field, useOptionText = false) => {
  return field.type === 'select-one' && useOptionText
    ? field.querySelector('option:checked').innerText
    : field.value
}
