// import React from 'react'
import React from 'react'
import styles from './styles.css'
import {useBranch} from 'baobab-react/hooks'
import PropTypes from 'prop-types'

function HelloWorld({name}) {
	const {versions} = useBranch({
		versions: ['versions']
	})

	return <div className={styles.main}>
		<h1>Hello, {name}!</h1>
		<p>This is your boilerplate with <b>Electron</b>, <b>React</b> and <b>Baobab</b>. And, you know, <b>HMR</b> and stuff.</p>
		<p>It uses Electron <b>v{versions.electron}</b>, NodeJS <b>v{versions.nodejs}</b> and Chromium <b>v{versions.chromium}</b><br/></p>
		<p>Have fun with this project! ^^</p>
	</div>
}

HelloWorld.propTypes = {
	name: PropTypes.string.isRequired
}

export default HelloWorld