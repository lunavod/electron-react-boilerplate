/**
 * Baobab actions - adds item to blackList
 * 
 * @param {object} tree Baobab tree
 * @param {string} item new blackList item
 */
export function addBlackListItem(tree, item) {
	tree.select(['blackList']).push(item)
}

/**
 * Baobab actions - removes item from blackList
 * 
 * @param {object} tree Baobab tree
 * @param {number} index index of item in black list
 */
export function removeBlackListItem(tree, index) {
	tree.select(['blackList']).splice([index, 1])
}

/**
 * Baobab actions -  updates blackList item
 * 
 * @param {object} tree Baobab tree
 * @param {number} index index of item in black list
 * @param {string} newValue new value for item
 */
export function updateBlackListItem(tree, index, newValue) {
	tree.select(['blackList', index]).set(newValue)
}