import React from 'react';
import Clients from './components/Clients';
import AddClientModel from './components/AddClientModel';
import Projects from './components/Projects';

const Home = () => {
  return (
    <>
      <AddClientModel />
      <Projects />
      <Clients />
    </>
  );
};

export default Home;
