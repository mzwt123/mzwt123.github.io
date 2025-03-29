// 动态生成导航按钮
function createNavButtons() {
  const categories = ["全部", "模拟经营", "动作冒险"];
  const navContainer = document.getElementById("nav-buttons");
  navContainer.innerHTML = categories.map(cat => `
    <button class="nav-button" onclick="filterGames('${cat}')">${cat}</button>
  `).join('');
}

// 动态生成游戏卡片
function renderGames(filter = '全部', customGames = null) {
  const gameList = document.getElementById("game-list");
  let filteredGames = customGames || games;

  if (filter !== '全部') {
    filteredGames = filteredGames.filter(game => game.category === filter);
  }

  gameList.innerHTML = filteredGames.map(game => `
    <div class="game-card">
      <img src="${game.image}" alt="${game.title}封面">
      <h3 class="game-title">${game.title}</h3>
      <p>类型：${game.category}</p>
      <p>${game.desc}</p>
      <a href="${game.link}" target="_blank" class="steam-link">前往Steam</a>
    </div>
  `).join('');

  if (filteredGames.length === 0) {
    gameList.innerHTML = '<p class="no-result">😢 没有找到相关游戏</p>';
  }
}

// 初始化页面
function init() {
  createNavButtons();
  renderGames();
}

// 页面加载后自动运行
window.onload = init;

// 分类过滤函数
function filterGames(category) {
  renderGames(category);
}

// 搜索函数
function searchGames() {
  const keyword = document.getElementById('search-input').value.toLowerCase();
  const filteredGames = games.filter(game => 
    game.title.toLowerCase().includes(keyword)
  );
  renderGames('全部', filteredGames);
}