import React, { useEffect, useRef, useState } from 'react';

const AmchartsPie3D = ({ uptime100Count, uptimeLessThan100Count, setChartInstance, style, customData }) => {
  const chartDivRef = useRef(null);
  const [scriptsLoaded, setScriptsLoaded] = useState(false);
  const [chartInstance, setLocalChartInstance] = useState(null);

  useEffect(() => {
    // Check if scripts are already loaded
    if (window.am4core && window.am4charts) {
      setScriptsLoaded(true);
      return;
    }

    // Function to load a script with error handling
    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        // Check if script already exists
        const existingScript = document.querySelector(`script[src="${src}"]`);
        if (existingScript) {
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
        document.head.appendChild(script);
      });
    };

    const loadAmchartsScripts = async () => {
      try {
        const scriptsToLoad = [
          'https://cdn.amcharts.com/lib/4/core.js',
          'https://cdn.amcharts.com/lib/4/charts.js',
          'https://cdn.amcharts.com/lib/4/themes/animated.js'
        ];

        // Load scripts sequentially
        for (const scriptSrc of scriptsToLoad) {
          await loadScript(scriptSrc);
        }

        setScriptsLoaded(true);
      } catch (error) {
        console.error('Error loading Amcharts scripts:', error);
        // Fallback: try to create a simple chart without Amcharts
        createFallbackChart();
      }
    };

    loadAmchartsScripts();

    // Cleanup function
    return () => {
      if (chartInstance) {
        try {
          chartInstance.dispose();
        } catch (error) {
          console.error('Error disposing chart:', error);
        }
      }
    };
  }, []);

  const createFallbackChart = () => {
    if (!chartDivRef.current) return;
    
    const div = chartDivRef.current;
    div.innerHTML = `
      <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        background: #f5f5f5;
        border: 1px solid #ddd;
        border-radius: 8px;
        color: #666;
        font-family: Arial, sans-serif;
      ">
        <div style="text-align: center;">
          <div style="font-size: 24px; margin-bottom: 10px;">📊</div>
          <div>Chart loading...</div>
          <div style="font-size: 12px; margin-top: 5px;">Amcharts library unavailable</div>
        </div>
      </div>
    `;
  };

  const createChart = () => {
    if (!chartDivRef.current || !window.am4core || !window.am4charts) {
      createFallbackChart();
      return;
    }

    try {
      // Dispose existing chart if any
      if (chartInstance) {
        chartInstance.dispose();
      }

      // Themes begin
      window.am4core.useTheme(window.am4themes_animated);
      // Themes end

      const chart = window.am4core.create(chartDivRef.current, window.am4charts.PieChart3D);
      chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

      // Use customData if provided, otherwise default to two-slice data
      chart.data = customData && customData.length > 0 ? customData : [
        {
          category: "Uptime = 100%",
          value: uptime100Count || 0,
          color: "#10b981" // Green color for 100% uptime
        },
        {
          category: "Uptime < 100%",
          value: uptimeLessThan100Count || 0,
          color: "#ef4444" // Red color for less than 100% uptime
        }
      ];

      chart.innerRadius = window.am4core.percent(40);
      chart.depth = 120;

      chart.legend = new window.am4charts.Legend();

      const series = chart.series.push(new window.am4charts.PieSeries3D());
      series.dataFields.value = "value";
      series.dataFields.depthValue = "value";
      series.dataFields.category = "category";
      series.slices.template.cornerRadius = 5;
      series.colors.step = 3;

      // If customData, use a color palette; otherwise, use default colors
      if (customData && customData.length > 0) {
        // Use a color palette for multiple slices
        series.colors.list = [
          window.am4core.color("#10b981"),
          window.am4core.color("#3b82f6"),
          window.am4core.color("#f59e0b"),
          window.am4core.color("#ef4444"),
          window.am4core.color("#6366f1"),
          window.am4core.color("#06b6d4"),
          window.am4core.color("#a21caf")
        ];
      } else {
        // Default two-slice colors
        series.colors.list = [
          window.am4core.color("#10b981"),
          window.am4core.color("#ef4444")
        ];
      }

      // Add export functionality
      chart.exporting.menu = new window.am4core.ExportMenu();
      chart.exporting.filePrefix = "uplink_availability_chart";

      setLocalChartInstance(chart);

      // Pass the chart instance back to the parent component
      if (setChartInstance) {
        setChartInstance(chart);
      }
    } catch (error) {
      console.error('Error creating Amcharts chart:', error);
      createFallbackChart();
    }
  };

  // Create chart when scripts are loaded and data changes
  useEffect(() => {
    if (scriptsLoaded) {
      createChart();
    }
  }, [scriptsLoaded, uptime100Count, uptimeLessThan100Count, customData]);

  return (
    <div id="chartdiv" ref={chartDivRef} style={{ width: '100%', height: '650px', ...style }}></div>
  );
};

export default AmchartsPie3D; 