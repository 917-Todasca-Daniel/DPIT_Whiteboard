// import React from 'react';
// import './HowItWorks.css';
// import { Button } from './Button';
// import { Link } from 'react-router-dom';

// function HowItWorks() {
//   return (
//     <>
//         {/* <div> */}
//             <h2 className="hiw_title">How it works?</h2>
//         {/* </div> */}
//     </>
//   );
// }

// export default HowItWorks;

import React from 'react';
import { Button } from './Button';
import './HowItWorks.css';
import { FaFire } from 'react-icons/fa';
import { BsXDiamondFill } from 'react-icons/bs';
import { GiCrystalize } from 'react-icons/gi';
import { IconContext } from 'react-icons/lib';
import { Link } from 'react-router-dom';
import AronAndreea from './AronAndreea.jpg';
import TeoUrsu from './TeoUrsu.jpg';
import SuciuAntonio from './SuciuAntonio.jpeg';
import SandorAlexandra from './SandorAlexandra.jpg';
import SusciucAnastasia from './SusciucAnastasia.jpg';
import TodascaDaniel from './TodascaDaniel.jpeg';

function HowItWorks() {
  return (
    <IconContext.Provider value={{ color: '#fff', size: 64, margin: 24 }}>
      <div className='pricing__section'>
        <div className='pricing__wrapper'>
          <h1 className='pricing__heading'>About us</h1>
          <div className='pricing__container'>
            <Link to='/sign-up' className='pricing__container-card'>
              <div className='pricing__container-cardInfo'>
              <img src={SandorAlexandra} height = "150px" class = "image"/>
                <h3>Sandor Alexandra</h3>
                <p>Software Engineer</p>
                
              </div>
            </Link>
            <Link to='/sign-up' className='pricing__container-card'>
              <div className='pricing__container-cardInfo'>
                <img src={TodascaDaniel} height = "150px" class = "image"/>
                <h3>Todasca Daniel</h3>
                <p>Software Engineer</p>
                
              </div>
            </Link>
            <Link to='/sign-up' className='pricing__container-card'>
              <div className='pricing__container-cardInfo'>
              <img src={SusciucAnastasia} height = "150px" class = "image"/>
                <h3>Susciuc Anastasia</h3>
              
                <p>Software Engineer</p>
                <ul className='pricing__container-features'>
                </ul>
                
              </div>
            </Link>

          </div>
          <div> <h1> </h1> <h1> </h1>  </div>
          <div className='pricing__container'>
            <Link to='/sign-up' className='pricing__container-card'>
              <div className='pricing__container-cardInfo'>
                <img src={SuciuAntonio} height = "150px" class = "image"/>
                <h3>Suciu Antonio</h3>
                <p>Marketing</p>
                
              </div>
            </Link>

            <Link to='/sign-up' className='pricing__container-card'>
              <div className='pricing__container-cardInfo'>
                <img src={AronAndreea} height = "150px" class = "image"/>
                <h3>Aron Andreea</h3>
                <p>Designer</p>
                
              </div>
            </Link>
            <Link to='/sign-up' className='pricing__container-card'>
              <div className='pricing__container-cardInfo'>
                <img src={TeoUrsu} height = "150px" class = "image"/>
                <h3>Ursu Teodora</h3>
                
                <p>Software Engineer</p>
                <ul className='pricing__container-features'>
                </ul>
                
              </div>
            </Link>

          </div>
        </div>
      </div>
    </IconContext.Provider>
  );
}
export default HowItWorks;
