import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
    title: 'My Notes',
    tagline: 'Cheatsheets and study notes',
    favicon: 'img/favicon.ico',

    url: 'https://HnHoussi.github.io', // change to your site URL
    baseUrl: '/',

    organizationName: 'HnHoussi', // GitHub username
    projectName: 'my-notes', // GitHub repo name

    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'warn',

    i18n: {
        defaultLocale: 'en',
        locales: ['en'],
    },

    presets: [
        [
            'classic',
            {
                docs: {
                    sidebarPath: require.resolve('./sidebars.ts'),
                    editUrl: 'https://github.com/HnHoussi/my-notes/edit/main/',
                },
                theme: {
                    customCss: require.resolve('./src/css/custom.css'),
                },
            } satisfies Preset.Options,
        ],
    ],

    themeConfig: {
        image: 'img/docusaurus-social-card.jpg',

        colorMode: {
                defaultMode: 'dark',   // or 'dark', whichever you prefer
                respectPrefersColorScheme: false, // disables System mode
        },

        navbar: {
            title: 'Home',
            logo: {
                alt: 'My Notes Logo',
                src: 'img/HXH.png',
                className: 'custom-logo',
            },
            items: [
                {
                    type: 'docSidebar',
                    sidebarId: 'notesSidebar', // must match sidebars.ts export
                    position: 'left',
                    label: 'Notes',
                },
                {
                    href: 'https://github.com/HnHoussi/my-notes',
                    label: 'GitHub',
                    position: 'right',
                },
            ],
        },

        footer: {
            style: 'dark',
            copyright: `Made with Love © ${new Date().getFullYear()} HN Notes`,
        },

        prism: {
            theme: prismThemes.github,
            darkTheme: prismThemes.dracula,
        },
    } satisfies Preset.ThemeConfig,
};

export default config;
