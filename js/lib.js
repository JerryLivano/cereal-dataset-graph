export function gbr_titik(imageDataSaya, canvas, x, y, warna) {
    let [r, g, b, a] = warna;

    var index;
    index = 4 * (Math.ceil(x) + (Math.ceil(y) * canvas.width));
    imageDataSaya.data[index] = r;
    imageDataSaya.data[index + 1] = g;
    imageDataSaya.data[index + 2] = b;
    imageDataSaya.data[index + 3] = a;
}

export function dda_line(imageData, canvas, titik1, titik2, warna) {
    let [x1, y1] = titik1;
    let [x2, y2] = titik2;

    var dx = x2 - x1;
    var dy = y2 - y1;

    if (Math.abs(dx) > Math.abs(dy)) {
        if (x2 > x1) {
            var y = y1;
            for (var x = x1; x <= x2; x++) {
                y = y + dy / Math.abs(dx);
                gbr_titik(imageData, canvas, x, y, warna);
            }
        } else {
            var y = y1;
            for (var x = x1; x >= x2; x--) {
                y = y + dy / Math.abs(dx);
                gbr_titik(imageData, canvas, x, y, warna);
            }
        }

    } else {
        if (y2 > y1) {
            var x = x1;
            for (var y = y1; y <= y2; y++) {
                x = x + dx / Math.abs(dy);
                gbr_titik(imageData, canvas, x, y, warna);
            }
        } else {
            var x = x1;
            for (var y = y1; y >= y2; y--) {
                x = x + dx / Math.abs(dy);
                gbr_titik(imageData, canvas, x, y, warna);
            }
        }
    }
}

export function polygon(imageData, canvas, dots, color) {
    for (var i = 0; i < dots.length - 1; i++) {
        dda_line(imageData, canvas, [dots[i].x, dots[i].y], [dots[i + 1].x, dots[i + 1].y], color);
    }
    dda_line(imageData, canvas, [dots[i].x, dots[i].y], [dots[0].x, dots[0].y], color);
}

export function lingkaran_polar(imageData, canvas, koordinat, rad, warna) {
    let [xc, yc] = koordinat;

    for (var theta = 0; theta <= Math.PI * 2; theta += 0.001) {
        let x = xc + rad * Math.cos(theta);
        let y = yc + rad * Math.sin(theta);

        gbr_titik(imageData, canvas, x, y, warna);
    }
}

export function part_lingkaran(imageData, canvas, koordinat, rad, total, start, sep, warna) {
    let [xc, yc] = koordinat;
    let x, y;

    for (var theta = (start / total) * (Math.PI * 2); theta <= ((start + sep) / total) * (Math.PI * 2); theta += 0.001) {
        x = xc + rad * Math.cos(theta);
        y = yc + rad * Math.sin(theta);

        gbr_titik(imageData, canvas, x, y, warna);
    }
    dda_line(imageData, canvas, [x, y], koordinat, warna);
}

export function fill_lingkaran(imageData, canvas, koordinat, rad, total, start, sep, warna) {
    let [xc, yc] = koordinat;

    let midX = Math.ceil(xc + (rad - 80) * Math.cos((start + sep / 2) / total * (Math.PI * 2)));
    let midY = Math.ceil(yc + (rad - 80) * Math.sin((start + sep / 2) / total * (Math.PI * 2)));
    floodFillStack(imageData, canvas, midX, midY, { r: 0, g: 0, b: 0 }, { r: warna[0], g: warna[1], b: warna[2] });

    return { x: midX, y: midY };
}

export function floodFillStack(imageData, canvas, x, y, toFlood, color) {
    var tumpukan = [];
    tumpukan.push({ x: x, y: y });

    while (tumpukan.length > 0) {

        var titik_now = tumpukan.pop();
        var index_now = 4 * (titik_now.x + (titik_now.y * canvas.width));

        var r1 = imageData.data[index_now];
        var g1 = imageData.data[index_now + 1];
        var b1 = imageData.data[index_now + 2];

        if ((r1 == toFlood.r) && (g1 == toFlood.g) && (b1 == toFlood.b)) {

            imageData.data[index_now] = color.r;
            imageData.data[index_now + 1] = color.g;
            imageData.data[index_now + 2] = color.b;
            imageData.data[index_now + 3] = 255;

            tumpukan.push({ x: titik_now.x + 1, y: titik_now.y });
            tumpukan.push({ x: titik_now.x - 1, y: titik_now.y });
            tumpukan.push({ x: titik_now.x, y: titik_now.y + 1 });
            tumpukan.push({ x: titik_now.x, y: titik_now.y - 1 });
        }
    }
}

export function translation(titik_lama, T) {
    var x_baru = titik_lama.x + T.x;
    var y_baru = titik_lama.y + T.y;

    return { x: x_baru, y: y_baru };
}

export function scaling(titik_lama, S) {
    var x_baru = titik_lama.x * S.x;
    var y_baru = titik_lama.y * S.y;

    return { x: x_baru, y: y_baru };
}

export function rotation(titik_lama, sudut) {
    var x_baru = titik_lama.x * Math.cos(sudut) - titik_lama.y * Math.sin(sudut);
    var y_baru = titik_lama.x * Math.sin(sudut) + titik_lama.y * Math.cos(sudut);

    return { x: x_baru, y: y_baru };
}

export function rotasi_fp(titik_lama, titik_putar, sudut) {
    var p1 = translation(titik_lama, { x: -titik_putar.x, y: -titik_putar.y });
    var p2 = rotation(p1, sudut);
    var p3 = translation(p2, titik_putar);

    return p3;
}

export function skala_fp(titik_lama, titik_pusat, S) {
    var p1 = translation(titik_lama, { x: -titik_pusat.x, y: -titik_pusat.y });
    var p2 = scaling(p1, S);
    var p3 = translation(p2, titik_pusat);

    return p3;
}

export function translation_array(array_titik, T) {
    var array_hasil = [];
    for (var i = 0; i < array_titik.length; i++) {
        var temp = translation(array_titik[i], T);
        array_hasil.push(temp);
    }
    return array_hasil;
}

export function rotation_array(array_titik, titik_pusat, sudut) {
    var array_hasil = [];
    for (var i = 0; i < array_titik.length; i++) {
        var temp = rotasi_fp(array_titik[i], titik_pusat, sudut);
        array_hasil.push(temp);
    }
    return array_hasil;
}

export function scaling_array(array_titik, titik_pusat, S) {
    var array_hasil = [];
    for (var i = 0; i < array_titik.length; i++) {
        var temp = skala_fp(array_titik[i], titik_pusat, S);
        array_hasil.push(temp);
    }
    return array_hasil;
}