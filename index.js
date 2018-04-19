import { request, parseName } from './utils';
import Component, { COMPONENT_TYPE } from './Component';

export default function VueLoader(url) {
  const name = parseName(url);
  return () => {
    return request(`${url}/card.json`)
      .then(
        config => {
          try {
            const conf = JSON.parse(config);
            return {
              ...conf,
              url: `${url}/${conf.main ? conf.main : ''}`,
              name,
              type: conf.type === 'multi'
                ? COMPONENT_TYPE.MULTI
                : COMPONENT_TYPE.SINGLE,
            }
          } catch (e) {
            /* eslint-disable */
            console.warn(e);
          }
        },
        () => ({
          url: `${url}/index.vue`,
          name
        })
      )
      .then(component => {
        const {url, name, ...opts} = component;
        return new Component(url, name, opts).parse()
      })
      .then(cmp => cmp.normalize())
      .then(cmp => cmp.compile())
      .then(cmp => {
        const exp = cmp.script !== null ? cmp.script.module.exports : {};
        if (cmp.template !== null) {
          exp.template = cmp.template.content;
        }
        if (exp.name === undefined && cmp.name !== undefined) {
          exp.name = cmp.name;
        }
        exp.__baseURI = cmp.baseURI;
        return exp;
      })
      .catch(e => {
        /* eslint-disable */
        console.error(e);
      });
  };
}
