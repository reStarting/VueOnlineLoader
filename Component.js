import TemplateContext from './TemplateContext';
import ScriptContext from './ScriptContext';
import StyleContext from './StyleContext';
import { request } from './utils';

let scopeIndex = 0;

export const COMPONENT_TYPE = {
  SINGLE: 0,
  MULTI: 1
};

export default class Component {
  constructor(
    url,
    name,
    {
      type = COMPONENT_TYPE.SINGLE,
      main = 'index.vue',
      style = 'index.css',
      template = 'index.html'
    } = {}
  ) {
    this.name = name;
    this.url = url;
    this.baseURI = url.substr(0, url.lastIndexOf('/') + 1);
    this.scopeId = this.getScopeId();
    this.template = null;
    this.script = null;
    this.style = null;
    this.type = type;
    this.scriptName = main;
    if (this.type === COMPONENT_TYPE.MULTI) {
      this.styleName = style;
      this.templateName = template;
    }
  }
  getScopeId() {
    return 'data-s-' + (scopeIndex++).toString(36);
  }
  beforeParse() {
    if (this.type === COMPONENT_TYPE.SINGLE) {
      return request(this.baseURI + this.scriptName);
    } else {
      return Promise.all([
        request(this.baseURI + this.scriptName).catch(() => ''),
        request(this.baseURI + this.templateName).catch(() => ''),
        request(this.baseURI + this.styleName).catch(() => '')
      ]).then(([js, html, css]) => {
        return `<template>${html}</template><script>${js}</script><style>${css}</style>}`;
      });
    }
  }
  async parse() {
    const doc = document.implementation.createHTMLDocument('');
    // IE: fix bug
    doc.body.innerHTML =
      (this.baseURI ? '<base href="' + this.baseURI + '">' : '') +
      (await this.beforeParse());
    for (var node = doc.body.firstChild; node; node = node.nextSibling) {
      switch (node.nodeName) {
      case 'TEMPLATE':
        this.template = new TemplateContext(node).scope(this.scopeId);
        break;
      case 'SCRIPT':
        this.script = new ScriptContext(node);
        break;
      case 'STYLE':
        this.style = new StyleContext(node).scope(this.scopeId);
        break;
      }
    }
    return this;
  }
  normalize() {
    return Promise.all([
      this.template.normalize(),
      this.script.normalize(),
      this.style.normalize()
    ]).then(() => this);
  }
  compile() {
    return Promise.all([
      this.template && this.template.compile(),
      this.script && this.script.compile(),
      this.style && this.style.compile()
    ]).then(() => this);
  }
}
