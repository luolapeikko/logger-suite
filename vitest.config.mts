import type { UserConfig } from 'vite';
import {defineConfig} from 'vitest/config';

export default defineConfig({
	test: {
		reporters: ['minimal', 'github-actions'],
		include: ['packages/**/*.test.ts'],
		coverage: {
			exclude: ['**/dist/**', '**/test/**', '**/*.test-d.ts', '**/index.d.ts'],
			include: ['packages/**/*.ts'],
			provider: 'v8',
			reporter: ['text', 'lcov'],
		},
	},
	resolve: { tsconfigPaths: true },
}) satisfies UserConfig as UserConfig ;
