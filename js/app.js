let correctWord = 'abcde'
let boardEmptySlots = [...Array(6)].map(e => Array(5))
let boardTiles = [...Array(6)].map(e => Array(5))
let foundLetters = []

for (let i = 0; i < 6; i++) {
	var row = `<div class='row' id=row-${i}>`

	document.getElementById('board').insertAdjacentHTML('beforeend', row)
	for (let j = 0; j < 5; j++) {
		var emptySlot = `<div class='slot empty' id='slot-${i}-${j}'></div>`

		document.getElementById(`row-${i}`).insertAdjacentHTML('beforeend', emptySlot)
		boardEmptySlots[i][j] = document.getElementById(`slot-${i}-${j}`)
	}
}

let currentRow = 0
let currentSlot = 0

document.addEventListener('keydown', function(e) {
	//TODO Check if the key pressed is a letter
	//TODO Check for Enter and Backspace

	switch (e.key) {
		case 'Backspace':
			return backspacePressed();
		case 'Enter':
			return enterPressed();
	}

	// Removes edge-cases like Function and Modifier keys
	if (e.key.length > 1) {
		return;
	}

	// Regex to check for a letter A-Z
	if (!/[A-Za-z]+$/.test(e.key)) {
		return;
	}

	if (currentSlot === 5) {
		return;
	}

	boardEmptySlots[currentRow][currentSlot].classList.remove('empty')
	boardEmptySlots[currentRow][currentSlot].classList.add('temp-tile')

	let tile = `<div class='tile' id='tile-${currentRow}-${currentSlot}'>${e.key}</div>`
	boardEmptySlots[currentRow] [currentSlot].insertAdjacentHTML('beforeend', tile)
	boardTiles[currentRow][currentSlot] = document.getElementById(`tile-${currentRow}-${currentSlot}`)

	currentSlot += 1
})

function backspacePressed() {
	if (currentSlot > 0) {
		boardTiles[currentRow][currentSlot - 1].remove()
		boardEmptySlots[currentRow][currentSlot - 1].classList.add('empty')
		boardEmptySlots[currentRow][currentSlot - 1].classList.remove('temp-tile')
		currentSlot--

		return;
	}
}

function enterPressed() {
	for (let i = 0; i < 5; i++) {
		if (correctWord[i] === boardTiles[currentRow][i].innerHTML) {
			boardTiles[currentRow][i].classList.add('correct-tile')
			boardTiles[currentRow][i].classList.remove('empty')

			boardEmptySlots[currentRow][i].classList.remove('temp-tile')

			foundLetters.push(boardTiles[currentRow][i].innerHTML)

			continue
		}
	}

	for (let i = 0; i < 5; i++) {
		if (foundLetters.includes(boardTiles[currentRow][i].innerHTML)) {
			continue
		}
		if (correctWord.includes(boardTiles[currentRow][i].innerHTML)) {

			boardTiles[currentRow][i].classList.add('misplaced-tile')
			boardTiles[currentRow][i].classList.remove('empty')

			boardEmptySlots[currentRow][i].classList.remove('temp-tile')

			foundLetters.push(boardTiles[currentRow][i].innerHTML)
		}

		else {
			boardTiles[currentRow][i].classList.add('incorrect-tile')
			boardTiles[currentRow][i].classList.remove('empty')

			boardEmptySlots[currentRow][i].classList.remove('temp-tile')
		}
	}

	currentRow++
	currentSlot = 0
	foundLetters = []
}