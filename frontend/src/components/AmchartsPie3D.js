import React, { useEffect, useRef } from 'react';

const AmchartsPie3D = ({ uptime100Count, uptimeLessThan100Count, setChartInstance }) => {
  const chartDivRef = useRef(null);

  useEffect(() => {
    // Function to load a script
    const loadScript = (src, callback) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = callback;
      document.body.appendChild(script);
      return script;
    };

    // Function to load a CSS file
    const loadCss = (href) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.type = 'text/css';
      link.media = 'all';
      document.head.appendChild(link);
      return link;
    };

    const scriptsToLoad = [
      'https://www.amcharts.com/lib/3/amcharts.js',
      'https://www.amcharts.com/lib/3/pie.js',
      'https://www.amcharts.com/lib/3/plugins/export/export.min.js' // Export plugin after amcharts.js
    ];
    const cssToLoad = [
      'https://www.amcharts.com/lib/3/plugins/export/export.css'
    ];

    const loadedScripts = [];
    const loadedCss = [];

    // Load CSS first (though order often matters less for CSS)
    cssToLoad.forEach(href => loadedCss.push(loadCss(href)));

    // Load scripts sequentially to ensure dependencies are met
    let scriptsLoadedCount = 0;
    const loadNextScript = () => {
      if (scriptsLoadedCount < scriptsToLoad.length) {
        loadScript(scriptsToLoad[scriptsLoadedCount], () => {
          scriptsLoadedCount++;
          loadNextScript();
        });
      } else {
        // All scripts loaded, create the chart
        createChart();
      }
    };

    loadNextScript();

    const createChart = () => {
      // Ensure AmCharts is available globally after scripts are loaded
      if (window.AmCharts && chartDivRef.current) {
        const chart = window.AmCharts.makeChart(chartDivRef.current, {
          "type": "pie",
          "theme": null,
          "dataProvider": [
            {
              "country": "Uptime = 100%",
              "value": uptime100Count || 0,
              "color": "#d4d42b"
            },
            {
              "country": "Untreated Patients",
              "value": uptimeLessThan100Count || 0,
              "color": "#4a72d4"
            }
          ],
          "valueField": "value",
          "titleField": "country",
          "outlineAlpha": 0.4,
          "depth3D": 65,
          "balloonText": "[[title]]<br><span style='font-size:14px'><b>[[value]]</b> ([[percents]]%)</span>",
          "angle": 30,
          "labelsEnabled": false,
          "legend": { "enabled": false },
          "export": {
            "enabled": true,
            "menu": []
          }
        });

        // Pass the chart instance back to the parent component
        if (setChartInstance) {
          setChartInstance(chart);
        }
      }
    };

    // Cleanup function: remove scripts and styles on unmount
    return () => {
      loadedScripts.forEach(script => document.body.removeChild(script));
      loadedCss.forEach(link => document.head.removeChild(link));
    };
  }, [uptime100Count, uptimeLessThan100Count, setChartInstance]); // Re-create chart if data changes

  return (
    <div id="chartdiv" ref={chartDivRef} style={{ width: '100%', height: '900px' }}></div>
  );
};

export default AmchartsPie3D; 