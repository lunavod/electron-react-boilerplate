import React from 'react'
import ReactDOM from 'react-dom'
import HelloWorld from './components/HelloWorld/index.jsx'

import {useRoot} from 'baobab-react/hooks'

import {hot} from 'react-hot-loader/root'

import tree from './state'

console.log('Hi')

let App = function() {
	const Root = useRoot(tree)

	return <Root >
		<HelloWorld name = 'Lu' />
	</Root>
}

App = hot(App)
ReactDOM.render(<App />,
	document.getElementById('app-entry')
)

if(module.hot) {
	module.hot.accept('./state.js', ()=>location.reload())
}