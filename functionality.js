//Drop-down menu for selecting option
function dropMenu() {
  document.getElementById("myDropdown").classList.toggle('show');
}

function dropMenu2() {
  document.getElementById("myDropdown2").classList.toggle('show');
}

function dropMenu3() {
  document.getElementById("myDropdown3").classList.toggle('show');
}

function dropMenu4() {
  document.getElementById("myDropdown4").classList.toggle('show');
}


window.onclick = function(event) {

  if (!(event.target.matches('.dropdown') || event.target.matches('.dropbtn') || event.target.matches('#buttonName'))) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }

  if (!(event.target.matches('.dropdown2') || event.target.matches('.drop2btn') || event.target.matches('#button2Name'))) {
    var dropdowns = document.getElementsByClassName("dropdown-content2");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }

  if (!(event.target.matches('.dropdown3') || event.target.matches('.drop3btn') || event.target.matches('#button3Name'))) {
    var dropdowns = document.getElementsByClassName("dropdown-content3");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }

  if (!(event.target.matches('.dropdown4') || event.target.matches('.drop4btn') || event.target.matches('#button4Name'))) {
    var dropdowns = document.getElementsByClassName("dropdown-content4");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }


  if (event.target.matches('.option')) {
    document.getElementById("buttonName").innerHTML = event.target.text;
  }
  else if (event.target.matches('.option2')) {
    document.getElementById("button2Name").innerHTML = event.target.text;
  }
  else if (event.target.matches('.option3')) {
    let temp = document.getElementById("tab4Name").innerHTML;
    document.getElementById("tab4Name").innerHTML = event.target.text + " - " + temp.split(" - ")[1];
    document.getElementById("button3Name").innerHTML = event.target.text;
  }
  else if (event.target.matches('.option4')) {
    let temp = document.getElementById("tab4Name").innerHTML;
    document.getElementById("tab4Name").innerHTML = temp.split(" - ")[0] + " - " + event.target.text;
    document.getElementById("button4Name").innerHTML = event.target.text;
  }
}


//opening a TAB
function openTab(tabName) {
  var i;
  
  clearInterval(timer); //preventing from live update
  //hiding all pages' contents
  var tabcontent = document.getElementsByClassName("content");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  //showing the content of the active page
  document.getElementById(tabName).style.display = "block";
  
  if (tabName == 'Tab1') {
    getData(1, 0, 1);
  } else if (tabName == 'Tab2') {
    getData(2, 1, 1); 
  } else if (tabName == 'Tab3') {
    getData(3, 2, 1);
  } else if (tabName == 'Tab4') {
    document.getElementById("tab4Name").innerHTML = "Temperature - Now";
    getData(4, 1, 1);
    document.getElementById("button3Name").innerHTML = "Select measurement";
    document.getElementById("button4Name").innerHTML = "Select period";
  } else {  //for Extra view
    toggle_btn = false;
    document.getElementById("livebutton").innerHTML = 'Live update (OFF)';
    document.getElementById("livebutton").style.backgroundColor = '#166da7';
    getData(5, 0, 1);
  }
}


