//Daniel Gallagher
//CA 2

// Reading the CSV file and processing the data
d3.csv("buildings.csv").then(data => {
    // Parse height in meters for each building
    data.forEach(d => {
        d.height_m = parseFloat(d.HEIGHT.replace(/[^0-9.]+/g, ""));
    });

    //SVG dimensions
    const svgWidth = 900;
    const svgHeight = 500;
    const margin = {top: 30, right: 30, bottom: 50, left: 60};

    //Creating a plot area inside the SVG
    const plotAreaWidth = svgWidth - margin.left - margin.right;
    const plotAreaHeight = svgHeight - margin.top - margin.bottom;

    //Selecting and setting the dimensions of the SVG container
    const svg = d3.select(".container svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    //Creating a group for the plot area
    const plotArea = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    //Creating a scale for the building completion years (x-axis)
    const xScale = d3.scaleLinear()
        .domain(d3.extent(data, d => +d.COMPLETION))
        .range([0, plotAreaWidth]);

    //Creating a scale for the building heights (y-axis)
    const yScale = d3.scaleLog()
        .domain([1, d3.max(data, d => d.height_m)])
        .range([plotAreaHeight, 0]);

    //Creating the x-axis and y-axis
    const xAxis = d3.axisBottom(xScale).ticks(10).tickFormat(d3.format("d"));
    const yAxis = d3.axisLeft(yScale).ticks(5, ".0f");

    //Adding the x-axis to the plot
    plotArea.append("g")
        .attr("transform", `translate(0,${plotAreaHeight})`)
        .call(xAxis);

    //Adding the y-axis to the plot
    plotArea.append("g")
        .call(yAxis);

    //Adding x-axis label
    plotArea.append("text")
    .attr("transform", `translate(${plotAreaWidth / 2},${plotAreaHeight + margin.bottom - 10})`)
    .style("text-anchor", "middle")
    .text("Building Completion Year");

    //Adding y-axis label
    plotArea.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + -2)
        .attr("x", -plotAreaHeight / 2)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Building Height (ft)");  

    //Selecting the tooltip element
    const tooltip = d3.select("#tooltip");

    //Creating the circles for each building
    const circles = plotArea.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.COMPLETION))
        .attr("cy", d => yScale(d.height_m))
        .attr("r", 5)
        .attr("fill", "#69b3a2")
        .attr("fill-opacity", 0.8)
        .on("mouseover", function(event, d) {
            //Changing the circle opacity and show tooltip on mouseover
            d3.select(this).attr("fill-opacity", 0.5);
            tooltip.style("visibility", "visible");
            tooltip.html(`${d.NAME} (${d.COMPLETION})<br>${d.HEIGHT}`);
        })
        .on("mousemove", event => {
            //Updaing the tooltip position on mousemove
            tooltip.style("top", (event.pageY - 10) + "px").style("left", (event.pageX + 10) + "px");
        })
        .on("mouseout", function() {
            //Restoring circle opacity and hiding the tooltip on mouseout
            d3.select(this).attr("fill-opacity", 0.8);
            tooltip.style("visibility", "hidden");
        });

        // Function to update the h1 heading based on selected mode (height or floors)
        const updateHeading = (mode) => {
        const heading = mode === "height" ? "World's Tallest Buildings by Height (ft)" : "World's Tallest Buildings by Floors";
        d3.select("h1").text(heading);
    };

    // Initialize the h1 heading with the height mode
    updateHeading("height");

    //Adding event listeners to update the h1 heading when the mode changes
    d3.selectAll("input[name='tst']").on("change", function() {
        updateHeading(this.value);
    });
});
            
                   
