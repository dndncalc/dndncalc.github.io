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

/* 2026-11-17 이탈 점검: 계산 결과가 화면 아래에 숨으면 결과 위치로 자동으로 내려 줌. 결과 상자에 data-autoscroll 이 있는 페이지만. 계산식은 건드리지 않음. */
(function(){
  var boxes=document.querySelectorAll('[data-autoscroll]');if(!boxes.length||!window.MutationObserver)return;
  var lastAct=0;function act(){lastAct=Date.now();}
  document.addEventListener('click',act,true);document.addEventListener('keydown',act,true);
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  boxes.forEach(function(box){
    var t=null;
    new MutationObserver(function(){
      if(Date.now()-lastAct>1500)return;
      clearTimeout(t);t=setTimeout(function(){
        if(!box.classList.contains('show')||!box.textContent.trim())return;
        var r=box.getBoundingClientRect(),vh=window.innerHeight||document.documentElement.clientHeight;
        if(r.top>=0&&r.top<=vh*0.55)return;
        window.scrollTo({top:window.pageYOffset+r.top-16,behavior:reduce?'auto':'smooth'});
      },60);
    }).observe(box,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
  });
})();