(function(root){
  const motifs=[
    '<path d="M60 155l31-46 15 17 22-43 44 72Z"/><circle cx="151" cy="61" r="18"/><path d="M52 173q58-26 127 0"/><path d="M115 140v-25m-7 9 7-9 8 8"/>',
    '<path d="M115 65v100m-43-50h86M90 90l50 50m0-50-50 50"/><circle cx="115" cy="115" r="32"/><path d="M96 48q10-15 19 0 10 15 19 0"/>',
    '<path d="M131 45a52 52 0 1 0 0 104 43 43 0 1 1 0-104Z"/><path d="M61 173h108M68 181h94"/><circle cx="115" cy="102" r="7"/>',
    '<path d="M115 166V89m0 41q-50 0-35-36 35 2 35 36m0 13q48 0 35-36-34 0-35 36M95 76l-6-21 21 8 5-20 8 20 20-8-7 21Z"/><path d="M79 169h72"/>',
    '<path d="M77 173V91h76v82M87 91V73h56v18M105 173v-37h20v37M82 57l12-20 21 13 22-13 12 20Z"/><circle cx="115" cy="111" r="11"/>',
    '<path d="M79 159l72-72m-72 0 72 72M74 81l8-8 13 13-8 8Zm63 68 8-8 13 13-8 8Z"/><path d="M115 45v38m-12-26h24M93 172h44"/>',
    '<path d="M115 145C35 101 81 65 115 98c34-33 80 3 0 47Z"/><circle cx="80" cy="64" r="12"/><circle cx="150" cy="64" r="12"/><path d="M65 166q50-22 100 0"/>',
    '<path d="M69 108h92l-11 49H80ZM87 105V75h56v30M80 75l35-22 35 22"/><circle cx="85" cy="162" r="12"/><circle cx="145" cy="162" r="12"/><path d="M115 78v26m-14-13h28"/>',
    '<path d="M75 95c-25-30 25-46 40-10 15-36 65-20 40 10-15 22-28 10-40-10-12 20-25 32-40 10Z"/><path d="M115 164c-46-22-58-57-35-66m35 66c46-22 58-57 35-66"/><path d="M97 142q18 18 36 0"/>',
    '<path d="M115 65v-22m-17 24h34v46H98Zm-7 49h48m-24-3v22m-33 33 33-40 34 40M115 78v22m-8-11h16"/><circle cx="115" cy="89" r="24"/>',
    '<circle cx="115" cy="113" r="51"/><circle cx="115" cy="113" r="34"/><circle cx="115" cy="113" r="7"/><path d="M115 62v102M64 113h102M79 77l72 72m0-72-72 72"/>',
    '<path d="M115 54v118m-30 0h60M65 83h100M77 83l-19 47h38Zm76 0-19 47h38Z"/><circle cx="115" cy="66" r="12"/>',
    '<path d="M70 48h90m-45 0v32l-27 21 27 19 26-21m-26 21v29m-21-38-12 27 33 11 24-13"/><circle cx="115" cy="164" r="13"/>',
    '<path d="M71 167q20-27 45-47 30-25 42-65M77 71q43-25 80-13M81 177h78"/><path d="M90 124c-22-24 10-41 25-16 15-25 47-8 25 16-19 20-33 20-50 0Z"/>',
    '<path d="M65 68h45l-8 30H74Zm55 75h45l-8 30h-29ZM87 98q0 45 55 45m-42-20 42 20-43 0"/><circle cx="145" cy="71" r="16"/>',
    '<path d="M115 62l40 66H75ZM115 72v69m-31-43 62 33m-62 0 62-33"/><path d="M75 151c-35-15-27 34 0 20m80-20c35-15 27 34 0 20M75 162h80"/>',
    '<path d="M88 177V91h54v86m-57-86h60M91 75l-7-21 21 6 10-21 10 21 21-6-7 21ZM120 76l-19 39 22-5-18 40"/><path d="m59 109 12 18m95-18-12 18"/>',
    '<path d="m115 55 10 29 31 0-25 19 9 29-25-18-25 18 9-29-25-19h31Z"/><path d="M51 163q16-13 32 0t32 0 32 0 32 0M65 179q16-13 32 0t32 0 32 0"/>',
    '<path d="M135 46a49 49 0 1 0 0 96 41 41 0 1 1 0-96Z"/><path d="M47 177l36-36 32 20 30-20 38 36M78 166l16-9m49 11 13-10"/>',
    '<circle cx="115" cy="105" r="31"/><path d="M115 55V41m0 114v14m-50-64H51m114 0h14M80 70 69 59m81 81 11 11M80 140l-11 11m81-81 11-11M100 103h1m28 0h1m-24 17q9 7 18 0"/>',
    '<path d="M76 155l24-30 15 18 15-18 24 30ZM115 51v52m-28-21h56m-28 21-12-12m12 12 12-12"/><path d="M60 172h110"/>',
    '<ellipse cx="115" cy="112" rx="44" ry="65"/><ellipse cx="115" cy="112" rx="35" ry="57"/><path d="M115 74v76m-18-57 18-19 18 19m-35 40 17 17 17-17M47 52l7 7m121-7-7 7M47 172l7-7m121 7-7-7"/>'
  ];
  const suitShapes={wands:'<path d="M0 18V-18m-8 6 8 8 8-8m-8 17-8-8m8 3 8-8"/>',cups:'<path d="M-13-14h26v8Q13 9 0 9T-13-6ZM0 9v10m-9 0H9"/>',swords:'<path d="m0-23 5 10-5 25-5-25ZM-12 12h24M0 12v10m-4 0h8"/>',pentacles:'<circle r="18"/><path d="m0-13 8 23-21-14h26L-8 10Z"/>'};
  function stars(){return [[44,48],[177,72],[52,128],[169,153],[76,42],[155,32]].map(([x,y],i)=>`<path d="M${x-3} ${y}h6m-3-3v6" opacity="${.25+i*.07}"/>`).join('');}
  function card(card, options={}){
    const mini=options.mini;
    let motif=motifs[card.rank];
    if(card.suit!=='major'){
      const shape=suitShapes[card.suit];
      if(card.rank<10){const n=card.rank+1;motif=Array.from({length:n},(_,i)=>{const a=i*2.399;const r=n===1?0:20+Math.floor(i/4)*13;return `<g transform="translate(${115+Math.sin(a)*r} ${108+Math.cos(a)*r}) scale(${n<4?1:.65})">${shape}</g>`;}).join('');}
      else motif=`<path d="M79 165V85h72v80M88 73l-5-18 20 8 12-25 12 25 20-8-5 18Z"/><g transform="translate(115 120)">${shape}</g>`;
    }
    return `<svg class="tarot-art ${mini?'mini':''}" viewBox="0 0 230 365" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${card.name}插画"><rect x="1" y="1" width="228" height="363" rx="12" fill="#282334" stroke="#9b8869"/><rect x="10" y="10" width="210" height="345" rx="7" fill="none" stroke="#867254" stroke-width=".6"/><path d="M28 251V112a87 87 0 0 1 174 0v139" fill="#211c2c" stroke="#aa946c" stroke-width=".8"/><g fill="none" stroke="#d9c29a" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">${stars()}<g transform="translate(0 35)">${motif}</g><path d="M29 253h172M44 260h142" stroke-width=".5"/><path d="M72 281h25m36 0h25M110 281l5-5 5 5-5 5Z" stroke-width=".7"/></g><text x="115" y="31" text-anchor="middle" fill="#c8ae82" font-size="10" letter-spacing="3" font-family="Georgia,serif">${card.suit==='major'?['0','I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII','XIII','XIV','XV','XVI','XVII','XVIII','XIX','XX','XXI'][card.rank]:'✦'}</text><text x="115" y="312" text-anchor="middle" fill="#eadcc4" font-size="20" font-family="Georgia,SimSun,serif" letter-spacing="5">${card.name}</text><text x="115" y="336" text-anchor="middle" fill="#b8a88e" font-size="8" font-family="Georgia,serif" letter-spacing="1.6">${card.en}</text></svg>`;
  }
  function back(){return `<svg viewBox="0 0 230 365" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect x="1" y="1" width="228" height="363" rx="12" fill="#292335" stroke="#8b7758"/><rect x="11" y="11" width="208" height="343" rx="7" fill="none" stroke="#a68c63" stroke-width=".7"/><g stroke="#bda57a" fill="none" stroke-width="1"><path d="M115 46 192 182 115 318 38 182Z"/><path d="M115 70 176 182 115 295 54 182Z"/><circle cx="115" cy="182" r="46"/><circle cx="115" cy="182" r="61" stroke-dasharray="1 8"/><path d="M137 150a36 36 0 1 0 0 64 31 31 0 1 1 0-64Z"/><path d="M115 96v18m-9-9h18M115 250v18m-9-9h18"/>${stars()}</g></svg>`;}
  function layout(spread){const n=spread.positions.length;let pts;if(spread.layout==='triangle')pts=[[25,60],[50,20],[75,60]];else if(spread.layout==='star')pts=[[50,10],[85,40],[73,80],[27,80],[15,40]];else if(spread.layout==='diamond')pts=[[50,10],[23,45],[77,45],[50,80]];else if(spread.layout==='horseshoe')pts=Array.from({length:n},(_,i)=>[15+i*70/(n-1),15+55*Math.sin(i*Math.PI/(n-1))]);else if(spread.layout==='celtic')pts=[[36,42],[40,44],[36,72],[15,42],[36,10],[61,42],[86,83],[86,60],[86,35],[86,10]];else if(spread.layout==='wheel')pts=Array.from({length:n},(_,i)=>[50+36*Math.sin(i*Math.PI*2/n),45-33*Math.cos(i*Math.PI*2/n)]);else pts=Array.from({length:Math.min(n,7)},(_,i)=>[n===1?50:15+i*70/(Math.min(n,7)-1),40]);return `<svg class="spread-diagram" viewBox="0 0 120 100" aria-hidden="true">${pts.map(([x,y],i)=>`<rect x="${x}" y="${y}" width="13" height="20" rx="2" fill="none" stroke="currentColor" opacity="${.45+i*.06}" ${spread.layout==='celtic'&&i===1?'transform="rotate(90 46.5 54)"':''}/>`).join('')}</svg>`;}
  root.TarotArt={card,back,layout};
})(globalThis);
