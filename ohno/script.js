let ohno = document.getElementById('ohno');
let i = 0;
let x = 0;

ohno.onclick = function rotateText() {
	let textohno = document.getElementById('textohno');
	i++;
	x++;
	if (x === 20) {
		textohno.innerHTML = '<span>O</span><span>h</span><span>&nbsp</span><span>y</span><span>e</span><span>s</span>';
	}
	switch (i) {
		case 1: // good
			textohno.style.alignItems = 'flex-end';
			textohno.style.flexDirection = 'column';
			textohno.style.justifyContent = 'flex-start';
			break;
		case 2: 
			textohno.style.alignItems = 'flex-end';
			textohno.style.flexDirection = 'row-reverse';
			textohno.style.justifyContent = 'flex-start';
			break;
		case 3: // good
			textohno.style.alignItems = 'flex-start';
			textohno.style.flexDirection = 'column-reverse';
			textohno.style.justifyContent = 'flex-start';
			break;
		case 4:
			textohno.style.alignItems = 'flex-start';
			textohno.style.flexDirection = 'row';
			textohno.style.justifyContent = 'flex-start';
			i = 0;
			break;
	}

}