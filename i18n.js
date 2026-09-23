(() => {
  'use strict';
  const dictionary = window.WebCraftArabic || {};
  const normalize = value => value.replace(/\s+/g, ' ').trim();
  const names = {SUFRA:'سفرة',SAHAB:'سحاب','forn.':'فرن'};
  const arabicName = name => names[name] || name;
  function translate(value) {
    const text = normalize(value);
    if (Object.hasOwn(dictionary, text)) return dictionary[text];
    let m;
    if ((m = text.match(/^Step (\d+) of (\d+)$/))) return 'الخطوة '+m[1]+' من '+m[2];
    if ((m = text.match(/^(\d+) \/ YOUR PROJECT$/))) return m[1]+' / مشروعك';
    if ((m = text.match(/^(\d+) \/ (.+)$/))) return m[1]+' / '+translate(m[2]);
    if ((m = text.match(/^(\d+) items · prices in JOD$/))) return m[1]+' أصناف · الأسعار بالدينار الأردني';
    if ((m = text.match(/^JOD ([\d,.]+)$/))) return m[1]+' د.أ';
    if ((m = text.match(/^([\d,.]+) JD$/))) return m[1]+' د.أ';
    if ((m = text.match(/^(Basic|Professional|Premium) package$/))) return 'الباقة '+translate(m[1]);
    if ((m = text.match(/^Get to know (.+)$/))) return 'تعرّف على '+arabicName(m[1]);
    if ((m = text.match(/^The textures, spaces and little details that bring (.+) to life\.$/))) return 'الخامات والمساحات والتفاصيل الصغيرة التي تمنح '+arabicName(m[1])+' روحه.';
    if ((m = text.match(/^Explore the visitor experience of this original (.+) concept\.$/))) return 'اكتشف تجربة الزائر في هذا النموذج الأصلي '+({'restaurant':'للمطعم','coffee house':'للمقهى','artisan bakery':'للمخبز'}[m[1]]||'')+'.';
    if ((m = text.match(/^Sample hours only\. (.+) is a fictional brand created by WebCraft, with no physical location or reservation service\.$/))) return 'ساعات توضيحية فقط. '+arabicName(m[1])+' علامة افتراضية من تصميم WebCraft، وليست مكانًا فعليًا ولا تستقبل الحجوزات.';
    if ((m = text.match(/^Enlarge (.+)$/))) return 'تكبير الصورة: '+translate(m[1]);
    if ((m = text.match(/^Open (.+) project$/))) return 'افتح نموذج '+translate(m[1]);
    if ((m = text.match(/^(.+) home$/))) return 'الرئيسية — '+arabicName(m[1]);
    if ((m = text.match(/^(.+) atmosphere$/))) return 'أجواء '+translate(arabicName(m[1]));
    if ((m = text.match(/^The (.+) story$/))) return 'حكاية '+arabicName(m[1]);
    if (text==='Ingredients and details') return 'المكوّنات والتفاصيل';
    if (text.includes(', ') && text.split(', ').every(x => dictionary[x])) return text.split(', ').map(translate).join('، ');
    return text;
  }
  let language = 'en';
  try { language = new URLSearchParams(location.search).get('lang') || localStorage.getItem('webcraft-language') || 'en'; } catch {}
  language = language === 'ar' ? 'ar' : 'en';
  const textSources = new WeakMap();
  const attrSources = new WeakMap();
  const originalTitle = document.title;
  const originalDescription = document.querySelector('meta[name="description"]')?.content || '';
  let toggle;
  let observer;
  const quote = (plan, extras, total) => {
    if(language!=='ar') return null;
    return 'مرحبًا WebCraft، أود مناقشة الباقة '+translate(plan)+'. الميزانية التقديرية: '+total.toLocaleString('en-US')+' دينار أردني. الإضافات: '+(extras.length?extras.map(translate).join('، '):'لا يوجد')+'. أرجو تأكيد متطلبات مشروعي وعرض السعر.';
  };
  const whatsapp = value => {
    if (dictionary[value]) return dictionary[value];
    let m;
    if ((m=value.match(/^Hello WebCraft, I'd like to discuss the (.+) package\. Estimated budget: JOD ([\d,]+)\. Extras: (.+)\. Please confirm my project scope and quote\.$/))) return quote(m[1],m[3]==='None'?[]:m[3].split(', '),Number(m[2].replaceAll(',','')));
    if ((m=value.match(/^Hello WebCraft, I like the (.+) (Restaurant|Coffee house|Artisan bakery) concept and would like to discuss a website for my business\.$/))) return 'مرحبًا WebCraft، أعجبني نموذج '+arabicName(m[1])+' ('+translate(m[2])+') وأود مناقشة تصميم موقع لمشروعي.';
    return value;
  };
  function changeText(node) {
    const current=node.nodeValue;
    if (!current.trim()) return;
    const stored=textSources.get(node);
    const original=stored && current===stored.output ? stored.original : current;
    const translated=normalize(original)==='to' && node.parentElement?.closest('.section.faq h2') ? 'تستحق' : translate(original);
    const output=language==='ar'?original.replace(original.trim(),translated):original;
    if(current!==output) node.nodeValue=output;
    textSources.set(node,{original,output});
  }
  function walk(parent) {
    if(parent.nodeType===1 && parent.hasAttribute('data-no-translate')) return;
    if(parent.nodeType===1 && /^(SCRIPT|STYLE|NOSCRIPT|TEXTAREA)$/.test(parent.tagName)) return;
    if(parent===toggle) return;
    for(const child of [...parent.childNodes]) {
      if(child.nodeType===3) changeText(child);
      else if(child.nodeType===1) walk(child);
    }
  }
  function attributes() {
    document.querySelectorAll('[aria-label],[alt],[placeholder],[title]').forEach(el=>{
      if(el===toggle) return;
      const stored=attrSources.get(el)||{};
      for(const name of ['aria-label','alt','placeholder','title']){
        if(!el.hasAttribute(name)) continue;
        const current=el.getAttribute(name);
        const original=stored[name] && current===stored[name].output ? stored[name].original : current;
        const output=language==='ar'?translate(original):original;
        if(current!==output) el.setAttribute(name,output);
        stored[name]={original,output};
      }
      attrSources.set(el,stored);
    });
  }
  function links() {
    document.querySelectorAll('a[href]').forEach(a=>{
      const href=a.getAttribute('href');
      if(href.startsWith('https://wa.me/')){
        if(!a.dataset.englishHref) a.dataset.englishHref=href;
        const link=new URL(a.dataset.englishHref);
        if(language==='ar') link.searchParams.set('text',whatsapp(link.searchParams.get('text')||''));
        if(a.href!==link.href) a.href=link.href;
      } else if(href.startsWith('index.html') || href.includes('/index.html') || href.includes('/concept.html') || href.startsWith('concept.html') || href.startsWith('/#') || href.startsWith('/?') || href.startsWith('/concept.html')){
        const link=new URL(href,location.href);
        link.searchParams.set('lang',language);
        const target=link.pathname+link.search+link.hash;
        if(href!==target)a.setAttribute('href',target);
      }
    });
  }
  function metadata() {
    if(language==='en'){document.title=originalTitle;}
    else if(document.querySelector('.site-header')){
      const params=new URLSearchParams(location.search);
      const brand={sufra:'سفرة',sahab:'سحاب',forn:'فرن',nabaa:'سفرة'}[params.get('project')]||'سحاب';
      const page={home:'الرئيسية',menu:'القائمة',story:'حكايتنا',gallery:'الصور',contact:'الزيارة',services:'القائمة'}[params.get('page')]||'الرئيسية';
      document.title=brand+' — '+page+' | نموذج WebCraft';
    } else document.title='WebCraft — مواقع تمنح أعمالك حضورًا مميّزًا';
    const meta=document.querySelector('meta[name="description"]');
    if(meta)meta.content=language==='en'?originalDescription:document.querySelector('.site-header')?'نموذج موقع ضيافة متكامل من تصميم WebCraft. تصفّح القائمة والحكاية والصور.':'تصمّم WebCraft مواقع سريعة ومتجاوبة للشركات والمطاعم والمقاهي والمخابز. استكشف أعمالنا وقدّر تكلفة مشروعك.';
  }
  function apply() {
    observer?.disconnect();
    document.documentElement.lang=language;
    document.documentElement.dir=language==='ar'?'rtl':'ltr';
    walk(document.body);attributes();links();metadata();
    if(toggle){
      toggle.textContent=language==='ar'?'English':'العربية';
      toggle.lang=language==='ar'?'en':'ar';
      toggle.dir=language==='ar'?'ltr':'rtl';
      toggle.setAttribute('aria-label',language==='ar'?'Switch to English':'التبديل إلى العربية');
    }
    observer?.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['aria-label','alt','placeholder','title']});
  }
  function setLanguage(next) {
    language=next==='ar'?'ar':'en';
    try{localStorage.setItem('webcraft-language',language);}catch{}
    try{const url=new URL(location.href);url.searchParams.set('lang',language);history.replaceState(null,'',url.pathname+url.search+url.hash);}catch{}
    apply();
    document.dispatchEvent(new CustomEvent('webcraft:language',{detail:{language}}));
  }
  window.WebCraftI18n={translate,quote,apply,setLanguage,get language(){return language;}};
  const header=document.querySelector('.nav,.site-header');
  if(header){
    toggle=document.createElement('button');
    toggle.type='button';toggle.className='language-toggle';
    toggle.addEventListener('click',()=>setLanguage(language==='ar'?'en':'ar'));
    header.insertBefore(toggle,header.querySelector('.menu,.nav-toggle'));
  }
  observer=new MutationObserver(()=>apply());
  setLanguage(language);
})();
