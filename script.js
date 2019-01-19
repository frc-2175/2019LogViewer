fetch("http://localhost:9000/TestData/TestTalon.csv").then(function(response) {
    response.text().then(function(value) {
        console.log(readCSV(value).Current);
        myChart.data.datasets[0].data = readCSV(value).Current;
        myChart.update();
    });
}).catch(function(err) {
    console.log(err);
});

function readCSV(csv) {
    let datasets = {};
    for(i = 1; i < csv.split('\n')[0].split(',').length; i++) {
        cell = csv.split('\n')[0].split(',')[i];
        datasets[cell] = [];
    }
    let timestamps = [];
    for(i = 1; i < csv.split('\n').length; i++) {
        timestamps.push(csv.split('\n')[i].split(',')[0]);
    }
    for(i = 1; i < csv.split('\n').length; i++) {
        for(j = 1; j < csv.split('\n')[i].split(',').length; j++) {
            let key = csv.split('\n')[0].split(',')[j];
            datasets[key].push({x: timestamps[i - 1], y: csv.split('\n')[i].split(',')[j]});
        }
    }
    return datasets;
}
