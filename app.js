const express = require('express');
const app = express()
const bodyParser = require('body-parser')
const request = require('request');
const cheerio = require('cheerio')
const db = require('./db')
const path = require('path');
const fs = require('fs');
const shell = require('shelljs');
const Xe = require('./xe.class')

// Parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Set public folder
app.use(express.static(__dirname + '/public'));

app.set('views', './views')
app.set('view engine', 'ejs')
// app.set("view options", { layout: "mylayout.ejs" });

app.get('/gioi-thieu', (req, res) => {
    res.render('index', { layout: 'baiviet', content: 'gioi_thieu' })
})
app.get('/lien-he', (req, res) => {
    res.render('index', { layout: 'baiviet', content: 'lien_he' })
})
app.get('/ho-tro-tra-gop', (req, res) => {
    res.render('index', { layout: 'baiviet', content: 'tra_gop' })
})

app.get('/', (req, res) => {
    // Hiển thị xe
    db.toyota2.find({}, (err, arrXe) => {
        let arrDongXe = []
        arrXe.forEach(xe => {
            let dongXe = {
                dong_xe_name: xe.dong_xe_name,
                dong_xe_url: xe.dong_xe_url
            }
            if (!containsObject(dongXe, arrDongXe)) {
                arrDongXe.push(dongXe)
            }
        });
        for (var i = 0; i < arrDongXe.length; i++) {
            arrDongXe[i].cars = arrXe.filter(xe => xe.dong_xe_url == arrDongXe[i].dong_xe_url)
        }
        arrDongXe.sort(function sortDongXe(mot, hai) {
            if (mot.cars.length > hai.cars.length) {
                return -1
            }
            if (mot.cars.length < hai.cars.length) {
                return 1
            }
            return 0
        })
        res.render('index', { layout: 'trangchu', arrDongXe: arrDongXe })

    })

})
function containsObject(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i].dong_xe_url === obj.dong_xe_url) {
            return true;
        }
    }
    return false;
}
app.get('/banggia',(req,res)=>{
    db.toyota2.find().sort({price:1},function(err,docs){
        res.json(docs)
    })
})
app.get('/dong-xe/:name', (req, res) => {
    // Hiển thị xe
    const dong_xe_url = req.params.name
    db.toyota2.find({ dong_xe_url: dong_xe_url }, (err, docs) => {
        dataDongXe = {
            dong_xe_url: docs[0].dong_xe_url,
            dong_xe_name: docs[0].dong_xe_name,
            cars: docs
        }
        res.render('index', { layout: 'dongxe', dataDongXe: dataDongXe })
    })


})


app.get('/downloadimage', (req, res) => {
    download('http://www.toyota.com.vn/data/news/1766/_3/thumb_1ucm0s.png?w=334&h=240&mode=crop', () => {
        console.log('done')
    })
    res.json({ a: 3 })
})
var download = function (uri, callback) {
    let filename = uri.split('/').pop()
    if (filename.indexOf('?') != -1) {
        filename = filename.substr(0, filename.indexOf('?'))
    }
    let start = uri.indexOf('com.vn/') + 7
    let end = uri.indexOf(filename)
    let dir = './public/images/' + uri.slice(start, end)
    if (!fs.existsSync(dir)) {
        shell.mkdir('-p', dir);
    }
    let fullPath = dir + filename
    request.head(uri, function (err, res, body) {
        request(uri).pipe(fs.createWriteStream(fullPath)).on('close', callback);
    });
};

app.get('/xe/:url_xe', (req, res) => {
    db.toyota2.find({ url: req.params.url_xe }, (err, docs) => {
        res.render('index', { layout: 'chitiet', chitiet: docs[0] })
    })
})
app.get('/addxe', (req, res) => {
    res.render('./index', { layout: 'addxe' })
})

