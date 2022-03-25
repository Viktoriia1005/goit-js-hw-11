import axios from 'axios';

export default class ApiService {
  constructor() {
    this.options = {
      params: {
        key: '26225007-03edf0f89f8f7aca6e8b387a9',
        q: '',
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: 1,
        per_page: 40,
      },
    };
  }

  incrementPage() {
    this.options.params.page += 1;
  }

  async getPictures() {
    const response = await axios.get('https://pixabay.com/api/', this.options);
    this.incrementPage();
    return response;
  }

  resetPage() {
    this.pageNumber = 1;
  }

  get searchQuery() {
    return this.options.params.q;
  }

  set searchQuery(newQuery) {
    this.options.params.q = newQuery;
  }

  get pageNumber() {
    return this.options.params.page;
  }

  set pageNumber(newNumber) {
    this.options.params.page = newNumber;
  }
}
