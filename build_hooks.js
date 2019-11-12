const fs = require('fs')
const {forEach, replace} = require('lodash')

const args = process.argv.slice(2)

function preRelease() {
	console.log('Running pre-build hook')
	forEach(['package.json', 'app/package.json','package-lock.json', 'app/package-lock.json' ], filename => {
		let content = fs.readFileSync(filename, 'utf8')
		content = replace(content, '"name": "TimerDEV"', '"name": "Timer"')
		fs.writeFileSync(filename, content)
	})
	console.log('Pre-build hook done')
}

function postRelease() {
	console.log('Running post-build hook')
	forEach(['package.json', 'app/package.json','package-lock.json', 'app/package-lock.json' ], filename => {
		let content = fs.readFileSync(filename, 'utf8')
		content = replace(content, '"name": "Timer"', '"name": "TimerDEV"')
		fs.writeFileSync(filename, content)
	})
	console.log('Post-build hook done')
}

// postRelease()
if (!args.length) return

switch(args[0]) {
case 'pre':
	preRelease()
	break
case 'post':
	postRelease()
	break
}