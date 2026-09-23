// Pure pricing rules: detailed requirements never silently imply a fixed quote.
window.WebCraftEstimate = function(a, d, selected, plans, extras) {
  const warnings=[], review=[], included=[];
  const get=key=>d[key]||'';
  const count=Number(get('Exact page count (optional)'));
  const validCount=Number.isInteger(count)&&count>0&&count<=100;
  const plan=validCount?(count>8?'premium':count>4?'professional':'basic'):(a.size==='large'?'premium':a.size==='medium'?'professional':'basic');
  if(validCount && ((a.size==='one'&&count!==1)||(a.size==='small'&&count>4)||(a.size==='medium'&&(count<5||count>8))||(a.size==='large'&&count<=8)))warnings.push('The exact page count overrides the page range when choosing the base package.');
  const ids=new Set([...(a.functions||[]),...selected]);
  if(a.type==='store')ids.add('ecommerce');
  if(a.language==='bilingual')ids.add('bilingual');
  if(a.content==='writing')ids.add('content_writing');
  if(a.seo==='advanced')ids.add('advanced_seo');
  if(a.delivery==='priority')ids.add('priority_delivery');
  const editing=get('Content editing needs');
  if(editing==='Edit text and photos')ids.add('cms');
  if(editing==='Manage products or menu' && a.type!=='store')ids.add('cms');
  if(a.type==='store' && ids.has('cms')){ids.delete('cms');included.push('cms');}
  if(editing==='Multiple staff accounts')review.push('Staff roles and permissions need a separate quote.');
  if(ids.has('booking')){
    const booking=get('Booking workflow');
    if(booking==='WhatsApp reservation enquiry'){ids.delete('booking');included.push('booking');}
    else if(booking!=='Simple appointment calendar'){ids.delete('booking');review.push('Define the booking workflow before pricing it; no booking fee has been added.');}
  }
  if(plan==='professional'&&ids.has('analytics')){ids.delete('analytics');included.push('analytics');}
  if(plan!=='basic'&&ids.has('premium_motion')){ids.delete('premium_motion');included.push('premium_motion');}
  const fulfil=get('Order fulfilment');
  if(a.type==='store'&&['Display only; no orders','Enquiries through WhatsApp'].includes(fulfil))warnings.push('Full store selected, but fulfilment is display or WhatsApp only. Choose catalogue or WhatsApp requests if you do not need a cart. The store setup is still counted until you change that choice.');
  if(a.type!=='store'&&['Pickup','Local delivery','Shipping to multiple countries'].includes(fulfil))review.push('Confirm whether you need a cart and order management or only manual WhatsApp requests.');
  if(ids.has('payment_gateway')&&get('Payment provider status')==='No online payment needed')warnings.push('Online payment setup conflicts with no online payment needed. Remove the payment option or change the provider answer; setup remains counted until resolved.');
  if(get('External integrations').trim())review.push('External integrations need a technical review and are not priced in this subtotal.');
  if(get('External integrations').trim()&&get('Payment provider status')==='No online payment needed')warnings.push('An external integration was requested while online payment is not needed. Confirm whether the integration involves payments.');
  if(get('Translation readiness')==='I need translation help')review.push('Content translation is not included in language setup; translation needs a separate quote.');
  if(a.language==='single'&&get('Translation readiness')==='I will provide both languages')warnings.push('One language was selected but two-language content was requested. Confirm the required languages.');
  if(a.language==='bilingual'&&get('Translation readiness')==='Only one language needed')warnings.push('Two languages were selected but only one is needed in the details. Confirm the required languages.');
  if(['26–100 products','More than 100 products'].includes(get('Approximate product count')))review.push('Catalogue size, product entry and variants require a separate review.');
  if(fulfil==='Shipping to multiple countries')review.push('International shipping, taxes and delivery rules are not included in this subtotal.');
  if(['I need image sourcing','I need a photo shoot'].includes(get('Photos')))review.push('Image sourcing or photography needs a separate quote.');
  if(get('Existing site / migration')==='Migrate content and URLs')review.push('Content and URL migration needs a separate quote.');
  if(get('Logo and brand assets')==='Need a new visual direction'&&!ids.has('brand_system'))review.push('The requested brand work is not included; confirm its deliverables and price.');
  if(get('Other requirements').trim())review.push('Additional notes require scope confirmation and may change the price.');
  const total=plans[plan].price+[...ids].reduce((sum,id)=>sum+(extras[id]?.price||0),0);
  const cap={'Under 300':299,'300–600':600,'600–1,000':1000}[get('Budget range (JOD)')];
  if(cap && total>cap)warnings.push('The priced subtotal exceeds your selected budget. Reduce the scope or discuss a phased launch; the budget does not automatically change our prices.');
  return {plan,ids:[...ids],included,total,warnings:[...new Set(warnings)],review:[...new Set(review)]};
};
