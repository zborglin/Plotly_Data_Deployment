function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");
  // Use the list of sample names to populate the select options
  d3.json("static/data/samples.json").then((data) => {
    var sampleNames = data.names;
    console.log(data);
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
    
  });
}


// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("static/data/samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Bar and Bubble charts
// Create the buildCharts function.
function buildCharts(sample) {
  // Use d3.json to load and retrieve the samples.json file 
  d3.json("static/data/samples.json").then((data) => {
    // Create a variable that holds the samples array. 
    var samples = data.samples;
    //console.log(samples);
    // Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    //console.log(resultArray);
    // Create a variable that holds the first sample in the array.
    var result = resultArray[0];
    console.log(result);
    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = result.otu_ids;
    //console.log(otu_ids);
    var otu_labels = result.otu_labels;
    //console.log(otu_labels);
    var sample_values = result.sample_values;
    //console.log(sample_values);

    // Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    // so the otu_ids with the most bacteria are last. 

    var yticks = otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
    console.log(yticks);
    // Create the trace for the bar chart. 
    var barData = [{
      x: sample_values.slice(0, 10).reverse(),
      y: yticks,
      text: otu_labels.slice(0, 10).reverse(),
      type: "bar",
      orientation:"h"
    }];
    // Create the layout for the bar chart. 
    var barLayout = {
      title: "10 Most Prevalent Bacteria Cultures",
      l:100,
      r:100,
      t:100,
      b:100
    };
    // Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);
    // 1. Create the trace for the bubble chart.
    var bubbleData = [ {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'Earth'
      }
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures per Sample",
      xaxis: {
        title: "OTU ID"
      },
      yaxis: {
        title: "# of Cultures"
      },
      l:100,
      r:100,
      t:100,
      b:100
      
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
  
    // 4. Create the trace for the gauge chart.
    //Initialize variables based on user selection
    
      // Create a variable that holds the metadata array. 
    var metadata = data.metadata;
  // Filter the data for the object with the desired id number
    var resultArrayWash = metadata.filter(sampleObj => sampleObj.id == sample);
    
    var resultWash = resultArrayWash[0];
    //console.log(resultWash);
    
    //filter selected id for wash frequency
    var wFreq = parseFloat(resultWash.wfreq);
    console.log(wFreq);
    var gaugeData = [{
      domain: { x: [0, 1], y: [0, 1] },
      value: wFreq,
      title: { text: 'Washing Frequency'},
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: {range: [null, 10]},
        steps: [
          {range: [0,2], color: "red"},
          {range: [2,4], color: "orange"},
          {range: [4,6], color: "yellow"},
          {range: [6,8], color: "lightgreen"},
          {range: [8,10], color: "green"}
        ],
      }
    }
      
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 600, 
      height: 450, 
      margin: { t: 0, b: 0 } 
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);
    }
  
  );
}
