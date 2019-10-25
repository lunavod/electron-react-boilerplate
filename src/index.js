import React from 'react'
import ReactDOM from 'react-dom'
import Statistics from './components/Statistics/index.jsx'

import {useRoot} from 'baobab-react/hooks'
import {hot} from 'react-hot-loader/root'

import './global.css'

import tree from './state'
import monitorStatistics from './services/monitor_statistics'

;(async () => {
	let timer = await monitorStatistics()
	if (module.hot) {
		module.hot.addDisposeHandler(()=>clearInterval(timer))
	}
})()

let App = function() {
	const Root = useRoot(tree)

	return <Root >
		<Statistics />
		{/*<HelloWorld name = 'Lu' />*/}
	</Root>
}

App = hot(App)
ReactDOM.render(<App />,
	document.getElementById('app-entry')
)

if(module.hot) {
	module.hot.accept('./state.js', ()=>location.reload())
}