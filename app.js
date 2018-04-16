const express = require('express');
const app = express()
const bodyParser = require('body-parser')
const request = require('request');
const cheerio = require('cheerio')
const db = require('./db')
const path = require('path');

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
    res.render('index', { layout: 'gioi-thieu' })
})
app.get('/lien-he', (req, res) => {
    res.render('index', { layout: 'lien-he' })
})
app.get('/ho-tro-tra-gop', (req, res) => {
    res.render('index', { layout: 'ho-tro-tra-gop' })
})
app.get('/', (req, res) => {
    // Hiển thị xe
    db.toyota.find({}, (err, arrDongXe) => {
        arrDongXe.sort(function compareLength(dongXe1, dongXe2) {
            if (dongXe1.cars.length > dongXe2.cars.length) {
                return -1
            }
            if (dongXe1.cars.length < dongXe2.cars.length) {
                return 1
            }
            return 0
        })
        res.render('index', { layout: 'trangchu', arrDongXe: arrDongXe })
    })

})

app.get('/dong-xe/:name', (req, res) => {
    // Hiển thị xe
    const dong_xe_url = req.params.name
    db.toyota.find({ dong_xe_url: dong_xe_url }, (err, docs) => {
        res.render('index', { layout: 'dongxe', dataDongXe: docs[0] })
    })

})
app.get('/xe/:url_xe', (req, res) => {

    request('http://www.toyota.com.vn/' + req.params.url_xe, (err, respoonse, body) => {
        if (err) {
            console.log('Loi: ' + err)
        } else {
            let data = {}
            const $ = cheerio.load(body)
            // Name
            let name = $('#spTitleCar').text()
            // Cover Image
            let thumbnailx = $('.img_box img[data-original]').attr('data-original')
            let thumbnail = thumbnailx.substr(0, thumbnailx.indexOf('?'))

            // Color
            let list_color = $(body).find("div.list-color")
            // Detail
            let price = $('.price_detail').text().trim()
            let descriptions = $('#sec_dt_01 .txt_dt_2 span')
            let so_cho_ngoi = $(descriptions[0]).text()
            let kieu_dang = $(descriptions[1]).text()
            let nhien_lieu = $(descriptions[2]).text()
            let xuat_xu = $(descriptions[3]).text()

            let detail = {
                so_cho_ngoi: parseInt(so_cho_ngoi.substr(so_cho_ngoi.indexOf(':') + 1)),
                kieu_dang: kieu_dang.substr(kieu_dang.indexOf(':') + 1).trim(),
                nhien_lieu: nhien_lieu.substr(nhien_lieu.indexOf(':') + 1).trim(),
                xuat_xu: xuat_xu.substr(xuat_xu.indexOf(':') + 1).trim(),
                price: price,
                name: name
            }
            // Ngoai That
            arrImages_ngoai_that = []
            let ngoai_that_html = $(body).find("div#sec_dt_04")
            let images_ngoai_that = $(ngoai_that_html).find("img.owl-lazy")
            for (var i = 0; i < images_ngoai_that.length; i++) {
                arrImages_ngoai_that.push({ src: $(images_ngoai_that[i]).attr('data-src') })
            }
            let ngoai_that_detail = {
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
            let noi_that_detail = {
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

                arr_tinh_nang.push({
                    name: $(tabs_tinh_nang[i]).text(),
                    content: arr_content
                })
            }
            let arrTabs = []
            let thong_so_ky_thuat = $(body).find("div.thong_so_ky_thuat")
            let tabs = $(thong_so_ky_thuat).find("li.tab a")

            let dong_co_khung_xe = $(thong_so_ky_thuat).find("div #tab_dt_2")
            let ngoai_that = $(thong_so_ky_thuat).find("div #tab_dt_3")
            let noi_that = $(thong_so_ky_thuat).find("div #tab_dt_4")
            let ghe = $(thong_so_ky_thuat).find("div #tab_dt_203")
            let tien_nghi = $(thong_so_ky_thuat).find("div #tab_dt_5")
            let an_ninh = $(thong_so_ky_thuat).find("div #tab_dt_8")
            let an_toan_chu_dong = $(thong_so_ky_thuat).find("div #tab_dt_6")
            let an_toan_bi_dong = $(thong_so_ky_thuat).find("div #tab_dt_7")
            arrTabs.push({ name: 'Động cơ & Khung xe', content: dong_co_khung_xe })
            arrTabs.push({ name: 'Ngoại thất', content: ngoai_that })
            arrTabs.push({ name: 'Nội thất', content: noi_that })
            arrTabs.push({ name: 'Ghế', content: ghe })
            arrTabs.push({ name: 'Tiện nghi', content: tien_nghi })
            arrTabs.push({ name: 'An ninh', content: an_ninh })
            arrTabs.push({ name: 'An toàn chủ động', content: an_toan_chu_dong })
            arrTabs.push({ name: 'An toàn bị động', content: an_toan_bi_dong })
            data.thumbnail = thumbnail
            data.list_color = list_color
            data.thong_so_ky_thuat = arrTabs
            data.detail = detail
            data.ngoai_that_detail = ngoai_that_detail
            data.noi_that_detail = noi_that_detail
            data.arr_tinh_nang = arr_tinh_nang
            res.render('./index', { layout: 'chitiet', chitiet: data })
        }
    })
})
app.get('/addxe', (req, res) => {
    res.render('./index', { layout: 'addxe' })
})
app.post('/addxe', (req, res) => {
    let xe = new Xe()
    let url_xe_toyota = req.body.url_xe_toyota
    // url_xe_toyota = 'http://www.toyota.com.vn/yaris-e-cvt'
    request(url_xe_toyota, (err, response, body) => {
        if (err) {
            alert('Fail')
        } else {
            const $ = cheerio.load(body)
            xe.url = url_xe_toyota.substr(url_xe_toyota.indexOf('com.vn/') + 7)
            xe.name = $(body).find("#spTitleCar").text()
            xe.price = parseInt($(body).find(".price_detail").text().split('.').join(''))
            xe.thumbnail = $('meta[property="og:image"]').prop('content')
            let colors = $('span[data-cl]')
            for (var i = 0; i < colors.length; i++) {
                let background_color = $(colors[i]).attr('style')
                xe.colors.push({
                    name: $(colors[i]).attr('data-cl'),
                    price: parseInt($(colors[i]).attr('data-price').split('.').join('')),
                    value: background_color.substr(background_color.indexOf('#'), 7),
                    image: 'http://www.toyota.com.vn' + $(colors[i]).attr('data-img').substr(0, $(colors[i]).attr('data-img').indexOf('?'))
                })
            }
            let descriptions = $('#sec_dt_01 .txt_dt_2 span')
            let so_cho_ngoi = $(descriptions[0]).text()
            let kieu_dang = $(descriptions[1]).text()
            let nhien_lieu = $(descriptions[2]).text()
            let xuat_xu = $(descriptions[3]).text()
            xe.description.push({
                so_cho_ngoi: parseInt(so_cho_ngoi.substr(so_cho_ngoi.indexOf(':') + 1)),
                kieu_dang: kieu_dang.substr(kieu_dang.indexOf(':') + 1).trim(),
                nhien_lieu: nhien_lieu.substr(nhien_lieu.indexOf(':') + 1).trim(),
                xuat_xu: xuat_xu.substr(xuat_xu.indexOf(':') + 1).trim()
            })
            xe.dongxe_name = req.body.dong_xe
            xe.dongxe_url = generateUrl(req.body.dong_xe)
            let url_thu_vien = url_xe_toyota + '/thuvien?name=' + xe.name + '&gallery=thuvien'
            request(url_thu_vien, (errTV, responseTV, bodyTV) => {
                if (errTV) {
                    alert('Fail')
                } else {
                    const $TV = cheerio.load(bodyTV)
                    let imgs = $TV('.open_popup_pc img')
                    for (var i = 0; i < imgs.length; i++) {
                        let img = $(imgs[i]).attr('src')
                        xe.images.push('http://www.toyota.com.vn' + img.substr(0, img.indexOf('?')))
                    }
                    db.toyota.find({ dong_xe_name: req.body.dong_xe }, (err, docs) => {
                        docs[0].cars.push(xe)
                        db.toyota.findAndModify({
                            query: { dong_xe_name: req.body.dong_xe },
                            update: { $set: { cars: docs[0].cars } },
                            new: true
                        }, (err, doc, lastErrorObject) => {
                            if (err) {
                                console.log('Fail findAndModify')
                            }
                        })
                    })

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