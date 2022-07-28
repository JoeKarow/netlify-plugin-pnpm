/* eslint-disable no-unused-vars */
import { detect } from 'detect-package-manager'
const plugin = {
	async onPreBuild({
		constants: { IS_LOCAL },
		utils: { build, status, cache, run },
	}) {
		try {
			if (IS_LOCAL) {
				status.show({
					summary: 'Skipping plugin - netlify-cli is being used locally',
				})
				return
			}
			if ((await detect()) === 'pnpm') {
				// console.info('Restoring cached packages...')
				// await cache.restore('./node_modules/.pnpm')
				console.info('Fetching packages...')
				await run.command('npx pnpm fetch')
				console.info('Running install...')
				await run('npx', ['pnpm', 'install', '--offline'], {
					env: { CI: true },
				})
				console.info('Cleaning up package cache...')
				await run.command('npx pnpm prune')
				// console.info('Caching package store...')
				// await cache.save('./node_modules/.pnpm')
			} else {
				build.failPlugin('pnpm not detected!')
			}
		} catch (error) {
			if (error instanceof Error) {
				build.failBuild('Error message', { error })
			}
		}
		status.show({ summary: 'pnpm install succeeded!' })
	},
}
export default plugin
