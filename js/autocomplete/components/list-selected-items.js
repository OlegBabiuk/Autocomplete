import Component from '../../components.js';

export default class SelectedItems extends Component {
  constructor({ element }) {
    super( {element} )
    this.element = element;
    this._render();

    this.selectedList = this.getSelectedList();
  }

  createItem(text) {
    let selectedItem = `
      <li data-element="selectedItem">
        <span>${text}</span>
        <i data-element="deleteItem"
           class="fas fa-times-circle">
        </i>
      </li>
      `
    this.selectedList.insertAdjacentHTML('beforeend', selectedItem);
  }

  getSelectedList() {
    return this.element.querySelector('[data-element="selectedItems"]');
  }

  getListElements() {
    return [...this.element.querySelectorAll('[data-element="selectedItem"]')];
  }

  deleteItem(event) {
    if (event.target.dataset.element === 'deleteItem') {
      event.target.closest('[data-element="selectedItem"]').remove();
      this.emit('labelShift');
    }
  }

  _render() {
    this.element.innerHTML = `
    <ul data-element="selectedItems" class="selectedItems"> </ul>`;
  }
}