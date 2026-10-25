// Formulário de contato do site.
// Todo botão "mailto:...?subject=..." passa a abrir um formulário curto. O contato vai para o editor
// (aba Contatos) e chega por e-mail para a Isabela. Se algo falhar, o visitante ainda pode mandar e-mail.
(function () {
  var ENDPOINT = 'https://isabela-editor.vercel.app/api/lead';
  var EMAIL = 'isaignacio1@gmail.com';

  var css = '' +
    '.ct-fundo{position:fixed;inset:0;z-index:100;background:rgba(18,26,36,.55);display:none;align-items:flex-end;justify-content:center;padding:0}' +
    '.ct-fundo.on{display:flex}' +
    '.ct-caixa{background:#FAF8F3;color:#15202E;width:100%;max-width:480px;max-height:92vh;overflow:auto;border-radius:22px 22px 0 0;padding:22px 20px 20px;font-family:Geist,system-ui,sans-serif;box-shadow:0 30px 80px -20px rgba(0,0,0,.5)}' +
    '@media(min-width:620px){.ct-fundo{align-items:center;padding:20px}.ct-caixa{border-radius:22px;padding:28px}}' +
    '.ct-caixa h2{font-size:22px;letter-spacing:-.03em;line-height:1.15;font-weight:600;margin:0}' +
    '.ct-caixa .ct-sub{color:#3A4554;font-size:15px;margin:6px 0 16px}' +
    '.ct-caixa .ct-tag{display:inline-block;font-size:12px;font-weight:600;background:#E3F0F0;color:#165F68;border-radius:999px;padding:3px 10px;margin-bottom:10px}' +
    '.ct-caixa label{display:block;font-size:13.5px;font-weight:500;margin:12px 0 5px}' +
    '.ct-caixa label small{color:#646B78;font-weight:400}' +
    '.ct-caixa input,.ct-caixa textarea{width:100%;box-sizing:border-box;border:1px solid #D4CFC2;border-radius:12px;padding:12px 14px;font:16px Geist,system-ui,sans-serif;background:#fff;color:#15202E}' +
    '.ct-caixa input:focus,.ct-caixa textarea:focus{outline:2px solid #1F6F78;border-color:transparent}' +
    '.ct-caixa textarea{min-height:90px;resize:vertical}' +
    '.ct-caixa .ct-hp{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}' +
    '.ct-caixa .ct-enviar{width:100%;margin-top:16px;border:0;border-radius:999px;background:#E2552D;color:#fff;font:500 16px Geist,system-ui,sans-serif;padding:15px;cursor:pointer}' +
    '.ct-caixa .ct-enviar:disabled{opacity:.6;cursor:default}' +
    '.ct-caixa .ct-rodape{font-size:13px;color:#646B78;margin-top:12px;text-align:center}' +
    '.ct-caixa .ct-rodape a{color:#15202E}' +
    '.ct-caixa .ct-erro{color:#B42318;font-size:14px;margin-top:10px;display:none}' +
    '.ct-fechar{float:right;border:0;background:transparent;font-size:24px;line-height:1;color:#646B78;cursor:pointer;padding:0 0 0 10px}' +
    '.ct-ok{text-align:center;padding:16px 4px}' +
    '.ct-ok b{display:block;font-size:22px;letter-spacing:-.02em;margin-bottom:6px}' +
    '.ct-ok p{color:#3A4554;font-size:15px;margin:0}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var fundo = document.createElement('div');
  fundo.className = 'ct-fundo';
  fundo.setAttribute('role', 'dialog');
  fundo.setAttribute('aria-modal', 'true');
  fundo.setAttribute('aria-labelledby', 'ct-titulo');
  fundo.innerHTML =
    '<div class="ct-caixa">' +
      '<button type="button" class="ct-fechar" aria-label="Fechar">×</button>' +
      '<div class="ct-form">' +
        '<span class="ct-tag" id="ct-assunto-tag"></span>' +
        '<h2 id="ct-titulo">Vamos conversar?</h2>' +
        '<p class="ct-sub">Deixe seu contato e o que você precisa. Eu respondo pessoalmente.</p>' +
        '<form novalidate>' +
          '<label for="ct-nome">Seu nome</label><input id="ct-nome" name="nome" autocomplete="name" required maxlength="120">' +
          '<label for="ct-contato">WhatsApp ou e-mail</label><input id="ct-contato" name="contato" autocomplete="email" required maxlength="160" placeholder="(11) 99999-9999 ou voce@empresa.com">' +
          '<label for="ct-empresa">Empresa <small>(opcional)</small></label><input id="ct-empresa" name="empresa" autocomplete="organization" maxlength="160">' +
          '<label for="ct-msg">O que você precisa? <small>(opcional)</small></label><textarea id="ct-msg" name="mensagem" maxlength="3000" placeholder="Ex.: quero entender por que meus clientes cancelam"></textarea>' +
          '<div class="ct-hp" aria-hidden="true"><label>Não preencha<input name="site" tabindex="-1" autocomplete="off"></label></div>' +
          '<button class="ct-enviar" type="submit">Enviar</button>' +
          '<p class="ct-erro" role="alert"></p>' +
        '</form>' +
        '<p class="ct-rodape">Prefere e-mail? <a href="mailto:' + EMAIL + '">' + EMAIL + '</a></p>' +
      '</div>' +
      '<div class="ct-ok" hidden><b>Recebido!</b><p>Obrigada pelo contato. Vou te responder em breve.</p></div>' +
    '</div>';
  document.body.appendChild(fundo);

  var form = fundo.querySelector('form'), erro = fundo.querySelector('.ct-erro'), botao = fundo.querySelector('.ct-enviar');
  var tag = fundo.querySelector('#ct-assunto-tag'), ok = fundo.querySelector('.ct-ok'), parteForm = fundo.querySelector('.ct-form');
  var assunto = '', ultimoFoco = null;

  function abre(novoAssunto) {
    assunto = novoAssunto || '';
    tag.textContent = assunto; tag.style.display = assunto ? '' : 'none';
    parteForm.hidden = false; ok.hidden = true; erro.style.display = 'none';
    ultimoFoco = document.activeElement;
    fundo.classList.add('on'); document.body.style.overflow = 'hidden';
    setTimeout(function () { fundo.querySelector('#ct-nome').focus(); }, 30);
  }
  function fecha() {
    fundo.classList.remove('on'); document.body.style.overflow = '';
    if (ultimoFoco && ultimoFoco.focus) ultimoFoco.focus();
  }
  fundo.addEventListener('click', function (e) { if (e.target === fundo) fecha(); });
  fundo.querySelector('.ct-fechar').addEventListener('click', fecha);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && fundo.classList.contains('on')) fecha(); });

  // botões com assunto viram abridores do formulário (o e-mail simples continua e-mail)
  document.querySelectorAll('a[href^="mailto:"]').forEach(function (a) {
    var href = a.getAttribute('href');
    var m = href.match(/[?&]subject=([^&]*)/);
    if (!m || a.closest('.ct-caixa')) return;
    var s = ''; try { s = decodeURIComponent(m[1]); } catch (e) { s = m[1]; }
    a.addEventListener('click', function (e) { e.preventDefault(); abre(s); });
    a.setAttribute('role', 'button');
    var texto = a.firstChild && a.firstChild.nodeType === 3 ? a.firstChild : null;
    if (texto && /mandar e-mail/i.test(texto.nodeValue)) texto.nodeValue = texto.nodeValue.replace(/mandar e-mail/i, 'Enviar mensagem');
  });

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    var d = Object.fromEntries(new FormData(form).entries());
    d.nome = (d.nome || '').trim(); d.contato = (d.contato || '').trim();
    if (!d.nome || d.contato.length < 6) { erro.textContent = 'Preencha seu nome e um WhatsApp ou e-mail.'; erro.style.display = 'block'; return; }
    d.assunto = assunto; d.pagina = location.pathname;
    botao.disabled = true; botao.textContent = 'Enviando…'; erro.style.display = 'none';
    try {
      var r = await fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(d) });
      if (!r.ok) throw new Error();
      form.reset(); parteForm.hidden = true; ok.hidden = false;
    } catch (x) {
      var corpo = 'Nome: ' + d.nome + '\nContato: ' + d.contato + (d.empresa ? '\nEmpresa: ' + d.empresa : '') + (d.mensagem ? '\n\n' + d.mensagem : '');
      erro.innerHTML = 'Não consegui enviar agora. <a href="mailto:' + EMAIL + '?subject=' + encodeURIComponent(assunto || 'Contato pelo site') + '&body=' + encodeURIComponent(corpo) + '">Clique aqui para mandar por e-mail</a>, com tudo já preenchido.';
      erro.style.display = 'block';
    } finally {
      botao.disabled = false; botao.textContent = 'Enviar';
    }
  });
})();
