// Decrypts <guide>/secrets.enc with the key from the link's #k=... fragment and renders it
// into #secrets. Without a valid key the block shows a "ask for the full link" note instead.
// Format (see scripts/encrypt-secrets.py): base64(nonce[12] + AES-256-GCM ciphertext) of
// {"items":[{icon,label,value,copy?,tel?}], "images":[{caption,src}]}.
(function () {
  const box = document.getElementById('secrets');
  if (!box) return;
  const locked = box.querySelector('.locked');
  const list = box.querySelector('.secret-items');
  const pics = box.querySelector('.secret-images');

  const fromB64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
  const fromB64u = (s) => fromB64(s.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (s.length % 4)) % 4));

  function toast(msg) {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 1600);
  }

  // "tel" is an international number without "+", e.g. 972501234567
  function actionButtons(it) {
    const wrap = document.createElement('div');
    wrap.className = 'contact-actions';
    const call = document.createElement('a');
    call.className = 'copy';
    call.href = 'tel:+' + it.tel;
    call.textContent = '📞 חיוג';
    const wa = document.createElement('a');
    wa.className = 'copy';
    wa.href = 'https://wa.me/' + it.tel;
    wa.target = '_blank';
    wa.rel = 'noopener';
    wa.textContent = '💬 וואטסאפ';
    wrap.append(call, wa);
    return wrap;
  }

  function render(data) {
    (data.items || []).forEach((it) => {
      const row = document.createElement('div');
      row.className = 'wifi-row';
      const lbl = document.createElement('span');
      lbl.className = 'lbl';
      lbl.textContent = (it.icon ? it.icon + ' ' : '') + it.label;
      const val = document.createElement('code');
      val.textContent = it.value;
      row.append(lbl, val);
      if (it.copy) {
        const btn = document.createElement('button');
        btn.className = 'copy';
        btn.type = 'button';
        btn.textContent = 'העתקה';
        btn.addEventListener('click', () => {
          navigator.clipboard.writeText(it.value).then(() => toast('הועתק! 📋'), () => toast('לא הצלחתי להעתיק'));
        });
        row.append(btn);
      }
      list.append(row);
      if (it.tel) {
        list.append(actionButtons(it));
        const slot = document.getElementById('contact');
        if (slot) {
          const line = document.createElement('p');
          line.className = 'contact-number';
          line.textContent = it.value;
          slot.replaceChildren(line, actionButtons(it));
        }
      }
    });
    (data.images || []).forEach((im) => {
      const fig = document.createElement('figure');
      const img = document.createElement('img');
      img.src = im.src;
      img.alt = im.caption || '';
      fig.append(img);
      if (im.caption) {
        const cap = document.createElement('figcaption');
        cap.textContent = im.caption;
        fig.append(cap);
      }
      pics.append(fig);
    });
    locked.hidden = true;
    box.classList.add('unlocked');
  }

  async function unlock() {
    const k = new URLSearchParams(location.hash.slice(1)).get('k');
    if (!k || !window.crypto || !crypto.subtle) return;
    try {
      const res = await fetch('secrets.enc', { cache: 'no-store' });
      if (!res.ok) return;
      const raw = fromB64((await res.text()).trim());
      const key = await crypto.subtle.importKey('raw', fromB64u(k), 'AES-GCM', false, ['decrypt']);
      const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: raw.slice(0, 12) }, key, raw.slice(12));
      render(JSON.parse(new TextDecoder().decode(plain)));
    } catch (e) {
      locked.querySelector('p').textContent = 'הקישור לא תקין או ישן - בקשו מיונתן קישור חדש.';
    }
  }

  unlock();
})();
