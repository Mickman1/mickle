document.addEventListener('keypress', function(e) {
	let word = document.getElementById('word')
	if (e.key === 'Enter') {
		word.innerHTML += '<br>'
		return;
	}
	word.innerHTML = word.innerHTML + e.key;
})