let container = document.querySelector('.container');

const objList = {
  name: 'New fruit',
  allItems: ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry']
};

createList(container, objList);

function createList(container, optionLists) {
  let allItems = optionLists.allItems;
  let allItemsHtml = allItems.map(item => `<li>${item}</li>`).join('');
  render(container);

  let listWrapper = container.querySelector('.wrapper');
  let itemsRow = listWrapper.querySelector('.itemsRow');
  let listSelecedItems = itemsRow.querySelector('.selectedItems');
  let optionItems = listWrapper.querySelector('.optionsItems');
  let autoInput = itemsRow.querySelector('.autoInput');
  let inputLabel = listWrapper.querySelector('label');
  let deboFilterAllItems = debounce(filterAllItems, 500);
  let currentSelecedItem;

  autoInput.addEventListener('focus', () => {
    listWrapper.classList.add('active');
    inputLabel.classList.add('shift');
    positionOptionItems();
    optionItems.addEventListener('mousedown', selectItem);
  });

  autoInput.addEventListener('blur', () => {
    listWrapper.classList.remove('active');
    optionItems.classList.add('hidden');
    labelShift();
    optionItems.removeEventListener('mousedown', selectItem);
  });

  listSelecedItems.addEventListener('click', deleteItem);
  autoInput.addEventListener('input', deboFilterAllItems);
  autoInput.addEventListener('keydown', keyboardInteraction);

  function keyboardInteraction(event) {
    let objKeys = {
      ArrowDown: moveInList,
      ArrowUp: moveInList,
      ArrowLeft: moveInList,
      ArrowRight: moveInList,
      Backspace: keyboarDelete,
      Enter: addItem,
      Escape: cancelSeleced
    }
    let currentFunction = objKeys[event.key];

    if (currentFunction) {
      currentFunction(event);
    }
  }

  function cancelSeleced() {
    optionItems.classList.add('hidden');
    if (currentSelecedItem) {
      currentSelecedItem.classList.remove('keyboardSelect');
    }
    currentSelecedItem = '';
  }

  function addItem(event) {
    if (autoInput.value) {
      selectItem(event, autoInput.value);
    }
    if (currentSelecedItem && !currentSelecedItem.childElementCount) {
      selectItem(event, currentSelecedItem.textContent);
    }
  }

  function keyboarDelete(event) {
    if (currentSelecedItem && currentSelecedItem.childElementCount) {
      currentSelecedItem.remove();
      currentSelecedItem = '';
    } else if (!autoInput.value && listSelecedItems.childElementCount) {
      moveInList(event, listSelecedItems);
    }
  }

  function moveInList(event, list) {
    if (!optionItems.childElementCount) {
      return;
    }

    let currentListElement = list || optionItems;

    if (currentSelecedItem && currentSelecedItem.childElementCount) {
      currentListElement = listSelecedItems;
    }

    currentList = currentListElement.querySelectorAll('li');
    autoInput.value = '';

    if (event.key === 'Backspace' && !currentSelecedItem) {
      currentSelecedItem = currentListElement.lastElementChild;
    }

    if (currentSelecedItem) {
      currentSelecedItem.classList.remove('keyboardSelect');

      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
        if (currentSelecedItem === currentListElement.lastElementChild) {
          currentSelecedItem = currentListElement.firstElementChild;
        } else {
          currentSelecedItem = currentSelecedItem.nextElementSibling;
        }
      } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
        if (currentSelecedItem === currentListElement.firstElementChild) {
          currentSelecedItem = currentListElement.lastElementChild;
        } else {
          currentSelecedItem = currentSelecedItem.previousElementSibling;
        }
      }
      
    } else {
      optionItems.classList.remove('hidden');
      positionOptionItems();

      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
        currentSelecedItem = currentListElement.firstElementChild;
      } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
        currentSelecedItem = currentListElement.lastElementChild;
      }
    }

    if (currentSelecedItem) {
      currentSelecedItem.classList.add('keyboardSelect');
    }
  }

  function filterAllItems() {
    optionItems.innerHTML = allItemsHtml;
    optionItems.innerHTML = Array.from(optionItems.querySelectorAll('li'))
      .filter((el) => {
        return (el.textContent
                  .toLowerCase()
                  .indexOf(autoInput.value.toLowerCase()) < 0) ? false : true;
      })
      .map((sortEl) => {
        return sortEl.outerHTML;
      })
      .join('');

    positionOptionItems();
    if (optionItems.childElementCount) {
      optionItems.classList.remove('hidden');
    } else {
      optionItems.classList.add('hidden');
    }
  }

  function labelShift() {
    if (!listSelecedItems.childElementCount && !autoInput.value) {
      inputLabel.classList.remove('shift');
    }
    if (autoInput.value) {
      inputLabel.classList.add('shift');
    }
  }

  function debounce(func, delay) {
    let timerId = null;
    return function () {
      clearTimeout(timerId);

      timerId = setTimeout(() => {
        func.call(this, ...arguments);
        timerId = null;
      }, delay);
    }
  }

  function deleteItem(event) {
    if (event.target.nodeName === 'I') {
      event.target.closest('li').remove();
    }
    labelShift();
  }

  function selectItem(event, inputValue) {
    let context = event.target.textContent;
    if (inputValue) {
      context = inputValue;
    }
    let selectedItem = `
      <li>
        <span>${context}</span>
        <i class="fas fa-times-circle"></i>
      </li>`
    listSelecedItems.insertAdjacentHTML('beforeend', selectedItem);
    autoInput.value = '';
    optionItems.innerHTML = allItemsHtml;
    setTimeout(() => {
      autoInput.focus();
    })
    currentSelecedItem = '';
    optionItems.classList.add('hidden');
  }

  function positionOptionItems() {
    let positionTop = itemsRow
      .getBoundingClientRect().bottom - listWrapper.getBoundingClientRect().top;
    let itemsRowWidth = itemsRow.offsetWidth;
    let bottomSpace = document.documentElement
                      .clientHeight - itemsRow.getBoundingClientRect().bottom;
    let topSpace = itemsRow.getBoundingClientRect().top;

    if (bottomSpace < optionItems.offsetHeight &&
           topSpace > optionItems.offsetHeight) {
      positionTop = positionTop - optionItems.offsetHeight -    itemsRow.offsetHeight - inputLabel.offsetHeight;
    }
    optionItems.style.setProperty('--optionListWidth', `${itemsRowWidth}px`);
    optionItems.style.setProperty('--optionListTop', `${positionTop}px`);
  }

  function render(el) {
    el.innerHTML = `
    <div class="wrapper">
      <label for="autoInput">${optionLists.name}...</label>
      <div class="itemsRow">
        <ul class="selectedItems"> 
        </ul>
        <input id="autoInput" class="autoInput">
      </div>
      <ul class="optionsItems hidden">
        ${allItemsHtml}
      </ul>
    </div>`;
  }
}