import * as lib from "./lib.js";

var canvasKita = document.querySelector('#canvas1');
var ctx = canvasKita.getContext("2d");

document.querySelector('#data-btn').addEventListener('click', function(){
    const data_val = document.querySelector('#data-value').value;
    d3.csv("cereal.csv").then(function (data) {
        let dataset = data.map(function (d) {
            return {
                name: d.name,
                mfr: d.mfr,
                type: d.type,
                calories: d.calories,
                protein: d.protein,
                fat: d.fat,
                sodium: d.sodium,
                fiber: d.fiber,
                carbo: d.carbo,
                sugars: d.sugars,
                potass: d.potass,
                vitamins: d.vitamins,
                shelf: d.shelf,
                weight: d.weight,
                cups: d.cups,
                rating: parseFloat(d.rating),
                color: randColor()
            };
        }).slice(0, data_val);
    
        const xScale = canvasKita.width / dataset.length;
        const maxRating = Math.max(...dataset.map(d => d.rating));
        const yScale = canvasKita.height / maxRating;
    
        function randColor() {
            const r = 1 + Math.floor(Math.random() * 255);
            const g = 1 + Math.floor(Math.random() * 255);
            const b = 1 + Math.floor(Math.random() * 255);
            return [r, g, b, 255];
        }
    
        function drawBar(imageData, x_pos, y_pos, height, width, color) {
            var point_array = [
                { x: x_pos, y: y_pos },
                { x: x_pos, y: y_pos - height },
                { x: x_pos + width, y: y_pos - height },
                { x: x_pos + width, y: y_pos }
            ];
            lib.polygon(imageData, canvasKita, point_array, color);
            lib.floodFillStack(imageData, canvasKita, Math.ceil(x_pos) + 1, y_pos - 1, { r: 0, g: 0, b: 0 }, { r: color[0], g: color[1], b: color[2] });
        }
        
        ctx.font = '18px Times New Roman';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
    
        function updateChart() {
            ctx.clearRect(0, 0, canvasKita.width, canvasKita.height);
            var imageDataSaya = ctx.getImageData(0, 0, canvasKita.width, canvasKita.height);
            var text_pos = [];
            for (let i = 0; i < dataset.length; i++) {
                var x_pos = i * xScale;
                var y_pos = canvasKita.height;
                var height = dataset[i].rating * yScale - 20;
                var width = xScale - 5;
                drawBar(imageDataSaya, x_pos, y_pos, height, width, dataset[i].color);
    
                var textX = x_pos + width / 2;
                var textY = y_pos - height - 5;
                text_pos.push({x: textX, y: textY});
            }
            ctx.putImageData(imageDataSaya, 0, 0);
            renderText(text_pos);
        }
    
        function renderText(text_pos){
            for (let i = 0; i < text_pos.length; i++){
                ctx.fillText(dataset[i].rating.toFixed(2), text_pos[i].x, text_pos[i].y);
            }
        }
    
        function updateTable(cereal) {
            let tbody = document.querySelector(".tbody");
            tbody.innerHTML = ''
    
            let row = document.createElement("tr");
            for (let key in cereal) {
                if (key != "color") {
                    let cell = document.createElement("td");
                    cell.textContent = cereal[key];
                    cell.style
                    row.appendChild(cell);
                }
            }
            tbody.appendChild(row);
        }
    
        updateChart();
    
        canvasKita.addEventListener("click", function (event) {
            let rect = canvasKita.getBoundingClientRect();
            let x = event.clientX - rect.left;
            let y = event.clientY - rect.top;
    
            for (let i = 0; i < dataset.length; i++) {
                let x_pos = i * xScale;
                let y_pos = canvasKita.height - 5;
                let width = xScale - 10;
                let height = dataset[i].rating * yScale - 20;
    
                if (x >= x_pos && x <= x_pos + width && y >= y_pos - height && y <= y_pos) {
                    updateTable(dataset[i]);
                    break;
                }
            }
        });
    
        document.querySelector("#sort-ascending").addEventListener("click", function () {
            dataset.sort((a, b) => a.rating - b.rating);
            updateChart();
        });
        document.querySelector("#sort-descending").addEventListener("click", function () {
            dataset.sort((a, b) => b.rating - a.rating);
            updateChart();
        });
        document.querySelector("#sort-label-asc").addEventListener("click", function () {
            dataset.sort((a, b) => a.name.localeCompare(b.name));
            updateChart();
        });
        document.querySelector("#sort-label-desc").addEventListener("click", function () {
            dataset.sort((a, b) => b.name.localeCompare(a.name));
            updateChart();
        });
    });
});