import React, { createContext, useContext, useState, useEffect } from "react";
import overlayService from "../services/overlayService";

const OverlayContext = createContext();

export const OverlayProvider = ({ children }) => {
  const [overlayState, setOverlayState] = useState({ visible: false, message: '', type: 'loading' });

  useEffect(() => {
    overlayService.register(setOverlayState);
    return () => overlayService.register(null);
  }, []);

  return (
    <OverlayContext.Provider value={{ processing: overlayState.visible, setProcessing: (state) => setOverlayState(typeof state === 'boolean' ? { visible: state, message: '', type: 'loading' } : state) }}>
      {children}
    </OverlayContext.Provider>
  );
};

export const useOverlay = () => {
  const ctx = useContext(OverlayContext);
  if (!ctx) throw new Error("useOverlay must be used inside OverlayProvider");
  return ctx;
};
