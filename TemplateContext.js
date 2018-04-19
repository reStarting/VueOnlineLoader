import Context from './Context';

export default class TemplateContext extends Context {
  set content(html) {
    this.node.innerHTML = html;
  }
  get content() {
    return this.node.innerHTML;
  }
  scope(id) {
    let template = this.node.content || this.node;
    let node = null;
    if ('firstElementChild' in template) {
      node = template.firstElementChild;
    } else {
      for (node = template.firstChild; node !== null; node = node.nextSibling) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          break;
        }
      }
    }
    node.setAttribute(id, '');
    return this;
  }
}