app.post('/addxe', (req, res) => {
    let xe = new Xe()
    let url_xe_toyota = req.body.url_xe_toyota
    request(url_xe_toyota, (err, response, body) => {
        if (err) {
            alert('Fail')
        } else {
            const $ = cheerio.load(body)
            xe.dong_xe_name = req.body.dong_xe
            xe.dong_xe_url = generateUrl(req.body.dong_xe)
            xe.url = url_xe_toyota.substr(url_xe_toyota.indexOf('com.vn/') + 7)
            xe.name = $(body).find("#spTitleCar").text()
            xe.price = parseInt($(body).find(".price_detail").text().split('.').join(''))
            let ogImage = $('meta[property="og:image"]').prop('content')
            xe.thumbnail = ogImage.replace('http://www.toyota.com.vn', '')
            download(ogImage, () => {
                console.log('Downloaded')
            })


            let colors = $('span[data-cl]')
            for (var i = 0; i < colors.length; i++) {
                let background_color = $(colors[i]).attr('style')
                xe.colors.push({
                    name: $(colors[i]).attr('data-cl'),
                    price: parseInt($(colors[i]).attr('data-price').split('.').join('')),
                    value: background_color.substr(background_color.indexOf('#'), 7),
                    image: $(colors[i]).attr('data-img').substr(0, $(colors[i]).attr('data-img').indexOf('?'))
                })
                download('http://www.toyota.com.vn' + $(colors[i]).attr('data-img'), () => {
                    console.log('done image color')
                })
            }
            let descriptions = $('#sec_dt_01 .txt_dt_2 span')
            let so_cho_ngoi = $(descriptions[0]).text()
            let kieu_dang = $(descriptions[1]).text()
            let nhien_lieu = $(descriptions[2]).text()
            let xuat_xu = $(descriptions[3]).text()
            xe.description = {
                so_cho_ngoi: parseInt(so_cho_ngoi.substr(so_cho_ngoi.indexOf(':') + 1)),
                kieu_dang: kieu_dang.substr(kieu_dang.indexOf(':') + 1).trim(),
                nhien_lieu: nhien_lieu.substr(nhien_lieu.indexOf(':') + 1).trim(),
                xuat_xu: xuat_xu.substr(xuat_xu.indexOf(':') + 1).trim()
            }
            // db.toyota.insert({
            //     dong_xe_name: req.body.dong_xe,
            //     dong_xe_url: generateUrl(req.body.dong_xe),
            //     cars: []
            // })

            // Ngoai That
            arrImages_ngoai_that = []
            let ngoai_that_html = $(body).find("div#sec_dt_04")
            let images_ngoai_that = $(ngoai_that_html).find("img.owl-lazy")
            for (var i = 0; i < images_ngoai_that.length; i++) {
                arrImages_ngoai_that.push({ src: $(images_ngoai_that[i]).attr('data-src') })
            }


            xe.ngoai_that = {
                description: $(ngoai_that_html).find("p.txt_dt_2").text(),
                title: $(ngoai_that_html).find("p.txt_dt").text(),
                images: arrImages_ngoai_that
            }
            // Noi That
            arrImages_noi_that = []
            let noi_that_html = $(body).find("div#sec_dt_05")
            let images_noi_that = $(noi_that_html).find("img.owl-lazy")
            for (var i = 0; i < images_noi_that.length; i++) {
                arrImages_noi_that.push({ src: $(images_noi_that[i]).attr('data-src') })
            }

            xe.noi_that = {
                description: $(noi_that_html).find("p.txt_dt_2").text(),
                title: $(noi_that_html).find("p.txt_dt").text(),
                images: arrImages_noi_that
            }
            // Tinh nang
            let tinh_nang_html = $(body).find("div#sec_dt_06")
            let tabs_tinh_nang = $(tinh_nang_html).find("ul.tabs_vanhanh li.tab a")
            let content_tinh_nang = $(tinh_nang_html).find("div.content-tab")

            arr_tinh_nang = []
            for (var i = 0; i < tabs_tinh_nang.length; i++) {
                arr_content = []
                $(content_tinh_nang[i]).find("div.inner").each(function (i, inner) {
                    arr_content.push({
                        img: $(inner).find(".owl-lazy").attr("data-src"),
                        title: $(inner).find(".txt1").text(),
                        description: $(inner).find(".txt2").text(),
                    })

                })

                xe.tinh_nang.push({
                    name: $(tabs_tinh_nang[i]).text(),
                    content: arr_content
                })
            }
            // THONG SO KY THUAT
            let arrTabs = []
            let thong_so_ky_thuat = $(body).find("div.thong_so_ky_thuat")
            let tabs = $(thong_so_ky_thuat).find("li.tab a")

            let dong_co_khung_xe = $(thong_so_ky_thuat).find("div #tab_dt_2").html()
            let ngoai_that = $(thong_so_ky_thuat).find("div #tab_dt_3").html()
            let noi_that = $(thong_so_ky_thuat).find("div #tab_dt_4").html()
            let ghe = $(thong_so_ky_thuat).find("div #tab_dt_203").html()
            let tien_nghi = $(thong_so_ky_thuat).find("div #tab_dt_5").html()
            let an_ninh = $(thong_so_ky_thuat).find("div #tab_dt_8").html()
            let an_toan_chu_dong = $(thong_so_ky_thuat).find("div #tab_dt_6").html()
            let an_toan_bi_dong = $(thong_so_ky_thuat).find("div #tab_dt_7").html()
            arrTabs.push({ name: 'Động cơ & Khung xe', content: dong_co_khung_xe })
            arrTabs.push({ name: 'Ngoại thất', content: ngoai_that })
            arrTabs.push({ name: 'Nội thất', content: noi_that })
            arrTabs.push({ name: 'Ghế', content: ghe })
            arrTabs.push({ name: 'Tiện nghi', content: tien_nghi })
            arrTabs.push({ name: 'An ninh', content: an_ninh })
            arrTabs.push({ name: 'An toàn chủ động', content: an_toan_chu_dong })
            arrTabs.push({ name: 'An toàn bị động', content: an_toan_bi_dong })
            xe.thong_so_ky_thuat = arrTabs
            // Thu Vien
            let url_thu_vien = url_xe_toyota + '/thuvien?name=' + xe.name + '&gallery=thuvien'
            request(url_thu_vien, (errTV, responseTV, bodyTV) => {
                if (errTV) {
                    alert('Fail')
                } else {
                    const $TV = cheerio.load(bodyTV)
                    let imgs = $TV('.open_popup_pc img')
                    for (var i = 0; i < imgs.length; i++) {
                        let img = $(imgs[i]).attr('src')
                        let full_img = img.substr(0, img.indexOf('?'))
                        xe.images.push(full_img)
                        download('http://www.toyota.com.vn' + full_img+'?w=500', () => {
                            console.log('Downloaded ' + full_img)
                        })
                    }
                    db.toyota2.insert(xe)

                    res.redirect('/addxe')
                }
            })
        }
    })
})
function generateUrl(name) {
    name = name.split(' ').join('-')
    name = name.replace('(', '')
    name = name.replace(')', '')
    name = name.replace('.', '-')
    return name.toLowerCase()
}

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log('running ....')
})