//get JSON data from the database (option: Now/24 hours/...)
function getData(view_num, measurement, option) {
  console.log("Updating data");
  let sourse = '';
  let content = document.getElementById("table");
  
  //selecting required SOURCE and TAB CONTENT
  if (view_num == 1) {
      content = document.getElementById("table");
      source = SOURCE1;
  } else if (view_num == 2) {
      source = SOURCE2;
      content = document.getElementById("table2");
  } else if (view_num == 3) {
      source = SOURCE3;
      content = document.getElementById("table3");
  } else if (view_num == 4) {
      content = document.getElementById("table4");

      if (measurement == 0) {
        let measure_name = document.getElementById("tab4Name").innerHTML.split(" - ")[0];
        if (measure_name == "Temperature") measurement=1;
        else if (measure_name == "Wind speed") measurement=2;
        else if (measure_name == "Wind direction") measurement=3;
        else if (measure_name == "Rain") measurement=4;
        else if (measure_name == "Light") measurement=5;
      }

      if (option == 0) {
        let option_name = document.getElementById("tab4Name").innerHTML.split(" - ")[1];
        if (option_name == "Now") option=1;
        else if (option_name == "24 hours") option=2;
        else if (option_name == "48 hours") option=3;
        else if (option_name == "72 hours") option=4;
        else if (option_name == "1 week") option=5;
        else if (option_name == "1 month") option=6;
      }

      //separate case since we use another sourse for Option 1
      if (option == 1) {
        source = SOURCE1;
      }
      else {
        if (measurement == 1) source = SOURCE2;
        else if (measurement == 2) source = SOURCE3;
        else if (measurement == 3) source = SOURCE4;
        else if (measurement == 4) source = SOURCE5;
        else if (measurement == 5) source = SOURCE6;
      }

  } else if (view_num == 5) {
      source = SOURCE1;
  }


  //adding link ending depending on the option
  if (option == 1) {
    document.getElementById("button2Name").innerHTML = "Select period";
    document.getElementById("buttonName").innerHTML = "Select period";
  }
  if (option == 2) {
    source = source + "/23";
  }
  else if (option == 3) {
    source = source + "/47";
  }
  else if (option == 4) {
    source = source + "/71";
  }
  else if (option == 5) {
    source = source + "/167";
  }
  else if (option == 6) {
    source = source + "/719";
  }

  //FETCH - fetching data from the database
  fetch(source).then(response => {
    return response.json()
    })
    .then(data => {
      if (view_num == 4 && option == 1) {
        data = selectData(data, measurement); //parsing latest 25 measurements
      }
      else if (view_num == 5) {
        var data1 = selectData(data, 1, 5);
        var data2 = selectData(data, 2, 5);
        var data3 = selectData(data, 3, 5);
        var data5 = selectData(data, 5, 5);
      }

      if (view_num <5) {
        content.innerHTML = jsonToHtml(data, view_num, measurement, option);
        if (view_num > 1) drawGraph(data, view_num, measurement);
      } else { //For Extra view
        
        drawExtraGraphs(data1, 1);
        drawExtraGraphs(data2, 2);
        drawExtraGraphs(data3, 3);
        drawExtraGraphs(data5, 5);
      }
    })
    .catch(error => console.error('Something WRONG ' + error)); 
}



//parsing latest 25 measurements for each indicator
function selectData(dataObj, measure_type, numberOfMeasurements = 25) {

  let measurements_counter = 0, i=0;
  let tmpObj = {};
  let tmpObj2 = {};
  let object = {};

  if (measure_type == 1) indicator = "temperature";
  else if (measure_type == 2) indicator = "wind_speed";
  else if (measure_type == 3) indicator = "wind_direction";
  else if (measure_type == 4) indicator = "rain";
  else if (measure_type == 5) indicator = "light";

  while (!(measurements_counter == numberOfMeasurements || i==dataObj.length))  {
    
    object = dataObj[i];

    for (const property in object.data) {
      var value = object.data[property];
      
      tmpObj = {};
        
      if (property == indicator) {

          tmpObj.date_time = object.date_time;
          tmpObj[property] = value;
          tmpObj2[measurements_counter] = tmpObj;

          measurements_counter++;
      }
      i++;
    }
  }

  //reverse JSON
  tmpObj = {};
  for (i = 0; i < Object.keys(tmpObj2).length; i++) {
    tmpObj[i] = tmpObj2[Object.keys(tmpObj2).length -1 - i];
  }

  return tmpObj;
}


