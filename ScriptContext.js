import Context from './Context';

export default class ScriptContext extends Context {
  constructor(node) {
    super(node);
    this.module = { exports: {} };
  }
  beforeCompile() {
    try {
      Function(
        'exports',
        'module',
        this.content
      ).call(
        this.module.exports,
        this.module.exports,
        this.module
      );
    } catch (e) {
      /* eslint-disable */
      console.error(e);
    }
    return this.module.exports;
  }
}
