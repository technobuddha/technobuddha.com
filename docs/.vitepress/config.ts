import { defineConfig, UserConfig, DefaultTheme } from 'vitepress';

import typedocSidebar from '@technobuddha/library/doc/typedoc-sidebar.json' with { type: 'json' };

const sidebar: DefaultTheme.Sidebar = typedocSidebar;

function fixLinks(bar: DefaultTheme.Sidebar): void {
  if (Array.isArray(bar)) {
    for (const item of bar) {
      if (item.link?.startsWith('/doc')) {
        item.link = item.link.replace('/doc', '');
      }
      if (item.items) {
        fixLinks(item.items);
      }
    }
  }
}
fixLinks(sidebar);

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Technobuddha Library',
  description: '@technobuddha/library documentation site',
  //srcDir: '../node_modules/@technobuddha/library/doc',
  //srcDir: '../../@technobuddha/library/doc',
  srcDir: '../docs',

  themeConfig: {
    //logo: 'https://api.iconify.design/material-symbols/all-inclusive.svg',
    logo: '/logo.svg',
    docFooter: {
      prev: false,
      next: false,
    },
    search: {
      provider: 'local',
    },

    // https://vitepress.dev/reference/default-theme-config
    nav: [{ text: 'Home', link: '/' }],

    sidebar,

    socialLinks: [{ icon: 'github', link: 'https://github.com/technobuddha/library' }],
  },
});
