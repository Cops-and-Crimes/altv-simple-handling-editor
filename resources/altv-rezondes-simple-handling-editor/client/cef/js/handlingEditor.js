const container = document.getElementById('container');

function createItem(key, value) {
    let itemElement = document.createElement('div');
    itemElement.classList.add('case');

    let titleElement = document.createElement('h1');
    titleElement.textContent = key;

    let valueElement = document.createElement('input');
    valueElement.type = 'number';
    valueElement.value = value;

    valueElement.addEventListener('change', (element) => {
        onChangeEvent(key, element);
    });

    itemElement.appendChild(titleElement);
    itemElement.appendChild(valueElement);

    container.appendChild(itemElement);
}

function onChangeEvent(key, element) {
    if ('alt' in window) {
        alt.emit('Client:HandlingEditor:Sync', key, element.target.value);
    }
}

if ('alt' in window) {
    alt.on('CEF:HandlingEditor:Init', (data) => {
        data.forEach((element) => {
            createItem(element.key, element.value);
        });
    });
}

setTimeout(() => {
    if ('alt' in window) {
        alt.emit('Client:HandlingEditor:Ready');
    }
}, 1500);
