// 🚨
// 🚨 CHANGES TO THIS FILE WILL BE OVERRIDDEN
// 🚨
// @ts-check
/** @type import("cspell").CSpellSettings */
const config = {
  $schema:
    'https://raw.githubusercontent.com/streetsidesoftware/cspell/main/packages/cspell-types/cspell.schema.json',
  version: '0.2',
  ignorePaths: ['**/*.svg', './locales/**/*.*', './dist/**/*.*', '**/*.tsbuildinfo', '**/*.test.*'],
  dictionaryDefinitions: [
    {
      name: 'internal',
      path: './.cspell/internal.dic',
      description: 'INTERNAL TO THIS PROJECT',
      addWords: true,
    },
    {
      name: 'tb-color',
      path: '~/.cspell/color.dic',
      description: 'Color',
      addWords: true,
    },
    {
      name: 'tb-css',
      path: '~/.cspell/css.dic',
      description: 'CSS',
      addWords: true,
    },
    {
      name: 'tb-db',
      path: '~/.cspell/db.dic',
      description: 'Database',
      addWords: true,
    },
    {
      name: 'tb-english',
      path: '~/.cspell/english.dic',
      description: 'English',
      addWords: true,
    },
    {
      name: 'tb-fonts',
      path: '~/.cspell/fonts.dic',
      description: 'Font',
      addWords: true,
    },
    {
      name: 'tb-html',
      path: '~/.cspell/html.dic',
      description: 'HTML',
      addWords: true,
    },
    {
      name: 'tb-math',
      path: '~/.cspell/math.dic',
      description: 'Math',
      addWords: true,
    },
    {
      name: 'tb-numbers',
      path: '~/.cspell/numbers.dic',
      description: 'Number',
      addWords: true,
    },
    {
      name: 'tb-programming',
      path: '~/.cspell/programming.dic',
      description: 'Programming',
      addWords: true,
    },
    {
      name: 'tb-proper',
      path: '~/.cspell/proper.dic',
      description: 'Proper nouns',
      addWords: true,
    },
    {
      name: 'tb-software',
      path: '~/.cspell/software.dic',
      description: 'Software',
      addWords: true,
    },
    {
      name: 'tb-technobuddha',
      path: '~/.cspell/technobuddha.dic',
      description: 'Technobuddha',
      addWords: true,
    },
    {
      name: 'tb-unicode',
      path: '~/.cspell/unicode.dic',
      description: 'Unicode',
      addWords: true,
    },
  ],
  dictionaries: [
    'typescript',
    'node',
    'html',
    'css',
    'bash',
    'fonts',
    'filetypes',
    'npm',

    'internal',
    'tb-color',
    'tb-css',
    'tb-db',
    'tb-english',
    'tb-fonts',
    'tb-html',
    'tb-math',
    'tb-numbers',
    'tb-programming',
    'tb-proper',
    'tb-software',
    'tb-technobuddha',
    'tb-unicode',
  ],
  patterns: [
    {
      name: 'comment-single-line',
      pattern: '/\\/\\/.*/g',
    },
    {
      name: 'comment-multi-line',
      pattern: '/\\/\\*(?:.|\\n)*?\\*\\//g',
    },
    {
      name: 'example',
      pattern: '/@example(?:.|\\n)*?\\*(?:\\s*@|\\/)/g',
    },
    {
      name: 'comments',
      pattern: ['comment-single-line', 'example'],
    },
  ],
  ignoreRegExpList: ['comments'],
};

export default config;
