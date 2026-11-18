/*
 * Elegancia — ملف تشغيل المتجر
 * هذا الملف مسؤول عن عرض الصفحات، المنتجات، السلة، المفضلة، والبحث.
 * ملاحظة للمبتدئ: لا تغيّر أسماء الدوال المستخدمة في onclick داخل الواجهات.
 */
'use strict';
const app=document.getElementById('app');
// المنتجات مكتوبة بالتفصيل في js/products.js
const products = window.ELEGANCIA_PRODUCTS;
let page='onboard',selected=products[0],size=38,filter='الكل',cart=JSON.parse(localStorage.getItem('eleganciaCart')||'[]').filter(x=>x.id<=20),fav=JSON.parse(localStorage.getItem('eleganciaFav')||'[]'),shipping=3,orderNumber='EG784532',slideIndex=0,sliderTimer=null,selectedColor=0,customer={
    name:'',phone:'',address:'',location:''
};
const img=n=>'images/'+n,price=n=>'$'+n.toFixed(2),persist=()=>{
    localStorage.setItem('eleganciaCart',JSON.stringify(cart));
    localStorage.setItem('eleganciaFav',JSON.stringify(fav))
};
const status=()=>'';
const header=(title,back='home')=>`<div class="header"><button class="iconbtn" onclick="go('${back}')">‹</button><h2>${title}</h2><div class="icons"><button class="iconbtn" onclick="go('search')" aria-label="البحث عن الأحذية"><svg viewBox="0 0 24 24" width="23" height="23" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.4" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="m15.5 15.5 5 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></button><button class="iconbtn" onclick="go('cart')"><svg class="bag-icon" viewBox="0 0 24 24" width="25" height="25" aria-hidden="true"><path d="M5 8h14l1 13H4L5 8Z" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linejoin="round"/><path d="M9 9V6a3 3 0 0 1 6 0v3" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round"/><path d="M12 13c-2.6-2.5-4.7.4 0 2.5 4.7-2.1 2.6-5 0-2.5Z" fill="none" stroke="currentColor" stroke-width="1"/></svg></button></div></div>`;
const homeHeader=()=>`<div class="header home-header elegant-header"><div class="header-left"><button class="iconbtn" onclick="go('cart')" aria-label="السلة"><svg class="bag-icon" viewBox="0 0 24 24" width="25" height="25" aria-hidden="true"><path d="M5 8h14l1 13H4L5 8Z" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linejoin="round"/><path d="M9 9V6a3 3 0 0 1 6 0v3" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round"/><path d="M12 13c-2.6-2.5-4.7.4 0 2.5 4.7-2.1 2.6-5 0-2.5Z" fill="none" stroke="currentColor" stroke-width="1"/></svg></button></div><h2><span class="brand">Elegancia</span></h2><div class="header-right"><button class="iconbtn" onclick="go('search')" aria-label="البحث عن الأحذية"><svg viewBox="0 0 24 24" width="23" height="23" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.4" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="m15.5 15.5 5 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></button></div></div>`;
function toggleHeaderHeart(){
    const liked=localStorage.getItem('eleganciaHeaderHeart')==='1';
    localStorage.setItem('eleganciaHeaderHeart',liked?'0':'1');
    render();
}
let categoryLikes=JSON.parse(localStorage.getItem('eleganciaCategoryLikes')||'[]');
function toggleCategoryLike(name){
    categoryLikes=categoryLikes.includes(name)?categoryLikes.filter(x=>x!==name):[...categoryLikes,name];
    localStorage.setItem('eleganciaCategoryLikes',JSON.stringify(categoryLikes));
    render();
}
const nav=()=>`<nav class="bottom" dir="rtl">${[['home','الرئيسية'],['categories','الأقسام'],['favorites','المفضلة'],['cart','السلة']].map(([p,t])=>`<button type="button" class="${page===p?'active':''}" onclick="go('${p}')"><span class="nav-icon">${({
    home:'<svg viewBox="0 0 24 24"><path d="M3 10.5 12 3l9 7.5V21h-6.6v-7H9.6v7H3Z" fill="currentColor"/></svg>',categories:'<svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>',favorites:'<svg viewBox="0 0 24 24"><path d="M20.8 5.1a5.1 5.1 0 0 0-7.2 0L12 6.7l-1.6-1.6a5.1 5.1 0 0 0-7.2 7.2L12 21l8.8-8.7a5.1 5.1 0 0 0 0-7.2Z"/></svg>',cart:'<svg viewBox="0 0 24 24"><path d="M5 8h14l1 13H4L5 8Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/><path d="M12 13c-2.6-2.5-4.7.4 0 2.5 4.7-2.1 2.6-5 0-2.5Z"/></svg>'})[p]}</span><span class="nav-label">${t}</span>${p==='cart'&&cart.length?`<span class="nav-count">${cart.reduce((n,x)=>n+x.qty,0)}</span>`:''}</button>`).join('')}</nav>`;
    const wrap=(body,showNav=true)=>`<main class="screen">${status()}${body}</main>${showNav?nav():''}`;
    const card=p=>`<div class="product" onclick="openProduct(${p.id})"><img loading="lazy" decoding="async" src="${img(p.img)}" alt="${p.name}"><button class="heart ${fav.includes(p.id)?'is-liked':''}" type="button" aria-label="إضافة للمفضلة" onclick="event.stopPropagation();toggleFav(${p.id})"><svg viewBox="0 0 24 24" width="23" height="23" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/></svg></button><p class="product-name">${p.name}</p><strong>${price(p.price)}</strong></div>`;
    let searchTerm='';
    function normalizeArabic(v){
        return v.toLocaleLowerCase('ar').replace(/[أإآ]/g,'ا').replace(/ة/g,'ه').replace(/[ًٌٍَُِّْـ]/g,'').trim();
    }
    function updateSearch(value){
        searchTerm=value;const results=document.getElementById('search-results');if(!results)return;const q=normalizeArabic(value);const found=products.filter(p=>normalizeArabic(p.name+' '+p.category).includes(q));results.innerHTML=found.length?found.map(card).join(''):'<p class="empty">ما لقينا أصناف مطابقة للبحث</p>';const count=document.getElementById('search-count');if(count)count.textContent=found.length+' صنف';
    }
    function go(p){
        page=p;render();window.scrollTo(0,0)
    }
    function changeSlide(n){
        slideIndex=(n+4)%4;document.querySelectorAll('.slide').forEach((el,i)=>el.classList.toggle('active',i===slideIndex));document.querySelectorAll('.slide-dot').forEach((el,i)=>el.classList.toggle('active',i===slideIndex));
    }
    function startSlides(){
        clearInterval(sliderTimer);if(page==='home'){
            sliderTimer=setInterval(()=>changeSlide(slideIndex+1),4500);
        }
    }
    function openProduct(id){
        selected=products.find(x=>x.id===id);selectedColor=0;go('detail')
    }
    function setProductColor(i){
        selectedColor=i;const photo=document.getElementById('detail-color-photo');if(photo){
            photo.src=productColorImage(selected.id,i);photo.alt=selected.name+' - '+colorOptions[i].name;
        }document.querySelectorAll('.color-dot').forEach((b,j)=>{
            b.classList.toggle('active',j===i);b.setAttribute('aria-pressed',String(j===i));
        });
    }
    const colorOptions=[{
        name:'فضي',hex:'#c9bdc1'
    },{
        name:'خمري',hex:'#850b30'
    },{
        name:'وردي',hex:'#e7aa9f'
    },{
        name:'أسود',hex:'#29242a'
    }];
    // اختيار الصورة الحقيقية المرتبطة بلون المنتج من ملف products.js
    const productColorImage = (id, i) => {
        const product = products.find(item => item.id === id);
        const keys = ['silver', 'burgundy', 'pink', 'black'];
        const filename = product?.colors?.[keys[i]];
        return 'images/' + (filename || ('color-' + String(id).padStart(2, '0') + '-' + i + '.webp'));
    };
    function toggleFav(id){
        fav=fav.includes(id)?fav.filter(x=>x!==id):[...fav,id];persist();render()
    }
    function addCart(){
        let item=cart.find(x=>x.id===selected.id&&x.size===size&&x.color===colorOptions[selectedColor].name);if(item)item.qty++;else cart.push({
            ...selected,size,color:colorOptions[selectedColor].name,img:productColorImage(selected.id,selectedColor).replace('images/',''),qty:1
        });persist();go('cart')
    }
    function quantity(i,d){
        cart[i].qty+=d;if(cart[i].qty<=0)cart.splice(i,1);persist();render()
    }
    const subtotal=()=>cart.reduce((s,x)=>s+x.price*x.qty,0);
    function setFilter(f){
        filter=f;go('products')
    }
    function updateCheckout(field,value){
        customer[field]=value;
    }
    function pickLocation(){
        if(!navigator.geolocation){
            alert('تحديد الموقع غير متاح في هذا المتصفح. يمكنك لصق رابط موقعك من خرائط Google في الحقل.');return;
        }
        navigator.geolocation.getCurrentPosition(pos=>{
            const {
                latitude,longitude
            }=pos.coords;
            const url=`https://www.google.com/maps?q=${latitude.toFixed(6)},${longitude.toFixed(6)}`;
            customer.location=url;
            const field=document.getElementById('customer-location');if(field)field.value=url;
            const msg=document.getElementById('location-status');if(msg)msg.textContent='✓ تم تحديد الموقع، ويمكنك متابعة الطلب';
        },()=>alert('لم نتمكن من تحديد موقعك. يمكنك نسخ رابط موقعك من خرائط Google ولصقه هنا، أو تركه فارغاً.'),{
            enableHighAccuracy:true,timeout:12000
        });
    }
    // Create an actual image of the shoes in the cart using the local product photos.
    // Browser WhatsApp links cannot attach local images automatically.
    async function makeOrderImage(){
        if(!cart.length){
            alert('السلة فارغة');return;
        }
        const items=cart.slice(0,20);
        const W=900, rowH=180, H=170+items.length*rowH+145;
        const canvas=document.createElement('canvas');canvas.width=W;canvas.height=H;
        const ctx=canvas.getContext('2d');
        ctx.fillStyle='#fff8f6';ctx.fillRect(0,0,W,H);
        ctx.fillStyle='#760b2b';ctx.fillRect(0,0,W,112);
        ctx.fillStyle='#fff';ctx.font='bold 48px Georgia';ctx.textAlign='center';ctx.fillText('Elegancia',W/2,70);
        ctx.textAlign='right';ctx.direction='rtl';
        ctx.font='bold 27px Arial';ctx.fillStyle='#650d28';ctx.fillText('صور منتجات الطلب',W-35,153);
        const load=src=>new Promise(resolve=>{
            const im=new Image();im.onload=()=>resolve(im);im.onerror=()=>resolve(null);im.src=src;
        });
        for(let i=0;i<items.length;i++){
            const item=items[i],y=180+i*rowH;
            ctx.fillStyle=i%2?'#fff':'#f9e9e7';ctx.fillRect(20,y-12,W-40,rowH-12);
            const im=await load(img(item.img));
            if(im){
                const scale=Math.min(160/im.width,150/im.height);const w=im.width*scale,h=im.height*scale;ctx.drawImage(im,32+(160-w)/2,y+(150-h)/2,w,h);
            }
            ctx.fillStyle='#45051a';ctx.font='bold 25px Arial';ctx.fillText(item.name,W-38,y+44);
            ctx.font='23px Arial';ctx.fillText(`المقاس: ${item.size}   |   الكمية: ${item.qty}`,W-38,y+88);
            ctx.font='bold 25px Arial';ctx.fillText(`$${(item.price*item.qty).toFixed(2)}`,W-38,y+130);
        }
        ctx.fillStyle='#760b2b';ctx.fillRect(0,H-125,W,125);
        ctx.fillStyle='white';ctx.font='bold 30px Arial';ctx.fillText(`الشحن: $3.00  |  الإجمالي: $${(subtotal()+shipping).toFixed(2)}`,W-35,H-65);
        return await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));
    }
    async function shareOrderImage(){
        const blob=await makeOrderImage();if(!blob)return;
        const file=new File([blob],'Elegancia-order-shoes.png',{
            type:'image/png'
        });
        if(navigator.canShare&&navigator.canShare({
            files:[file]
        })&&navigator.share){
            try{
                await navigator.share({
                    files:[file],title:'صور طلب Elegancia'
                });return;
            }
            catch(e){
                if(e.name==='AbortError')return;
            }
        }
        const url=URL.createObjectURL(blob);
        const link=document.createElement('a');link.href=url;link.download=file.name;document.body.appendChild(link);link.click();link.remove();
        setTimeout(()=>URL.revokeObjectURL(url),15000);
        alert('تم تنزيل صورة منتجات الطلب. يمكنك إرفاقها في محادثة واتساب بعد فتح الطلب.');
    }
    function confirmOrder(){
        if(!cart.length)return go('cart');
        const name=customer.name.trim();
        const phone=customer.phone.trim();
        const address=customer.address.trim();
        if(!name||!phone||!address){
            alert('يرجى إدخال الاسم ورقم الهاتف والعنوان قبل إرسال الطلب');return;
        }
        const lines=cart.map((x,i)=>[
        `${i+1}. 👠 ${x.name}`,
        `   اللون: ${x.color||'غير محدد'} | المقاس: ${x.size} | الكمية: ${x.qty}`,
        `   سعر القطعة: ${price(x.price)} | الإجمالي: ${price(x.price*x.qty)}`
        ].join('\n'));
        const msg=[
        '🛍️ *طلب جديد من Elegancia*',
        '━━━━━━━━━━━━━━',
        '👤 *بيانات الزبون*',
        `الاسم: ${name}`,
        `الهاتف: ${phone}`,
        `العنوان: ${address}`,
        ...(customer.location.trim()?[`📍 الموقع: ${customer.location.trim()}`]:[]),
        '', '👠 *تفاصيل الطلب*', ...lines,
        '', '━━━━━━━━━━━━━━',
        `المجموع الفرعي: ${price(subtotal())}`,
        '🚚 الشحن العادي: 3 - 7 أيام',
        `تكلفة الشحن: ${price(shipping)}`,
        `💰 *الإجمالي النهائي: ${price(subtotal()+shipping)}*`,
        '', '📸 يمكن مشاركة صورة المنتجات من زر «صور الطلب» في صفحة إتمام الطلب.'
        ].join('\n');
        const url='https://wa.me/96171918022?text='+encodeURIComponent(msg);
        const opened=window.open(url,'_blank','noopener,noreferrer');
        if(!opened)window.location.href=url;
        // لا نفرغ السلة قبل إرسال الطلب فعلياً عبر واتساب.
    }
    function render(){
        let h='';
        if(page==='splash')h=`<div class="splash" onclick="go('onboard')">${status()}<div class="logo">♧</div><h1>Elegancia</h1><small>SHOES BOUTIQUE</small><p>متجر الأحذية النسائية</p><button class="goldbtn" onclick="event.stopPropagation();go('onboard')">اكتشفي المجموعة ←</button></div>`;
        else if(page==='onboard')h=`<div class="onboard"><img src="${img('hero.jpg')}"><h1>أناقة في كل خطوة</h1><p>تشكيلة فاخرة من الأحذية النسائية لجميع المناسبات</p><div class="dots">● ● ●</div><button class="primary" onclick="go('home')">ابدئي التسوق ←</button></div>`;
        else if(page==='home')h=wrap(`${homeHeader()}<div class="slider" aria-label="مجموعات الأحذية المميزة">${['كعب السهرة','أناقة الأحمر','تشكيلة البوت','لمسة الشامبانيا'].map((name,i)=>`<div class="slide ${i===slideIndex?'active':''}" style="background-image:url('${img('slide-'+(i+1)+'.jpg')}')"><div class="slide-shade"></div><div class="slide-content"><small>THE NEW COLLECTION</small><h2>${name}</h2><p>اكتشفي أحدث التصاميم</p><button class="goldbtn" onclick="setFilter('${['كعب عالي','كعب عالي','بوت','صنادل'][i]}')">تسوّقي الآن ←</button></div></div>`).join('')}</div><div class="slider-dots">${[0,1,2,3].map(i=>`<button class="slide-dot ${i===slideIndex?'active':''}" onclick="changeSlide(${i})" aria-label="الشريحة ${i+1}"></button>`).join('')}</div><h3 class="sectiontitle">تسوّقي حسب الفئة</h3><div class="category-grid">${[['item-02.jpg','كعب عالي'],['item-05.jpg','بوت'],['item-08.jpg','صنادل'],['item-09.jpg','رياضية']].map(([im,n])=>`<div class="category-tile"><div class="category-photo" onclick="setFilter('${n}')"><img src="${img(im)}" alt="${n}"></div><span onclick="setFilter('${n}')">${n}</span></div>`).join('')}</div><h3 class="sectiontitle">تشكيلتنا المميزة </h3><div class="products">${products.slice(0,8).map(card).join('')}</div><button class="primary" onclick="go('products')">شاهدي كل المنتجات </button>`);
        else if(page==='search')h=wrap(`${header('البحث عن الأصناف','home')}<div class="search-area"><label for="product-search">ابحثي عن حذائك المفضل</label><div class="search-field"><svg viewBox="0 0 24 24" width="23" height="23" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.4" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="m15.5 15.5 5 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg><input id="product-search" type="search" placeholder="مثلاً: كعب، بوت، صندل، فضي..." autocomplete="off" value="${searchTerm.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;')}" oninput="updateSearch(this.value)" /></div></div><div class="search-results-title"><strong>نتائج البحث</strong><span id="search-count"></span></div><div class="products" id="search-results"></div>`);
        else if(page==='categories')h=wrap(`${header('الأقسام')}<div class="lux-category-grid" dir="rtl">${[['item-02.jpg','كعب عالي'],['item-08.jpg','صنادل'],['item-05.jpg','بوت'],['item-09.jpg','رياضية'],['item-14.jpg','باليرينا'],['item-11.jpg','لوفر']].map(([im,n])=>`<button type="button" class="lux-category-card" onclick="setFilter('${n}')" aria-label="تصفح قسم ${n}"><img loading="lazy" src="${img(im)}" alt="${n}"><span class="lux-category-label"><strong>${n}</strong><span class="lux-category-arrow" aria-hidden="true">←</span></span></button>`).join('')}</div>`);
        else if(page==='products'||page==='favorites'){
            let shown=products.filter(p=>page==='favorites'?fav.includes(p.id):filter==='الكل'||p.category===filter);h=wrap(`${header(page==='favorites'?'المفضلة':'الأحذية النسائية','home')}${page==='products'?`<div class="filters">${['الكل','كعب عالي','بوت','صنادل','رياضية','لوفر','باليرينا'].map(f=>`<button class="chip ${filter===f?'active':''}" onclick="setFilter('${f}')">${f}</button>`).join('')}</div>`:''}<p class="count-label">${shown.length} منتج</p><div class="products">${shown.map(card).join('')}</div>${!shown.length?'<p class="empty">لا توجد منتجات هنا بعد</p>':''}`)
        }
        else if(page==='detail')h=wrap(`${header('تفاصيل المنتج','products')}<img id="detail-color-photo" class="detail-photo" src="${productColorImage(selected.id,selectedColor)}" alt="${selected.name}" fetchpriority="high" decoding="async">${`<div class="label">اللون</div><div class="color-dots" role="group" aria-label="اختيار لون الحذاء">${colorOptions.map((c,i)=>`<button type="button" class="color-dot ${i===selectedColor?'active':''}" style="--swatch:${c.hex}" aria-label="${c.name}" aria-pressed="${i===selectedColor}" title="${c.name}" onclick="setProductColor(${i})"></button>`).join('')}</div>${![1,2,3,4,5,6,7,8,10,11,12,13,14].includes(selected.id)?'<p class="color-note">صور الألوان لهذا الموديل معاينات تجريبية وليست صوراً مؤكدة للمنتج الحقيقي.</p>':''}` }<div class="detail-top"><h3>${selected.name}</h3><span class="price">${price(selected.price)}</span></div><div class="label">المقاس</div><div class="sizes">${[36,37,38,39,40,41].map(n=>`<button class="size ${size===n?'active':''}" onclick="size=${n};render()">${n}</button>`).join('')}</div><p class="detail-description">تصميم أنيق مناسب لإطلالاتك المميزة. الصور والأسعار تجريبية ويمكن تعديلها بسهولة.</p><button class="primary sticky-action" onclick="addCart()">أضيفي إلى السلة 🛒</button>`);
        else if(page==='cart'){
            let items=cart.map((p,i)=>`<div class="cartitem"><img loading="lazy" src="${img(p.img&&p.img.startsWith('color-')?p.img:p.img)}"><div class="info"><h3>${p.name}</h3><small>اللون: ${p.color||'غير محدد'} · المقاس: ${p.size}</small><div class="qty"><button onclick="quantity(${i},-1)">−</button>${p.qty}<button onclick="quantity(${i},1)">+</button></div></div><strong>${price(p.price*p.qty)}</strong></div>`).join('');h=wrap(`${header('سلة المشتريات')}${cart.length?`${items}<div class="summary"><div><span>المجموع الفرعي</span><b>${price(subtotal())}</b></div><div><span>تكلفة الشحن</span><b>${price(shipping)}</b></div><div class="total"><span>الإجمالي</span><b>${price(subtotal()+shipping)}</b></div></div><button class="primary sticky-action" onclick="go('checkout')">إتمام الطلب ←</button>`:'<div class="empty">سلة المشتريات فارغة<br><br><button class="primary" onclick="go(\'products\')">تسوقي الآن</button></div>'}`)
        }
        else if(page==='checkout')h=wrap(`${header('إتمام الطلب','cart')}<h3 class="sectiontitle">عنوان الشحن</h3><input id="customer-name" class="field" oninput="updateCheckout('name',this.value)" value="${customer.name}" autocomplete="name" placeholder="الاسم الكامل"><input id="customer-phone" class="field" oninput="updateCheckout('phone',this.value)" value="${customer.phone}" type="tel" autocomplete="tel" placeholder="رقم الهاتف"><input id="customer-address" class="field" oninput="updateCheckout('address',this.value)" value="${customer.address}" autocomplete="street-address" placeholder="العنوان التفصيلي"><div class="optional-location"><h3 class="sectiontitle">الموقع <small>(اختياري)</small></h3><p class="location-hint">يمكنك تحديد موقعك أو إضافة رابط من خرائط Google. هذا الحقل غير إجباري.</p><button class="location-picker" type="button" onclick="pickLocation()">⌖ تحديد موقعي الحالي</button><input id="customer-location" class="field" type="url" dir="ltr" oninput="updateCheckout('location',this.value)" value="${customer.location}" placeholder="رابط الموقع من خرائط Google (اختياري)"><p id="location-status" class="location-hint"></p></div><h3 class="sectiontitle">طريقة الشحن</h3><div class="choice selected shipping-only"><span>شحن عادي (3 - 7 أيام)</span><b>${price(shipping)} ●</b></div><div class="summary"><div class="total"><span>الإجمالي</span><b>${price(subtotal()+shipping)}</b></div></div><button class="primary sticky-action" onclick="confirmOrder()">إرسال الطلب عبر واتساب ↗</button><button class="order-image-action" type="button" onclick="shareOrderImage()">📸 مشاركة / تنزيل صورة أحذية الطلب</button><p class="location-hint">تُرسل تفاصيل الطلب برسالة واتساب، ويمكنك مشاركة صورة الأحذية بشكل منفصل.</p>`);
        else if(page==='success')h=wrap(`${header('تأكيد الطلب')}<div class="success"><div class="check">✓</div><h1>تم تأكيد طلبك بنجاح!</h1><p>شكراً لتسوقك من Elegancia<br>هذا طلب تجريبي ولم يُرسل إلى متجر فعلي.</p><div class="order-number">رقم الطلب<br><strong>#${orderNumber}</strong></div><button class="primary" onclick="go('home')">العودة إلى الرئيسية</button></div>`,false);
        else if(page==='profile')h=wrap(`<div class="profile-head"><h2>حسابي</h2><small>Elegancia Shoes Boutique</small></div>${[['طلباتي','orders'],['عناويني','addresses'],['طرق الدفع','payments'],['المفضلة','favorites'],['الإعدادات','settings'],['المساعدة والدعم','help'],['العودة للبداية','splash']].map(([t,p])=>`<button class="menu-row" onclick="${p==='favorites'||p==='splash'?`go('${p}')`:`alert('هذه الميزة تحتاج إلى ربط الموقع بنظام خلفي')`}">${t}<span>‹</span></button>`).join('')}`);
        app.innerHTML=h;
        if(page==='search')updateSearch(searchTerm);
        startSlides();
    }
    render();

