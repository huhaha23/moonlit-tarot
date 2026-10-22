(function (root) {
  'use strict';
  const LIMIT = 4294967296;
  function randomInt(n, fill) {
    if (!Number.isSafeInteger(n) || n < 1 || n > LIMIT) throw new RangeError('随机范围无效');
    const provider = fill || (a => {
      if (!root.crypto?.getRandomValues) throw new Error('当前浏览器不支持安全随机，请更换浏览器。');
      return root.crypto.getRandomValues(a);
    });
    const ceiling = Math.floor(LIMIT / n) * n;
    const buf = new Uint32Array(1);
    do { provider(buf); } while (buf[0] >= ceiling);
    return buf[0] % n;
  }
  function shuffle(items) {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i--) {
      const j = randomInt(i + 1);
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
  function makeDeck(cards, reversals) {
    return shuffle(cards).map(card => ({ cardId: card.id, reversed: reversals ? randomInt(2) === 1 : false }));
  }
  function takeAt(deck, index) {
    if (!Number.isInteger(index) || index < 0 || index >= deck.length) throw new RangeError('这张牌已经抽取');
    return deck.splice(index, 1)[0];
  }
  function safeLoad(key, fallback) {
    try { const data = JSON.parse(localStorage.getItem('moonlit.' + key)); return data ?? fallback; } catch { return fallback; }
  }
  function safeSave(key, value) {
    try { localStorage.setItem('moonlit.' + key, JSON.stringify(value)); return true; } catch { return false; }
  }
  function escape(value) { return String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  root.TarotEngine = { randomInt, shuffle, makeDeck, takeAt, safeLoad, safeSave, escape };
})(globalThis);
