gsap.registerPlugin(ScrollTrigger);

let cart = JSON.parse(localStorage.getItem('foodloop-cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('foodloop-wishlist')) || [];
let couponApplied = false;

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initCursor();
  initNavAndScroll();
  initTheme();
  initCart();
  initWishlist();
  initFilters();
  initTilt();
  initScrollProgress();
  initQuickView();
  initMagneticButtons();
  initCounters();
  initSpotlight();
  initTextMagnetic();
  initClipReveal();
});

/* --- PRELOADER --- */
function initPreloader() {
  const loader = document.getElementById('loader');
  if(!loader) return;
  const tl = gsap.timeline();

  tl.to('.progress', { width: '100%', duration: 1.2, ease: 'power2.inOut' })
    .to(loader, { y: '-100%', duration: 0.8, ease: 'power4.inOut', delay: 0.2 })
    .set(loader, { display: 'none' })
    .from('.reveal', { y: 40, opacity: 0, duration: 1, stagger: 0.1, ease: 'power3.out' });

  tl.eventCallback('onComplete', () => {
    document.querySelectorAll('.reveal').forEach(el => {
      gsap.to(el, {
        y: 0, opacity: 1, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
      });
    });
  });
}

/* --- CURSOR (FIXED INVISIBLE DOT) --- */
function initCursor() {
  const cursor = document.getElementById('cursor');
  const blur = document.getElementById('cursor-blur');
  if(!cursor || !blur) return;

  window.addEventListener('mousemove', (e) => {
    // Make cursor visible when mouse moves
    gsap.to([cursor, blur], { opacity: 1, duration: 0.3 });

    gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1, ease: 'power2.out' });
    gsap.to(blur, { x: e.clientX, y: e.clientY, duration: 0.5, ease: 'power2.out' });
  });

  document.querySelectorAll('a, button, .tilt').forEach(el => {
    el.addEventListener('mouseenter', () => {
      gsap.to(cursor, { width: 40, height: 40, backgroundColor: 'rgba(255,95,56,0.2)', border: '1px solid #FF5F38' });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(cursor, { width: 12, height: 12, backgroundColor: '#FF5F38', border: 'none' });
    });
  });
}

/* --- NAVIGATION & MOBILE --- */
function initNavAndScroll() {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) window.scrollTo({ top: target.offsetTop - 100, behavior: 'smooth' });
        document.getElementById('mobile-menu').classList.remove('active');
      }
    });
  });

  const mobileBtn = document.getElementById('mobile-menu-btn');
  const closeMobileBtn = document.getElementById('close-mobile-menu');
  const mobileMenu = document.getElementById('mobile-menu');

  if(mobileBtn) mobileBtn.addEventListener('click', () => mobileMenu.classList.add('active'));
  if(closeMobileBtn) closeMobileBtn.addEventListener('click', () => mobileMenu.classList.remove('active'));
}

/* --- THEME --- */
function initTheme() {
  const btn = document.getElementById('theme-toggle-btn');
  if(!btn) return;
  const icon = btn.querySelector('i');

  if (document.documentElement.getAttribute('data-theme') === 'dark') icon.className = 'ri-sun-line';
  else icon.className = 'ri-moon-clear-line';

  btn.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('foodloop-theme', 'light');
      icon.className = 'ri-moon-clear-line';
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('foodloop-theme', 'dark');
      icon.className = 'ri-sun-line';
    }
  });
}

