const resourceName = 'moritz_radial';

let mainButtons = [];
let currentMenu = null; // main | personal | vehicle | job | extras | inputs
let currentSlices = [];
let selectedIndex = 0;
let pendingInput = null;

const root          = document.getElementById('radial-root');
const mainMenu      = document.getElementById('main-menu');
const subMenu       = document.getElementById('sub-menu');
const extrasMenu    = document.getElementById('extras-menu');
const subSlices     = document.getElementById('sub-slices');
const extrasSlices  = document.getElementById('extras-slices');
const subLogo       = document.getElementById('sub-logo');
const extrasLogo    = document.getElementById('extras-logo');
const inputPanel    = document.getElementById('input-panel');
const inputFieldsEl = document.getElementById('input-fields');
const btnCancel     = document.getElementById('btn-cancel');
const btnSubmit     = document.getElementById('btn-submit');

function closeAll() {
    root.classList.add('hidden');
    mainMenu.classList.add('hidden');
    subMenu.classList.add('hidden');
    extrasMenu.classList.add('hidden');
    inputPanel.classList.add('hidden');
    currentMenu = null;
    currentSlices = [];
    selectedIndex = 0;
    pendingInput = null;
}

window.addEventListener('message', (event) => {
    const data = event.data;
    if (!data || !data.action) return;

    try {
        switch (data.action) {
            case 'openMain':
                root.classList.remove('hidden');
                showMain(data.mainButtons || []);
                break;
            case 'openSub':
                showSubmenu(data.menuType, data.logo, data.items || []);
                break;
            case 'openExtras':
                showExtras(data.logo, data.extras || []);
                break;
            case 'openInputs':
                showInputs(data.menuType, data.index, data.fields || []);
                break;
            case 'closeAll':
                closeAll();
                break;
        }
    } catch (e) {
        console.log('radial error', e);
    }
});

/* MAIN MENU */

function showMain(buttons) {
    mainButtons = buttons;
    currentMenu = 'main';

    const btnElems = document.querySelectorAll('.main-btn');
    btnElems.forEach((el, i) => {
        const cfg = buttons[i];
        el.innerHTML = '';
        if (cfg) {
            const img = document.createElement('img');
            img.src = cfg.icon;
            el.appendChild(img);
            el.dataset.menuId = cfg.id;
            el.style.display = 'flex';
        } else {
            el.style.display = 'none';
            el.dataset.menuId = '';
        }
        el.classList.remove('keyboard-selected');
    });

    selectedIndex = 0;
    if (buttons[0]) {
        btnElems[0].classList.add('keyboard-selected');
    }

    mainMenu.classList.remove('hidden');
    subMenu.classList.add('hidden');
    extrasMenu.classList.add('hidden');
    inputPanel.classList.add('hidden');
}

/* SUB / EXTRAS */

function showSubmenu(menuType, logo, items) {
    currentMenu = menuType;
    mainMenu.classList.add('hidden');
    extrasMenu.classList.add('hidden');
    inputPanel.classList.add('hidden');

    subLogo.src = logo || '';
    buildSlices(subSlices, items, menuType);
    subMenu.classList.remove('hidden');
}

function showExtras(logo, extras) {
    currentMenu = 'extras';
    mainMenu.classList.add('hidden');
    subMenu.classList.add('hidden');
    inputPanel.classList.add('hidden');

    extrasLogo.src = logo || '';
    const items = extras.map(e => ({
        index: e.idx,
        label: e.label,
        extraId: e.idx
    }));
    buildSlices(extrasSlices, items, 'extras');
    extrasMenu.classList.remove('hidden');
}

function buildSlices(container, items, menuType) {
    container.innerHTML = '';
    currentSlices = items || [];
    selectedIndex = 0;

    const count = currentSlices.length;
    if (!count) return;

    const step = 360 / count;

    currentSlices.forEach((item, i) => {
        const angle = 0 + step * i; // Start nach rechts

        const slice = document.createElement('div');
        slice.className = 'slice';

        const inner = document.createElement('div');
        inner.className = 'slice-inner';

        const label = document.createElement('span');
        label.innerText = item.label || '';

        // Rotationswert aus Config (0 / 90 / -90)
        const rot = item.rotation || 0;
        label.style.transform = `rotate(${rot}deg)`;
	
	// kleinen seitlichen Offset je nach Rotation setzen
	label.style.marginLeft  = '0';
	label.style.marginRight = '0';

	if (rot === 90) {
	    // Text etwas nach rechts schieben
 	   label.style.marginLeft = '1.2vh';
	} else if (rot === -90) {
 	   // Text etwas nach links schieben
 	   label.style.marginRight = '1.2vh';
	}


        inner.appendChild(label);
        slice.appendChild(inner);

        slice.dataset.menuType = menuType;
        slice.dataset.index    = item.index;

        // Rotation um Kreiszentrum
        slice.style.transform = `rotate(${angle}deg)`;

        // Fontsize nach Länge des Texts
        const len = (item.label || '').length;
        let fontSize = 1.5;
        if (len > 10) fontSize = 1.3;
        if (len > 18) fontSize = 1.1;
        inner.style.fontSize = fontSize + 'vh';

        // Klick
        inner.addEventListener('click', () => {
            clickSlice(i);
        });

        // Maus-Hover (überschreibt Keyboard-Highlight)
        inner.addEventListener('mouseenter', () => {
            const allSlices = container.querySelectorAll('.slice');
            allSlices.forEach(el => el.classList.remove('mouse-selected'));
            slice.classList.add('mouse-selected');
        });

        inner.addEventListener('mouseleave', () => {
            slice.classList.remove('mouse-selected');
            highlightSlice();
        });

        container.appendChild(slice);
    });

    highlightSlice();
}

