import { useEffect } from 'react';
import { useStore } from './store/useStore';
import { AppShell } from './components/shell/AppShell';
import { Onboarding } from './components/shell/Onboarding';

export default function App() {
  const theme = useStore((s) => s.theme);
  const onboarded = useStore((s) => s.onboarded);
  const setLeft = useStore((s) => s.setLeft);
  const setRight = useStore((s) => s.setRight);

  // apply theme to the document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // start with rails collapsed on small screens (they become bottom/side sheets)
  useEffect(() => {
    if (window.innerWidth < 1080) {
      setLeft(false);
      setRight(false);
    }
  }, [setLeft, setRight]);

  return onboarded ? <AppShell /> : <Onboarding />;
}