//converting JSON object into HTML representation
function jsonToHtml (dataObj, view_num, measurement, option) {
  let content = ``;
  const length = dataObj.length;

  //For View1
  if (view_num == 1) {
     content = `
                <table>
                <tr>
                  <th id="col1">Number</th>
                  <th id="col2">Date</th>
                  <th id="col3">Time</th>
                  <th id="col4">Measurement type</th>
                  <th id="col5">Value</th>
                </tr>
                <tbody>
                `;
  
    for (let i = 0; i < 50; i++) {
      const object = dataObj[i];
        for (const property in object.data) {
          var pr = property;
          var value = object.data[property];
        }
      
        content +=  `
                      <tr>
                        <td id="td-col1">${i+1}</td>
                        <td>${extractDate(object.date_time)}</td>
                        <td>${extractTime(object.date_time)}</td>
                        <td>${pr}</td>
                        <td id="pointsCol">${value}</td>
                      </tr>
                    `;
    }
  }
  //For View2
  else if (view_num == 2) {
    
    let measurements_counter = 0;
    var i=0;
    content = `
                <table>
                <tr>
                <th id="col1">Number</th>
                <th id="col2">Date</th>
                <th id="col3">Time</th>
                <th id="col4">Temperature</th>
                </tr>
                <tbody>
                `;


    //exit the loop if ether get 20 results OR checked all 500 measurements
    //while (!(measurements_counter == 20 || i==dataObj.length)) {
    
      for (i = 0; i < dataObj.length; i++) {
        const object = dataObj[i];
      
        
          content +=  `
                          <tr>
                            <td id="td-col1">${i+1}</td>
                            <td>${extractDate(object.date_time)}</td>
                            <td>${extractTime(object.date_time)}</td>
                            <td id="pointsCol">${object.temperature}</td>
                          </tr>
                        `;
          measurements_counter++;
     
    }
  }
  else if (view_num == 3) {
    
    let measurements_counter = 0;
    var i=0;
    content = `
                <table>
                <tr>
                <th id="col1">Number</th>
                <th id="col2">Date</th>
                <th id="col3">Time</th>
                <th id="col4">Wind speed</th>
                </tr>
                <tbody>
                `;

    for (i = 0; i < dataObj.length; i++) {
      const object = dataObj[i];

      content += `
                    <tr>
                    <td id="td-col1">${i + 1}</td>
                    <td>${extractDate(object.date_time)}</td>
                    <td>${extractTime(object.date_time)}</td>
                    <td id="pointsCol">${object.wind_speed}</td>
                    </tr>
                    `;
      measurements_counter++;
    }
  }  //for View 4
  else if (view_num == 4) {


      let indicator = '';
      if (measurement == 1) indicator = "temperature";
      else if (measurement == 2) indicator = "wind_speed";
      else if (measurement == 3) indicator = "wind_direction";
      else if (measurement == 4) indicator = "rain";
      else if (measurement == 5) indicator = "light";
      
        let measurements_counter = 0;
        var i=0;
        content = `
                    <table>
                    <tr>
                    <th id="col1">Number</th>
                    <th id="col2">Date</th>
                    <th id="col3">Time</th>
                    <th id="col4">${document.getElementById("tab4Name").innerHTML.split(" - ")[0]}</th>
                    </tr>
                    <tbody>
                    `;

          for (i = 0; i < Object.keys(dataObj).length; i++) {
            const object = dataObj[i];
          
              content +=  `
                              <tr>
                                <td id="td-col1">${i+1}</td>
                                <td>${extractDate(object.date_time)}</td>
                                <td>${extractTime(object.date_time)}</td>
                                <td id="pointsCol">${object[indicator]}</td>
                              </tr>
                            `;
              measurements_counter++;
            
      } //end of measurement = 1
  }

  content +=  `
              </tbody>
              </table> `;
  return content;
}


//Extracting Date
function extractDate (timeString) {
  let result = timeString.match(/(.+)T/);
  return result[1].split("-").reverse().join("-");
}

//Extracting Time
function extractTime (timeString) {
  let result = timeString.match( /T(\d+:\d+:\d+)/);
  return result[1];
}



