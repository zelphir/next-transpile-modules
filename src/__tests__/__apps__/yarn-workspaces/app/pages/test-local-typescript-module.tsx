import React from 'react';
import { add } from 'shared-ts/utils/calc';
import { Subtitle } from 'shared-ts/components/Subtitle';

const HomePage: React.FC = () => {
  return (
    <div>
      <h1>The answer is {add(40, 3)}</h1>
      <Subtitle underlined>And this is a subtitle</Subtitle>
    </div>
  );
};

export default HomePage;
