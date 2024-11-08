/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
	preset: 'ts-jest',
	testEnvironment: "node",
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/src/$1', // Mapeia '@' para a pasta 'src'
	},
	testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
	transform: {
		"^.+.tsx?$": ["ts-jest", {}],
	},
};