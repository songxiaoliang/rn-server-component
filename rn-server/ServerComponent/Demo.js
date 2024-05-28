import React from 'react';
import {navigate} from '@/Services/Navigation';

import SC from '@/Components/ServerComponent/ServerComponent';

const Demo = () => {
  return (
    <SC.HomeBanner
      data={{
        type: 'Button',
        props: {
          style: {
            width: 100,
            height: 100,
            backgroundColor: '#f90f',
          },
          onPress: {
            '@clientFn': true,
            event: 'buttonPress',
            payload: {
              type: 'template',
              code: `globalThis.a()`,
            },
          },
        },
      }}
      template={`
                      return function(plugin) {
                          plugin['global'].a = function() {
                              plugin['route']('LSLoginPage')
                          }
                      }
                  `}
      plugin={{
        global: globalThis,
        route: navigate,
      }}
      buttonPress={params => {
        if (params.type === 'navigate') {
          navigate(params.route.name);
        }
        if (params.type === 'template') {
          Function(params.code)();
        }
      }}
    />
  );
};

export default Demo;
