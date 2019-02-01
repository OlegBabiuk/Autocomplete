import Component from '../../components.js';

export default class OptionItems extends Component {
  constructor({
    element,
    listItems
  }) {
    super( {element} )
    this.element = element;
    this.listItems = listItems;
    this.originalListItems = listItems;
    this._render();
    this.hide();

    this.optionList = this.getOptionList();
  }

  toggleListener(callback, type) {
    if (type === 'add') {
      this.element.addEventListener('mousedown', callback);
    }
    if (type === 'remove') {
      this.element.removeEventListener('mousedown', callback);
    }
  }

  changePosition({ itemsRowWidth, positionTop }) {
    this.optionList = this.getOptionList();
    this.optionList.style.setProperty('--optionListWidth', `${itemsRowWidth}px`);
    this.optionList.style.setProperty('--optionListTop', `${positionTop}px`);
  }

  filterItems(transferredText) {
    this.updateList();
    this.listItems = this.listItems.filter(item => {
      return item.toLowerCase()
                 .includes(transferredText.toLowerCase());
    });
    this._render();

    if (!this.listItems.length) {
      this.hide()
    }
  }

  getOptionList() {
    return this.element.querySelector('[data-element="optionList"]');
  }

  getOptionHeight() {
    return this.optionList.offsetHeight;
  }

  updateList() {
    this.listItems = this.originalListItems;
    this._render();
  }

  getListElements() {
    return [...this.element.querySelectorAll('[data-element="optionItem"]')];
  }

  _render() {
    this.element.innerHTML = `
    <ul 
      data-element="optionList" 
      class="optionsItems"
    >
      ${this.listItems
          .map(item => '<li data-element="optionItem">' + item + '</li>')
          .join('')}

    </ul>`;
  }
}