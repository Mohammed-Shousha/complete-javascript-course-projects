'use strict';

// Elements
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const openModalButtons = document.querySelectorAll('.show-modal');
const closeModalButton = document.querySelector('.close-modal');

// Functions
const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

const closeModalOnEsc = function (event) {
  if (event.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
};

// Event listeners
for (let openModalButton of openModalButtons) {
  openModalButton.addEventListener('click', openModal);
}

closeModalButton.addEventListener('click', closeModal);

overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', closeModalOnEsc);
