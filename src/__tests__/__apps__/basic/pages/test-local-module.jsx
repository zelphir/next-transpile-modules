import React from 'react';
import { multiply } from 'shared';
import { add } from 'shared/utils/calc';

const HomePage = () => {
  return (
    <>
      <h1>The answer is {add(40, 2)}</h1>
      <h2>The answer is not {multiply(40, 2)}</h2>
    </>
  );
};

export default HomePage;
