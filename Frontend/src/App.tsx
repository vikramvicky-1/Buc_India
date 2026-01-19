import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Events from './components/Events';
import Registration from './components/Registration';
import Gallery from './components/Gallery';
import Members from './components/Members';
import Safety from './components/Safety';
import Forum from './components/Forum';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <Hero />
      <About />
      <Events />
      <Registration />
      <Gallery />
      <Members />
      <Safety />
      <Forum />
      <Footer />
    </div>
  );
}

export default App;