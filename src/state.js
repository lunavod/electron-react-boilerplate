import Baobab from 'baobab'

const tree = new Baobab({
	versions: {
		electron: process.versions.electron,
		nodejs: process.versions.node,
		chromium: process.versions.chrome
	}
})

export default tree