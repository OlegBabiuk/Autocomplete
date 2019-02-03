import Autocomplete from './autocomplete/autocompleteElement.js'

const autocompleteElement = new Autocomplete({
  element: document.querySelector('[data-component="autocomplete"]'),
  listName: 'New fruit',
  listItems: ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry']
})