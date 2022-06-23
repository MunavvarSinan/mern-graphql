import React from 'react';
import Clients from '../components/Clients';
import AddClientModel from '../components/AddClientModel';
import AddProjectModel from '../components/AddProjectModel';
import Projects from '../components/Projects';

const Home = () => {
  return (
    <>
      <div className='d-flex gap-3 mb-4'>
        <AddClientModel />
        <AddProjectModel />
      </div>
      <Projects />
      <hr />
      <Clients />
    </>
  );
};

export default Home;
