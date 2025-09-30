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
            ],
        },
        {
            type: 'category',
            label: 'Backend',
            items: [
                'backend/nodejs',
                'backend/expressjs',
                'backend/postgresql',
                'backend/symfony',
                'backend/api-platform',
            ],
        },
        {
            type: 'category',
            label: 'Projects',
            items: [
                'projects/project1',
                'projects/project2',
                'projects/project3',
            ],
        },
    ],
};

export default sidebars;
