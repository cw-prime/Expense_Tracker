const PdfPrinter = require('pdfmake');
const path = require('path');
const fonts = {
  Roboto: {
    normal: path.resolve(__dirname, '..', 'fonts', 'Roboto-Regular.ttf'),
    bold: path.resolve(__dirname, '..', 'fonts', 'Roboto-Medium.ttf'),
    italics: path.resolve(__dirname, '..', 'fonts', 'Roboto-Italic.ttf'),
    bolditalics: path.resolve(__dirname, '..', 'fonts', 'Roboto-MediumItalic.ttf')
  }
};

exports.generatePDF = (expenses) => {
  const printer = new PdfPrinter(fonts);
  const docDefinition = {
    content: [
      { text: 'Expenses Report', style: 'header' },
      expenses.map(expense => {
        return [
          { text: `Date: ${expense.date.toDateString()}`, style: 'subheader' },
          { text: `Category: ${expense.category}` },
          { text: `Amount: ${expense.amount}` },
          { text: `Tags: ${expense.tags.join(', ')}`, margin: [0, 0, 0, 20] },
        ];
      })
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 10]
      },
      subheader: {
        fontSize: 14,
        bold: true,
        margin: [0, 10, 0, 5]
      }
    }
  };

  return printer.createPdfKitDocument(docDefinition);
};
