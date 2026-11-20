// Shared helpers: API calls, login state and navigation bar
const COLORS = ['#1e3a5f', '#c26b2c', '#2d6a3e', '#7a3e6c', '#3b6e8f', '#8a5a2b', '#4a4a7a', '#2f7a6a'];

function getToken() { return localStorage.getItem('token'); }
function getUser() { return JSON.parse(localStorage.getItem('user') || 'null'); }

async function api(url, options = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (getToken()) headers.Authorization = 'Bearer ' + getToken();
  const response = await fetch(url, { ...options, headers });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Request failed');
  return data;
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  location.href = 'index.html';
}

function renderNav() {
  const user = getUser();
  const right = user
    ? `<span style="margin-left:22px;font-size:14px;color:#555">Hi, ${user.name}</span><a class="btn o" style="margin-left:16px" onclick="logout()">Logout</a>`
    : `<a class="btn o" style="margin-left:22px" href="login.html">Login</a>`;
  document.getElementById('nav').innerHTML =
    `<div class="logo">📚 BookBridge</div><div><a href="index.html">Home</a><a href="books.html">Browse Books</a>` +
    `<a href="sell.html">Sell a Book</a><a href="requests.html">My Requests</a>${right}</div>`;
}

function requireLoginPage() {
  if (!getToken()) location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', renderNav);
