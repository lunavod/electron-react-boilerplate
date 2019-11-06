/**
 * Baobab action - sets day. If day is null, Statistics component will use current date,
 * so instead of setting current date, set null.
 * 
 * @param {object} tree Baobab tree
 * @param {string|null} day new day
 */
export function setDay(tree, day) {
	tree.select('statistics_day').set(day)
}