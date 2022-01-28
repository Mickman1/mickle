let correctWord = 'ABCDE'
let boardState = [...Array(6)].map(e => Array(5))

for (let i = 0; i < 6; i++) {
	var row = `<div class='row' id=row-${i}>`

	document.getElementById('board').insertAdjacentHTML('beforeend', row)
	for (let j = 0; j < 5; j++) {
		var emptySlot = `<div class='slot empty' id='slot-${i}-${j}'></div>`

		document.getElementById(`row-${i}`).insertAdjacentHTML('beforeend', emptySlot)
		boardState[i][j] = document.getElementById(`slot-${i}-${j}`)
	}
}

let currentRow = 0
let currentSlot = 0

document.addEventListener('keypress', function(e) {
	boardState[currentRow] [currentSlot].classList.remove('empty')

	let tile = `<div class='tile'>${e.key}</div>`
	boardState[currentRow] [currentSlot].insertAdjacentHTML('beforeend', tile)

	if (currentSlot === 4) {
		currentRow++
		currentSlot = 0
	}

	else {
		currentSlot += 1
	}
})