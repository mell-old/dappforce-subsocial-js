// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '@subsocial/react-components/types';
import { Size } from '../types';

import React from 'react';
import { Labelled } from '@subsocial/react-components';

import Bare from './Bare';

interface Props extends BareProps {
  children?: React.ReactNode;
  isDisabled?: boolean;
  isOuter?: boolean;
  label?: React.ReactNode;
  size?: Size;
  withLabel?: boolean;
}

function Base ({ children, className, isOuter, label, size = 'full', style, withLabel }: Props): React.ReactElement<Props> {
  return (
    <Bare
      className={className}
      style={style}
    >
      <Labelled
        className={size}
        isOuter
        label={label}
        withEllipsis
        withLabel={withLabel}
      >
        {!isOuter && children}
      </Labelled>
      {isOuter && children}
    </Bare>
  );
}

export default React.memo(Base);