/* --- CART WITH FLY-TO-CART --- */
function showToast(msg, icon = 'ri-check-line') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="${icon}"></i> ${msg}`;
  container.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 400); }, 3000);
}

function initCart() {
  const cartIcon = document.getElementById('cart-icon');
  const sidebar = document.getElementById('cart-sidebar');
  const overlay = document.getElementById('cart-overlay');
  const closeCart = document.getElementById('close-cart');
  const cartItems = document.getElementById('cart-items');
  const cartSubtotal = document.getElementById('cart-subtotal');
  const cartDiscount = document.getElementById('cart-discount');
  const discountRow = document.getElementById('discount-row');
  const cartTotal = document.getElementById('cart-total');
  const checkoutBtn = document.getElementById('checkout-btn');
  const couponBtn = document.getElementById('apply-coupon');
  const couponInput = document.getElementById('coupon-input');

  const toggleCart = () => {
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
  };

  cartIcon.addEventListener('click', toggleCart);
  closeCart.addEventListener('click', toggleCart);
  overlay.addEventListener('click', toggleCart);

  document.querySelectorAll('.acquire-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = e.target.closest('.item');
      const name = card.dataset.name;
      const price = parseFloat(card.dataset.price);
      const img = card.querySelector('img').src;

      // FLY TO CART ANIMATION
      const imgEl = card.querySelector('img');
      const cartRect = cartIcon.getBoundingClientRect();
      const imgRect = imgEl.getBoundingClientRect();

      const clone = imgEl.cloneNode();
      clone.style.position = 'fixed';
      clone.style.top = imgRect.top + 'px';
      clone.style.left = imgRect.left + 'px';
      clone.style.width = imgRect.width + 'px';
      clone.style.height = imgRect.height + 'px';
      clone.style.borderRadius = '15px';
      clone.style.zIndex = '9999';
      clone.style.pointerEvents = 'none';
      document.body.appendChild(clone);

      gsap.to(clone, {
        top: cartRect.top + 10,
        left: cartRect.left + 10,
        width: 20,
        height: 20,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.inOut',
        onComplete: () => {
          clone.remove();
          const existing = cart.find(i => i.name === name);
          if (existing) existing.quantity++;
          else cart.push({ name, price, img, quantity: 1 });

          updateCart();
          showToast(`${name} added to cart!`, 'ri-shopping-bag-line');
          if (!sidebar.classList.contains('active')) toggleCart();
        }
      });
    });
  });

  couponBtn.addEventListener('click', () => {
    if(couponInput.value.toUpperCase() === 'LOOP10') {
      couponApplied = true;
      showToast('Coupon applied: 10% off!', 'ri-coupon-3-line');
      updateCart();
    } else {
      showToast('Invalid coupon code.', 'ri-error-warning-line');
    }
  });

  window.updateCart = function() {
    cartItems.innerHTML = '';
    let subtotal = 0;
    let count = 0;

    if (cart.length === 0) {
      cartItems.innerHTML = '<p class="empty-msg">Your loop is currently empty.</p>';
    } else {
      cart.forEach(item => {
        subtotal += item.price * item.quantity;
        count += item.quantity;
        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.innerHTML = `
          <img src="${item.img}" alt="${item.name}">
          <div class="item-info">
            <h4>${item.name}</h4>
            <p>$${item.price.toFixed(2)}</p>
            <div class="qty-controls">
              <button class="qty-btn" onclick="changeQty('${item.name}', -1)">-</button>
              <span>${item.quantity}</span>
              <button class="qty-btn" onclick="changeQty('${item.name}', 1)">+</button>
            </div>
          </div>
          <button class="remove-btn" onclick="removeItem('${item.name}')"><i class="ri-delete-bin-line"></i></button>
        `;
        cartItems.appendChild(itemEl);
      });
    }

    let discount = 0;
    if (couponApplied) {
      discount = subtotal * 0.1;
      discountRow.style.display = 'flex';
      cartDiscount.innerText = `-$${discount.toFixed(2)}`;
    } else {
      discountRow.style.display = 'none';
    }

    cartSubtotal.innerText = `$${subtotal.toFixed(2)}`;
    cartTotal.innerText = `$${(subtotal - discount).toFixed(2)}`;
    localStorage.setItem('foodloop-cart', JSON.stringify(cart));
  };

  window.changeQty = (name, amount) => {
    const item = cart.find(i => i.name === name);
    if (item) {
      item.quantity += amount;
      if (item.quantity <= 0) cart = cart.filter(i => i.name !== name);
      window.updateCart();
    }
  };

  window.removeItem = (name) => {
    cart = cart.filter(i => i.name !== name);
    window.updateCart();
  };

  checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) return showToast('Cart is empty!', 'ri-error-warning-line');
    const curtain = document.getElementById('curtain');
    gsap.fromTo(curtain, { scaleY: 0 }, { scaleY: 1, transformOrigin: 'bottom', duration: 0.6, ease: 'power4.inOut', onComplete: () => {
      showToast('Checkout successful!', 'ri-check-double-line');
      cart = [];
      couponApplied = false;
      window.updateCart();
      toggleCart();
      gsap.to(curtain, { scaleY: 0, transformOrigin: 'top', duration: 0.6, ease: 'power4.inOut', delay: 0.5 });
    }});
  });

  window.updateCart();
}

/* --- WISHLIST --- */
function initWishlist() {
  const wishlistBtn = document.getElementById('wishlist-btn');
  const sidebar = document.getElementById('wishlist-sidebar');
  const overlay = document.getElementById('wishlist-overlay');
  const closeBtn = document.getElementById('close-wishlist');
  const itemsContainer = document.getElementById('wishlist-items');

  const toggleWishlist = () => {
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
  };

  wishlistBtn.addEventListener('click', toggleWishlist);
  closeBtn.addEventListener('click', toggleWishlist);
  overlay.addEventListener('click', toggleWishlist);

  document.querySelectorAll('.wishlist-toggle').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const name = btn.dataset.name;
      const card = btn.closest('.item');
      const price = parseFloat(card.dataset.price);
      const img = card.querySelector('img').src;

      if (wishlist.find(i => i.name === name)) {
        wishlist = wishlist.filter(i => i.name !== name);
        btn.classList.remove('active');
        showToast('Removed from wishlist.', 'ri-heart-dislike-line');
      } else {
        wishlist.push({ name, price, img });
        btn.classList.add('active');
        showToast('Saved to wishlist.', 'ri-heart-fill');
      }
      updateWishlist();
    });
  });

  window.updateWishlist = function() {
    itemsContainer.innerHTML = '';

    document.querySelectorAll('.wishlist-toggle').forEach(btn => {
      if (wishlist.find(i => i.name === btn.dataset.name)) btn.classList.add('active');
      else btn.classList.remove('active');
    });

    if (wishlist.length === 0) {
      itemsContainer.innerHTML = '<p class="empty-msg">Your wishlist is empty.</p>';
    } else {
      wishlist.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'wishlist-item';
        itemEl.innerHTML = `
          <img src="${item.img}" alt="${item.name}">
          <div class="item-info">
            <h4>${item.name}</h4>
            <p>$${item.price.toFixed(2)}</p>
          </div>
          <button class="remove-btn" onclick="removeWishlistItem('${item.name}')"><i class="ri-delete-bin-line"></i></button>
        `;
        itemsContainer.appendChild(itemEl);
      });
    }
    localStorage.setItem('foodloop-wishlist', JSON.stringify(wishlist));
  };

  window.removeWishlistItem = (name) => {
    wishlist = wishlist.filter(i => i.name !== name);
    window.updateWishlist();
  };

  window.updateWishlist();
}

/* --- FILTERS --- */
function initFilters() {
  const buttons = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.shop-grid .item');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      items.forEach(item => {
        if (filter === 'all' || item.dataset.cat === filter) {
          item.style.display = 'flex';
          gsap.fromTo(item, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.4 });
        } else {
          item.style.display = 'none';
        }
      });
      ScrollTrigger.refresh();
    });
  });
}

/* --- QUICK VIEW MODAL --- */
function initQuickView() {
  const modal = document.getElementById('quick-view-modal');
  const overlay = document.getElementById('modal-overlay');
  const closeBtn = document.getElementById('close-modal');
  const addBtn = document.getElementById('modal-add-btn');
  let currentProduct = null;

  document.querySelectorAll('.quick-view-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = e.target.closest('.item');
      currentProduct = {
        name: card.dataset.name,
        price: parseFloat(card.dataset.price),
        desc: card.dataset.desc,
        img: card.querySelector('img').src
      };

      document.getElementById('modal-img').src = currentProduct.img;
      document.getElementById('modal-title').innerText = currentProduct.name;
      document.getElementById('modal-price').innerText = `$${currentProduct.price.toFixed(2)}`;
      document.getElementById('modal-desc').innerText = currentProduct.desc;

      modal.classList.add('active');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeModal = () => {
    modal.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);

  addBtn.addEventListener('click', () => {
    if (!currentProduct) return;
    const existing = cart.find(i => i.name === currentProduct.name);
    if (existing) existing.quantity++;
    else cart.push({ name: currentProduct.name, price: currentProduct.price, img: currentProduct.img, quantity: 1 });

    window.updateCart();
    showToast(`${currentProduct.name} added to cart!`, 'ri-shopping-bag-line');
    closeModal();
    document.getElementById('cart-sidebar').classList.add('active');
    document.getElementById('cart-overlay').classList.add('active');
  });
}

/* --- ADVANCED EFFECTS --- */

function initTilt() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.querySelectorAll('.tilt').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;
      gsap.to(card, { rotateX, rotateY, transformPerspective: 1000, duration: 0.5, ease: 'power2.out' });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.5, ease: 'power2.out' });
    });
  });
}

function initScrollProgress() {
  const progressBar = document.getElementById('scroll-progress');
  if(!progressBar) return;
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = ((scrollTop / docHeight) * 100) + '%';
  });
}

function initMagneticButtons() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(pointer: coarse)').matches) return;

  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.3, ease: 'power2.out' });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
    });
  });
}

function initCounters() {
  document.querySelectorAll('.counter').forEach(counter => {
    const target = parseInt(counter.dataset.target);
    const isLarge = target > 1000;
    ScrollTrigger.create({
      trigger: counter,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(counter, {
          innerText: target,
          duration: 2,
          ease: 'power2.out',
          snap: { innerText: 1 },
          onUpdate: function() {
            const val = Math.ceil(this.targets()[0].innerText);
            if (isLarge) counter.innerText = (val / 1000).toFixed(0) + 'k+';
            else counter.innerText = val + '+';
          }
        });
      }
    });
  });
}

// Spotlight cursor tracking for Vision Cards
function initSpotlight() {
  document.querySelectorAll('.spotlight-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--x', `${x}px`);
      card.style.setProperty('--y', `${y}px`);
    });
  });
}

// Text Magnetic Hover for Hero Title
function initTextMagnetic() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  const h1 = document.querySelector('.text-magnetic');
  if(!h1) return;

  h1.addEventListener('mousemove', (e) => {
    const rect = h1.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(h1, { x: x * 0.1, y: y * 0.1, duration: 0.5, ease: 'power2.out' });
  });

  h1.addEventListener('mouseleave', () => {
    gsap.to(h1, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.3)' });
  });
}

// Clip Reveal for Recipe Images
function initClipReveal() {
  const wrappers = document.querySelectorAll('.clip-reveal .img-wrapper');
  wrappers.forEach(wrapper => {
    gsap.fromTo(wrapper,
      { clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)' },
      {
        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
        duration: 1.2,
        ease: 'power3.inOut',
        scrollTrigger: {
          trigger: wrapper,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );
  });
}