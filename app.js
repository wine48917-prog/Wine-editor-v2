const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const canvas=$('#preview'),ctx=canvas.getContext('2d'),fileInput=$('#fileInput'),empty=$('#emptyState');let img=null,filter='none',ratio='free',textColor='#ffffff',overlay='',history=[],future=[],beforeData=null,compare=false;
const defaults={brightness:100,contrast:100,saturation:100,warmth:0};let vals={...defaults};
function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove('show'),2300)}
function snapshot(){if(!img)return;history.push(canvas.toDataURL('image/png'));if(history.length>25)history.shift();future=[];updateHistory()}
function updateHistory(){$('#undoBtn').disabled=!history.length;$('#redoBtn').disabled=!future.length}
function loadFile(file){if(!file)return;if(!file.type.startsWith('image/'))return toast('اختار ملف صورة صالح');const url=URL.createObjectURL(file);const image=new Image();image.onload=()=>{img=image;canvas.hidden=false;empty.hidden=true;beforeData=null;history=[];future=[];vals={...defaults};Object.keys(vals).forEach(k=>{const el=$('#'+k);if(el)el.value=vals[k];const out=$('#'+k+'Val');if(out)out.textContent=vals[k]});filter='none';overlay=$('#overlayText').value='';draw();$('#canvasSize').textContent=image.naturalWidth+' × '+image.naturalHeight;snapshot();toast('الصورة جاهزة للتعديل');URL.revokeObjectURL(url)};image.onerror=()=>toast('مش قادرين نفتح الصورة دي');image.src=url}
function filterCSS(){let f={none:'',mono:'grayscale(1)',warm:'sepia(.48) saturate(1.25)',cool:'hue-rotate(155deg) saturate(.9)',fade:'sepia(.22) brightness(1.12) contrast(.82)',dramatic:'contrast(1.35) saturate(.85) brightness(.92)',rose:'sepia(.18) hue-rotate(315deg) saturate(1.22) contrast(1.04)',matte:'contrast(.82) brightness(1.12) saturate(.78)',emerald:'hue-rotate(75deg) saturate(1.18) contrast(1.08)',noir:'grayscale(1) contrast(1.5) brightness(.82)'}[filter]||'';return `brightness(${vals.brightness}%) contrast(${vals.contrast}%) saturate(${vals.saturation}%) ${f}`}
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
$('#aiEditBtn').onclick=()=>toast('واجهة الذكاء الاصطناعي جاهزة — باقي توصيل Backend الآمن بالمفتاح');
const stage=$('#stage');stage.addEventListener('dragover',e=>{e.preventDefault();stage.classList.add('dragging')});stage.addEventListener('dragleave',()=>stage.classList.remove('dragging'));stage.addEventListener('drop',e=>{e.preventDefault();stage.classList.remove('dragging');loadFile(e.dataTransfer.files[0])});
openPanel('adjust');updateHistory();