//graphs for Views 2-4
function drawGraph (jsonData, pagenumber, measurement) {

  let category = [];
  let value = [];
  let indicator = 'Temperature';

  if (pagenumber == 2) {
    var myChart = echarts.init(document.getElementById("graph2"));

    graphName = 'Temperature - ';
    if (document.getElementById("buttonName").innerHTML == 'Select period')
      graphName += 'Now';
    else graphName += document.getElementById("buttonName").innerHTML;

    for(var i = 0; i < jsonData.length; i++) {
        let item = jsonData[i];

        category.push("\""+extractTime(item.date_time)+"\"");
        value.push("\""+item.temperature+"\"");
    }

  } else if (pagenumber == 3) {

    indicator = 'Wind speed';
    var myChart = echarts.init(document.getElementById("graph3"));

    graphName = 'Wind speed - ';
    if (document.getElementById("button2Name").innerHTML == 'Select period')
      graphName += 'Now';
    else graphName += document.getElementById("button2Name").innerHTML;

    for(var i = 0; i < jsonData.length; i++) {
        var item = jsonData[i];

              category.push("\""+extractTime(item.date_time)+"\"");
              value.push("\""+item.wind_speed+"\"");
            }
  }
  else { //other graphs for View 4
    var myChart = echarts.init(document.getElementById("graph4"));
    graphName = 'Others';
  }


   //parsing data for Wind Speed graph
   if (pagenumber==4) {
   
    if (measurement == 1) indicator = "temperature";
      else if (measurement == 2) indicator = "wind_speed";
      else if (measurement == 3) indicator = "wind_direction";
      else if (measurement == 4) indicator = "rain";
      else if (measurement == 5) indicator = "light";
    graphName = document.getElementById("tab4Name").innerHTML;

    for (let i = 0; i < Object.keys(jsonData).length; i++) {
        var item = jsonData[i];

              category.push("\""+extractTime(item.date_time)+"\"");
              value.push("\""+item[indicator]+"\"");
            } 
  }

  
  category= '['+category+']';
  var result_category = category.toString();

  value= '['+value+']';
  var result_value = value.toString();


  //drawing a graph
  // specify chart configuration item and data
            var option = {
                title: {
                    text: graphName,
                    left: 'center',
                },
                tooltip: {},
                legend: {
                    data:['']
                },
                xAxis: {
                    axisLabel: {
                    mininterval: 1.5,
                    rotate: 90
                },
                    data: JSON.parse(result_category)
                },
                yAxis: {},
                series: [{
                    axisLabel : {
                    formatter: '{value} °C'
                  },
                    name: indicator,
                    type: 'bar',
                    data: JSON.parse(result_value)
                }]
            };


if (pagenumber == 4) {
  option.series[0].type = "line";
  option.series[0].areaStyle = "{}";
}

            // use configuration item and data specified to show chart
            myChart.setOption(option);

}





