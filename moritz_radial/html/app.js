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
const extrasList    = document.getElementById('extras-list');
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

function normalizeBool(v) {
    // akzeptiert: true/false, 1/0, "1"/"0", "true"/"false"
    if (v === true) return true;
    if (v === false) return false;
    if (v === 1) return true;
    if (v === 0) return false;
    if (typeof v === 'string') {
        const s = v.trim().toLowerCase();
        if (s === 'true' || s === '1' || s === 'on' || s === 'ein') return true;
        if (s === 'false' || s === '0' || s === 'off' || s === 'aus') return false;
    }
    return false;
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

    // extras kommt als [{ idx, label, on }]
    currentSlices = (extras || []).map((e, i) => {
        const extraId = (e && (e.idx ?? e.id ?? e.extraId)) ?? (i + 1);
        const onVal   = (e && (e.on ?? e.enabled ?? e.state)) ?? false;
        return {
            index: i + 1,
            extraId: Number(extraId),
            label: (e && e.label) ? String(e.label) : `Extra ${extraId}`,
            on: normalizeBool(onVal)
        };
    });

    selectedIndex = 0;
    buildExtrasList();
    extrasMenu.classList.remove('hidden');
}

function buildExtrasList() {
    extrasList.innerHTML = '';

    if (!currentSlices || currentSlices.length === 0) return;

    currentSlices.forEach((item, i) => {
        const row = document.createElement('div');
        row.className = 'extras-row';
        row.dataset.index = String(i);

        const left = document.createElement('div');
        left.className = 'left';

        const dot = document.createElement('div');
        dot.className = 'status-dot ' + (item.on ? 'on' : 'off');

        const label = document.createElement('div');
        label.className = 'label';
        label.innerText = item.label || '';

        left.appendChild(dot);
        left.appendChild(label);

        const state = document.createElement('div');
        state.className = 'state';
        state.innerText = item.on ? 'EIN' : 'AUS';

        row.appendChild(left);
        row.appendChild(state);

        row.addEventListener('click', () => clickSlice(i));

        row.addEventListener('mouseenter', () => {
            selectedIndex = i;
            highlightSlice();
        });

        extrasList.appendChild(row);
    });

    highlightSlice();
}

function buildSlices(container, items, menuType) {
    container.innerHTML = '';
    currentSlices = items || [];
    selectedIndex = 0;

    const count = currentSlices.length;
    if (!count) return;

    const step = 360 / count;

    currentSlices.forEach((item, i) => {
        const angle = 0 + step * i;

        const slice = document.createElement('div');
        slice.className = 'slice';

        const inner = document.createElement('div');
        inner.className = 'slice-inner';

        const label = document.createElement('span');
        label.innerText = item.label || '';

        const rot = item.rotation || 0;
        label.style.transform = `rotate(${rot}deg)`;

        label.style.marginLeft  = '0';
        label.style.marginRight = '0';
        if (rot === 90) {
            label.style.marginLeft = '1.2vh';
        } else if (rot === -90) {
            label.style.marginRight = '1.2vh';
        }

        inner.appendChild(label);
        slice.appendChild(inner);

        slice.dataset.menuType = menuType;
        slice.dataset.index    = item.index;

        slice.style.transform = `rotate(${angle}deg)`;

        const len = (item.label || '').length;
        let fontSize = 1.5;
        if (len > 10) fontSize = 1.3;
        if (len > 18) fontSize = 1.1;
        inner.style.fontSize = fontSize + 'vh';

        inner.addEventListener('click', () => {
            clickSlice(i);
        });

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

    const vals = {};
    const inputs = inputFieldsEl.querySelectorAll('input');

    inputs.forEach((inp, idx) => {
        const key = String(idx + 1);
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
        // UI sofort flippen (fühlt sich besser an)
        item.on = !item.on;
        buildExtrasList();

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
    if (currentMenu === 'extras') {
        const rows = extrasList.querySelectorAll('.extras-row');
        rows.forEach((el, i) => {
            if (i === selectedIndex) el.classList.add('keyboard-selected');
            else el.classList.remove('keyboard-selected');
        });

        const sel = rows[selectedIndex];
        if (sel && sel.scrollIntoView) {
            sel.scrollIntoView({ block: 'nearest' });
        }
        return;
    }

    const container = subSlices;
    const sliceEls = container.querySelectorAll('.slice');
    sliceEls.forEach((el, i) => {
        if (i === selectedIndex) el.classList.add('keyboard-selected');
        else el.classList.remove('keyboard-selected');
    });
}
