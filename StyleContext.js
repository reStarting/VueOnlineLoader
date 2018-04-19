import Context from './Context';

export default class StyleContext extends Context {
  process(id) {
    const sheet = this.node.sheet;
    const rules = Array.prototype.slice.call(sheet.cssRules || []);
    rules.forEach((rule, i) => {
      if (rule.type !== 1) return;
      const scopedSelectors = [];
      rule.selectorText.split(/\s*,\s*/).forEach(sel => {
        scopedSelectors.push(id + ' ' + sel);
        const segments = sel.match(/([^ :]+)(.+)?/);
        scopedSelectors.push(segments[1] + id + (segments[2] || ''));
      });
      const scopedRule =
          scopedSelectors.join(',') +
          rule.cssText.substr(rule.selectorText.length);
      sheet.deleteRule(i);
      sheet.insertRule(scopedRule, i);
    });
  }
  scope(id) {
    try {
      this.process(id);
    } catch (e) {
      if (e instanceof DOMException && e.code === DOMException.INVALID_ACCESS_ERR) {
        const me = this;
        const element = this.node;
        element.sheet.disabled = true;
        element.addEventListener('load', function onLoaded() {
          element.removeEventListener('load', onLoaded);
          setTimeout(() => {
            me.process(id);
            element.sheet.disabled = false;
          }, 0);
        });
        return;
      }
      throw e;
    }
    return this;
  }
  beforeCompile(baseURL = null) {
    const head = document.head || document.getElementsByTagName('head')[0];

    let baseNode = null;
    if (baseURL) {
      baseNode = document.createElement('base');
      baseNode.href = baseURL;
      head.insertBefore(baseNode, head.firstChild);
    }
    head.appendChild(this.node);
    if (baseNode) {
      head.removeChild(baseNode);
    }
  }
}