// Video editor MVP: one source clip, trim handles, playback speed and WebM export.
(()=>{
 const $v=id=>document.getElementById(id);
 const modeBtn=$v('videoModeBtn'),photoMain=document.querySelector('.workspace'),videoStudio=$v('videoStudio');
 const video=$v('videoPreview'),videoInput=$v('videoInput'),musicInput=$v('musicInput');
 if(!modeBtn||!videoStudio||!video)return;
 let videoUrl=null,musicUrl=null,musicEl=null,recording=false;
 let startPct=0,endPct=1000;
 let videoFilter='none';
 const vf={none:'none',cinema:'contrast(1.18) saturate(.88) brightness(.92)',vintage:'sepia(.42) contrast(.92) saturate(.82)',bw:'grayscale(1) contrast(1.12)',vivid:'saturate(1.65) contrast(1.12)',cool:'hue-rotate(155deg) saturate(1.12)',warm:'sepia(.24) saturate(1.2) brightness(1.04)',dream:'brightness(1.12) contrast(.82) saturate(.9)'};
 const filterCSS=()=>{const b=Number($v('vBrightness')?.value||100),c=Number($v('vContrast')?.value||100),sat=Number($v('vSaturation')?.value||100);return `brightness(${b}%) contrast(${c}%) saturate(${sat}%) ${vf[videoFilter]||'none'}`};
 function applyVideoFilter(){video.style.filter=filterCSS()}
 document.querySelectorAll('[data-vfilter]').forEach(btn=>btn.addEventListener('click',()=>{videoFilter=btn.dataset.vfilter;document.querySelectorAll('[data-vfilter]').forEach(x=>x.classList.toggle('active',x===btn));applyVideoFilter()}));
 ['vBrightness','vContrast','vSaturation'].forEach(id=>{const el=$v(id);if(el)el.addEventListener('input',()=>{$v(id+'Out').textContent=el.value+'%';applyVideoFilter()})});
 const fmt=t=>{if(!Number.isFinite(t))return '00:00';const m=Math.floor(t/60),s=Math.floor(t%60);return String(m).padStart(2,'0')+':'+String(s).padStart(2,'0')};
 const notify=m=>{if(typeof toast==='function')toast(m);else alert(m)};
 function updateTrim(){if(!Number.isFinite(video.duration)||!video.duration)return;const a=startPct/1000*video.duration,b=endPct/1000*video.duration;$v('trimStartOut').textContent=a.toFixed(1)+'s';$v('trimEndOut').textContent=b.toFixed(1)+'s';$v('trimReadout').textContent=a.toFixed(1)+'s — '+b.toFixed(1)+'s';$v('videoClock').textContent=fmt(video.currentTime)+' / '+fmt(video.duration);$v('rulerMiddle').textContent=fmt(video.duration/2);$v('rulerEnd').textContent=fmt(video.duration);}
 function loadVideo(file){if(!file)return;if(!file.type.startsWith('video/'))return notify('اختار ملف فيديو صالح');if(videoUrl)URL.revokeObjectURL(videoUrl);videoUrl=URL.createObjectURL(file);video.src=videoUrl;video.style.filter='none';videoFilter='none';document.querySelectorAll('[data-vfilter]').forEach(x=>x.classList.toggle('active',x.dataset.vfilter==='none'));['vBrightness','vContrast','vSaturation'].forEach(id=>{if($v(id))$v(id).value=100;if($v(id+'Out'))$v(id+'Out').textContent='100%'});applyVideoFilter();video.load();$v('videoEmpty').hidden=true;$v('clipStrip').textContent='🎬 '+file.name;video.onloadedmetadata=()=>{startPct=0;endPct=1000;$v('trimStart').value=0;$v('trimEnd').value=1000;$v('seekVideo').max=Math.round(video.duration*100);$v('seekVideo').value=0;updateTrim();notify('الفيديو جاهز للمونتاج')};}
 modeBtn.addEventListener('click',()=>{photoMain.classList.add('hidden');videoStudio.classList.remove('hidden');window.scrollTo({top:0,behavior:'smooth'})});
 $v('backToPhoto').addEventListener('click',()=>{videoStudio.classList.add('hidden');photoMain.classList.remove('hidden');window.scrollTo({top:0,behavior:'smooth'})});
 $v('chooseVideo').onclick=$v('addVideoMedia').onclick=()=>videoInput.click();videoInput.addEventListener('change',e=>loadVideo(e.target.files[0]));
 $v('videoPlay').onclick=async()=>{if(!video.src)return notify('ارفع فيديو الأول');if(video.paused){const a=startPct/1000*video.duration,b=endPct/1000*video.duration;if(video.currentTime<a||video.currentTime>=b)video.currentTime=a;try{await video.play();$v('videoPlay').textContent='Ⅱ إيقاف'}catch{notify('تعذر تشغيل الفيديو')}}else{video.pause();$v('videoPlay').textContent='▶ تشغيل'}};
 $v('videoSpeed').onchange=e=>video.playbackRate=Number(e.target.value);
 $v('trimStart').oninput=e=>{startPct=Number(e.target.value);if(startPct>=endPct){startPct=Math.max(0,endPct-1);e.target.value=startPct}updateTrim()};
 $v('trimEnd').oninput=e=>{endPct=Number(e.target.value);if(endPct<=startPct){endPct=Math.min(1000,startPct+1);e.target.value=endPct}updateTrim()};
 $v('seekVideo').oninput=e=>{if(video.duration)video.currentTime=Math.min(video.duration,Number(e.target.value)/100)};
 video.addEventListener('timeupdate',()=>{if(!video.duration)return;$v('seekVideo').value=Math.round(video.currentTime*100);updateTrim();if(video.currentTime>=endPct/1000*video.duration){video.pause();video.currentTime=startPct/1000*video.duration;$v('videoPlay').textContent='▶ تشغيل'}});
 video.addEventListener('ended',()=>$v('videoPlay').textContent='▶ تشغيل');
 musicInput.addEventListener('change',e=>{const f=e.target.files[0];if(!f)return;if(musicUrl)URL.revokeObjectURL(musicUrl);musicUrl=URL.createObjectURL(f);musicEl=new Audio(musicUrl);musicEl.loop=true;musicEl.preload='auto';$v('musicStatus').textContent='تمت إضافة: '+f.name+' — ستُضمّن أثناء التصدير إذا دعم المتصفح ذلك.';});
 async function exportClip(){
  if(!video.src||!Number.isFinite(video.duration))return notify('ارفع فيديو الأول');
  if(!video.captureStream&&!video.mozCaptureStream)return notify('متصفحك لا يدعم تصدير الفيديو. جرّب Chrome محدث.');
  if(!window.MediaRecorder)return notify('تسجيل الفيديو غير مدعوم في المتصفح ده.');
  if(recording)return;
  const oldTime=video.currentTime,oldRate=video.playbackRate,oldMuted=video.muted;const from=startPct/1000*video.duration,to=endPct/1000*video.duration;
  if(to-from<0.15)return notify('حدد جزء أطول من الفيديو');
  try{
   recording=true;$v('exportVideo').disabled=true;$v('exportVideo').textContent='جاري التصدير…';
   video.pause();video.currentTime=from;video.playbackRate=Number($v('videoSpeed').value)||1;
   await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(new Error('تعذر تجهيز الفيديو')),8000);video.addEventListener('seeked',()=>{clearTimeout(timer);resolve()},{once:true})});
   const sourceStream=(video.captureStream||video.mozCaptureStream).call(video);
   const renderCanvas=document.createElement('canvas');renderCanvas.width=video.videoWidth||1280;renderCanvas.height=video.videoHeight||720;
   const renderCtx=renderCanvas.getContext('2d');const stream=renderCanvas.captureStream(30);
   sourceStream.getAudioTracks().forEach(t=>stream.addTrack(t));
   let audioCtx=null,musicSource=null;
   if(musicEl){try{audioCtx=new (window.AudioContext||window.webkitAudioContext)();await audioCtx.resume();musicSource=audioCtx.createMediaElementSource(musicEl);const dest=audioCtx.createMediaStreamDestination();musicSource.connect(dest);musicSource.connect(audioCtx.destination);dest.stream.getAudioTracks().forEach(t=>stream.addTrack(t));musicEl.currentTime=0;await musicEl.play()}catch(err){console.warn('Music mix unavailable',err)}}
   const types=['video/webm;codecs=vp9,opus','video/webm;codecs=vp8,opus','video/webm'];const mime=types.find(t=>MediaRecorder.isTypeSupported(t))||'';const bitrate=$v('videoQuality').value==='high'?5000000:2500000;const recorder=new MediaRecorder(stream,mime?{mimeType:mime,videoBitsPerSecond:bitrate,audioBitsPerSecond:128000}:{videoBitsPerSecond:bitrate,audioBitsPerSecond:128000});const chunks=[];
   recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};
   const done=new Promise((resolve,reject)=>{recorder.onerror=()=>reject(new Error('فشل تسجيل الفيديو'));recorder.onstop=resolve});
   recorder.start(250);await video.play();
   await new Promise(resolve=>{const render=()=>{renderCtx.clearRect(0,0,renderCanvas.width,renderCanvas.height);renderCtx.filter=filterCSS();renderCtx.drawImage(video,0,0,renderCanvas.width,renderCanvas.height);if(video.currentTime>=to||video.ended){video.pause();resolve()}else requestAnimationFrame(render)};requestAnimationFrame(render)});
   recorder.stop();await done;if(musicEl)musicEl.pause();
   const blob=new Blob(chunks,{type:recorder.mimeType||'video/webm'});if(!blob.size)throw new Error('ملف التصدير فارغ');const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='WINE-EDITOR-'+Date.now()+'.webm';a.click();setTimeout(()=>URL.revokeObjectURL(url),60000);notify('تم تصدير الفيديو بنجاح');
   stream.getTracks().forEach(t=>t.stop());sourceStream.getTracks().forEach(t=>t.stop());if(audioCtx)await audioCtx.close();
  }catch(err){console.error(err);notify(err.message||'حصل خطأ أثناء التصدير')}finally{recording=false;$v('exportVideo').disabled=false;$v('exportVideo').textContent='تصدير الفيديو ↗';video.pause();video.playbackRate=oldRate;video.muted=oldMuted;video.currentTime=Math.min(oldTime,video.duration||oldTime);if(musicEl)musicEl.pause()}
 }
 $v('exportVideo').addEventListener('click',exportClip);
})();
