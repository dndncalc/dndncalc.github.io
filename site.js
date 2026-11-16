/* 든든 생활계산기 공통 스크립트: 체크리스트 개수 표시, 홈 주제별 글 수 자동 세기. 저장하지 않음. */
(function(){
  document.querySelectorAll('[data-check]').forEach(function(box){
    var cbs=box.querySelectorAll('input[type=checkbox]'),out=box.querySelector('.check-count');
    function up(){var n=0;cbs.forEach(function(c){if(c.checked)n++;});if(out)out.textContent=cbs.length+'개 중 '+n+'개 확인했어요'+(n===cbs.length?'. 모두 확인했어요!':'');}
    cbs.forEach(function(c){c.addEventListener('change',up);});up();
  });
  document.querySelectorAll('[data-count-of]').forEach(function(el){
    var sec=document.getElementById(el.getAttribute('data-count-of'));
    if(sec){var n=sec.querySelectorAll('a.item').length;el.textContent=n+'편';}
  });
})();

/* 2026-11-17 이탈 점검: 계산 결과가 화면 아래에 숨으면 결과 위치로 자동으로 내려 줌. 결과 상자에 data-autoscroll 이 있는 페이지만. 계산식은 건드리지 않음.
   (11/17 보완) 계산 버튼(button)을 누른 직후에만 움직이고, 입력 칸에 숫자를 넣는 중에는 움직이지 않음.
   data-autoscroll="live" (입력하면 바로 바뀌는 결과): 입력 칸에서 Enter(휴대폰 키보드 '이동·완료')를 누를 때 결과가 가려져 있으면 내려 줌. */
(function(){
  var boxes=document.querySelectorAll('[data-autoscroll]');if(!boxes.length)return;
  var lastAct=0;
  document.addEventListener('click',function(e){var t=e.target;if(t&&t.closest&&t.closest('button,input[type=submit],input[type=button]'))lastAct=Date.now();},true);
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function hidden(box){
    if(!box.classList.contains('show')||!box.textContent.trim())return false;
    var r=box.getBoundingClientRect(),vh=window.innerHeight||document.documentElement.clientHeight;
    return !(r.top>=0&&r.top<=vh*0.55);
  }
  function go(box){window.scrollTo({top:window.pageYOffset+box.getBoundingClientRect().top-16,behavior:reduce?'auto':'smooth'});}
  if(window.MutationObserver)boxes.forEach(function(box){
    if(box.getAttribute('data-autoscroll')==='live')return;
    var t=null;
    new MutationObserver(function(){
      if(Date.now()-lastAct>1500)return;
      clearTimeout(t);t=setTimeout(function(){if(hidden(box))go(box);},60);
    }).observe(box,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
  });
  document.addEventListener('keydown',function(e){
    if(e.key!=='Enter'||e.isComposing)return;
    var inp=e.target;if(!inp||inp.tagName!=='INPUT'||!inp.closest)return;
    var area=inp.closest('.tool');var box=area&&area.querySelector('[data-autoscroll="live"]');if(!box)return;
    setTimeout(function(){if(hidden(box)){inp.blur();go(box);}},60);
  });
})();

/* 2026-11-17: 원 단위 금액 칸(input에 data-won)이면 칸 아래에 '= 900만 원'처럼 읽어 주는 줄을 붙임. 입력할 때 바로 바뀜. 화면 표시만 하고 계산에는 쓰지 않음. */
(function(){
  var ins=document.querySelectorAll('input[data-won]');if(!ins.length)return;
  function c(n){return n.toLocaleString('ko-KR');}
  function read(v){
    if(v===''||v==null)return '';
    var n=Math.round(Number(v));if(!isFinite(n)||n<=0||n>=1e16)return '';
    var jo=Math.floor(n/1e12),eok=Math.floor(n%1e12/1e8),man=Math.floor(n%1e8/1e4),won=n%1e4,p=[];
    if(jo)p.push(c(jo)+'조');if(eok)p.push(c(eok)+'억');if(man)p.push(c(man)+'만');if(won)p.push(c(won));
    return '= '+p.join(' ')+(won?'원':' 원');
  }
  var ups=[];
  ins.forEach(function(inp,i){
    var s=document.createElement('small');s.className='won-read';s.id=(inp.id||'won'+i)+'-read';
    inp.insertAdjacentElement('afterend',s);
    var d=inp.getAttribute('aria-describedby');inp.setAttribute('aria-describedby',(d?d+' ':'')+s.id);
    function up(){var t=read(inp.value);if(s.textContent!==t)s.textContent=t;}
    inp.addEventListener('input',up);inp.addEventListener('change',up);up();ups.push(up);
  });
  /* 버튼으로 값을 넣는 경우(예: 최저임금 넣기)도 따라 바뀌게 */
  document.addEventListener('click',function(){setTimeout(function(){ups.forEach(function(f){f();});},0);});
})();