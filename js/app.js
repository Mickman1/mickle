let correctWord = generateCorrectWord('./correctWords.json')
let wordList = readWordsFile('./words.json')
let boardEmptySlots = [...Array(6)].map(() => Array(5))
let boardTiles = [...Array(6)].map(() => Array(5))
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

// Event 'keydown' for keyboard presses
// Event 'click' for on-screen keyboard clicks / taps
document.addEventListener('keydown', keyPress)
document.addEventListener('click', keyClick)

function keyPress(e) {
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

	let tile = `<div class='tile' id='tile-${currentRow}-${currentSlot}'>${e.key.toLowerCase()}</div>`
	boardEmptySlots[currentRow][currentSlot].insertAdjacentHTML('beforeend', tile)
	boardEmptySlots[currentRow][currentSlot].setAttribute('data-animation', 'pop')
	boardTiles[currentRow][currentSlot] = document.getElementById(`tile-${currentRow}-${currentSlot}`)

	currentSlot += 1
}

function keyClick(e) {
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
}

function backspacePressed() {
	if (currentSlot > 0) {
		boardTiles[currentRow][currentSlot - 1].remove()

		boardEmptySlots[currentRow][currentSlot - 1].classList.add('empty')
		boardEmptySlots[currentRow][currentSlot - 1].classList.remove('temp-tile')

		boardEmptySlots[currentRow][currentSlot - 1].removeAttribute('data-animation')
		
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
		// Adds 'shake' animation to all 5 tiles
		// Sets timeout to remove them after 600ms
		for (let i = 0; i < 5; i++) {
			boardTiles[currentRow][i].setAttribute('data-animation', 'shake')
			setTimeout(() => {
				boardTiles[currentRow][i].removeAttribute('data-animation')
			}, 600)
		}
		
		toastNum += 1

		generateToast(`${capitalizeFirstLetter(fullSubmittedWord)} is not a valid word!`, 0.05)

		return;
	}

	unfoundLetters = correctWord
	let filledTiles = []
	let tileColorsArray = Array(5)

	for (let i = 0; i < 5; i++) {
		if (correctWord[i] === boardTiles[currentRow][i].innerHTML) {
			// Add correct-tile to array of tiles to flip and color
			tileColorsArray[i] = 'correct-tile'

			// Color correct key green
			let keyElement = document.getElementById(`key-${boardTiles[currentRow][i].innerHTML}`)
			keyElement.classList.remove('key-normal', 'key-misplaced', 'incorrect')
			keyElement.classList.add('key-correct')

			filledTiles.push(i)
			unfoundLetters = unfoundLetters.replace(boardTiles[currentRow][i].innerHTML, '')
		}
	}

	for (let i = 0; i < 5; i++) {
		// Skip tiles that already have an assigned color
		if (filledTiles.includes(i)) {
			continue
		}

		if (unfoundLetters.includes(boardTiles[currentRow][i].innerHTML)) {
			// Add misplaced-tile to array of tiles to flip and color
			tileColorsArray[i] = 'misplaced-tile'
			
			// Color misplaced key yellow
			let keyElement = document.getElementById(`key-${boardTiles[currentRow][i].innerHTML}`)

			if (!keyElement.classList.contains('key-correct')) {
				keyElement.classList.remove('key-normal', 'key-incorrect')
				keyElement.classList.add('key-misplaced')
			}

			filledTiles.push(i)
			unfoundLetters = unfoundLetters.replace(boardTiles[currentRow][i].innerHTML, '')
		}

		else {
			// Add incorrect-tile to array of tiles to flip and color
			tileColorsArray[i] = 'incorrect-tile'

			// Color incorrect key grey
			let keyElement = document.getElementById(`key-${boardTiles[currentRow][i].innerHTML}`)

			if (!keyElement.classList.contains('key-misplaced') && !keyElement.classList.contains('key-correct')) {
				keyElement.classList.remove('key-normal')
				keyElement.classList.add('key-incorrect')
			}
		}
	}

	flipTiles(tileColorsArray, currentRow)

	// If there's no unfound letters left, player pressed Enter with all greens / correct tiles
	if (unfoundLetters === '') {
		winGame(currentRow)

		document.removeEventListener('keydown', keyPress)
		document.removeEventListener('click', keyClick)
	}

	currentRow += 1
	currentSlot = 0
	filledTiles = []
}

// Flip each tile in the current row, and color them on the 'Flip-Out' animation
// Also removes the 'temp-tile' and 'empty' classes
// Delay 250ms between Flip-In and Flip-Out, then 300ms between tiles
function flipTiles(tileColorsArray, row) {
	let delay = 0

	for (let i = 0; i < 5; i++) {
		setTimeout(function() {
			document.getElementById(`slot-${row}-${i}`).setAttribute('data-animation', 'flip-in')
		}, delay)
	
		setTimeout(function() {
			boardEmptySlots[row][i].classList.remove('temp-tile')
			boardTiles[row][i].classList.remove('empty')

			document.getElementById(`slot-${row}-${i}`).setAttribute('data-animation', 'flip-out')

			boardTiles[row][i].classList.add(tileColorsArray[i])
		}, delay + 250)

		delay += 300
	}
}

function winGame(winningRow) {
	let delay = 1667

	for (let i = 0; i < 5; i++) {
		setTimeout(function() {
			document.getElementById(`slot-${winningRow}-${i}`).setAttribute('data-animation', 'bounce')
			
			if (i === 4) {
				let successToastWords = ['Genius!', 'Great!', 'Bravo!']
				let toastWord = successToastWords[Math.floor(Math.random() * successToastWords.length)]

				generateToast(toastWord, 0.035, 1000)
			}
		}, delay)

		delay += 100
	}
}

function generateToast(message, opacityChange, waitTime) {
	let toastDiv = `<div class='toaster' id='game-toaster'></div>`
	document.getElementById('game-container').insertAdjacentHTML('beforeend', toastDiv)
	
	let toast = `<div class='toast' id='toast-${toastNum}'>${message}</div>`
	document.getElementById('game-toaster').insertAdjacentHTML('beforeend', toast)

	setTimeout(() => {
		fadeOutEffect(toastNum, opacityChange)
	}, waitTime)
}

function readWordsFile(file) {
	fetch(file)
		.then(response => response.json())
		.then(data => {
			wordList = data.words
		})
}

function generateCorrectWord(file) {
	fetch(file)
		.then(response => response.json())
		.then(data => {
			let correctWordList = data.correctWords
			correctWord = correctWordList[Math.floor(Math.random() * correctWordList.length)]
		})
}

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

function fadeOutEffect(toastNum, opacityChange = 0.05) {
	var fadeTarget = document.getElementById(`toast-${toastNum}`)
	var fadeEffect = setInterval(function () {
		if (!fadeTarget.style.opacity) {
			fadeTarget.style.opacity = 1
		}

		if (fadeTarget.style.opacity > 0) {
			fadeTarget.style.opacity -= opacityChange
		}

		else {
			clearInterval(fadeEffect)
			document.getElementById(`toast-${toastNum}`).remove()
		}
	}, 100)
}