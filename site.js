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