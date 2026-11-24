/* public/laboratorio/conecta-raras/support.js
 * Motor mínimo que faz as telas da prévia do Conecta Raras (formato .dc.html)
 * rodarem como páginas comuns: lê o modelo dentro de <x-dc>, a classe Component
 * do <script type="text/x-dc"> e redesenha a tela a cada setState.
 * Sinais suportados: {{caminho}} em texto e atributos, <sc-if value>, <sc-for list as>,
 * onClick/onChange e <helmet> (vai para o <head>).
 */
(function () {
  'use strict';

  function DCLogic(props) {
    this.props = props || {};
    this.state = {};
  }
  DCLogic.prototype.setState = function (patch) {
    var p = typeof patch === 'function' ? patch(this.state) : patch;
    for (var k in p) this.state[k] = p[k];
    schedule();
  };
  window.DCLogic = DCLogic;

  var root, tpl, comp, pending = false;
  var EXPR = /\{\{\s*([^}]*?)\s*\}\}/g;
  var FULL = /^\s*\{\{\s*([^}]*?)\s*\}\}\s*$/;

  function lookup(expr, scope) {
    if (expr === 'true') return true;
    if (expr === 'false') return false;
    if (expr === '') return '';
    var parts = expr.split('.');
    var v = scope;
    for (var i = 0; i < parts.length; i++) {
      if (v == null) return undefined;
      v = v[parts[i]];
    }
    return v;
  }

  function text(v) {
    return v == null || v === false ? '' : String(v);
  }

  function child(scope, name, value) {
    var s = Object.create(scope);
    s[name] = value;
    return s;
  }

  function processChildren(parent, scope) {
    var nodes = Array.prototype.slice.call(parent.childNodes);
    for (var i = 0; i < nodes.length; i++) processNode(nodes[i], scope);
  }

  function unwrap(el) {
    var parent = el.parentNode;
    while (el.firstChild) parent.insertBefore(el.firstChild, el);
    parent.removeChild(el);
  }

  function processNode(node, scope) {
    if (node.nodeType === 3) {
      if (node.nodeValue.indexOf('{{') >= 0) {
        node.nodeValue = node.nodeValue.replace(EXPR, function (_, e) {
          return text(lookup(e, scope));
        });
      }
      return;
    }
    if (node.nodeType !== 1) return;
    var tag = node.tagName.toLowerCase();

    if (tag === 'sc-if') {
      var m = FULL.exec(node.getAttribute('value') || '');
      var ok = m ? lookup(m[1], scope) : false;
      if (ok) {
        processChildren(node, scope);
        unwrap(node);
      } else {
        node.parentNode.removeChild(node);
      }
      return;
    }

    if (tag === 'sc-for') {
      var lm = FULL.exec(node.getAttribute('list') || '');
      var list = (lm && lookup(lm[1], scope)) || [];
      var as = node.getAttribute('as') || 'item';
      var parent = node.parentNode;
      for (var i = 0; i < list.length; i++) {
        var frag = document.createDocumentFragment();
        for (var c = node.firstChild; c; c = c.nextSibling) frag.appendChild(c.cloneNode(true));
        var holder = document.createElement('div');
        holder.appendChild(frag);
        processChildren(holder, child(scope, as, list[i]));
        while (holder.firstChild) parent.insertBefore(holder.firstChild, node);
      }
      parent.removeChild(node);
      return;
    }

    var attrs = Array.prototype.slice.call(node.attributes);
    for (var a = 0; a < attrs.length; a++) {
      var name = attrs[a].name, val = attrs[a].value;
      if (name.indexOf('hint-') === 0) {
        node.removeAttribute(name);
        continue;
      }
      if (val.indexOf('{{') < 0) continue;
      var fm = FULL.exec(val);
      if (name.indexOf('on') === 0 && fm) {
        var fn = lookup(fm[1], scope);
        node.removeAttribute(name);
        if (typeof fn === 'function') {
          var ev = name.slice(2).toLowerCase();
          if (ev === 'change' && /^(input|textarea)$/i.test(node.tagName)) ev = 'input';
          node.addEventListener(ev, fn);
        }
        continue;
      }
      var out = fm ? text(lookup(fm[1], scope)) : val.replace(EXPR, function (_, e) { return text(lookup(e, scope)); });
      if (name === 'value' && 'value' in node) {
        node.removeAttribute('value');
        node.value = out;
      } else {
        node.setAttribute(name, out);
      }
    }
    processChildren(node, scope);
  }

  function render() {
    pending = false;
    var active = document.activeElement;
    var focusId = active && active.id;
    var selStart = null, selEnd = null;
    try {
      selStart = active.selectionStart;
      selEnd = active.selectionEnd;
    } catch (e) {}
    var vals = comp.renderVals() || {};
    var fresh = tpl.cloneNode(true);
    processChildren(fresh, vals);
    root.innerHTML = '';
    while (fresh.firstChild) root.appendChild(fresh.firstChild);
    if (focusId) {
      var el = document.getElementById(focusId);
      if (el) {
        el.focus();
        try {
          if (selStart != null) el.setSelectionRange(selStart, selEnd);
        } catch (e) {}
      }
    }
  }

  function schedule() {
    if (pending || !comp) return;
    pending = true;
    (window.requestAnimationFrame || setTimeout)(render);
  }

  function start() {
    root = document.querySelector('x-dc');
    if (!root) return;
    var helmet = root.querySelector('helmet');
    if (helmet) {
      while (helmet.firstChild) document.head.appendChild(helmet.firstChild);
      helmet.parentNode.removeChild(helmet);
    }
    tpl = document.createElement('div');
    while (root.firstChild) tpl.appendChild(root.firstChild);
    root.style.display = 'block';
    var script = document.querySelector('script[type="text/x-dc"]');
    var Component = DCLogic;
    if (script) {
      Component = new Function('DCLogic', script.textContent + '\nreturn Component;')(DCLogic);
    }
    comp = new Component({});
    if (!comp.state) comp.state = {};
    render();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
