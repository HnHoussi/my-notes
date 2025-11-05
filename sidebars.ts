import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
    notesSidebar: [
        {
            type: 'category',
            label: 'Frontend',
            items: [
                'frontend/typescript',
                'frontend/react',
                'frontend/nextjs',
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
                        'symfony/services',
                        'symfony/security',
                      ],
                },
            ],
        },
        {
            type: 'category',
            label: 'Testing',
            items: [
                'test/test-types',
                'test/test-frontend',
                'test/test-backend',
            ]
        },
        {
            type: 'category',
            label: 'Github',
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
        {
            type: 'category',
            label: 'Internship',
            items: ['internship/internship-stack']
        },

    ],

};

export default sidebars;
