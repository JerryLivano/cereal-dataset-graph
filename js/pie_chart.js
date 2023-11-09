import * as lib from './lib.js';

var canvasKita = document.querySelector('#canvas2');
var ctx = canvasKita.getContext("2d");

d3.csv("cereal.csv").then(function (data) {
    let mfrCounts = {};
    data.forEach(function (d) {
        let mfr = d.mfr;
        if (mfrCounts[mfr]) {
            mfrCounts[mfr]++;
        } else {
            mfrCounts[mfr] = 1;
        }
    });

    let dataset = Object.keys(mfrCounts).map(function (mfr) {
        return {
            mfr: mfr,
            mfrCounts: mfrCounts[mfr],
            names: data.filter(d => d.mfr == mfr).map(d => d.name),
            types: data.filter(d => d.mfr == mfr).map(d => d.type),
            calories: data.filter(d => d.mfr == mfr).map(d => d.calories),
            carbos: data.filter(d => d.mfr == mfr).map(d => d.carbo),
            sugars: data.filter(d => d.mfr == mfr).map(d => d.sugars),
            rating: data.filter(d => d.mfr == mfr).map(d => parseFloat(d.rating))
        };
    });

    var imageDataSaya;
    ctx.font = '24px Times New Roman';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';

    function totalMfrCount() {
        let total = 0;
        for (let i = 0; i < dataset.length; i++) {
            total += dataset[i].mfrCounts;
        }
        return total;
    }

    function randColor() {
        const r = 1 + Math.floor(Math.random() * 255);
        const g = 1 + Math.floor(Math.random() * 255);
        const b = 1 + Math.floor(Math.random() * 255);
        return [r, g, b, 255];
    }

    function createPie() {
        let start = 0;
        let colors = [];
        setInterval(function () {
            ctx.clearRect(0, 0, canvasKita.width, canvasKita.height);
            imageDataSaya = ctx.getImageData(0, 0, canvasKita.width, canvasKita.height);
            let mid_point = [];
            let start_outline = start;
            for (let i = 0; i < dataset.length; i++) {
                let color = randColor();
                colors.push(color);
                let sep = dataset[i].mfrCounts;
                lib.part_lingkaran(imageDataSaya, canvasKita, [300, 300], 290, totalMfrCount(), start_outline, sep, color);
                start_outline += sep;
            }

            canvasKita.addEventListener('click', function (e) {
                let rect = canvasKita.getBoundingClientRect();
                let x = e.clientX - rect.left;
                let y = e.clientY - rect.top;
                let distance = Math.sqrt(Math.pow(x - 300, 2) + Math.pow(y - 300, 2));

                if (distance <= 290) {
                    var data = ctx.getImageData(x, y, x, y).data;
                    var colorToFind = [data[0], data[1], data[2], 255];
                    var index = -1;

                    for (var i = 0; i < colors.length; i++) {
                        if (colors[i][0] == colorToFind[0] &&
                            colors[i][1] == colorToFind[1] &&
                            colors[i][2] == colorToFind[2] &&
                            colors[i][3] == colorToFind[3]) {
                            index = i;
                            break;
                        }
                    }

                    if (index >= 0) {
                        updateTable(dataset[index]);
                    }
                }
            });

            let start_color = start;
            for (let i = 0; i < dataset.length; i++) {
                let sep = dataset[i].mfrCounts;
                mid_point.push(lib.fill_lingkaran(imageDataSaya, canvasKita, [300, 300], 290, totalMfrCount(), start_color, sep, colors[i]));
                start_color += sep;
            }
            ctx.putImageData(imageDataSaya, 0, 0);
            render_text(mid_point);
            start += Math.PI / 32;
        }, 10);
    }

    function updateTable(cereal) {

        let tbody = document.querySelector("#table-pie");
        tbody.innerHTML = '';

        let mfr_span = document.querySelector("#mfr");
        mfr_span.innerHTML = cereal.mfr;

        for (let i = 0; i < cereal.names.length; i++) {
            let row = document.createElement("tr");
            for (let key in cereal) {
                if (key != "mfr" && key != "mfrCounts") {
                    let cell = document.createElement("td");
                    cell.textContent = cereal[key][i];
                    cell.style
                    row.appendChild(cell);
                }
            }
            tbody.appendChild(row);
        }
    }

    function render_text(mid_point) {
        for (let i = 0; i < mid_point.length; i++) {
            ctx.fillText(dataset[i].mfr, mid_point[i].x, mid_point[i].y + 10);
        }
    }

    createPie();

});