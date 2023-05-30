import React, { Suspense } from 'react';
import { Route } from 'react-router-dom';

const SearchBox = React.lazy(() => import('../MainMenue'));
const StockInfo = React.lazy(() => import('../StockInformation'));

const MainRoutes = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <Route exact path="/" render={() => <SearchBox onSearch={handleSearch} /> } />
    <Route path="/stock/:symbol" render={() => <StockInfo />} />
  </Suspense>
);

// Example handleSearch function
const handleSearch = (query: string) => {
    // Handle the search logic here
  };

export default MainRoutes;


