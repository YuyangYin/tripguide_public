import { ReactNode } from 'react';

interface MobileFrameProps {
  children: ReactNode;
  // themeId kept for backwards-compatible API; not used after removing the phone frame.
  themeId?: string;
}

// Was a "phone mockup" wrapper (status bar / notch / home indicator).
// Now a pure page shell: full viewport on any device, no fake phone chrome.
// PC / tablet / mobile all render as a clean full-width web page.
export default function MobileFrame({ children }: MobileFrameProps) {
  return (
    <div className="h-[100dvh] w-full flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {children}
      </div>
    </div>
  );
}
