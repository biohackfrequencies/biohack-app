import React, { createContext, useContext, useState, useEffect } from 'react';

type IntegrationId = 'oura' | 'calendar' | 'cgm' | 'fitbit';

interface IntegrationsContextType {
  connectedIntegrations: Set<IntegrationId>;
  toggleIntegration: (id: IntegrationId) => void;
}

const IntegrationsContext = createContext<IntegrationsContextType | null>(null);

export const IntegrationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [connectedIntegrations, setConnectedIntegrations] = useState<Set<IntegrationId>>(() => {
    try {
      const item = localStorage.getItem('biohack_integrations');
      return item ? new Set(JSON.parse(item)) : new Set();
    } catch (error) {
      return new Set();
    }
  });

  useEffect(() => {
    localStorage.setItem('biohack_integrations', JSON.stringify(Array.from(connectedIntegrations)));
  }, [connectedIntegrations]);

  const toggleIntegration = (id: IntegrationId) => {
    setConnectedIntegrations(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <IntegrationsContext.Provider value={{ connectedIntegrations, toggleIntegration }}>
      {children}
    </IntegrationsContext.Provider>
  );
};

export const useIntegrations = (): IntegrationsContextType => {
  const context = useContext(IntegrationsContext);
  if (!context) {
    throw new Error('useIntegrations must be used within an IntegrationsProvider');
  }
  return context;
};