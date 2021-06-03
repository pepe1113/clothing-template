// Example starter JavaScript for disabling form submissions if there are invalid fields
;(function () {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.prototype.slice.call(forms).forEach(function (form) {
    form.addEventListener(
      'submit',
      function (event) {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }

        form.classList.add('was-validated')
      },
      false
    )
  })
})()

//swiper
const mobileSwiper = new Swiper('.mobileProductList', {
  slidesPerView: 2,
  spaceBetween: 30,
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
})

const productsListSwiper = new Swiper('.productsListSwiper', {
  slidesPerView: 2,
  spaceBetween: 20,
  loop: true,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  breakpoints: {
    980: {
      slidesPerView: 6,
      spaceBetween: 30,
    },
    480: {
      slidesPerView: 4,
      spaceBetween: 20,
    },
  },
})

//remove modal
const removeModal = document.querySelector('#removeModal')
removeModal.addEventListener('show.bs.modal', function (e) {
  const btn = e.relatedTarget
  const title = btn.dataset.title
  const modalLabel = document.querySelector('#removeModalLabel')
  const modalBody = document.querySelector('#modal-body-productTitle')
  console.log(title)
  modalLabel.textContent = '刪除 ' + title
  modalBody.textContent = title
})

//slick slider
$(document).ready(function () {
  //slick slider
  $('.slider-for').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
    asNavFor: '.slider-nav',
  })

  $('.slider-nav').slick({
    slidesToShow: 5,
    slidesToScroll: 1,
    asNavFor: '.slider-for',
    dots: false,
    centerMode: true,
    focusOnSelect: true,
    vertical: true,
  })

  $(window).scroll(function () {
    let scrollTop = $(window).scrollTop()
    let windowHeight = $(window).height()

    $('.animated').each(function () {
      let thisPos = $(this).offset().top
      if (thisPos <= scrollTop + windowHeight) {
        $(this).addClass('fadeIn')
      }
    })
  })
})
