/**
 * 🛡️ DRY - CART CLIENT STATE
 * ============================================================
 * Cart state disimpan di browser (memory), bukan di server.
 * Semua fungsi (addToCart, removeFromCart, toggleCart, checkout)
 * dipanggil dari index.ejs — komponen cart sidebar udah ada
 * di sana, file ini cuma logic-nya.
 * ============================================================
 */

const cartStore = createStore({
  items: [], // [{id, name, price, stock, category, quantity}]
});

function formatRupiahClient(amount) {
  return 'Rp' + Number(amount).toLocaleString('id-ID');
}

// ============================================================
// CART ACTIONS
// ============================================================

function addToCart({ id, name, price, stock, category }) {
  const state = cartStore.getState();
  const existing = state.items.find((item) => item.id === id);

  if (existing) {
    if (existing.quantity >= stock) {
      showToast(`Stok "${name}" maksimal ${stock}`, 'warning');
      return;
    }
    existing.quantity += 1;
    cartStore.setState({ items: [...state.items] });
  } else {
    cartStore.setState({
      items: [...state.items, { id, name, price, stock, category, quantity: 1 }],
    });
  }

  showToast(`${name} ditambahkan ke keranjang`, 'success');
}

function removeFromCart(productId) {
  const state = cartStore.getState();
  cartStore.setState({
    items: state.items.filter((item) => item.id !== productId),
  });
}

function updateCartItemQty(productId, delta) {
  const state = cartStore.getState();
  const item = state.items.find((i) => i.id === productId);
  if (!item) return;

  const newQty = item.quantity + delta;
  if (newQty <= 0) {
    removeFromCart(productId);
    return;
  }
  if (newQty > item.stock) {
    showToast(`Stok tersedia: ${item.stock}`, 'warning');
    return;
  }

  item.quantity = newQty;
  cartStore.setState({ items: [...state.items] });
}

// ============================================================
// CART SIDEBAR TOGGLE
// ============================================================

function toggleCart() {
  const overlay = document.getElementById('cart-overlay');
  const panel = document.getElementById('cart-panel');

  const isOpen = !panel.classList.contains('closed');
  if (isOpen) {
    panel.classList.add('closed');
    overlay.classList.add('hidden');
  } else {
    panel.classList.remove('closed');
    overlay.classList.remove('hidden');
  }
}

// ============================================================
// CHECKOUT
// ============================================================

async function checkout() {
  const state = cartStore.getState();
  if (state.items.length === 0) return;

  const buyerName = prompt('Atas nama siapa pesanan ini?');
  if (!buyerName || !buyerName.trim()) return;

  const checkoutBtn = document.getElementById('checkout-btn');
  checkoutBtn.disabled = true;
  checkoutBtn.textContent = 'Memproses...';

  try {
    const res = await fetch('/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        buyerName: buyerName.trim(),
        items: state.items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      }),
    });

    const result = await res.json();

    if (!result.success) {
      if (res.status === 401 || res.status === 302) {
        showToast('Silakan login dulu untuk checkout', 'warning');
        setTimeout(() => (window.location.href = '/login'), 1000);
        return;
      }
      showToast(result.message || 'Gagal checkout', 'error');
      return;
    }

    // Berhasil — redirect ke halaman sukses
    cartStore.setState({ items: [] });
    window.location.href = `/order/success/${result.orderId}`;
  } catch (err) {
    showToast('Gagal checkout: ' + err.message, 'error');
  } finally {
    checkoutBtn.disabled = false;
    checkoutBtn.textContent = 'Checkout Sekarang';
  }
}

// ============================================================
// RENDER CART UI
// ============================================================

function renderCart(state) {
  const container = document.getElementById('cart-items');
  const footer = document.getElementById('cart-footer');
  const cartCount = document.getElementById('cart-count');
  const cartTotal = document.getElementById('cart-total');

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  // Badge count
  if (totalItems > 0) {
    cartCount.textContent = totalItems;
    cartCount.classList.remove('hidden');
    cartCount.classList.add('cart-badge');
  } else {
    cartCount.classList.add('hidden');
  }

  // Cart items
  if (state.items.length === 0) {
    container.innerHTML = `
      <div class="flex flex-col items-center justify-center h-full text-gray-400">
        <span class="text-5xl mb-3">🛒</span>
        <p class="text-sm">Keranjang masih kosong</p>
      </div>
    `;
    footer.classList.add('hidden');
    return;
  }

  container.innerHTML = state.items
    .map(
      (item) => `
    <div class="bg-gray-50 rounded-xl p-4 border border-gray-100">
      <div class="flex items-start justify-between mb-2">
        <div class="flex-1 min-w-0">
          <p class="font-semibold text-gray-800 text-sm truncate">${item.name}</p>
          <p class="text-xs text-gray-400">${item.category || 'Umum'}</p>
        </div>
        <button onclick="removeFromCart(${item.id})"
          class="text-red-400 hover:text-red-600 text-lg ml-2 transition-colors" title="Hapus">×</button>
      </div>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <button onclick="updateCartItemQty(${item.id}, -1)"
            class="w-7 h-7 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 text-sm font-bold transition-colors">−</button>
          <span class="text-sm font-bold text-gray-800 w-6 text-center">${item.quantity}</span>
          <button onclick="updateCartItemQty(${item.id}, 1)"
            class="w-7 h-7 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 text-sm font-bold transition-colors">+</button>
        </div>
        <p class="font-bold text-sm bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          ${formatRupiahClient(item.price * item.quantity)}
        </p>
      </div>
    </div>
  `
    )
    .join('');

  footer.classList.remove('hidden');
  cartTotal.textContent = formatRupiahClient(totalPrice);
}

cartStore.subscribe(renderCart);
renderCart(cartStore.getState());

// ============================================================
// TOAST NOTIFICATION
// ============================================================

function showToast(message, type = 'success') {
  // Remove existing toast
  const existing = document.getElementById('toast-notification');
  if (existing) existing.remove();

  const colors = {
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    error: 'bg-red-500',
  };

  const toast = document.createElement('div');
  toast.id = 'toast-notification';
  toast.className = `fixed top-5 right-5 z-[100] ${colors[type] || colors.success} text-white text-sm font-medium px-5 py-3 rounded-xl shadow-2xl transition-all duration-300 translate-x-0 opacity-100`;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}
