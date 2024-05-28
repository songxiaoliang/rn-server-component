import { loadPluginCode, virtualDomToNative } from "./JSXRender";

const SC = new Proxy(
  {},
  {
    get: function (target, key, receiver) {
      // init time: target[key] = undefined;
      if (typeof target[key] === "undefined") {
        // return function, ...args => Component props
        return function (...args) {
          const { data, template, plugin, ...props } = args[0];
          // data => server jsx
          loadPluginCode(template, plugin);
          // props => { vyttinPress: [Function buttonPress]}
          return virtualDomToNative(data, props);
        };
      } else {
        // cache component
        return Reflect.get(target, key, receiver);
      }
    },
  },
);

export default SC;
