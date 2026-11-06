const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const canvas=$('#preview'),ctx=canvas.getContext('2d'),fileInput=$('#fileInput'),empty=$('#emptyState');let img=null,filter='none',ratio='free',textColor='#ffffff',overlay='',history=[],future=[],beforeData=null,compare=false;
const defaults={brightness:100,contrast:100,saturation:100,warmth:0};let vals={...defaults};
function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove('show'),2300)}
function snapshot(){if(!img)return;history.push(canvas.toDataURL('image/png'));if(history.length>25)history.shift();future=[];updateHistory()}
function updateHistory(){$('#undoBtn').disabled=!history.length;$('#redoBtn').disabled=!future.length}
function loadFile(file){if(!file)return;if(!file.type.startsWith('image/'))return toast('اختار ملف صورة صالح');const url=URL.createObjectURL(file);const image=new Image();image.onload=()=>{img=image;canvas.hidden=false;empty.hidden=true;beforeData=null;history=[];future=[];vals={...defaults};Object.keys(vals).forEach(k=>{const el=$('#'+k);if(el)el.value=vals[k];const out=$('#'+k+'Val');if(out)out.textContent=vals[k]});filter='none';overlay=$('#overlayText').value='';draw();$('#canvasSize').textContent=image.naturalWidth+' × '+image.naturalHeight;snapshot();toast('الصورة جاهزة للتعديل');URL.revokeObjectURL(url)};image.onerror=()=>toast('مش قادرين نفتح الصورة دي');image.src=url}
function filterCSS(){let f={none:'',mono:'grayscale(1)',warm:'sepia(.48) saturate(1.25)',cool:'hue-rotate(155deg) saturate(.9)',fade:'sepia(.22) brightness(1.12) contrast(.82)',dramatic:'contrast(1.35) saturate(.85) brightness(.92)'}[filter]||'';return `brightness(${vals.brightness}%) contrast(${vals.contrast}%) saturate(${vals.saturation}%) ${f}`}
function draw(){if(!img)return;let w=img.naturalWidth,h=img.naturalHeight;if(ratio!=='free'){const [rw,rh]=ratio.split(':').map(Number),target=rw/rh,current=w/h;if(current>target)w=h*target;else h=w/target}canvas.width=Math.round(w);canvas.height=Math.round(h);ctx.clearRect(0,0,w,h);ctx.save();ctx.filter=filterCSS();ctx.drawImage(img,(img.naturalWidth-w)/2,(img.naturalHeight-h)/2,w,h);ctx.restore();if(vals.warmth!==0){ctx.save();ctx.globalAlpha=Math.abs(vals.warmth)/260;ctx.fillStyle=vals.warmth>0?'#ff9a4d':'#4d9cff';ctx.fillRect(0,0,w,h);ctx.restore()}if(overlay){ctx.save();const size=Math.max(22,Math.round(w*.055));ctx.font=`700 ${size}px Cairo, sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineWidth=Math.max(2,size*.08);ctx.strokeStyle='rgba(0,0,0,.55)';ctx.fillStyle=textColor;ctx.strokeText(overlay,w/2,h*.82);ctx.fillText(overlay,w/2,h*.82);ctx.restore()}$('#canvasSize').textContent=canvas.width+' × '+canvas.height}
function openPanel(name){const names=['adjust','filters','crop','text','ai'];names.forEach((n,i)=>{$('#'+n+'Panel').classList.toggle('hidden',n!==name)});$$('[data-panel]').forEach(b=>b.classList.toggle('active',b.dataset.panel===name));$('#panelTitle').textContent={adjust:'تحسين الصورة',filters:'الفلاتر',crop:'قصّ ومقاس',text:'إضافة نص',ai:'الذكاء الاصطناعي'}[name];$('.panel-count').innerHTML=String(names.indexOf(name)+1).padStart(2,'0')+' <i>/</i> 05'}
$$('[data-panel]').forEach(b=>b.addEventListener('click',()=>openPanel(b.dataset.panel)));
$('#chooseBtn').onclick=$('#replaceBtn').onclick=()=>fileInput.click();fileInput.onchange=e=>loadFile(e.target.files[0]);
['brightness','contrast','saturation','warmth'].forEach(k=>$('#'+k).addEventListener('input',e=>{vals[k]=+e.target.value;$('#'+k+'Val').textContent=vals[k];draw()}));
$$('[data-filter]').forEach(b=>b.onclick=()=>{if(!img)return toast('ارفع صورة الأول');snapshot();filter=b.dataset.filter;$$('[data-filter]').forEach(x=>x.classList.toggle('selected',x===b));draw()});
$$('[data-ratio]').forEach(b=>b.onclick=()=>{if(!img)return toast('ارفع صورة الأول');snapshot();ratio=b.dataset.ratio;$$('[data-ratio]').forEach(x=>x.classList.toggle('selected',x===b));draw()});
$$('[data-preset]').forEach(b=>b.onclick=()=>{if(!img)return toast('ارفع صورة الأول');snapshot();const p=b.dataset.preset;vals=p==='soft'?{brightness:108,contrast:92,saturation:88,warmth:8}:p==='vivid'?{brightness:104,contrast:118,saturation:140,warmth:2}:{brightness:94,contrast:128,saturation:82,warmth:7};Object.keys(vals).forEach(k=>{$('#'+k).value=vals[k];$('#'+k+'Val').textContent=vals[k]});draw();toast('تم تطبيق اللمسة')});
$$('[data-color]').forEach(b=>b.onclick=()=>{textColor=b.dataset.color;$$('[data-color]').forEach(x=>x.classList.toggle('active',x===b));$('#textColor').value=textColor});$('#textColor').oninput=e=>textColor=e.target.value;
$('#addTextBtn').onclick=()=>{if(!img)return toast('ارفع صورة الأول');if(!$('#overlayText').value.trim())return toast('اكتب النص الأول');snapshot();overlay=$('#overlayText').value.trim();draw();toast('تمت إضافة النص')};
function exportImage(){if(!img)return toast('ارفع صورة الأول');const a=document.createElement('a');a.href=canvas.toDataURL('image/png');a.download='WINE-EDITOR-'+Date.now()+'.png';a.click();toast('الصورة اتصدّرت بنجاح')}
$('#exportBtn').onclick=$('#mobileExport').onclick=exportImage;
$('#resetBtn').onclick=()=>{if(!img)return; snapshot();vals={...defaults};Object.keys(vals).forEach(k=>{$('#'+k).value=vals[k];$('#'+k+'Val').textContent=vals[k]});filter='none';ratio='free';overlay='';$('#overlayText').value='';$$('[data-filter]').forEach(x=>x.classList.toggle('selected',x.dataset.filter==='none'));$$('[data-ratio]').forEach(x=>x.classList.toggle('selected',x.dataset.ratio==='free'));draw();toast('رجّعنا التعديلات للوضع الأصلي')};
$('#undoBtn').onclick=()=>{if(!history.length)return;future.push(canvas.toDataURL());const data=history.pop();restore(data);updateHistory()};$('#redoBtn').onclick=()=>{if(!future.length)return;history.push(canvas.toDataURL());restore(future.pop());updateHistory()};function restore(data){const im=new Image();im.onload=()=>{canvas.width=im.width;canvas.height=im.height;ctx.drawImage(im,0,0);canvas.hidden=false;empty.hidden=true};im.src=data}
$('#compareBtn').onclick=()=>{if(!img)return toast('ارفع صورة الأول');compare=!compare;if(compare){beforeData=canvas.toDataURL();drawOriginal()}else draw();toast(compare?'عرض الصورة الأصلية':'عرض التعديلات')};function drawOriginal(){canvas.width=img.naturalWidth;canvas.height=img.naturalHeight;ctx.filter='none';ctx.drawImage(img,0,0)}
async function runAIEdit(){
  if(!img)return toast('ارفع صورة الأول');
  const prompt=$('#aiPrompt').value.trim();
  if(prompt.length<3)return toast('اكتب وصف التعديل الأول');
  const btn=$('#aiEditBtn');
  if(btn.disabled)return;
  btn.disabled=true;
  const oldLabel=btn.textContent;
  btn.textContent='✦ بنجهّز الصورة...';
  try{
    const imageData=canvas.toDataURL('image/jpeg',0.82);
    if(imageData.length>3_600_000)throw new Error('الصورة كبيرة على التعديل. قلّل مقاسها أو ارفع صورة أصغر.');
    const submit=await fetch('/api/ai-edit',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt,imageData})});
    const job=await submit.json();
    if(!submit.ok)throw new Error(job.error||'تعذر إرسال طلب التعديل');
    btn.textContent='✦ الذكاء الاصطناعي بيعدّل...';
    let result=null;
    for(let i=0;i<60;i++){
      await new Promise(resolve=>setTimeout(resolve,2500));
      const check=await fetch('/api/ai-status?requestId='+encodeURIComponent(job.requestId),{cache:'no-store'});
      const state=await check.json();
      if(!check.ok)throw new Error(state.error||'حصل خطأ أثناء متابعة التعديل');
      if(state.status==='COMPLETED'){result=state.imageUrl;break;}
      btn.textContent=i<10?'✦ بننفّذ فكرتك...':'✦ التعديل بياخد وقته...';
    }
    if(!result)throw new Error('التعديل طول أكتر من المتوقع. جرّب تاني بعد شوية.');
    const output=new Image();
    output.crossOrigin='anonymous';
    await new Promise((resolve,reject)=>{output.onload=resolve;output.onerror=()=>reject(new Error('الصورة الناتجة مش متاحة دلوقتي.'));output.src=result;});
    snapshot();
    img=output;filter='none';ratio='free';overlay='';vals={...defaults};
    Object.keys(vals).forEach(k=>{const el=$('#'+k),out=$('#'+k+'Val');if(el)el.value=vals[k];if(out)out.textContent=vals[k];});
    $('#overlayText').value='';
    $$('[data-filter]').forEach(x=>x.classList.toggle('selected',x.dataset.filter==='none'));
    $$('[data-ratio]').forEach(x=>x.classList.toggle('selected',x.dataset.ratio==='free'));
    draw();snapshot();toast('تم تعديل الصورة بالذكاء الاصطناعي بنجاح ✨');
  }catch(error){toast(error.message||'حصل خطأ. حاول تاني');}
  finally{btn.disabled=false;btn.textContent=oldLabel;}
}
$('#aiEditBtn').onclick=runAIEdit;
const stage=$('#stage');stage.addEventListener('dragover',e=>{e.preventDefault();stage.classList.add('dragging')});stage.addEventListener('dragleave',()=>stage.classList.remove('dragging'));stage.addEventListener('drop',e=>{e.preventDefault();stage.classList.remove('dragging');loadFile(e.dataTransfer.files[0])});
openPanel('adjust');updateHistory();
                                                                             
