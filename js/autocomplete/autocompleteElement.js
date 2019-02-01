import SelectedItems from './components/list-selected-items.js';
import OptionItems from './components/list-option-items.js';
import Component from '../components.js';

export default class Autocomplete extends Component {
  constructor({
    element,
    listName,
    listItems
  }) {
    super({ element });
    this.listName = listName;
    this.listItems = listItems;
    this._render();
    this.initSelectedItems();
    this.initOptionItems();

    this.listWrapper = this.element.querySelector('[data-element="wrapper"]');
    this.itemsRow = this.element.querySelector('[data-element="itemsRow"]');
    this.autoInput = this.element.querySelector('[data-element="autoInput"]');
    this.inputLabel = this.element.querySelector('[data-element="label"]');
    this.currentSelectedElement = '';

    this._initBind();

    this._inputAction = this._debounce(this._inputAction, 500);
    this._listOfListeners();
  }

  initSelectedItems() {
    this.selectedItems = new SelectedItems({
      element: this.element.querySelector('[data-component="selectedItems"]')
    });
    this.selectedItems.subscribe('labelShift', () => {
      this.labelShift();
    })
  }

  initOptionItems() {
    this.optionItems = new OptionItems({
      element: this.element.querySelector('[data-component="optionItems"]'),
      listItems: this.listItems
    })

  }

  labelShift() {
    if (!this.selectedItems.getSelectedList().childElementCount &&
      !this.autoInput.value
    ) {
      this.inputLabel.classList.remove('shift');
    } else {
      this.inputLabel.classList.add('shift');
    }
  }

  _focusAction() {
    this.listWrapper.classList.add('active');
    this.inputLabel.classList.add('shift');
    this.optionItems.toggleListener(this.addSelectedItem, 'add');
  }

  _blurAction() {
    this.listWrapper.classList.remove('active');
    this.optionItems.hide();
    this.labelShift();
    this.optionItems.toggleListener(this.addSelectedItem, 'remove');

    if (this.currentSelectedElement) {
      this.currentSelectedElement.classList.remove('keyboardSelect');
      this.currentSelectedElement = '';
    }
  }

  _inputAction() {
    this.optionItems.filterItems(this.autoInput.value);
    this._positionOptionItems();

    if (!this.autoInput.value) {
      this.optionItems.hide();
    }
  }

  _clickAction(event) {
    this.selectedItems.deleteItem(event);
  }

  _keyboardInteraction(event) {
    let objKeys = {
      ArrowDown: this._moveInList,
      ArrowUp: this._moveInList,
      ArrowLeft: this._moveInList,
      ArrowRight: this._moveInList,
      Backspace: this._keyboarDelete,
      Enter: this._keyboardAddItem,
      Escape: this._cancelSeleced
    }
    this.currentFunction = objKeys[event.key];

    if (this.currentFunction) {
      this.currentFunction(event);
    }
  }

  _initBind() {
    this._focusAction = this._focusAction.bind(this);
    this._blurAction = this._blurAction.bind(this);
    this._inputAction = this._inputAction.bind(this);
    this.addSelectedItem = this.addSelectedItem.bind(this);
    this._clickAction = this._clickAction.bind(this);
    this._keyboardInteraction = this._keyboardInteraction.bind(this);
  }

  _listOfListeners() {
    this.autoInput.addEventListener('focus', this._focusAction);
    this.autoInput.addEventListener('blur', this._blurAction);
    this.autoInput.addEventListener('input', this._inputAction);
    this.autoInput.addEventListener('keydown', this._keyboardInteraction);
    this.autoInput.addEventListener('dblclick', () => {
      this._positionOptionItems();
    });
    this.element.addEventListener('click', this._clickAction);
  }

