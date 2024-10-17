// @ts-check
/** @type {import('simple-scaffold').ScaffoldConfigFile} */
// eslint-disable-next-line no-undef
module.exports = {
  component: {
    templates: ['gen/component'],
    output: 'src/components',
    subdirHelper: 'pascalCase',
    subdir: true,
  },
  page: {
    templates: ['gen/page'],
    output: 'src/pages',
    subdirHelper: 'pascalCase',
    subdir: true,
  },
}
