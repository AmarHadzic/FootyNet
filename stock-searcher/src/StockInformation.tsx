import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';


interface StockData {
  symbol: string;
  address: string;
  descript: string;
  PE:  number;
  marketCap:  number;
  targetPrice:  number;
  buy: number;
  sell: number;
  avgNormalized: number;
  daysOfNews: number;
  exchange: string;
  companyName: string;
  enterpriseValue: number;
  forwardPE: number;
  // Add other fields as needed
}

const StockInfo: React.FC = () => {
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [widgetCreated, setWidgetCreated] = useState(false); // Declare widgetCreated state variable
  const containerRef3 = useRef<HTMLDivElement | null>(null);


  const containerRef = useRef<HTMLDivElement | null>(null);
  const [widgetCreated2, setWidgetCreated2] = useState(false); // Declare widgetCreated state variable
  const containerRef2 = useRef<HTMLDivElement | null>(null);
  const [widgetCreated3, setWidgetCreated3] = useState(false); // Declare widgetCreated state variable

  const containerRef4 = useRef<HTMLDivElement | null>(null);
  const [widgetCreated4, setWidgetCreated4] = useState(false); // Declare widgetCreated state variable

  const containerRef5 = useRef<HTMLDivElement | null>(null);
  const [widgetCreated5, setWidgetCreated5] = useState(false); // Declare widgetCreated state variable
  interface RouteParams {
    symbol: string;
  }
  
  // Inside your component...
  const { symbol } = useParams<RouteParams>();
  console.log('Symbol:', symbol);


  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await axios.get<any>(
          'https://eodhistoricaldata.com/api/fundamentals/' + symbol + '.US?api_token=5e89bf0940e071.13894345'
        );
          /*STOCK FUNDAMENTALS DATA*/ 
        const updatedStockData: StockData = {
            symbol: response.data.General.Code,
            address: response.data.General.Address,
            descript: response.data.General.Description,
            PE: response.data.Highlights.PERatio,
            targetPrice: response.data.Highlights.WallStreetTargetPrice,
            marketCap: response.data.Highlights.MarketCapitalization,
            buy: response.data.AnalystRatings.Buy,
            sell: response.data.AnalystRatings.Sell,
            exchange: response.data.General.Exchange,
            avgNormalized: 0,      //these 2 are not assigned on this API call.
            daysOfNews: 0,
            companyName : response.data.General.Name,
            enterpriseValue : response.data.Valuation.EnterpriseValue,
            forwardPE: response.data.Valuation.ForwardPE
        };
        console.log(response.data);
        setStockData(updatedStockData);

      } catch (error) {
        console.error('Error fetching stock data:', error);
      }
      /*GETTING SENTIMATE DATA:*/ 
      try {
        const sentimateInfo = await axios.get<any>(
          'https://eodhistoricaldata.com/api/sentiments?s=' + symbol?.toLowerCase() + '&from=2022-01-01&to=2022-04-22&api_token=5e89bf0940e071.13894345'
        );
        const admSentimentData = sentimateInfo.data[symbol+'.US']; // Accessing stock sentimate data array.
        const averageNormalized = calculateNormalizedSentimate(admSentimentData);

        setStockData(prevStockData => {
          if (prevStockData) {
            return {
              ...prevStockData,
              avgNormalized: averageNormalized, // Update avgNormalized field
              daysOfNews: admSentimentData.length
            };
          }
          return null; // Handle the case when prevStockData is null
        });
      
        console.log("avg:" + averageNormalized);
        console.log(sentimateInfo.data);

     


      } catch (error) {
        console.error('Error fetching stock data:', error);
      }
    };
    

    fetchStockData();
  }, []);

  useEffect(() => {
  }, [stockData]);

  const tradingViewChartWidget = stockData ? (
    <div className="tradingview-widget-container" style={{ float: 'left' }}>
      <iframe
        className="tradingview-widget-frame"
        src={`https://www.tradingview.com/widgetembed/?symbol=${stockData.symbol}&amp;interval=D&amp;timezone=UTC&amp;theme=dark&amp;style=1&amp;locale=en&amp;toolbarbg=f1f3f6&amp;enablepublishing=false&amp;withdateranges=false&amp;hide_side_toolbar=false&amp;allow_symbol_change=true&amp;saveimage=false&amp;details=true&amp;studies=%5B%5D&amp;show_popup_button=false&amp;popup_width=1000&amp;popup_height=650&amp;ref=website`}
        allowTransparency={true}
        width="500px"
        height="500px"
        scrolling="no"
      ></iframe>
    </div>
  ) : null;

  //SYMBOL INFORMATION

  useEffect(() => {
    if (stockData && !widgetCreated){

      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src ='https://s3.tradingview.com/external-embedding/embed-widget-symbol-info.js';
      script.async = true;
      script.innerHTML = JSON.stringify({
        symbol: symbol, // Customize the symbol here
        width: 900,
        locale: 'en',
        colorTheme: 'light',
        isTransparent: false,
    });
    if (containerRef.current) {
      containerRef.current.appendChild(script);
      setWidgetCreated(true);
    }
    }
  },  [stockData, symbol, widgetCreated]);
  

  // BUY AND SELL INDICATOR
  useEffect(() => {
    if (stockData && !widgetCreated4) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js';
      script.async = true;
      script.innerHTML = JSON.stringify({
        interval: '1M',
        width: 500,
        isTransparent: false,
        height: 500,
        symbol: symbol,
        showIntervalTabs: true,
        locale: 'en',
        colorTheme: 'light'
      });

      if (containerRef4.current) {
        containerRef4.current.appendChild(script);
        setWidgetCreated4(true);
      }
    }
  }, [stockData, symbol, widgetCreated4]);