function drawExtraGraphs (object, measurement) {


  let category = [];
  let value_mid = 0;
  let scale_color = '';
  let unit = '';
  let value_min = 0, value_max = 0;
  

  if (measurement == 1) {
    graphName = 'Temperature';
    indicator = "temperature";
    var Chart = echarts.init(document.getElementById("graph5"));
    scale_color = '#fc9739';
    unit = '°C';
    value_min = -30;
    value_max = 30;
  }
  else if (measurement == 2) {
    indicator = "wind_speed";
    graphName = 'Wind speed';
    var Chart = echarts.init(document.getElementById("graph6"));
    scale_color = '#58D9F9';
    unit = 'm/s';
    value_min = 0;
    value_max = 40;
  }
      else if (measurement == 3) indicator = "wind_direction";
      else if (measurement == 5) indicator = "light";

  for (let i = 0; i < Object.keys(object).length; i++) {
    var item = object[i];

          value_mid += item[indicator];
        } 

  value_mid = value_mid/5;
  value_mid = Math.round(value_mid * 10) / 10;

  //drawing a graph depending on measurement type
  if (measurement == 1 || measurement == 2) {

    option = {
      title: {text: graphName,
              left: 'center'},
      series: [{
          type: 'gauge',
          center: ["50%", "60%"],
          startAngle: 180,
          endAngle: 0,
          min: value_min,
          max: value_max,
          splitNumber: 4,
          itemStyle: {
              color: scale_color,
              shadowColor: 'rgba(0,138,255,0.45)',
              shadowBlur: 10,
              shadowOffsetX: 2,
              shadowOffsetY: 2
          },
          progress: {
              show: true,
              roundCap: true,
              width: 18
          },
          pointer: {
              icon: 'path://M2090.36389,615.30999 L2090.36389,615.30999 C2091.48372,615.30999 2092.40383,616.194028 2092.44859,617.312956 L2096.90698,728.755929 C2097.05155,732.369577 2094.2393,735.416212 2090.62566,735.56078 C2090.53845,735.564269 2090.45117,735.566014 2090.36389,735.566014 L2090.36389,735.566014 C2086.74736,735.566014 2083.81557,732.63423 2083.81557,729.017692 C2083.81557,728.930412 2083.81732,728.84314 2083.82081,728.755929 L2088.2792,617.312956 C2088.32396,616.194028 2089.24407,615.30999 2090.36389,615.30999 Z',
              length: '70%',
              width: 16,
              offsetCenter: [0, '5%']
          },
          axisLine: {
              roundCap: true,
              lineStyle: {
                  width: 18
              }
          },
          axisTick: {
              splitNumber: 2,
              lineStyle: {
                  width: 2,
                  color: '#999'
              }
          },
          splitLine: {
              length: 12,
              lineStyle: {
                  width: 3,
                  color: '#999'
              }
          },
          axisLabel: {
              distance: 25,
              color: '#999',
              fontSize: 20
          },
          title: {
              show: true,
          },
          detail: {
              backgroundColor: '#fff',
              borderColor: '#999',
              borderWidth: 2,
              width: '75%',
              lineHeight: 40,
              height: 40,
              borderRadius: 8,
              offsetCenter: [0, '35%'],
              valueAnimation: true,
              formatter: function (value) {
                  return '{value|' + value.toFixed(0) + '}{unit|'+unit+'}';
              },
              rich: {
                  value: {
                      fontSize: 40,
                      fontWeight: 'bolder',
                      color: '#777'
                  },
                  unit: {
                      fontSize: 20,
                      color: '#999',
                      padding: [0, 0, -20, 10]
                  }
              }
          },
          data: [{
              value: value_mid
          }]
      },
    ]
    };
    

    //wind speed graph
  } else if (measurement == 3) {

    graphName = 'Wind direction';
    var Chart = echarts.init(document.getElementById("graph7"));

    option = {
      title: {text: graphName,
              left: 'center',
      },
      series: [{
          type: 'gauge',
          center: ["50%", "55%"],
          startAngle: 90,
          endAngle: 450,
          min: 0,
          max: 360,
          splitNumber: 8,
          axisLine: {
              lineStyle: {
                  width: 10,
                  color: [
                      [0.125, '#58D9F9'],
                      [0.375, '#FDDD60'],
                      [0.625, '#FF6E76'],
                      [0.875, '#5ac28e'],
                      [1, '#58D9F9'],
                  ]
              }
          },
          pointer: {
            icon: 'path://M2090.36389,615.30999 L2090.36389,615.30999 C2091.48372,615.30999 2092.40383,616.194028 2092.44859,617.312956 L2096.90698,728.755929 C2097.05155,732.369577 2094.2393,735.416212 2090.62566,735.56078 C2090.53845,735.564269 2090.45117,735.566014 2090.36389,735.566014 L2090.36389,735.566014 C2086.74736,735.566014 2083.81557,732.63423 2083.81557,729.017692 C2083.81557,728.930412 2083.81732,728.84314 2083.82081,728.755929 L2088.2792,617.312956 C2088.32396,616.194028 2089.24407,615.30999 2090.36389,615.30999 Z',
            length: '60%',
              width: 15,
              offsetCenter: [0, '-20%'],
              itemStyle: {
                  color: 'auto'
              }
          },
          axisTick: {
              length: 10,
              lineStyle: {
                  color: 'auto',
                  width: 2
              }
          },
          splitLine: {
              length: 20,
              lineStyle: {
                  color: 'auto',
                  width: 5
              }
          },
          axisLabel: {
              color: '#464646',
              fontSize: 20,
              distance: -58,
              interval: 180,
              //grid: { containLabel: true },
              formatter: function (value) {
                  if (value < 45) {
                      return 'N';
                  }
                  else if (value < 90) {
                      return 'NE';
                  }
                  else if (value < 135) {
                      return 'E';
                  }
                  else if (value < 180) {
                      return 'SE';
                  }
                  else if (value < 225) {
                    return 'S';
                  }
                  else if (value < 270) {
                    return 'SW';
                  }
                  else if (value < 300) {
                    return 'W';
                  }
                  else if (value < 360) {
                    return 'NW';
                  }
              }
          },
          title: {
              offsetCenter: [0, '+20%'],
              fontSize: 25
          },
          detail: {
              backgroundColor: '#fff',
              color: '#777',
              fontSize: 34,
              borderColor: '#999',
              borderWidth: 2,
              width: '50%',
              lineHeight: 40,
              height: 35,
              borderRadius: 8,
              offsetCenter: [0, 0],
              valueAnimation: true,
              formatter: function (value) {
                   return Math.round(value) + '°';
              },
          },
          data: [{
              value: value_mid,
              name: ''
          }]
      }]
  };


  }  //Light level
  else if (measurement == 5) {

    graphName = 'Light level';
    var Chart = echarts.init(document.getElementById("graph8"));

    option = {
      title: {text: graphName,
              left: 'center'},
      series: [{
          type: 'gauge',
          center: ["50%", "60%"],
          startAngle: 180,
          endAngle: 0,
          min: 0,
          max: 120,
          splitNumber: 3,
          axisLine: {
              roundCap: true,
              lineStyle: {
                  width: 18,
                  color: [
                      [0.33, '#13036e'],
                      [0.66, '#4f60f7'],
                      [1, '#bac1f8'],
                  ]
              }
          },
          pointer: {
              icon: 'path://M2090.36389,615.30999 L2090.36389,615.30999 C2091.48372,615.30999 2092.40383,616.194028 2092.44859,617.312956 L2096.90698,728.755929 C2097.05155,732.369577 2094.2393,735.416212 2090.62566,735.56078 C2090.53845,735.564269 2090.45117,735.566014 2090.36389,735.566014 L2090.36389,735.566014 C2086.74736,735.566014 2083.81557,732.63423 2083.81557,729.017692 C2083.81557,728.930412 2083.81732,728.84314 2083.82081,728.755929 L2088.2792,617.312956 C2088.32396,616.194028 2089.24407,615.30999 2090.36389,615.30999 Z',
              length: '60%',
              width: 15,
              offsetCenter: [0, '-25%'],
              itemStyle: {
                  color: 'auto'
              }
          },
          axisTick: {
              length: 12,
              splitNumber: 3,
              lineStyle: {
                  color: 'auto',
                  width: 2
              }
          },
          splitLine: {
              length: 20,
              lineStyle: {
                  color: 'auto',
                  width: 5
              }
          },
          axisLabel: {
              color: '#999',
              fontSize: 20,
              distance: 20,
          },
          title: {
              offsetCenter: [0, '+20%'],
              fontSize: 25
          },
          detail: {
            backgroundColor: '#fff',
            borderColor: '#999',
            borderWidth: 2,
            width: '75%',
            lineHeight: 40,
            height: 40,
            borderRadius: 8,
            offsetCenter: [0, '35%'],
            valueAnimation: true,
            formatter: function (value) {
                return '{value|' + value.toFixed(0) + '}{unit|%}';
            },
            rich: {
                value: {
                    fontSize: 40,
                    fontWeight: 'bolder',
                    color: '#777'
                },
                unit: {
                    fontSize: 20,
                    color: '#999',
                    padding: [0, 0, -20, 10]
                }
            }
          },
          data: [{
              value: value_mid,
              name: ''
          }]
      }]
    };

  }

  Chart.setOption(option);

}



function livedata() {
  clearInterval(timer);
  button = document.getElementById("livebutton");
  button.innerHTML = 'Live update (OFF)';
  button.style.backgroundColor = '#166da7';
  toggle_btn = !toggle_btn;
  //only if button is ON
  if (toggle_btn) {
    button.style.backgroundColor = 'red';
    button.innerHTML = 'Live update (ON)';
    timer = setInterval(function() {
      getData(5, 0, 1);
      }, 3000);
  }
}



//main program
var timer = 0;
var toggle_btn = false;
const SOURCE1 = 'http://webapi19sa-1.course.tamk.cloud/v1/weather';
const SOURCE2 = 'http://webapi19sa-1.course.tamk.cloud/v1/weather/temperature';
const SOURCE3 = 'http://webapi19sa-1.course.tamk.cloud/v1/weather/wind_speed';
const SOURCE4 = 'http://webapi19sa-1.course.tamk.cloud/v1/weather/wind_direction';
const SOURCE5 = 'http://webapi19sa-1.course.tamk.cloud/v1/weather/rain';
const SOURCE6 = 'http://webapi19sa-1.course.tamk.cloud/v1/weather/light';



//to open the first Page by default
document.getElementById("defaultOpen").click();

