/**
 * Baobab actions - adds new popup to the list
 * 
 * @param {object} tree Baobab tree
 * @param {*} data data for new popup
 */
export function addPopup(tree, data) {
	let id = parseInt(tree.select(['popupQueue', 'lastId']).get())+1
	tree.select(['popupQueue', 'popups']).push({id: id, ...data})
	tree.select(['popupQueue', 'lastId']).set(id)
}

/**
 * Baobab action - shifts popup
 * 
 * @param {object} tree Baobab tree
 */
export function shiftPopup(tree) {
	tree.select(['popupQueue', 'popups']).shift()
}