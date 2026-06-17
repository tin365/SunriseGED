import { type ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import MessengerChat from '../components/MessengerChat';
import LineChat from '../components/LineChat';
import { useScrollReveal } from '../hooks/useScrollReveal';

/** Public site chrome: nav, footer, chat widgets, scroll-reveal animations. */
export default function BaseLayout({ children }: { children?: ReactNode }) {
  useScrollReveal();
  return (
    <>
      <div className="grain" aria-hidden="true" />
      <Nav />
      <main>{children ?? <Outlet />}</main>
      <Footer />
      <MessengerChat />
      <LineChat />
    </>
  );
}
