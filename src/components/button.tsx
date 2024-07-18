import React from 'react';

interface Props {
  textButton: string;
  classButton: string;
  onClick: () => void;
}

export function Button(props: Props): JSX.Element {
  return (
    <button className={props.classButton} onClick={() => props.onClick()}>
      {props.textButton}
    </button>
  );
}
