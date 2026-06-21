import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../components/Hero';
import About from '../components/About';
import Rooms from '../components/Rooms';
import Amenities from '../components/Amenities';
import Gallery from '../components/Gallery';
import Reviews from '../components/Reviews';
import Contact from '../components/Contact';

const Home = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [hash]);

  return (
    <div>
      <Hero />
      <About />
      <Rooms />
      <Amenities />
      <Gallery />
      <Reviews />
      <Contact />
    </div>
  );
};

export default Home;
