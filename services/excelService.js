const XLSX = require('xlsx');

exports.generateExcel = (expenses) => {
  const worksheet = XLSX.utils.json_to_sheet(expenses.map(expense => ({
    Date: expense.date.toISOString().split('T')[0],
    Category: expense.category,
    Amount: expense.amount,
    Tags: expense.tags.join(',')
  })));

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Expenses');

  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
};
