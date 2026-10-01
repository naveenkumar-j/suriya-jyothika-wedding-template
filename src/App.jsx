import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { AppProvider, useApp } from "./context/AppContext.jsx";
import { useLockScroll } from "./hooks/useLockScroll.js";
import OpeningScreen from "./components/layout/OpeningScreen.jsx";
import ScrollProgress from "./components/layout/ScrollProgress.jsx";
import MusicControl from "./components/audio/MusicControl.jsx";
import InvitationCard from "./components/sections/InvitationCard.jsx";
import CoupleSection from "./components/sections/CoupleSection.jsx";
import Countdown from "./components/countdown/Countdown.jsx";
import EventsSection from "./components/sections/EventsSection.jsx";
import Gallery from "./components/gallery/Gallery.jsx";
import CoupleMessage from "./components/sections/CoupleMessage.jsx";
import RSVP from "./components/sections/RSVP.jsx";
import Footer from "./components/layout/Footer.jsx";
import AnalyticsPage from "./pages/AnalyticsPage.jsx";

// The host keeps the replies on one page instead of a second deploy, so the
// router is just the pathname: `/analytics` swaps the whole document.
const isAnalytics = /^\/analytics\/?$/i.test(window.location.pathname);

export default function App() {
  if (isAnalytics) return <AnalyticsPage />;

  return (
    <AppProvider>
      <Invitation />
    </AppProvider>
  );
}

function Invitation() {
  const { entered, introDone } = useApp();
  const reduce = useReducedMotion();
  useLockScroll(!introDone);

  return (
    <>
      <motion.div
        className="site-shell"
        initial={false}
        animate={
          introDone
            ? { opacity: 1, filter: "blur(0px)" }
            : { opacity: 0, filter: "blur(6px)" }
        }
        transition={{ duration: reduce ? 0 : 1.1, ease: [0.22, 0.61, 0.36, 1] }}
        aria-hidden={!introDone}
        inert={!introDone}
      >
        <main>
          <InvitationCard />
          {/* Sits above the pinned card so each section slides over it. */}
          <div className="relative z-[1] bg-[var(--color-ivory)]">
            <CoupleSection />
            <Countdown />
            <EventsSection />
            <Gallery />
            <CoupleMessage />
            <RSVP />
          </div>
        </main>
        <Footer />
      </motion.div>

      {/* Outside the blurred shell so `fixed` still resolves to the viewport. */}
      {introDone && <ScrollProgress />}

      <AnimatePresence>{!introDone && <OpeningScreen key="opening" />}</AnimatePresence>

      {entered && <MusicControl />}
    </>
  );
}
