import React from 'react';
import {storiesOf} from '@storybook/react';

import CodeExample from 'wix-storybook-utils/CodeExample';
import ControlledBadgeExample from './Example';
import ControlledBadgeExampleRaw from '!raw-loader!./Example';

storiesOf('12. Other', module)
  .add('12.1 Badge', () =>
    <div>
      <CodeExample title="Badge" code={ControlledBadgeExampleRaw}>
        <ControlledBadgeExample/>
      </CodeExample>
    </div>
  );
