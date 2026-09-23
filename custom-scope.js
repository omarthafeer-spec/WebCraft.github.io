window.WebCraftScope = function(blueprint) {
  const unspecified=['','Not decided yet'];
  const fields=[];
  const sections=[...blueprint.querySelectorAll('.blueprint-step[data-index]')].slice(0,7);
  const sourceLabels=new WeakMap();
  sections.forEach(p=>p.querySelectorAll('h3,.blueprint-option').forEach(el=>sourceLabels.set(el,el.matches('h3')?el.textContent:el.firstChild.textContent.trim())));
  const make=(step,title,type,options=[],hint='')=>{
    const id='scope-'+fields.length;
    const wrap=document.createElement('label');wrap.className='scope-field';
    const caption=document.createElement('span');caption.textContent=title;wrap.append(caption);
    const input=document.createElement(type==='select'?'select':type==='textarea'?'textarea':'input');
    input.id=id;input.name=id;
    if(type==='select') [unspecified,...options.map(x=>[x,x])].forEach(([value,label])=>{const o=document.createElement('option');o.value=value;o.textContent=label;input.append(o);});
    else {input.type=type;input.maxLength=type==='textarea'?1200:250;if(type==='number'){input.min='1';input.max='100';input.step='1';}}
    if(hint){const help=document.createElement('small');help.id=id+'-hint';help.textContent=hint;input.setAttribute('aria-describedby',help.id);wrap.append(input,help);}else wrap.append(input);
    sections[step].querySelector('.scope-fields').append(wrap);
    fields.push({title,input,type});
    return input;
  };
  sections.forEach(panel=>{
    const d=document.createElement('details');d.className='scope-details';
    d.innerHTML='<summary>Project details <span aria-hidden="true">+</span></summary><p>Optional details for a more useful quote. Your answers stay on this page until you send them through WhatsApp.</p><div class="scope-fields"></div>';
    panel.querySelector('.blueprint-actions').before(d);
  });
  make(0,'Business activity','select',['Restaurant or café','Bakery or food business','Professional services','Retail','Other']);
  make(0,'Main goal','select',['Get enquiries','Show services','Show a menu or catalogue','Sell products']);
  make(0,'Target audience / location','text');
  make(1,'Exact page count (optional)','number',[],'A page is a separate address, not a section on the home page. Exact counts outside the selected package need a revised quote.');
  make(1,'Page names','textarea',[],'Example: Home, About, Menu, Gallery, Contact');
  make(2,'Translation readiness','select',['Only one language needed','I will provide both languages','I need translation help'],'Language setup and content translation are different services. Translation help is quoted after reviewing the text.');
  make(3,'Content editing needs','select',['No editing tools needed','Edit text and photos','Manage products or menu','Multiple staff accounts']);
  make(3,'Approximate product count','select',['No products','1–25 products','26–100 products','More than 100 products']);
  make(3,'Order fulfilment','select',['Display only; no orders','Enquiries through WhatsApp','Pickup','Local delivery','Shipping to multiple countries']);
  make(3,'Payment provider status','select',['No online payment needed','I already have an approved account','I need help choosing a provider']);
  make(3,'External integrations','textarea',[],'Example: CRM, delivery service, accounting software');
  const note=document.createElement('p');note.className='scope-note';note.textContent='Advanced workflows, product entry, shipping rules and third-party integrations need a separate review. They are not silently included in the estimate.';
  sections[3].querySelector('.scope-details').append(note);
  make(4,'Logo and brand assets','select',['Ready to use','Need a new visual direction']);
  make(4,'Photos','select',['I have licensed photos','I need image sourcing','I need a photo shoot']);
  make(4,'Design direction','select',['Clean and minimal','Warm and welcoming','Dark and premium','Bright and playful']);
  make(4,'Reference websites','textarea');
  const additions=document.createElement('fieldset');additions.className='scope-additions';
  additions.innerHTML='<legend>Optional priced additions</legend><label><input type="checkbox" value="premium_motion"><span>Extra motion: +JOD 120 for Basic; included in Professional and Premium.</span></label><label><input type="checkbox" value="brand_system"><span>Mini brand system: +JOD 180. Final deliverables agreed in the quote.</span></label>';
  sections[4].querySelector('.scope-details').append(additions);
  make(5,'Existing domain','select',['I already own a domain','I need a new domain']);
  make(5,'Existing hosting','select',['I already have hosting','I need hosting advice']);
  make(5,'Existing site / migration','select',['This is a new website','Replace an existing site','Migrate content and URLs'],'Hosting, domain renewals, paid images, translations and migration are excluded from the displayed estimate.');
  make(6,'Preferred launch date','date',[],'A preferred date is not a confirmed deadline. Availability and final scope must be agreed first.');
  make(6,'Budget range (JOD)','select',['Under 300','300–600','600–1,000','Over 1,000']);
  make(6,'Other requirements','textarea',[],'Mention your must-have features. Do not include passwords, card details or sensitive customer data.');
  make(3,'Booking workflow','select',['WhatsApp reservation enquiry','Simple appointment calendar','Tables, staff or complex availability']);
  const brief=document.createElement('section');brief.className='scope-brief';
  brief.innerHTML='<h4>Your project brief</h4><p>Detailed requirements are for scoping, not an automatic fixed-price promise. Only the listed priced additions are counted in the total.</p><dl class="scope-answers"></dl><h4>Itemised estimate</h4><div class="scope-costs"></div>';
  blueprint.querySelector('.blueprint-result').append(brief);
  const tr=s=>window.WebCraftI18n?.language==='ar'?window.WebCraftI18n.translate(s):s;
  function row(root,label,value,customer=false) {
    const group=document.createElement('div'), dt=document.createElement('dt'),dd=document.createElement('dd');
    dt.textContent=label;dd.textContent=value;
    if(customer)dd.setAttribute('data-no-translate','');
    group.append(dt,dd);root.append(group);
  }
  return {
    values:()=>Object.fromEntries(fields.map(f=>[f.title,f.input.value||''])),
    extras:()=>[...additions.querySelectorAll('input')].filter(i=>i.checked).map(i=>i.value),
    valid:()=>fields.every(f=>!f.input.value || !f.input.checkValidity || f.input.checkValidity()),
    reset:()=>{fields.forEach(f=>f.input.value='');additions.querySelectorAll('input').forEach(i=>i.checked=false);brief.querySelector('.scope-answers').replaceChildren();brief.querySelector('.scope-costs').replaceChildren();},
    update:(plan,ids,extras,base,included=[])=>{
      const list=brief.querySelector('.scope-answers');list.replaceChildren();
      sections.forEach(panel=>{
        const selected=[...panel.querySelectorAll('.blueprint-option.selected')].map(b=>sourceLabels.get(b));
        selected.forEach(value=>row(list,sourceLabels.get(panel.querySelector('h3')),value));
      });
      fields.forEach(f=>{if((f.input.value||'').trim())row(list,f.title,f.input.value.trim(),f.type!=='select');});
      const costs=brief.querySelector('.scope-costs');costs.replaceChildren();
      row(costs,'Base package','JOD '+base);
      ids.forEach(id=>row(costs,extras[id].name,'JOD '+extras[id].price));
      included.forEach(id=>row(costs,extras[id].name,'Included in the selected package'));
      // Detailed requirements are reviewed, never silently priced as included.
      if(fields.some(f=>(f.input.value||'').trim()))row(costs,'Needs individual review','Detailed requirements are for scoping, not an automatic fixed-price promise. Only the listed priced additions are counted in the total.');
    },
    text:()=>tr('Your project brief')+'\n'+[...brief.querySelectorAll('.scope-answers>div,.scope-costs>div')].map(r=>[...r.children].map(c=>c.textContent).join(': ')).join('\n')
  };
};
