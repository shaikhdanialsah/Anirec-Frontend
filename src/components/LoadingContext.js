import React, { createContext, useContext, useState } from 'react';

const LoadingContext = createContext();

export const useLoading = () => {
  return useContext(LoadingContext);
};

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);

  const finishLoading = () => {
    setLoading(false);
  };

  return (
    <LoadingContext.Provider value={{ loading, finishLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};
