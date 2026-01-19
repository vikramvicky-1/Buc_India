import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Events from './components/Events.jsx';
import Registration from './components/Registration.jsx';
import Gallery from './components/Gallery.jsx';
import Members from './components/Members.jsx';
import Safety from './components/Safety.jsx';
import Forum from './components/Forum.jsx';
import Footer from './components/Footer.jsx';

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
