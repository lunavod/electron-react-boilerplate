import React from 'react'
import ReactDOM from 'react-dom'
import Statistics from './components/Statistics/index.jsx'
import Timers from './components/Timers/index.jsx'

import {useRoot} from 'baobab-react/hooks'
import {hot} from 'react-hot-loader/root'

import './global.css'

import tree from './state'
import monitorStatistics from './services/monitor_statistics'
import tickTimers from './services/tick_timers'

import './fa-library'

;(async () => {
	let timer = await monitorStatistics()
	if (module.hot) {
		module.hot.addDisposeHandler(()=>clearInterval(timer))
	}
})()

;(async () => {
	let timer = await tickTimers(tree)
	if (module.hot) {
		module.hot.addDisposeHandler(()=>clearInterval(timer))
	}
})()

let App = function() {
	const Root = useRoot(tree)

	return <Root >
		<Timers />
		<Statistics />
	</Root>
}

App = hot(App)
ReactDOM.render(<App />,
	document.getElementById('app-entry')
)

if(module.hot) {
	module.hot.accept('./state.js', ()=>location.reload())
}