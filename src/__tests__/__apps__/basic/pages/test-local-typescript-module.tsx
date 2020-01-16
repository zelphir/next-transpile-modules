import React from 'react';
import { add } from 'shared-ts/utils/calc';

const HomePage: React.FC = () => {
  return <h1>The answer is {add(40, 3)}</h1>;
};

export default HomePage;
