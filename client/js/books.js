async function loadBooks() {
  const params = new URLSearchParams();
  ['search', 'department', 'semester', 'condition'].forEach(id => {
    const value = document.getElementById(id).value;
    if (value) params.append(id, value);
  });
  const response = await fetch('/api/books?' + params);
  if (!response.ok) throw new Error('Could not load books');
  return response.json();
}

async function showBooks() {
  try {
    const books = await loadBooks();
    document.getElementById('grid').innerHTML = books.length ? books.map((b, i) => `
      <div class="card">
        <div class="cover" style="background:${COLORS[i % COLORS.length]}">${b.title}</div>
        <h4>${b.title}</h4><small>${b.author || ''}</small>
        <small>Seller: ${b.seller ? b.seller.name : '-'} · Sem ${b.semester || '-'}</small>
        <div class="row"><span class="price">₹${b.price}</span><span class="badge">${b.condition || ''}</span></div>
        <a class="btn sm" style="margin-top:10px" onclick="requestBook('${b._id}')">Request to buy</a>
      </div>`).join('') : '<div class="empty">No books match your filters.</div>';
  } catch (err) {
    document.getElementById('msg').textContent = err.message;
  }
}

async function requestBook(bookId) {
  if (!getToken()) return (location.href = 'login.html');
  try {
    await api('/api/requests', { method: 'POST', body: JSON.stringify({ bookId }) });
    alert('Request sent to the seller');
  } catch (err) {
    alert(err.message);
  }
}

['search', 'department', 'semester', 'condition'].forEach(id =>
  document.getElementById(id).addEventListener('input', showBooks));
showBooks();
