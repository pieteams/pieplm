import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'PiePLM',
  description: 'Empowering SMEs with Product Lifecycle Management',
  base: '/pieplm/',
  sitemap: {
    hostname: 'https://pieteams.github.io/pieplm/',
  },
  cleanUrls: true,
  lastUpdated: true,
  ignoreDeadLinks: [
    /localhost/,
  ],
  head: [
    ['script', { async: '', src: 'https://www.googletagmanager.com/gtag/js?id=G-HWD1L3DX4N' }],
    ['script', {}, `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-HWD1L3DX4N');
    `]
  ],
  themeConfig: {
    socialLinks: [
      { icon: 'github', link: 'https://github.com/pieteams/pieplm' }
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present Jasen Han'
    },
    search: {
      provider: 'local'
    },
  },
  locales: {
    root: {
      label: 'English',
      lang: 'en',
      themeConfig: {
        nav: [
          {
            text: 'Getting Started',
            link: '/getting-started/what-is-pieplm',
            activeMatch: '/getting-started/',
          },
          {
            text: 'Guide',
            link: '/guide/architecture',
            activeMatch: '/guide/',
          },
          {
            text: 'Reference',
            link: '/reference/config',
            activeMatch: '/reference/',
          },
        ],
        sidebar: {
          '/getting-started/': [
            {
              base: '/getting-started/',
              text: 'Getting Started',
              collapsed: false,
              items: [
                { text: 'What is PiePLM', link: 'what-is-pieplm' },
                { text: 'Installation', link: 'installation' },
                { text: 'Quick Start', link: 'quick-start' },
              ]
            },
            {
              base: '/getting-started/',
              text: 'PLM Market',
              collapsed: false,
              items: [
                { text: 'PLM Systems', link: 'plm-systems' },
                { text: 'International Consulting', link: 'international-consulting' },
                { text: 'China Consulting', link: 'china-consulting' },
              ]
            },
          ],
          '/guide/': [
            {
              base: '/guide/',
              text: 'Guide',
              collapsed: false,
              items: [
                { text: 'Architecture', link: 'architecture' },
                { text: 'Core Modules', link: 'core-modules' },
                { text: 'Search Engine', link: 'search-engine' },
                { text: 'MCP Integration', link: 'mcp-integration' },
              ]
            }
          ],
          '/reference/': [
            {
              base: '/reference/',
              text: 'Reference',
              items: [
                { text: 'Config', link: 'config' },
                { text: 'API', link: 'api' },
              ]
            }
          ],
        }
      }
    },
    'zh-CN': {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/zh-CN/',
      themeConfig: {
        nav: [
          {
            text: '快速开始',
            link: '/zh-CN/getting-started/what-is-pieplm',
            activeMatch: '/zh-CN/getting-started/',
          },
          {
            text: '指南',
            link: '/zh-CN/guide/architecture',
            activeMatch: '/zh-CN/guide/',
          },
          {
            text: '参考',
            link: '/zh-CN/reference/config',
            activeMatch: '/zh-CN/reference/',
          },
        ],
        sidebar: {
          '/zh-CN/getting-started/': [
            {
              base: '/zh-CN/getting-started/',
              text: '快速开始',
              collapsed: false,
              items: [
                { text: '什么是 PiePLM', link: 'what-is-pieplm' },
                { text: '安装', link: 'installation' },
                { text: '快速上手', link: 'quick-start' },
              ]
            },
            {
              base: '/zh-CN/getting-started/',
              text: 'PLM 市场',
              collapsed: false,
              items: [
                { text: 'PLM 系统清单', link: 'plm-systems' },
                { text: '国际咨询公司', link: 'international-consulting' },
                { text: '中国咨询公司', link: 'china-consulting' },
              ]
            },
          ],
          '/zh-CN/guide/': [
            {
              base: '/zh-CN/guide/',
              text: '指南',
              collapsed: false,
              items: [
                { text: '架构设计', link: 'architecture' },
                { text: '核心模块', link: 'core-modules' },
                { text: '搜索引擎', link: 'search-engine' },
                { text: 'MCP 集成', link: 'mcp-integration' },
              ]
            }
          ],
          '/zh-CN/reference/': [
            {
              base: '/zh-CN/reference/',
              text: '参考',
              items: [
                { text: '配置', link: 'config' },
                { text: 'API', link: 'api' },
              ]
            }
          ],
        }
      }
    },
  }
})
