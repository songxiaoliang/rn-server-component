import { Image, Pressable, Text, TextInput, View } from "@/LasoUI";
import { isArray, isFunction } from "lodash";
import { Children, createElement } from "react";

const ComponentEnum = {
  View: View,
  Text: Text,
  Image: Image,
  Button: Pressable,
  TextInput: TextInput,
};

const loadPluginCode = (template, plugin) => {
  if (isArray(template)) {
    template.map((code) => {
      try {
        Function(`${code}`)()(plugin);
      } catch (error) {
        console.log(error);
      } finally {
      }
    });
  }
  try {
    Function(`${template}`)()(plugin);
  } catch (error) {
    console.log(error);
  } finally {
  }
};

const virtualDomToNative = (config, callbacks) => {
  const { type, props, children } = config;
  let newProps = {};
  if (props) {
    newProps = Object.entries(props).reduce((acc, [key, value]) => {
      if (value["@clientFn"]) {
        return {
          ...acc,
          [key]: () => {
            if (isFunction(callbacks[value.event])) {
              callbacks[value.event](value.payload);
            }
          },
        };
      }
      return {
        ...acc,
        [key]: value,
      };
    }, {});
  }
  const ComponentView = ComponentEnum[type] ?? ComponentEnum["View"];
  return createElement(
    ComponentView,
    newProps,
    isArray(children)
      ? Children.map(children, (child) => virtualDomToNative(child, callbacks))
      : children,
  );
};

export { virtualDomToNative, loadPluginCode };