/* INPUT PANEL */

function showInputs(menuType, index, fields) {
    currentMenu  = 'inputs';
    pendingInput = { menuType, index, fields };

    inputPanel.classList.remove('hidden');
    inputFieldsEl.innerHTML = '';

    const labels = {
        id:   "ID",
        text: "Value 1",
        text2:"Value 2"
    };

    (fields || []).forEach((f, idx) => {
        const wrap = document.createElement('div');
        wrap.className = 'input-field';

        const label = document.createElement('label');
        label.innerText = labels[f] || `Value ${idx + 1}`;

        const inp = document.createElement('input');
        inp.dataset.field = `value${idx + 1}`;
        inp.type = (f === 'id') ? 'number' : 'text';

        wrap.appendChild(label);
        wrap.appendChild(inp);
        inputFieldsEl.appendChild(wrap);
    });

    const first = inputFieldsEl.querySelector('input');
    if (first) first.focus();
}

/* MAIN BTN MOUSE */

document.querySelectorAll('.main-btn').forEach((el, index) => {
    el.addEventListener('click', () => {
        const cfg = mainButtons[index];
        if (!cfg) return;
        fetch(`https://${resourceName}/openMenu`, {
            method: 'POST',
            body: JSON.stringify({ menuId: cfg.id })
        });
    });
});

/* INPUT BTN */

btnCancel.addEventListener('click', () => {
    if (!pendingInput) return;
    fetch(`https://${resourceName}/cancelInputs`, {
        method: 'POST',
        body: JSON.stringify({ menuType: pendingInput.menuType })
    });
});

btnSubmit.addEventListener('click', () => {
    if (!pendingInput) return;

    // Werte als Objekt schicken, damit Lua schöne "1","2","3"-Keys bekommt
    const vals = {};
    const inputs = inputFieldsEl.querySelectorAll('input');

    inputs.forEach((inp, idx) => {
        const key = String(idx + 1);      // "1", "2", "3"
        vals[key] = inp.value || "";
    });

    fetch(`https://moritz_radial/submitInputs`, {
        method: 'POST',
        body: JSON.stringify({
            menuType: pendingInput.menuType,
            index:    pendingInput.index,
            values:   vals
        })
    });
});

/* SLICES */

function clickSlice(posIndex) {
    const item = currentSlices[posIndex];
    if (!item) return;

    if (currentMenu === 'extras') {
        fetch(`https://${resourceName}/toggleExtra`, {
            method: 'POST',
            body: JSON.stringify({ idx: item.extraId })
        });
        return;
    }

    fetch(`https://${resourceName}/selectSlice`, {
        method: 'POST',
        body: JSON.stringify({
            menuType: currentMenu,
            index: item.index
        })
    });
}

/* KEYBOARD */

window.addEventListener('keydown', (e) => {
    if (!currentMenu) return;

    if (currentMenu === 'inputs') {
        if (e.key === 'Escape') {
            btnCancel.click();
            e.preventDefault();
        } else if (e.key === 'Enter') {
            btnSubmit.click();
            e.preventDefault();
        }
        return;
    }

    if (e.key === 'Escape') {
        fetch(`https://${resourceName}/close`, {
            method: 'POST',
            body: JSON.stringify({})
        });
        e.preventDefault();
        return;
    }

    if (currentMenu === 'main') {
        const total = mainButtons.length;
        if (!total) return;

        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            selectedIndex = (selectedIndex + 1) % total;
            updateMainHighlight();
            e.preventDefault();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            selectedIndex = (selectedIndex - 1 + total) % total;
            updateMainHighlight();
            e.preventDefault();
        } else if (e.key === 'Enter') {
            const cfg = mainButtons[selectedIndex];
            if (cfg) {
                fetch(`https://${resourceName}/openMenu`, {
                    method: 'POST',
                    body: JSON.stringify({ menuId: cfg.id })
                });
            }
            e.preventDefault();
        }
        return;
    }

    const totalSlices = currentSlices.length;
    if (!totalSlices) return;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        selectedIndex = (selectedIndex + 1) % totalSlices;
        highlightSlice();
        e.preventDefault();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        selectedIndex = (selectedIndex - 1 + totalSlices) % totalSlices;
        highlightSlice();
        e.preventDefault();
    } else if (e.key === 'Enter') {
        clickSlice(selectedIndex);
        e.preventDefault();
    }
});

function updateMainHighlight() {
    const btnElems = document.querySelectorAll('.main-btn');
    btnElems.forEach((el, i) => {
        if (i === selectedIndex) el.classList.add('keyboard-selected');
        else el.classList.remove('keyboard-selected');
    });
}

function highlightSlice() {
    const container = (currentMenu === 'extras') ? extrasSlices : subSlices;
    const sliceEls = container.querySelectorAll('.slice');
    sliceEls.forEach((el, i) => {
        if (i === selectedIndex) el.classList.add('keyboard-selected');
        else el.classList.remove('keyboard-selected');
    });
}
