(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const money = (value) => `JOD ${Number(value).toLocaleString('en-US')}`;

  const plans = {
    basic: { name: 'Basic', price: 249, original: 349 },
    professional: { name: 'Professional', price: 499, original: 749 },
    premium: { name: 'Premium', price: 849, original: 1299 }
  };
  const extras = {
    extra_page: { name: 'Extra page', price: 35 },
    bilingual: { name: 'Arabic + English', price: 90 },
    booking: { name: 'Booking system', price: 80 },
    ecommerce: { name: 'E-commerce', price: 250 },
    payment_gateway: { name: 'Online payment setup', price: 150 },
    domain: { name: 'Domain registration', price: 18 },
    hosting: { name: '1-year hosting', price: 85 },
    content_writing: { name: 'Content writing', price: 120 },
    advanced_seo: { name: 'Advanced SEO', price: 130 },
    priority_delivery: { name: 'Priority delivery', price: 100 },
    premium_motion: { name: 'Premium motion', price: 120 },
    brand_system: { name: 'Mini brand system', price: 180 },
    cms: { name: 'Content manager', price: 100 },
    analytics: { name: 'Analytics setup', price: 45 }
  };

  function addRuntimeStyles() {
    if (!$('link[href="blueprint.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'blueprint.css';
      document.head.append(link);
    }
    const style = document.createElement('style');
    style.textContent = `
      body{padding-top:82px}.nav{position:fixed!important;inset:0 0 auto 0;height:82px!important;background:rgba(5,8,13,.78);backdrop-filter:blur(18px);border-bottom-color:rgba(185,231,255,.12)!important;z-index:25!important}
      .nav-scrolled{box-shadow:0 14px 45px rgba(0,0,0,.3)}
      .hero{padding-top:95px}.hero-meta strong{font-size:18px}.hero-meta small{max-width:120px}
      .project{cursor:pointer}.project-visual{background-size:cover!important;background-position:center!important;border:1px solid rgba(185,231,255,.15)}.project-visual:after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,transparent 50%,rgba(2,7,12,.45));transition:.4s}.project:hover .project-visual:after{opacity:.35}.project-info .round-button{cursor:pointer}
      .old-price{font:500 18px Manrope;color:#698292;text-decoration:line-through;letter-spacing:0;margin-right:10px}.sale-label{display:inline-block;margin-top:8px;padding:4px 8px;border:1px solid rgba(92,229,255,.28);border-radius:99px;color:#5ce5ff;font:9px DM Mono;text-transform:uppercase}
      .launch-note{margin:0 0 28px;padding:18px 22px;display:flex;justify-content:space-between;gap:20px;border:1px solid rgba(92,229,255,.22);background:rgba(14,34,50,.65);border-radius:7px;color:#9db4c0;font-size:12px}.launch-note b{color:#fff}.launch-note span{color:#5ce5ff;white-space:nowrap}
      .toast{position:fixed;left:50%;bottom:28px;z-index:80;transform:translate(-50%,20px);opacity:0;background:#0c2030;border:1px solid rgba(92,229,255,.45);color:#eaf8ff;padding:11px 18px;border-radius:99px;font-size:12px;transition:.25s}.toast.show{opacity:1;transform:translate(-50%,0)}
      @media(max-width:760px){body{padding-top:68px}.nav{height:68px!important}.nav.open nav{display:flex;position:absolute;top:68px;left:0;right:0;flex-direction:column;gap:0;background:#07111b;border-bottom:1px solid rgba(185,231,255,.16);padding:10px 6vw 18px}.nav.open nav a{padding:12px 0}.hero{padding-top:74px}.launch-note{flex-direction:column}.scope-options{grid-template-columns:1fr}}
    `;
    document.head.append(style);
  }

  function toast(message) {
    let el = $('.toast');
    if (!el) {
      el = document.createElement('div');
      el.className = 'toast';
      document.body.append(el);
    }
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => el.classList.remove('show'), 2200);
  }

  function setHonestContent() {
    const meta = $('.hero-meta');
    if (meta) meta.innerHTML = '<div><strong>Responsive</strong><small>every screen considered</small></div><div><strong>Personal</strong><small>direct communication</small></div>';

    const testimonials = $('.testimonials');
    if (testimonials) testimonials.innerHTML = '<p class="section-number">07 / Our promise</p><div class="quote-slider"><article class="quote active"><blockquote>“Thoughtful design. Clear communication. A website that feels like your business.”</blockquote><p>— The WebCraft standard</p></article></div>';
  }

  function setupNavigation() {
    const nav = $('.nav');
    const menu = $('.menu');
    addEventListener('scroll', () => nav?.classList.toggle('nav-scrolled', scrollY > 12), { passive: true });
    menu?.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      menu.setAttribute('aria-expanded', String(open));
    });
    $$('.nav a').forEach((link) => link.addEventListener('click', () => nav?.classList.remove('open')));

    $$('.phone, .floating-contact, a[href^="tel:"]').forEach((link) => {
      link.href = 'tel:+962795069114';
      link.addEventListener('click', () => {
        if (navigator.clipboard) navigator.clipboard.writeText('0795069114').catch(() => {});
        toast('WebCraft: 0795069114');
      });
    });
  }

  function setupMotion() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    $$('.reveal').forEach((el) => observer.observe(el));
    $$('.magnetic').forEach((button) => {
      button.addEventListener('pointermove', (event) => {
        const rect = button.getBoundingClientRect();
        button.style.transform = `translate(${(event.clientX - rect.left - rect.width / 2) * .12}px, ${(event.clientY - rect.top - rect.height / 2) * .12}px)`;
      });
      button.addEventListener('pointerleave', () => button.style.transform = '');
    });
    addEventListener('load', () => setTimeout(() => $('.loader')?.classList.add('done'), 250));
    setTimeout(() => $('.loader')?.classList.add('done'), 1500);
  }

  function setupEnhancedMotion() {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const progress = document.createElement('i');
    progress.className = 'scroll-progress';
    document.body.append(progress);

    $$('.service-card,.reason-grid>div,.price-card,.project,.process li,.accordion details').forEach((item, index) => {
      item.style.setProperty('--stagger', `${(index % 4) * 70}ms`);
      if (!item.classList.contains('reveal')) item.classList.add('reveal');
    });

    const updateScroll = () => {
      const available = document.documentElement.scrollHeight - innerHeight;
      progress.style.transform = `scaleX(${available > 0 ? scrollY / available : 0})`;
      if (!reduced && innerWidth > 800) {
        const art = $('.hero-art');
        if (art) art.style.transform = `translate3d(0,${Math.min(scrollY * .09, 55)}px,0) rotate(${(-6 + scrollY * .002).toFixed(2)}deg)`;
      }
    };
    addEventListener('scroll', updateScroll, { passive: true });
    updateScroll();

    if (reduced || !matchMedia('(pointer:fine)').matches) return;
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.append(glow);
    addEventListener('pointermove', (event) => {
      glow.style.transform = `translate3d(${event.clientX}px,${event.clientY}px,0)`;
    }, { passive: true });

    $$('.service-card,.price-card,.project').forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - .5;
        const y = (event.clientY - rect.top) / rect.height - .5;
        card.style.setProperty('--mx', `${(event.clientX - rect.left).toFixed(0)}px`);
        card.style.setProperty('--my', `${(event.clientY - rect.top).toFixed(0)}px`);
        card.style.transform = `perspective(900px) rotateX(${(-y * 3).toFixed(2)}deg) rotateY(${(x * 3).toFixed(2)}deg) translateY(-5px)`;
      });
      card.addEventListener('pointerleave', () => card.style.transform = '');
    });

    $$('.button,.book-button,.round-button').forEach((button) => button.addEventListener('click', (event) => {
      const ripple = document.createElement('i');
      const rect = button.getBoundingClientRect();
      ripple.className = 'button-ripple';
      ripple.style.left = `${event.clientX - rect.left}px`;
      ripple.style.top = `${event.clientY - rect.top}px`;
      button.append(ripple);
      setTimeout(() => ripple.remove(), 650);
    }));
  }

  function setupAmbientBackground() {
    const scene = document.createElement('div');
    scene.className = 'ambient-scene';
    scene.setAttribute('aria-hidden', 'true');
    scene.innerHTML = `<i class="ambient-aurora aurora-a"></i><i class="ambient-aurora aurora-b"></i><i class="ambient-grid"></i><div class="ambient-particles">${Array.from({ length: 16 }, (_, index) => `<b style="--x:${(index * 37) % 100}%;--y:${(index * 61) % 100}%;--size:${2 + (index % 3)}px;--duration:${12 + (index % 6) * 3}s;--delay:${-index * 1.7}s"></b>`).join('')}</div>`;
    document.body.prepend(scene);
  }

  function totalFor(plan, addonIds = []) {
    return plans[plan].price + addonIds.reduce((sum, id) => sum + (extras[id]?.price || 0), 0);
  }

  function quoteLink(plan, addonIds = []) {
    const message = `Hello WebCraft, I'd like to discuss the ${plans[plan].name} package. Estimated budget: ${money(totalFor(plan, addonIds))}. Extras: ${addonIds.map(id => extras[id].name).join(', ') || 'None'}. Please confirm my project scope and quote.`;
    const localized = window.WebCraftI18n?.quote(plans[plan].name, addonIds.map(id => extras[id].name), totalFor(plan, addonIds));
    return 'https://wa.me/962795069114?text=' + encodeURIComponent(localized || message);
  }

  function setupPricing() {
      $$('.price-card').forEach(card => {
      const key = card.dataset.package;
      $('.price', card).innerHTML = '<sup>JOD</sup>' + plans[key].price;
      const action = $('.book-button', card);
      const link = document.createElement('a');
      link.className = 'book-button';
      link.href = quoteLink(key);
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.innerHTML = 'Discuss ' + plans[key].name + ' <b>↗</b>';
      action.replaceWith(link);
    });
  }

  function buildBlueprint() {
    const grid = $('.pricing-grid');
    if (!grid || $('#blueprint')) return;
    const steps = [
      { key: 'type', title: 'What are you building?', options: [['landing','Focused landing page'],['business','Business website'],['portfolio','Portfolio website'],['catalogue','Menu or product catalogue'],['whatsapp','Product requests through WhatsApp'],['store','Full store with cart and orders']] },
      { key: 'size', title: 'How much content?', options: [['one','One focused page'],['small','Up to 4 pages'],['medium','Up to 8 pages'],['large','More than 8 pages']] },
      { key: 'language', title: 'Which languages?', options: [['single','One language'],['bilingual','Arabic + English']] },
      { key: 'functions', title: 'What should it do?', multiple: true, options: [['booking','Accept bookings'],['payment_gateway','Accept online payments'],['cms','Let me edit content'],['analytics','Track visitors']] },
      { key: 'content', title: 'Is your content ready?', options: [['ready','Yes, content is ready'],['writing','I need content writing']] },
      { key: 'seo', title: 'How much search support?', options: [['basic','SEO-ready structure'],['advanced','Advanced SEO setup']] },
      { key: 'delivery', title: 'Preferred timeline?', options: [['standard','Standard schedule'],['priority','Priority delivery']] }
    ];
    const blueprint = document.createElement('section');
    blueprint.id = 'blueprint';
    blueprint.className = 'blueprint reveal';
    blueprint.innerHTML = `<div class="blueprint-top"><div><span>WebCraft project blueprint</span><h3>Build a clearer estimate.</h3></div><div><span class="blueprint-count">Step 1 of ${steps.length}</span><div class="blueprint-progress"><i></i></div></div></div><div class="blueprint-body">${steps.map((step, index) => `<div class="blueprint-step${index === 0 ? ' active' : ''}" data-index="${index}"><small>0${index + 1} / YOUR PROJECT</small><h3>${step.title}</h3><div class="blueprint-options">${step.options.map(([value,label]) => `<button type="button" class="blueprint-option" data-value="${value}">${label}<span>${step.multiple ? 'Select if needed' : 'Choose this option'}</span></button>`).join('')}</div><div class="blueprint-actions"><button type="button" class="blueprint-restart">Start over</button><button type="button" class="blueprint-next" disabled>${index === steps.length - 1 ? 'See my estimate' : 'Continue →'}</button></div></div>`).join('')}<div class="blueprint-step" data-index="${steps.length}"><div class="blueprint-result"><div><small>YOUR RECOMMENDED START</small><h3 class="result-title"></h3><p>This is a transparent starting estimate. WebCraft confirms the exact scope with you before production begins.</p><p class="estimate-exclusions">Estimate only. Domain, hosting, provider fees and renewals are excluded. Store and gateway setup are added only when selected; provider approval and running costs remain separate.</p><button type="button" class="blueprint-restart">Start over</button></div><div class="result-card"><p><span>Base package</span><b class="result-base"></b></p><p><span>Selected extras</span><b class="result-extras"></b></p><p><span>Estimated total</span><b class="result-price"></b></p><button type="button" class="button blueprint-book">Discuss this estimate ↗</button><button type="button" class="copy-estimate">Copy estimate</button><p class="copy-status" role="status" aria-live="polite"></p></div></div></div></div>`;
    grid.before(blueprint);
    const scope = window.WebCraftScope?.(blueprint);
    const status=document.createElement('p');status.className='estimate-status';status.setAttribute('role','status');$('.result-card',blueprint).prepend(status);
    const alerts=document.createElement('div');alerts.className='estimate-alerts';$('.blueprint-result',blueprint).append(alerts);
    $('.copy-estimate', blueprint).addEventListener('click', async () => {
      const text = $('.result-title', blueprint).textContent + '\n' + [...blueprint.querySelectorAll('.result-card > p:not(.copy-status)')].map(p => p.textContent).join('\n') + '\n' + $('.estimate-exclusions', blueprint).textContent;
      const status = $('.copy-status', blueprint);
      try {
        await navigator.clipboard.writeText(text + '\n' + (scope?.text() || '') + '\n' + $('.estimate-alerts',blueprint).textContent);
        status.textContent = 'Estimate copied';
      } catch {
        status.textContent = 'Could not copy automatically. Select and copy the estimate text.';
      }
    });

    const answers = {};
    let current = 0;
    const render = () => {
      $$('.blueprint-step', blueprint).forEach((step, i) => step.classList.toggle('active', i === current));
      $('.blueprint-count', blueprint).textContent = current < steps.length ? `Step ${current + 1} of ${steps.length}` : 'Estimate ready';
      $('.blueprint-progress i', blueprint).style.width = `${Math.min(100, ((current + 1) / steps.length) * 100)}%`;
      const heading=$('.blueprint-step.active h3',blueprint);
      if(heading){heading.tabIndex=-1;heading.focus?.({preventScroll:true});}
      blueprint.scrollIntoView?.({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
    };
    const reset = () => {
      scope?.reset();
      Object.keys(answers).forEach((key) => delete answers[key]);
      $$('.blueprint-option.selected', blueprint).forEach((button) => button.classList.remove('selected'));
      $$('.blueprint-next', blueprint).forEach((button) => button.disabled = !steps[Number(button.closest('.blueprint-step').dataset.index)].multiple);
      current = 0;
      render();
    };
    $$('.blueprint-step[data-index]', blueprint).slice(0, steps.length).forEach((panel, index) => {
      if(index>0){
        const back=document.createElement('button');back.type='button';back.className='blueprint-back';back.textContent='Back';
        back.addEventListener('click',()=>{current=index-1;render();});
        $('.blueprint-actions',panel).prepend(back);
      }
      const step = steps[index];
      if (step.multiple) $('.blueprint-next', panel).disabled = false;
      $$('.blueprint-option', panel).forEach((button) => button.addEventListener('click', () => {
        if (step.multiple) {
          button.classList.toggle('selected');
          answers[step.key] = $$('.blueprint-option.selected', panel).map((item) => item.dataset.value);
          $('.blueprint-next', panel).disabled = false;
        } else {
          $$('.blueprint-option', panel).forEach((item) => item.classList.remove('selected'));
          button.classList.add('selected');
          answers[step.key] = button.dataset.value;
          $('.blueprint-next', panel).disabled = false;
        }
      }));
      $('.blueprint-next', panel).addEventListener('click', () => {
        if([...panel.querySelectorAll('input')].some(input=>input.value && input.checkValidity && !input.checkValidity())){panel.querySelector('.scope-details').open=true;panel.querySelectorAll('input').forEach(input=>input.reportValidity?.());return;}
        if (index < steps.length - 1) { current += 1; render(); return; }
        const estimate = window.WebCraftEstimate(answers, scope?.values() || {}, scope?.extras() || [], plans, extras);
        const {plan, ids:unique, included} = estimate;
        blueprint.dataset.plan = plan;
        blueprint.dataset.addons = unique.join(',');
        $('.result-title', blueprint).textContent = `${plans[plan].name} package`;
        $('.result-base', blueprint).textContent = money(plans[plan].price);
        $('.result-extras', blueprint).textContent = unique.length ? unique.map((id) => extras[id].name).join(', ') : 'None';
        $('.result-price', blueprint).textContent = money(totalFor(plan, unique));
        scope?.update(plan,unique,extras,plans[plan].price,included);
        const alerts=$('.estimate-alerts',blueprint);alerts.replaceChildren();
        const addNote=(title,items)=>{if(!items.length)return;const heading=document.createElement('h4');heading.textContent=title;const list=document.createElement('ul');items.forEach(message=>{const li=document.createElement('li');li.textContent=message;list.append(li);});alerts.append(heading,list);};
        addNote('Check these answers',estimate.warnings);
        addNote('Not included in the priced subtotal',estimate.review);
        $('.result-price',blueprint).previousElementSibling.textContent='Priced subtotal';
        $('.estimate-status',blueprint).textContent=estimate.review.length||estimate.warnings.length?'Incomplete estimate — review required before a final quote.':'Starting estimate — final scope confirmed in writing.';
        window.WebCraftI18n?.apply();
        current = steps.length;
        render();
      });
    });
    $$('.blueprint-restart', blueprint).forEach((button) => button.addEventListener('click', reset));
    const edit=document.createElement('button');edit.type='button';edit.className='blueprint-back';edit.textContent='Edit my answers';edit.addEventListener('click',()=>{current=0;render();});$('.blueprint-result',blueprint).prepend(edit);
    $('.blueprint-book', blueprint).addEventListener('click', () => {
      const link=new URL(quoteLink(blueprint.dataset.plan, (blueprint.dataset.addons || '').split(',').filter(Boolean)));
      link.searchParams.set('text',link.searchParams.get('text')+'\n\n'+$('.estimate-status',blueprint).textContent+'\n'+(scope?.text() || '')+'\n'+$('.estimate-alerts',blueprint).textContent);
      window.open(link.href, '_blank', 'noopener,noreferrer');
    });
  }

  addRuntimeStyles();
  setHonestContent();
  setupAmbientBackground();
  setupNavigation();
  setupPricing();
  buildBlueprint();
  setupEnhancedMotion();
  setupMotion();
})();
