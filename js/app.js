let correctWord = 'parry'
let wordList = readTextFile('../words.json')
let boardEmptySlots = [...Array(6)].map(() => Array(5))
let boardTiles = [...Array(6)].map(() => Array(5))
let filledTiles = []
let unfoundLetters = correctWord
let currentRow = 0
let currentSlot = 0
let toastNum = 0

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

	let tile = `<div class='tile' id='tile-${currentRow}-${currentSlot}' data-animation='pop'>${e.key.toLowerCase()}</div>`
	boardEmptySlots[currentRow][currentSlot].insertAdjacentHTML('beforeend', tile)
	boardTiles[currentRow][currentSlot] = document.getElementById(`tile-${currentRow}-${currentSlot}`)

	currentSlot += 1
})

document.addEventListener('click', function(e) {
	if (e.target.id == 'backspace') {
		backspacePressed()
		return;
	}

	if (e.target.tagName === 'BUTTON') {
		let button = e.target

		if (button.innerText === 'ENTER') {
			enterPressed()
			return;
		}

		// Emulate a key press for the right on-screen keyboard button
		document.dispatchEvent(new KeyboardEvent('keydown', { 'key': button.innerText.toLowerCase() }))
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
	// Check if all 5 letters have been filled
	if (currentSlot !== 5) {
		return;
	}

	let fullSubmittedWord = ''
	for (let i = 0; i < 5; i++) {
		fullSubmittedWord += boardTiles[currentRow][i].innerText
	}
	
	fullSubmittedWord = fullSubmittedWord.toLowerCase()
	
	// Check if submitted word is in the wordList
	if (!wordList.includes(fullSubmittedWord)) {
		//alert(`${capitalizeFirstLetter(fullSubmittedWord)} is not a valid word!`)

		// Adds 'shake' animation to all 5 tiles
		// Sets timeout to remove them after 600ms
		for (let i = 0; i < 5; i++) {
			boardTiles[currentRow][i].setAttribute('data-animation', 'shake')
			setTimeout(() => {
				boardTiles[currentRow][i].removeAttribute('data-animation')
			}, 600)
		}
		
		toastNum += 1

		let toastDiv = `<div class='toaster' id='game-toaster'></div>`
		document.getElementById('game-container').insertAdjacentHTML('beforeend', toastDiv)
		
		let toast = `<div class='toast' id='toast-${toastNum}'>${capitalizeFirstLetter(fullSubmittedWord)} is not a valid word!</div>`
		document.getElementById('game-toaster').insertAdjacentHTML('beforeend', toast)

		fadeOutEffect(toastNum)

		return;
	}

	unfoundLetters = correctWord

	for (let i = 0; i < 5; i++) {
		if (correctWord[i] === boardTiles[currentRow][i].innerHTML) {
			// Color correct tile green
			boardTiles[currentRow][i].classList.add('correct-tile')

			// Color correct key green
			let keyElement = document.getElementById(`key-${boardTiles[currentRow][i].innerHTML}`)
			keyElement.classList.remove('key-normal', 'key-misplaced', 'incorrect')
			keyElement.classList.add('key-correct')

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
			// Color misplaced tile yellow
			boardTiles[currentRow][i].classList.add('misplaced-tile')
			
			// Color misplaced key yellow
			let keyElement = document.getElementById(`key-${boardTiles[currentRow][i].innerHTML}`)

			if (!keyElement.classList.contains('key-correct')) {
				keyElement.classList.remove('key-normal', 'key-incorrect')
				keyElement.classList.add('key-misplaced')
			}

			boardTiles[currentRow][i].classList.remove('empty')
			boardEmptySlots[currentRow][i].classList.remove('temp-tile')

			filledTiles.push(i)
			unfoundLetters = unfoundLetters.replace(boardTiles[currentRow][i].innerHTML, '')
		}

		else {
			// Color incorrect tile grey
			boardTiles[currentRow][i].classList.add('incorrect-tile')

			// Color incorrect key grey
			let keyElement = document.getElementById(`key-${boardTiles[currentRow][i].innerHTML}`)

			if (!keyElement.classList.contains('key-misplaced') && !keyElement.classList.contains('key-correct')) {
				keyElement.classList.remove('key-normal')
				keyElement.classList.add('key-incorrect')
			}

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
		.then(response => response.json())
		.then(data => {
			wordList = data.words
		})
}

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

function fadeOutEffect(toastNum) {
	var fadeTarget = document.getElementById(`toast-${toastNum}`)
	var fadeEffect = setInterval(function () {
		if (!fadeTarget.style.opacity) {
			fadeTarget.style.opacity = 1
		}

		if (fadeTarget.style.opacity > 0) {
			fadeTarget.style.opacity -= 0.05
		}

		else {
			clearInterval(fadeEffect)
			document.getElementById(`toast-${toastNum}`).remove()
		}
	}, 100)
}