import './css/common.css';

import { Notify } from 'notiflix/build/notiflix-notify-aio';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import ApiService from './js/api-service';
import markup from './js/markup';
import LoadMoreBtn from './js/load-more-button';

const form = document.querySelector('.search-form');
const searchButton = document.querySelector('[type=submit]');

const gallery = document.querySelector('.gallery');

const options = {
  simpleLightBox: {
    captions: true,
    captionsData: 'alt',
    captionDelay: 250,
  },
};

const apiService = new ApiService();
const loadMoreBtn = new LoadMoreBtn({
  selector: '.load-more',
  hidden: true,
});

let galleryLightBox = new SimpleLightbox('.gallery a', options.simpleLightBox);

function dataProcessing(data) {
  if (data.data.totalHits === 0) {
    return Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
    );
  }
  if (data.data.totalHits !== 0 && data.data.hits.length === 0) {
    searchButton.disabled = true;
    return Notify.warning(`We're sorry, but you've reached the end of search results.`);
  }

  gallery.insertAdjacentHTML('beforeend', markup(data.data.hits));

  galleryLightBox.refresh();

  if (apiService.pageNumber === 2) {
    return Notify.info(`Hooray! We found ${data.data.totalHits} images.`);
  } else {
    const { height: cardHeight } = gallery.firstElementChild.getBoundingClientRect();
    window.scrollBy({
      top: cardHeight * 2 + 120,
      behavior: 'smooth',
    });
  }
}

function loadPictures() {
  apiService
    .getPictures()
    .then(dataProcessing)
    .then(loadMoreBtn.show())
    .catch(error => {
      console.log(error);
      Notify.failure('Something went wrong, please try again...');
    });
}

function onFormSubmit(event) {
  event.preventDefault();

  const isFilled = event.currentTarget.elements.searchQuery.value;
  if (isFilled) {
    searchButton.disabled = true;
    apiService.searchQuery = isFilled;
    apiService.resetPage();
    gallery.innerHTML = '';
    loadPictures();
  } else {
    return Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
    );
  }
}

form.addEventListener('submit', onFormSubmit);

function onLoadMore() {
  loadPictures();
}

loadMoreBtn.refs.button.addEventListener('click', onLoadMore);
