// [ Plugin setting ]

;(function () {
  'use strict'
  var forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.prototype.slice.call(forms).forEach(function (form) {
    form.addEventListener(
      'submit',
      function (event) {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        } else {
          onSubmitOrder()
          window.location.href = window.location.origin + '/index.html'
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

// [ Render logic ]

// base
const baseUrl = 'http://localhost:3000'

// loading
function loading() {
  $('body').loading()
  setTimeout(function () {
    $('body').loading('toggle')
  }, 1000)
}

let products = []
let cart = []

const init = (function () {
  loading()
  fetchProducts()
  fetchCart()
})()

// Initial render

function fetchProducts() {
  axios
    .get(baseUrl + '/product')
    .then((res) => {
      products = res.data
      renderCollection()
    })
    .catch((err) => {
      console.log(err)
    })
}

function renderProductCard(container, list) {
  if (window.location.pathname !== '/collections.html') return

  let str = ''
  list.forEach((product) => {
    str += `
    <div class="col">
    <div class="card productCard">
      <a href="products.html">
        <div
          class="card-body"
          style="
            background-image: url(${product.images[1]});
          "
        >
          <img
            src="${product.images[0]}"
            alt="${product.title}"
          />
        </div>
      </a>
      <div class="card-body">
        <p class="product-subtitle"><a href="products.html">${product.series}</a></p>
        <p class="product-title"><a href="products.html">${product.title}</a></p>
        <p>$${product.price}</p>
      </div>
      <div class="card-footer bg-transparent border-0 p-0">
        <button class="btn btn-primary rounded px-4" data-id='${product.id}'  data-bs-toggle="modal" data-bs-target="#addCartModal">+ 加入購物車</button>
      </div>
    </div>
  </div>
    `
  })
  container.innerHTML = str
}

function renderCollection() {
  const tab_all = document.querySelector('#tabpane-all')
  const tab_new = document.querySelector('#tabpane-new')
  const tab_sale = document.querySelector('#tabpane-sale')
  const tab_ranking = document.querySelector('#tabpane-ranking')
  const tab_tops = document.querySelector('#tabpane-tops')
  const tab_dress = document.querySelector('#tabpane-dress')
  const tab_knitwear = document.querySelector('#tabpane-knitwear')

  renderProductCard(tab_all, products)

  let newProducts = products.filter((i) => i.tag.indexOf('new') >= 0)
  renderProductCard(tab_new, newProducts)

  let saleProducts = products.filter((i) => i.tag.indexOf('sale') >= 0)
  renderProductCard(tab_sale, saleProducts)

  let rankingProducts = products.filter((i) => i.tag.indexOf('ranking') >= 0)
  renderProductCard(tab_ranking, rankingProducts)

  let topsProducts = products.filter((i) => i.tag.indexOf('tops') >= 0)
  renderProductCard(tab_tops, topsProducts)

  let dressProducts = products.filter((i) => i.tag.indexOf('dress') >= 0)
  renderProductCard(tab_dress, dressProducts)

  let knitwearProducts = products.filter((i) => i.tag.indexOf('knitwear') >= 0)
  renderProductCard(tab_knitwear, knitwearProducts)
}

function fetchCart() {
  axios
    .get(baseUrl + '/cart')
    .then((res) => {
      cart = res.data
      renderCart()
      renderShoppingCart()
      renderCheckout()
      onChangeCartNum()
    })
    .catch((err) => {
      console.log(err)
    })
}

function renderCart() {
  if (window.location.pathname === '/checkout.html') return

  const cartDropdown = document.querySelector('#cart')
  const cartTotal = document.querySelector('#cartTotal')
  const cartAmount = document.querySelector('#cartAmount')

  cartAmount.textContent = cart.length

  let total = cart.reduce((acc, cur) => {
    return acc + cur.product.price * cur.quantity
  }, 0)
  cartTotal.textContent = '$' + total

  let str = ''
  cart.forEach((item) => {
    str += `
    <tr>
    <td class="me-2" style="width: 85px">
      <img class="img-fluid" src="${item.product.images[0]}" />
    </td>
    <td>
      <div>${item.product.title} X${item.quantity}</div>
      <div class="py-0">$${item.product.price}</div>
    </td>
    <td class="align-middle">
      <a
        class="text-primary"
        href="#"
        data-bs-toggle="modal"
        data-bs-target="#removeModal"
        data-title="${item.product.title}"
        data-cartid="${item.id}"
        ><i class="fas fa-trash"></i
      ></a>
    </td>
  </tr>
    `
  })
  cartDropdown.innerHTML = str
}

// Add product to shopping cart

const addCart = (function () {
  const productList = document.querySelector('.productList-cardlist')
  if (!productList) return

  productList.addEventListener('click', function (e) {
    if (e.target.nodeName !== 'BUTTON') return
    const currentId = parseInt(e.target.dataset.id)
    const currentItem = products.filter((i) => i.id === currentId)[0]
    const cartIds = cart.map((i) => i.product.id)

    if (cartIds.indexOf(currentId) === -1) {
      // 沒有相同商品
      postCartData(currentItem)
    } else {
      // 已經有商品
      cart[cartIds.indexOf(currentId)].quantity += 1
      const cartId = cart[cartIds.indexOf(currentId)].id
      updateCartData(cartId)
    }
  })
})()

// 沒有的商品：新增
function postCartData(product) {
  axios
    .post(baseUrl + '/cart', {
      quantity: 1,
      product: product,
    })
    .then((res) => {
      cart.push(res.data)
      renderCart()
    })
    .catch((err) => console.log(err))
}

// 已經有的商品：修改數量
function updateCartData(cartId) {
  const updatedProduct = cart.filter((i) => i.id === cartId)[0]
  axios
    .put(baseUrl + `/cart/${cartId}`, updatedProduct)
    .then(() => {
      renderCart()
      renderShoppingCart()
    })
    .catch((err) => console.log(err))
}

// Remove from shopping cart

function deleteCartData(cartId) {
  axios
    .delete(baseUrl + `/cart/${cartId}`)
    .then(() => {
      cart = cart.filter((i) => i.id !== cartId)
      renderCart()
      renderShoppingCart()
    })
    .catch((err) => {
      console.log(err)
    })
}

let cartId
removeModal.addEventListener('shown.bs.modal', function (e) {
  cartId = parseInt(e.relatedTarget.dataset.cartid)
})

const removeBtn = document.querySelector('#removeBtn')
removeBtn.addEventListener('click', function (e) {
  deleteCartData(cartId)
})

// ---Shoppingcart Page---

// Render shopping cart page
function renderShoppingCart() {
  if (window.location.pathname !== '/shoppingcart.html') return

  const cartBlock = document.querySelector('.cart-shoppingcart')
  const cartTotal = document.querySelector('.total-shoppingcart')
  let total = cart.reduce((acc, cur) => {
    return acc + cur.product.price * cur.quantity
  }, 0)
  cartTotal.textContent = '$' + total

  let str = ''
  cart.forEach((item) => {
    str += `
    <tr>
      <td>
        <a href="#"><span 
        class="material-icons" 
        data-bs-toggle="modal"
        data-bs-target="#removeModal"
        data-title="${item.product.title}"
        data-cartid="${item.id}">close</span></a>
      </td>
      <td>
        <img src="${item.product.images[0]}" alt="${item.product.title}" class="img-fluid" />
      </td>
      <td>
        <p>${item.product.title}</p>
        <p>M</p>
      </td>
      <td>
        <p>$${item.product.price}</p>
      </td>
      <td>
        <input type="number" class="w-100 text-center" value="${item.quantity}" data-cartid="${item.id}" />
      </td>
      <td>
        <p class="text-end pe-3">$${item.product.price * item.quantity}</p>
      </td>
    </tr>
    `
  })

  cartBlock.innerHTML = str
}

// Change Cart quantity
function onChangeCartNum() {
  if (window.location.pathname !== '/shoppingcart.html') return

  const cartBlock = document.querySelector('.cart-shoppingcart')
  cartBlock.addEventListener('change', function (e) {
    if (e.target.nodeName !== 'INPUT') return
    let newNum = parseInt(e.target.value)
    let cartId = parseInt(e.target.dataset.cartid)
    cart = cart.map(function (item) {
      if (item.id === cartId) {
        item.quantity = newNum
        return item
      } else {
        return item
      }
    })
    updateCartData(cartId)
  })
}

// ---checkout Page---

// Render checkout page

function renderCheckout() {
  if (window.location.pathname !== '/checkout.html') return

  const cartCheckout = document.querySelector('#cart-checkout')
  const totalForm = document.querySelector('#totalForm')

  let quantityAmount = cart.reduce((acc, cur) => acc + cur.quantity, 0)
  let total = cart.reduce((acc, cur) => acc + cur.quantity * cur.product.price, 0)
  let deliveryTotal = 60 + total

  let str = ''
  cart.forEach((item) => {
    str += `
    <tr>
    <td>
      <img src="${item.product.images[0]}" alt="${item.product.title}" class="img-fluid" />
    </td>
    <td>
      <p>${item.product.title}</p>
      <p>M</p>
    </td>
    <td>
      <p>$${item.product.price}</p>
    </td>
    <td>
      <p>${item.quantity}</p>
    </td>
    <td>
      <p class="text-end pe-3">$${item.product.price * item.quantity}</p>
    </td>
  </tr>
    `
  })
  cartCheckout.innerHTML = str

  totalForm.innerHTML = `
    <li class="d-flex justify-content-between">
      <span>商品數量</span>
      <span>共 ${quantityAmount} 件</span>
    </li>
    <li class="d-flex justify-content-between">
      <span>總金額</span>
      <span>$${total}</span>
    </li>
    <li class="d-flex justify-content-between">
      <span>運費</span>
      <span>$60</span>
    </li>
    <li class="d-flex justify-content-between">
      <span>應付金額</span>
      <span>$${deliveryTotal}</span>
    </li>
  `
}

// Get order details

function onSubmitOrder() {
  const form = document.querySelector('#checkoutForm')
  const deliveryArea = form.querySelector('#deliveryArea')
  const payway = form.querySelector('#payway')
  const name = form.querySelector('#checkout-name')
  const phone = form.querySelector('#checkout-phone')
  const email = form.querySelector('#checkout-email')
  const memo = form.querySelector('#checkout-memo')
  const zip = form.querySelector('#checkout-zip')
  const address1 = form.querySelector('#checkout-address1')
  const address2 = form.querySelector('#checkout-address2')
  const address3 = form.querySelector('#checkout-address3')

  let order = {
    deliveryArea: deliveryArea.value,
    payway: payway.value,
    name: name.value,
    phone: phone.value,
    email: email.value,
    memo: memo.value,
    zip: zip.value,
    address1: address1.value,
    address2: address2.value,
    address3: address3.value,
    cart: cart,
  }

  postOrder(order)
}

function postOrder(order) {
  axios
    .post(baseUrl + '/order', order)
    .then((res) => {
      console.log(res.data)
      alert('已送出訂單')
    })
    .catch((err) => {
      console.log(err)
    })
}
