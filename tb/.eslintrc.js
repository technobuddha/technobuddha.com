const path = require('path');
const base = require('../../.eslintrc.base');

module.exports = base(path.join(__dirname, './config/tsconfig.lint.json'));
