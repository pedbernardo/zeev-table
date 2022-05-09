const NAME = 'TableMv';

const BUTTONS_REFS = {
  btnInsert: '#BtnInsertNewRow',
  btnDelete: '.btn-delete-mv'
};

const HELPER_CLASSES = {
  disabledClass: '-disabled',
  readonlyClass: '-readonly'
};

const isFunction = value =>
  typeof value === 'function';

const isTable = element =>
  element.tagName.toLowerCase() === 'table';

const isMultiValueTable = element =>
  element.getAttribute('mult') === 'S';

const reappendClick = ({ element, oldCallback, newCallback }) => {
  if (!element) return

  element.removeAttribute('onclick');
  element.removeEventListener('click', oldCallback);
  element.addEventListener('click', newCallback);
};

const getFieldId = field =>
  field.getAttribute('xname').substring(3);

const getFieldValue = (field, useOptionText = false) => {
  return field.type === 'select-one' && useOptionText
    ? field.querySelector('option:checked').innerText
    : field.value
};

// ---------------------------------
// 🔒 Private Helpers
// reserved for internal usage
// ---------------------------------

const getTableBtnInsert = table =>
  table.querySelector(BUTTONS_REFS.btnInsert);

const getRowBtnDelete = row =>
  row.querySelector(BUTTONS_REFS.btnDelete);

// ---------------------------------
// 🔑 Public Helpers
// ---------------------------------

function getRows (table) {
  return [...table.querySelectorAll('tr:not(.header)')]
}

function getLastRow (table) {
  return table.querySelector('tr:last-child')
}

function getLength (table) {
  return getRows(table)?.length || 0
}

function getData (table, config = {}) {
  return getRows(table).map(row => getRowData(row, config))
}

function getRowData (row, config = {}) {
  const fields = [...row.querySelectorAll('[xname]')];

  return fields.reduce((rowData, field) => {
    const id = getFieldId(field);

    return {
      ...rowData,
      [id]: getFieldValue(field, config.getOptionText)
    }
  }, {})
}

function reset (table) {
  const btnInsert = getTableBtnInsert(table);

  // use existent mechanism to insert a new row at end
  btnInsert.click();

  // clear all rows, except the last new added row
  table
    .querySelectorAll('tr:not(.header):not(:last-child')
    .forEach(row => row.remove());
}

function appendData (table, data, config = {}) {
  const keepData = config.keepData || false;
  const btnInsert = getTableBtnInsert(table);

  if (!keepData) {
    reset(table);
  }

  data.forEach((row, index) => {
    // avoid insert a new row for the first occurrence
    // cause after table reset the table already has one
    // empty row, or ignore when using keepData option
    if (index > 0 || keepData) {
      btnInsert.click();
    }

    const currentRow = getLastRow(table);

    Object.entries(row).forEach(([id, value]) => {
      const field = currentRow.querySelector(`[xname=inp${id}]`);
      if (field) field.value = value;
    });
  });
}

function enable (table) {
  table
    .classList
    .remove(HELPER_CLASSES.disabledClass);
}

function disable (table) {
  table
    .classList
    .add(HELPER_CLASSES.disabledClass);
}

const INSTANCE_ALIAS = `_${NAME}`;

function createTable (element, onRowMount) {
  try {
    inspectElement(element);
  } catch (error) {
    return console.warn(`[${NAME}]: ${error}`)
  }

  if (element[INSTANCE_ALIAS]) return element[INSTANCE_ALIAS]

  return TableMvFactory(element, onRowMount)
}

function inspectElement (element) {
  const elementTag = element.tagName.toLowerCase();

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
    getRows: getRows$1,
    getLastRow: getLastRow$1,
    getLength: getLength$1,
    getData: getData$1,
    reset: reset$1,
    appendData: appendData$1,
    enable: enable$1,
    disable: disable$1,
    on
  };

  mount();

  table[INSTANCE_ALIAS] = instance;

  return instance

  // ---------------------------------
  // 🔒 Private Methods
  // ---------------------------------

  function mount () {
    instance.table = table;
    instance.btnInsert = getTableBtnInsert(table);
    instance.onMount = isFunction(onRowMount) ? onRowMount : null;

    addTriggers();

    if (instance.onMount) {
      getRows$1().forEach(onRowMount);
    }
  }

  function addTriggers () {
    getRows$1().forEach(addRowTriggers);

    reappendClick({
      element: instance.btnInsert,
      oldCallback: window.InsertNewRow,
      newCallback: onInsertRow
    });
  }

  function addRowTriggers (row) {
    reappendClick({
      element: getRowBtnDelete(row),
      oldCallback: window.DeleteRow,
      newCallback: onDeleteRow
    });
  }

  function onInsertRow () {
    const btnInsert = this;

    instance.table.dispatchEvent(
      new CustomEvent('beforeInsert', getEventConfig())
    );

    window.InsertNewRow(btnInsert, true);

    const newestRow = getLastRow$1();

    addRowTriggers(newestRow);

    if (instance.onMount) {
      instance.onMount(newestRow);
    }

    instance.table.dispatchEvent(
      new CustomEvent('afterInsert', getEventConfig())
    );
  }

  function onDeleteRow () {
    const btnDelete = this;
    const previousLength = getLength$1();
    const deletedRow = btnDelete.closest('tr');

    instance.table.dispatchEvent(
      new CustomEvent('beforeDelete', getEventConfig({ deletedRow }))
    );

    window.DeleteRow(btnDelete);

    // rows aren't deleted when table has only one row
    const wasRowDeleted = getLength$1() < previousLength;

    if (!wasRowDeleted) return

    instance.table.dispatchEvent(
      new CustomEvent('afterDelete', getEventConfig({ deletedRow }))
    );
  }

  function getEventConfig (data) {
    return {
      detail: {
        table: instance.table,
        length: getLength$1(),
        lastRow: getLastRow$1(),
        ...data
      }
    }
  }

  // ---------------------------------
  // 🔑 Public Methods
  // ---------------------------------

  function getRows$1 () {
    return getRows(instance.table)
  }

  function getLastRow$1 () {
    return getLastRow(instance.table)
  }

  function getLength$1 () {
    return getLength(instance.table)
  }

  function getData$1 (config) {
    return getData(instance.table, config)
  }

  function reset$1 () {
    reset(instance.table);
  }

  function appendData$1 (data, config = {}) {
    appendData(instance.table, data, config);
  }

  function enable$1 () {
    enable(instance.table);
  }

  function disable$1 () {
    disable(instance.table);
  }

  function on (event, callback) {
    instance.table
      .addEventListener(event, callback);
  }
}

export { appendData, createTable, disable, enable, getData, getLastRow, getLength, getRowData, getRows, reset };
