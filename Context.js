import { request } from './utils';
export default class Context {
  constructor(node) {
    this.node = node;
  }
  set content(content) {
    this.node.textContent = content;
  }
  get content() {
    return this.node.textContent;
  }
  scope(id) {
    return id;
  }
  processor(content) {
    return content;
  }
  async normalize() {
    const element = this.node;
    const src = element.getAttribute('src');
    let content = null;
    if (src) {
      content = await request(src);
      element.removeAttribute('src');
    }
    /* TODO: support processor
     * 通过元素节点上的lang属性获取处理方法
     * 如: lang="scss", lang="typescript"
     */
    const parseContent = this.processor(content ? content : this.content);
    this.content = parseContent || '';
    return Promise.resolve();
  }
  beforeCompile() {
  }
  compile(baseURL) {
    return Promise.resolve(this.beforeCompile(baseURL));
  }
}
