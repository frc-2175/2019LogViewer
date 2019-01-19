function updateGraphs(match) {
    return fetch(`http://localhost:9000/${match}`).then(function(response) {
        return response.text().then(function(value) {
            let graph = document.getElementById('graph');
            let innerHTML = '';
            let promises = [];
            for(const device of value.split('\n')) {
                promises.push(fetch(`http://localhost:9000/${match}/${device}`).then(function(responseFile) {
                    return responseFile.text().then(function(fileContents) {
                        innerHTML += `<optgroup label="${device.split('.')[0]}">`;
                        console.log(readCSV(fileContents));
                        for(const key in readCSV(fileContents)) {
                            innerHTML += `<option value="${device.split('.')[0]}.${key}">${key}</option>`
                        }
                        innerHTML += '</optgroup>';
                        graph.innerHTML = innerHTML;
                    });
                }));
            }
            console.log(promises);
            return Promise.all(promises)
        });
    });
}

function updateChart(graph) {
    let match = document.getElementById('match').value;
    let filename = graph.split('.')[0] + '.csv';
    console.log(match);
    console.log(filename);
    fetch(`http://localhost:9000/${match}/${filename}`).then(function(response) {
        response.text().then(function (fileContents) {
            let dataset = graph.split('.')[graph.split('.').length - 1];
            myChart.data.datasets[0].data = readCSV(fileContents)[dataset]
            console.log(readCSV(fileContents));
            myChart.data.datasets[0].label = graph.split('.')[0] + ': ' + dataset;
            myChart.update();
        });
    });
}

fetch("http://localhost:9000/").then(function(response) {
    response.text().then(function(value) {
        let match = document.getElementById('match');
        let innerHTML = '';
        for(const folder of value.split('\n')) {
            innerHTML += `<option value="${folder}">Match ${folder}</option>`;
        }
        match.innerHTML = innerHTML;
        updateGraphs(document.getElementById('match').value)
            .then(function() {
                console.log(document.getElementById('graph').innerHTML);
                updateChart(document.getElementById('graph').value);
             });
    });
}).catch(function(err) {
    console.log(err);
});


document.getElementById('match').addEventListener('change', function(event) { 
    updateGraphs(event.target.value)
        .then(function() { updateChart(document.getElementById('graph').value) });
});


document.getElementById('graph').addEventListener('change', function(event) { updateChart(event.target.value) });

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
