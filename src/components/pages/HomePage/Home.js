import React from 'react';
import HeroSection from '../../HeroSection';
import HowItWorks from '../../HowItWorks';
import { homeObjOne, homeObjTwo, homeObjThree, homeObjFour } from './Data';

function Home() {
  return (
    <>
      <HeroSection {...homeObjOne} />
      <HowItWorks />
    </>
  );
}

export default Home;