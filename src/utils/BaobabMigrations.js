import storage from '../utils/BetterLocalStorage'

import Logger from '../utils/Logger'

const log = (new Logger({
	migrations_progress: true
})).log

export default function setUpMigrations(tree, migrations) {
	let storeVersion = storage.get('__store_version') || 0
	for (let migration of migrations) {
		if (migration.version <= storeVersion) continue
		log('migrations_progress', [migration.description])
		migration.up(tree)
		log('migrations_progress', ['Done!'])
		storeVersion = migration.version
	}
	storage.set('__store_version', storeVersion)
}