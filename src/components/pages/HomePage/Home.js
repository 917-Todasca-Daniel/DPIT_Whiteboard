import React from 'react';
import HeroSection from '../../HeroSection';
import { homeObjOne, homeObjTwo, homeObjThree, homeObjFour } from './Data';

function Home() {
  return (
    <>
      <HeroSection {...homeObjOne} />
    </>
  );
}

export default Home;