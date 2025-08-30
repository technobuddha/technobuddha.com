//@ts-check

/** @type {import('typedoc').TypeDocOptions & import('typedoc-plugin-markdown').PluginOptions} */
const config = {
  // typedoc
  //  Configuration
  plugin: [
    'typedoc-plugin-markdown',
    'typedoc-vitepress-theme',
    'typedoc-plugin-mdn-links',
    '@giancosta86/typedoc-readonly',
    'typedoc-plugin-coverage',
    // './typedoc-technobuddha-plugin.js',
  ],
  //  Input
  entryPointStrategy: 'packages',
  entryPoints: ['../@technobuddha/library'],
  exclude: [],
  excludeInternal: true,
  excludePrivate: true,
  excludeProtected: true,
  gitRevision: 'main',
  readme: 'none',
  //  Output
  out: 'doc',
  router: 'group',
  basePath: '.',
  navigation: {
    includeCategories: true,
    includeGroups: true,
    includeFolders: false,
    compactFolders: true,
    excludeReferences: true,
  },
  //  Organization
  categorizeByGroup: true,
  defaultCategory: 'Uncategorized',
  categoryOrder: ['Uncategorized', '*'],


  // typedoc-plugin-markdown
  //  File Options
  entryFileName: 'index.md',
  mergeReadme: false,
  //  Display
  hidePageHeader: true,
  expandObjects: true,
  expandParameters: true,
  indexFormat: 'table',
  parametersFormat: 'table',
  interfacePropertiesFormat: 'table',
  classPropertiesFormat: 'table',
  typeAliasPropertiesFormat: 'table',
  enumMembersFormat: 'table',
  propertyMembersFormat: 'table',
  typeDeclarationFormat: 'table',
  typeDeclarationVisibility: 'verbose',
  useCodeBlocks: true,
};

export default config;
