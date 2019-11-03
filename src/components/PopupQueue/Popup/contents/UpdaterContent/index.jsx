import React, {useState} from 'react'

import styles from './styles.css'
import PropTypes from 'prop-types'
const {ipcRenderer} = global.require('electron')


/**
 * UpdaterContent react component
 */
function UpdaterContent() {

	const [downloadPercent, setDownloadPercent] = useState(0)

	ipcRenderer.on('download-progress', (e, percent) => {
		setDownloadPercent(percent)
	})

	const onAccept = () => {
		ipcRenderer.send('quit-and-install')
	}

	const DownloadingContent = <>
		<div className={styles.title}>{`Загрузка... ${downloadPercent.toFixed(0)}%`}</div>
		<div className={styles.progress_wrapper}>
			<div className={styles.progress} style={{width: `${downloadPercent}%`}} />
		</div>
	</>
	const FetchingContent = <>
		<div className={styles.title}>{'Получаю информацию об обновлении'}</div>
	</>

	const DownloadedContent = <>
		<div className={styles.title}>Загрузка завершена! Установить обновление?</div>
		<button className={styles.decline}>Нет</button>
		<button className={styles.accept} onClick={onAccept}>Да</button>
	</>
	
	return <div>
		{downloadPercent==0? FetchingContent : ''}
		{downloadPercent>0 && downloadPercent < 100? DownloadingContent : ''}
		{downloadPercent==100? DownloadedContent : ''}
	</div>
}

UpdaterContent.propTypes = {
	removeFromQueue: PropTypes.func.isRequired
}

export default UpdaterContent