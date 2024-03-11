import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App';
import Signin from './Components/Signin';

import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
const client = new ApolloClient({
  uri: 'http://localhost:5000/graphql', 
  cache: new InMemoryCache(),
});

const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
   
      <Router>
        <Routes>
          <Route path="/:roomuuid" element={<App />} />
          <Route path="/" element={<Signin />} />
        </Routes>
      </Router>
    
    </ApolloProvider>
    
  </React.StrictMode>
);


