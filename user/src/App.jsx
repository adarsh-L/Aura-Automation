import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import Process from './components/Process';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0F172A', color: '#F8FAFC' }}>
      <Header />
      <main>
        <Hero />
        <Services />
        <Process />
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
}