  _moveInList(event, list) {
    if (!this.optionItems.listItems.length) {
      return;
    }

    this.currentListElements = list || this.optionItems.getListElements();

    if (this.currentSelectedElement && this.currentSelectedElement.childElementCount) {
      this.currentListElements = this.selectedItems.getListElements();
    }

    this.amountElements = this.currentListElements.length;

    if (event.key === 'Backspace' && !this.currentSelectedElement) {
      this.currentSelectedElement = this.currentListElements[this.amountElements - 1];
    }

    if (this.currentSelectedElement) {
      this.currentSelectedElement.classList.remove('keyboardSelect');

      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
        this._moveInListDown();
      } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
        this._moveInListUp();
      }
    } else {
      this._initFirstSelectedElement();
    }

    if (this.currentSelectedElement) {
      this.currentSelectedElement.classList.add('keyboardSelect');
    }
  }

  _initFirstSelectedElement() {
    this.optionItems.show();
    this._positionOptionItems();

    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      this.currentSelectedElement = this.currentListElements[0];
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      this.currentSelectedElement = this.currentListElements[this.amountElements - 1];
    }
  }

  _moveInListDown() {
    if (this.currentSelectedElement ===
      this.currentListElements[this.amountElements - 1]
    ) {
      this.currentSelectedElement = this.currentListElements[0]
    } else {
      this.currentSelectedElement = this.currentSelectedElement.nextElementSibling
    }
  }

  _moveInListUp() {
    if (this.currentSelectedElement === this.currentListElements[0]) {
      this.currentSelectedElement = this.currentListElements[this.amountElements - 1];
    } else {
      this.currentSelectedElement = this.currentSelectedElement.previousElementSibling;
    }
  }

  _keyboardAddItem(event) {
    if (this.currentSelectedElement && !this.currentSelectedElement.childElementCount) {
      this.addSelectedItem(event, this.currentSelectedElement.textContent);
    }

    if (this.autoInput.value) {
      this.addSelectedItem(event, this.autoInput.value);
    }
  }

  _cancelSeleced() {
    this.optionItems.hide()
    if (this.currentSelectedElement) {
      this.currentSelectedElement.classList.remove('keyboardSelect');
      this.currentSelectedElement = '';
    }
  }

  _keyboarDelete(event) {
    if (this.currentSelectedElement &&
      this.currentSelectedElement.childElementCount
    ) {
      this.currentSelectedElement.remove();
      this.currentSelectedElement = '';
    } else if (!this.autoInput.value &&
      this.selectedItems.getSelectedList().childElementCount
    ) {
      this._moveInList(event, this.selectedItems.getListElements());
    }
  }

  addSelectedItem(event, transferredText) {
    let context = event.target.textContent;

    if (transferredText) {
      context = transferredText;
    }

    this.selectedItems.createItem(context);

    if (this.currentSelectedElement) {
      this.currentSelectedElement.classList.remove('keyboardSelect');
      this.currentSelectedElement = '';
    }
    this.optionItems.updateList();
    this.autoInput.value = '';
    setTimeout(() => {
      this.autoInput.focus();
    })
    this.optionItems.hide();
  }

  _debounce(func, delay) {
    let timerId = null;
    return function () {
      clearTimeout(timerId);

      timerId = setTimeout(() => {
        func.call(this, ...arguments);
        timerId = null;
      }, delay);
    }
  }

  _positionOptionItems() {
    const itemsRowPosition = this.itemsRow.getBoundingClientRect();
    const itemsRowWidth = this.itemsRow.offsetWidth;

    this.optionItems.show();
    const optionItemsHeight = this.optionItems.getOptionHeight();
    const bottomSpace = document.documentElement
      .clientHeight - itemsRowPosition.bottom;
    const topSpace = itemsRowPosition.top;
    let positionTop = itemsRowPosition.bottom - this.listWrapper.getBoundingClientRect().top;

    if (bottomSpace < optionItemsHeight && topSpace > optionItemsHeight) {
      positionTop = positionTop - optionItemsHeight - this.itemsRow.offsetHeight - this.inputLabel.offsetHeight;
    }

    this.optionItems.changePosition({
      itemsRowWidth,
      positionTop
    });
  }

  _render() {
    this.element.innerHTML = `
      <div data-element="wrapper" class="wrapper">
       
        <label
          data-element="label"
          for="autoInput">
            ${this.listName}...
        </label>

        <div data-element="itemsRow" class="itemsRow">

          <div data-component="selectedItems"></div>

          <input 
            data-element="autoInput"
            id="autoInput" 
            class="autoInput"
          >

        </div>

        <div data-component="optionItems"></div>

      </div>`;
  }
}