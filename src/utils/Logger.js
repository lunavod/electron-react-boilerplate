/*eslint no-console: ["error", { allow: ["log", "warn", "error"] }] */
export default class Logger {
	config = {}

	constructor(config) {
		this.config = config
	}

	/**
	 * Log data
	 * 
	 * @param {string} type log type
	 * @param {Array} data data to log
	 */
	log = (type, data) => {
		if (!this.config[type]) return

		console.log(...data)
	}
}