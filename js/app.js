let correctWord = 'knife'
let wordList = readTextFile('../words.txt')
let boardEmptySlots = [...Array(6)].map(() => Array(5))
let boardTiles = [...Array(6)].map(() => Array(5))
let filledTiles = []
let unfoundLetters = correctWord
let currentRow = 0
let currentSlot = 0

for (let i = 0; i < 6; i++) {
	var row = `<div class='row' id=row-${i}>`

	document.getElementById('board').insertAdjacentHTML('beforeend', row)
	for (let j = 0; j < 5; j++) {
		var emptySlot = `<div class='slot empty' id='slot-${i}-${j}'></div>`

		document.getElementById(`row-${i}`).insertAdjacentHTML('beforeend', emptySlot)
		boardEmptySlots[i][j] = document.getElementById(`slot-${i}-${j}`)
	}
}

document.addEventListener('keydown', function(e) {
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

	let tile = `<div class='tile' id='tile-${currentRow}-${currentSlot}' data-animation='pop'>${e.key}</div>`
	boardEmptySlots[currentRow] [currentSlot].insertAdjacentHTML('beforeend', tile)
	boardTiles[currentRow][currentSlot] = document.getElementById(`tile-${currentRow}-${currentSlot}`)

	currentSlot += 1
})

document.addEventListener('click', function(e) {
	console.log(e)

	if (e.target.tagName === 'BUTTON') {
		let button = e.target
		console.log(button.innerText)
		/*let buttonId = button.id

		if (buttonId === 'reset') {
			resetGame()
		}

		else if (buttonId === 'submit') {
			submitWord()
		}*/
	}

})

function backspacePressed() {
	if (currentSlot > 0) {
		boardTiles[currentRow][currentSlot - 1].remove()
		boardEmptySlots[currentRow][currentSlot - 1].classList.add('empty')
		boardEmptySlots[currentRow][currentSlot - 1].classList.remove('temp-tile')
		
		currentSlot -= 1

		return;
	}
}

function enterPressed() {
	if (currentSlot !== 5) {
		return;
	}

	let fullSubmittedWord = ''
	for (let i = 0; i < 5; i++) {
		fullSubmittedWord += boardTiles[currentRow][i].innerText
	}
	fullSubmittedWord = fullSubmittedWord.toLowerCase()
	
	if (!wordList.includes(fullSubmittedWord)) {
		alert(`${capitalizeFirstLetter(fullSubmittedWord)} is not a valid word!`)
		return;
	}

	unfoundLetters = correctWord

	for (let i = 0; i < 5; i++) {
		if (correctWord[i] === boardTiles[currentRow][i].innerHTML) {
			boardTiles[currentRow][i].classList.add('correct-tile')
			boardTiles[currentRow][i].classList.remove('empty')
			boardEmptySlots[currentRow][i].classList.remove('temp-tile')

			filledTiles.push(i)
			unfoundLetters = unfoundLetters.replace(boardTiles[currentRow][i].innerHTML, '')

			continue
		}
	}

	for (let i = 0; i < 5; i++) {
		if (filledTiles.includes(i)) {
			continue
		}

		if (unfoundLetters.includes(boardTiles[currentRow][i].innerHTML)) {
			boardTiles[currentRow][i].classList.add('misplaced-tile')
			boardTiles[currentRow][i].classList.remove('empty')
			boardEmptySlots[currentRow][i].classList.remove('temp-tile')

			filledTiles.push(i)
			unfoundLetters = unfoundLetters.replace(boardTiles[currentRow][i].innerHTML, '')
		}

		else {
			boardTiles[currentRow][i].classList.add('incorrect-tile')
			boardTiles[currentRow][i].classList.remove('empty')

			boardEmptySlots[currentRow][i].classList.remove('temp-tile')
		}
	}

	currentRow += 1
	currentSlot = 0
	filledTiles = []
}

function readTextFile(file) {
	fetch(file)
		.then(response => response.text())
		.then(data => {
			wordList = data.split('\n')
		})
}

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}