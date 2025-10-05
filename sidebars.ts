import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
    notesSidebar: [
        {
            type: 'category',
            label: 'Frontend',
            items: [
                'frontend/react',
                'frontend/nextjs',
                'frontend/typescript',
                'frontend/angularjs',
            ],
        },
        {
            type: 'category',
            label: 'Backend',
            items: [
                'backend/nodejs',
                'backend/expressjs',
                'backend/postgresql',
                'backend/api-platform',
                {
                    type: 'category',
                    label: 'Symfony',
                    items: [
                        'symfony/introduction',   
                        'symfony/installation',
                        'symfony/project-workflow',
                        'symfony/mvc',
                        'symfony/model',
                        'symfony/view',
                        'symfony/controller',
                        'symfony/form',
                        'symfony/routing',
                        'symfony/services',
                        'symfony/security',
                      ],
                },
            ],
        },
        {
            type: 'category',
            label: 'Github guide',
            items: [
                'github/work-in-group',
                'github/useful-commands',
            ],
        },
        {
            type: 'category',
            label: 'Projects',
            items: [
                'projects/task-manager',
                'projects/cv-ai-assistant',
            ],
        },
    ],
};

export default sidebars;