/**FUNDAMENTALS DIPLAY: */

  useEffect(() => {
    if (stockData && !widgetCreated2) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src =
        'https://s3.tradingview.com/external-embedding/embed-widget-financials.js';
      script.async = true;
      script.innerHTML = JSON.stringify({
        colorTheme: 'light',
        isTransparent: false,
        largeChartUrl: '',
        displayMode: 'regular',
        width: 500,
        height: 830,
        symbol: symbol, // Customize the symbol here
        locale: 'en',
      });

      if (containerRef2.current) {
        containerRef2.current.appendChild(script);
        setWidgetCreated2(true);
      }
    }
  }, [stockData,symbol, widgetCreated2]);



  //TIMELINE
  useEffect(() => {
  
    if (stockData && !widgetCreated3) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-timeline.js';
      script.async = true;
      script.innerHTML = JSON.stringify({
        feedMode: symbol,
        symbol: symbol,
        colorTheme: 'light',
        isTransparent: false,
        displayMode: 'regular',
        width: 500,
        height: 830,
        locale: 'en',
      });

      if (containerRef3.current) {
        containerRef3.current.appendChild(script);
        setWidgetCreated3(true);
      }
    }
  }, [stockData, symbol, widgetCreated3]);

  //COMPANY PROFILE:

  useEffect(() => {
    if (stockData && !widgetCreated5) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-symbol-profile.js';
      script.async = true;
      script.innerHTML = JSON.stringify({
      width: '800',
      height: '400',
      colorTheme: 'light',
      isTransparent: false,
      symbol: symbol, // Customize the symbol here
      locale: 'en',
    });
    if (containerRef5.current) {
      containerRef5.current.appendChild(script);
      setWidgetCreated5(true);
    }
  }
  }, [stockData, symbol, widgetCreated5]);

  
  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      {stockData ? (
        <div>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0px' }}>
            <div className="tradingview-widget-container" ref={containerRef}></div> 
          </div>
          <br />
  
          <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '20px' }}>
            <div style={{ flex: 1, marginRight: '20px' }}>
              <div ref={containerRef2} className="tradingview-widget-container__widget"></div>
            </div>
            <div style={{ flex: 1 }}>
              <div className="tradingview-widget-container" ref={containerRef3} style={{ width: '500px', height: '830px' }}></div>
            </div>
          </div>
          <br />

          <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '20px' }}>
            <div style={{ display: 'flex', marginRight: '125px' }}>
              {tradingViewChartWidget}
            </div>
            <div style={{ flex: 1 }}>
              <div className="tradingview-widget-container" ref={containerRef4} style={{ width: '500px', height: '830px' }}></div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '50px' }}>
            <div className="tradingview-widget-container" ref={containerRef5}></div> 
          </div>

        </div>
      ) : (
        <p>Loading stock data...</p>
      )}
    </div>
  );
};


function calculateNormalizedSentimate(data: Array<any>) : number{
  if(data.length === 0){
    return 0; 
  }
  else{
    const sum = data.reduce((acc, item) => acc + item.normalized, 0);
    const average = sum / data.length;
    return average;
  }
}

export default StockInfo;
