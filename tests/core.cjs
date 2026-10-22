const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const crypto=require('node:crypto').webcrypto;
const context=vm.createContext({crypto,Uint32Array,localStorage:{getItem(){return null;},setItem(){}}});
for(const f of ['data.js','engine.js','art.js'])vm.runInContext(fs.readFileSync('dist/'+f,'utf8'),context);
const {cards,spreads,modes}=context.TarotData,E=context.TarotEngine;
assert.equal(cards.length,78);assert.equal(new Set(cards.map(c=>c.id)).size,78);assert.equal(new Set(cards.map(c=>c.name)).size,78);
assert.equal(cards.filter(c=>c.suit==='major').length,22);
for(const suit of ['wands','cups','swords','pentacles'])assert.equal(cards.filter(c=>c.suit===suit).length,14);
assert.equal(spreads.length,165);assert.equal(new Set(spreads.map(s=>s.id)).size,165);assert.equal(modes.length,10);
for(const s of spreads){assert(s.positions.length>=1&&s.positions.length<=78);assert(s.positions.every(p=>p.name.trim()&&p.prompt.trim()));}
for(const c of cards){assert(c.upright&&c.reverse&&c.keywords);assert(context.TarotArt.card(c).includes('<svg'));}
let attempts=0;
assert.equal(E.randomInt(78,a=>{a[0]=attempts++===0?4294967295:77;}),77,'rejection sampling must reject the biased tail');
assert.equal(attempts,2);
assert.equal(E.randomInt(1,a=>a[0]=4294967295),0);
assert.throws(()=>E.randomInt(0));assert.throws(()=>E.randomInt(1.5));
for(let run=0;run<150;run++){
 const deck=E.makeDeck(cards,true),drawn=[];
 assert.equal(deck.length,78);
 while(deck.length)drawn.push(E.takeAt(deck,E.randomInt(deck.length)));
 assert.equal(new Set(drawn.map(c=>c.cardId)).size,78,'initial, supplemental and branch draws must share the same remaining pool');
 assert(drawn.every(r=>typeof r.reversed==='boolean'));
 assert.throws(()=>E.takeAt(deck,0));
}
assert(E.makeDeck(cards,false).every(c=>!c.reversed));
const tally=Array(78).fill(0);let reverse=0;
for(let i=0;i<78000;i++)tally[E.randomInt(78)]++;
for(let i=0;i<10000;i++)reverse+=E.randomInt(2);
assert(tally.every(n=>n>750&&n<1250),'sanity check catches severe selection bias, not a proof of randomness');
assert(reverse>4600&&reverse<5400);
assert.equal(E.escape('<script>"&'),'&lt;script&gt;&quot;&amp;');
console.log('PASS: 78 unique cards, 165 valid spreads, 10 modes, rejection sampling boundary, 150 exhausted decks, reversals and distribution sanity.');
