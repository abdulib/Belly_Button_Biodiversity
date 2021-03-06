function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
    d3.json(`/metadata/${sample}`).then(function(data){
      console.log(data)
      
      var metadatapanel = d3.select("#sample-metadata")

      // Use `.html("") to clear any existing metadata

      metadatapanel.html("")

      // Use `Object.entries` to add each key and value pair to the panel
      // Hint: Inside the loop, you will need to use d3 to append new
      // tags for each key-value in the metadata.

      Object.entries(data).forEach(([key, value]) =>{
        metadatapanel.append("p")
        .text(`${key}:${value}`)

      });

    });



    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then(function(data){
    console.log(data)
    var sample_values = data.sample_values.slice(0, 11)
    console.log(sample_values)
    
    var otu_ids = data.otu_ids.slice(0, 11)
    console.log(otu_ids)

    var otu_labels = data.otu_labels.slice(0, 11)
    console.log(otu_ids)

    // @TODO: Build a Bubble Chart using the sample data

    var trace1 = {
      x: otu_ids,
      y: sample_values,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
      }
    };
    
    var data = [trace1];
    
    var layout = {
      title: `Sample: ${sample}`,
      showlegend: false,

    };
    
    Plotly.newPlot('bubble', data, layout);


    // @TODO: Build a Pie Chart

    var data = [{
      values: sample_values,
      labels: otu_ids,
      type: 'pie'
    }];
    

    var layout = {
      title: `Sampple: ${sample}`,
      // showlegend: false,
      height: 400,
      width: 500
    };
    
    Plotly.newPlot('pie', data, layout);
    
  })

}



function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
