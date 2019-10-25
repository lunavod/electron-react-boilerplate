import {replace} from 'lodash'

/**
 * Pluralize russian words
 * 
 * @param {number} count count of items
 * @param {Array} words items names - ['(одна) вещь', '(две) вещи' '(пять) вещей']
 */
function pluralize(count, words) {
	var cases = [2, 0, 1, 1, 1, 2]
	return count + ' ' + words[ (count % 100 > 4 && count % 100 < 20) ? 2 : cases[ Math.min(count % 10, 5)] ]
}

/**
 * Converts milliseconds into data object
 * 
 * @param {number} ms milliseconds
 * @param {object} config config object
 */
function convertTime(ms, config) {
	let data = {
		years: 0,
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0
	}

	let secondMS = 1000
	let minuteMS = 60 * secondMS
	let hourMS = 60 * minuteMS
	let dayMS = 24 * hourMS
	let yearMS = 365 * dayMS

	if (ms >= yearMS && config.years) {
		data.years = Math.floor(ms / yearMS)
		ms -= Math.floor(ms / yearMS) * yearMS
	}

	if (ms >= dayMS && config.days) {
		data.days = Math.floor(ms / dayMS)
		ms -= Math.floor(ms / dayMS) * dayMS
	}

	if (ms >= hourMS && config.hours) {
		data.hours = Math.floor(ms / hourMS)
		ms -= Math.floor(ms / hourMS) * hourMS
	}

	if (ms >= minuteMS && config.minutes) {
		data.minutes = Math.floor(ms / minuteMS)
		ms -= Math.floor(ms / minuteMS) * minuteMS
	}

	if (ms >= secondMS && config.seconds) {
		data.seconds = Math.floor(ms / secondMS)
		ms -= Math.floor(ms / secondMS) * minuteMS
	}

	return data
}

/**
 * Formatting time
 * 
 * @param {number} ms time in milliseconds
 * @param {number|boolean} [format] something like 'H M'. S - seconds, M - minutes, H - hours, D - days, Y - years
 * @param {object} [config] config
 */
export default function formatTime(ms, format, config = {
	years: true,
	days: true,
	hours: true,
	minutes: true,
	seconds: true
}) {
	let data = convertTime(ms, config)

	let result = format || ''

	let secondsS = pluralize(data.seconds, ['секунда', 'секунды', 'секунд'])
	let minutesS = pluralize(data.minutes, ['минута', 'минуты', 'минут'])
	let hoursS = pluralize(data.hours, ['час', 'часа', 'часов'])
	let daysS = pluralize(data.days, ['день', 'дня', 'дней'])
	let yearsS = pluralize(data.years, ['год', 'года', 'лет'])

	if (format) {
		result = format
		result = replace(result, 'S', secondsS)
		result = replace(result, 'M', minutesS)
		result = replace(result, 'H', hoursS)
		result = replace(result, 'D', daysS)
		result = replace(result, 'Y', yearsS)
	} else {
		let tmp = []
		if (data.years) tmp.push(yearsS)
		if (data.days) tmp.push(daysS)
		if (data.hours) tmp.push(hoursS)
		if (data.minutes) tmp.push(minutesS)
		if (data.seconds) tmp.push(secondsS)
		result = tmp.join(' ')
	}

	return result
}

window.replace = replace