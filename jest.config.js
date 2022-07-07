const { pathsToModuleNameMapper } = require('ts-jest/utils')
const { compilerOptions } = require('./tsconfig.paths.json')
module.exports = {
    projects: [
        {
            displayName: 'Unit-Tests',
            roots: ['<rootDir>'],
            testMatch: [
                '**/__tests__/**/*.+(ts|tsx|js)',
                '**/?(*.)+(unit.)+(spec|test).+(ts|tsx|js)',
            ],
            transform: {
                '^.+\\.(ts|tsx)$': 'ts-jest',
            },
            collectCoverageFrom: [
                '**/*.{js,jsx,ts,tsx}',
                '!**/*.d.ts',
                '!**/node_modules/**',
                '!.serverless/**',
                '!.webpack/**',
            ],
            moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
                prefix: '<rootDir>/',
            }),
            globals: {
                'ts-jest': {
                    tsconfig: 'tsconfig.json',
                },
            },
        },
        {
            displayName: 'Intg-Tests',
            roots: ['<rootDir>'],
            testMatch: [
                '**/__tests__/**/*.+(ts|tsx|js)',
                '**/?(*.)+(intg.)+(spec|test).+(ts|tsx|js)',
            ],
            transform: {
                '^.+\\.(ts|tsx)$': 'ts-jest',
            },
            collectCoverageFrom: [
                '**/*.{js,jsx,ts,tsx}',
                '!**/*.d.ts',
                '!**/node_modules/**',
                '!.serverless/**',
                '!.webpack/**',
            ],
            moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
                prefix: '<rootDir>/',
            }),
            globals: {
                'ts-jest': {
                    tsconfig: 'tsconfig.json',
                },
            },
        },
    ],
}
