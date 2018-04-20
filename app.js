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
    let arrMeta = [{ name: "Description", content: "Giới thiệu Toyota Gia Lai" },
    { name: "Keywords", content: "gioi thieu, toyota, toyota gia lai" },
    { name: "og:url", content: "http://www.toyotagialaii.com/gioi-thieu" },
    { name: "og:type", content: "article" },
    { name: "og:title", content: "Giới thiệu | Toyota Gia Lai" },
    { name: "og:description", content: "Giới thiệu Toyota Gia Lai" },
    { name: "og:image", content: "http://www.toyotagialaii.com/images/data/news/1766/wfen2o.png" },
    { name: "twitter:title", content: "Giới thiệu | Toyota Gia Lai" },
    { name: "twitter:description", content: "Giới thiệu Toyota Gia Lai" },
    { name: "twitter:image", content: "http://www.toyotagialaii.com/images/data/news/1766/wfen2o.png" },
    { name: "twitter:card", content: "http://www.toyotagialaii.com/images/data/news/1766/wfen2o.png" },
    { name: "fragment", content: "!" },
    { name: "viewport", content: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" }]

    res.render('index', { layout: 'baiviet', content: 'gioi_thieu', title: 'Giới thiệu', arrMeta: arrMeta })
})
app.get('/lien-he', (req, res) => {
    let arrMeta = [{ name: "Description", content: "Liên hệ Toyota Gia Lai" },
    { name: "Keywords", content: "gioi thieu, toyota, toyota gia lai" },
    { name: "og:url", content: "http://www.toyotagialaii.com/gioi-thieu" },
    { name: "og:type", content: "article" },
    { name: "og:title", content: "Liên hệ | Toyota Gia Lai" },
    { name: "og:description", content: "Liên hệ Toyota Gia Lai" },
    { name: "og:image", content: "http://www.toyotagialaii.com/images/data/news/1766/wfen2o.png" },
    { name: "twitter:title", content: "Liên hệ | Toyota Gia Lai" },
    { name: "twitter:description", content: "Liên hệ Toyota Gia Lai" },
    { name: "twitter:image", content: "http://www.toyotagialaii.com/images/data/news/1766/wfen2o.png" },
    { name: "twitter:card", content: "http://www.toyotagialaii.com/images/data/news/1766/wfen2o.png" },
    { name: "fragment", content: "!" },
    { name: "viewport", content: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" }]
    res.render('index', { layout: 'baiviet', content: 'lien_he', title: 'Liên hệ', arrMeta: arrMeta })
})
app.get('/ho-tro-tra-gop', (req, res) => {
    let arrMeta = [{ name: "Description", content: "Hướng dẫn mua xe trả góp tại Toyota Gia Lai" },
    { name: "Keywords", content: "mua xe tra gop, toyota, toyota gia lai" },
    { name: "og:url", content: "http://www.toyotagialaii.com/ho-tro-tra-gop" },
    { name: "og:type", content: "article" },
    { name: "og:title", content: "Hỗ trợ trả góp | Toyota Gia Lai" },
    { name: "og:description", content: "Hướng dẫn mua xe trả góp tại Toyota Gia Lai" },
    { name: "og:image", content: "http://www.toyotagialaii.com/images/data/news/1766/wfen2o.png" },
    { name: "twitter:title", content: "Hỗ trợ trả góp | Toyota Gia Lai" },
    { name: "twitter:description", content: "Hướng dẫn mua xe trả góp tại Toyota Gia Lai" },
    { name: "twitter:image", content: "http://www.toyotagialaii.com/images/data/news/1766/wfen2o.png" },
    { name: "twitter:card", content: "http://www.toyotagialaii.com/images/data/news/1766/wfen2o.png" },
    { name: "fragment", content: "!" },
    { name: "viewport", content: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" }]
    res.render('index', { layout: 'baiviet', content: 'tra_gop', title: 'Hỗ trợ trả góp', arrMeta: arrMeta })
})

app.get('/', (req, res) => {
    let arrDongXe = [{ "dong_xe_name": "Toyota Corolla Altis", "dong_xe_url": "toyota-corolla-altis", "cars": [{ "thumbnail": "/data/news/1758/uaxdpx.png", "price": 678000000, "name": "Corolla Altis 1.8E (MT)", "url": "corolla-altis-1-8e-mt" }, { "thumbnail": "/data/news/3131/rvj1lm.png", "price": 707000000, "name": "Corolla Altis 1.8E (CVT)", "url": "corolla-altis-1-8e-cvt" }, { "thumbnail": "/data/news/1865/gmh0as.png", "price": 753000000, "name": "Corolla Altis 1.8G (CVT)", "url": "corolla-altis-1-8g-cvt" }, { "thumbnail": "/data/news/1864/cpet54.png", "price": 864000000, "name": "Corolla Altis 2.0V(CVT)", "url": "corolla-altis-2-0v-cvt" }, { "thumbnail": "/data/news/3133/1t3znp.png", "price": 905000000, "name": "Corolla Altis 2.0V Sport", "url": "corolla-altis-2-0v-sport" }] }, { "dong_xe_name": "Toyota Innova", "dong_xe_url": "toyota-innova", "cars": [{ "thumbnail": "/data/news/1866/Innova-2-0E.png", "price": 743000000, "name": "Innova 2.0E", "url": "innova-2-0e" }, { "thumbnail": "/data/news/1867/Innova-2-0G.png", "price": 817000000, "name": "Innova 2.0G", "url": "innova-20g" }, { "thumbnail": "/data/news/3201/ldqgej.png", "price": 855000000, "name": "Innova Venturer", "url": "innova-venturer" }, { "thumbnail": "/data/news/1768/Innova-2-0V.png", "price": 945000000, "name": "Innova 2.0V", "url": "innova-2-0v" }] }, { "dong_xe_name": "Toyota Vios", "dong_xe_url": "toyota-vios", "cars": [{ "thumbnail": "/data/news/1766/wfen2o.png", "price": 513000000, "name": "Vios 1.5E (MT)", "url": "vios-1-5e-mt" }, { "thumbnail": "/data/news/1757/qegisi.png", "price": 535000000, "name": "Vios 1.5E (CVT)", "url": "vios-1-5e-cvt" }, { "thumbnail": "/data/news/1765/nd3bv1.png", "price": 565000000, "name": "Vios 1.5G (CVT)", "url": "vios-1-5g-cvt" }, { "thumbnail": "/data/news/2901/sckeqs.png", "price": 586000000, "name": "Vios TRD Sportivo", "url": "vios-trd-sportivo" }] }, { "dong_xe_name": "Toyota Fortuner", "dong_xe_url": "toyota-fortuner", "cars": [{ "thumbnail": "/data/news/2010/jc2hxv.png", "price": 981000000, "name": "Fortuner 2.4G 4x2", "url": "fortuner-2-4g-4x2" }, { "thumbnail": "/data/news/1855/opkqn2.png", "price": 1149000000, "name": "Fortuner 2.7V 4x2", "url": "fortuner-2-7v-4x2" }, { "thumbnail": "/data/news/1854/hittvx.png", "price": 1308000000, "name": "Fortuner 2.7V 4x4", "url": "fortuner-2-7v-4x4" }] }, { "dong_xe_name": "Toyota Camry", "dong_xe_url": "toyota-camry", "cars": [{ "thumbnail": "/data/news/1770/nlbdu0.png", "price": 997000000, "name": "Camry 2.0E", "url": "camry-2-0e" }, { "thumbnail": "/data/news/1767/ffxuwo.png", "price": 1161000000, "name": "Camry 2.5G", "url": "camry-25g" }, { "thumbnail": "/data/news/1764/qpixkk.png", "price": 1302000000, "name": "Camry 2.5Q", "url": "camry-2-5q" }] }, { "dong_xe_name": "Toyota Hilux", "dong_xe_url": "toyota-hilux", "cars": [{ "thumbnail": "/data/news/1872/Hilux-2-4E-4x2-MT.png", "price": 631000000, "name": "Hilux 2.4E 4x2 MT", "url": "hilux-2-4e-4x2-mt" }, { "thumbnail": "/data/news/1871/Hilux-2-8G-4x4-MT.png", "price": 775000000, "name": "Hilux 2.4G 4x4 MT", "url": "hilux-2-4g-4x4-mt" }, { "thumbnail": "/data/news/1870/4rlpjg.png", "price": 673000000, "name": "Hilux 2.4E 4x2 AT", "url": "hilux-2-4e-4x2-at" }] }, { "dong_xe_name": "Toyota Hiace", "dong_xe_url": "toyota-hiace", "cars": [{ "thumbnail": "/data/news/1874/Hiace-dong-co-xang.png", "price": 1131000000, "name": "Hiace Động cơ xăng", "url": "hiace-dong-co-xang" }, { "thumbnail": "/data/news/1873/Hiace-dong-co-dau.png", "price": 1240000000, "name": "Hiace Động cơ dầu", "url": "hiace-dong-co-dau" }] }, { "dong_xe_name": "Toyota Yaris", "dong_xe_url": "toyota-yaris", "cars": [{ "thumbnail": "/data/news/1863/YarisECVT.png", "price": 592000000, "name": "Yaris E CVT", "url": "yaris-e-cvt" }, { "thumbnail": "/data/news/1763/yarisGCVT.png", "price": 642000000, "name": "Yaris G CVT", "url": "yaris-g-cvt" }] }, { "dong_xe_name": "Toyota Land Cruiser", "dong_xe_url": "toyota-land-cruiser", "cars": [{ "thumbnail": "/data/news/1869/Land-Cruiser.png", "price": 3650000000, "name": "Land Cruiser VX", "url": "land-cruiser-vx" }] }, { "dong_xe_name": "Toyota Land Cruiser Prado", "dong_xe_url": "toyota-land-cruiser-prado", "cars": [{ "thumbnail": "/data/news/1868/4podxq.png", "price": 2262000000, "name": "Land Cruiser Prado VX", "url": "land-cruiser-prado-vx" }] }, { "dong_xe_name": "Toyota Alphard", "dong_xe_url": "toyota-alphard", "cars": [{ "thumbnail": "/data/news/3068/0l1os5.png", "price": 3533000000, "name": "Alphard", "url": "alphard" }] }]
    let arrMeta = [{ name: "Description", content: "Toyota l&#224; thương hiệu &#244;t&#244; h&#224;ng đầu thế giới. Tại Việt Nam, Toyota cũng bắt đầu sản xuất v&#224; kinh doanh từ năm 1997 v&#224; cho đến nay vẫn l&#224; h&#227;ng xe du lịch được ưa chuộng nhất tại Việt Nam." },
    { name: "Keywords", content: "toyota, toyota viet nam, xe toyota" },
    { property: "og:url", content: "http://www.toyotagialaii.com" },
    { property: "og:type", content: "article" },
    { property: "og:title", content: "Trang chủ | Toyota Gia Lai" },
    { property: "og:description", content: "Toyota l&#224; thương hiệu &#244;t&#244; h&#224;ng đầu thế giới. Tại Việt Nam, Toyota cũng bắt đầu sản xuất v&#224; kinh doanh từ năm 1997 v&#224; cho đến nay vẫn l&#224; h&#227;ng xe du lịch được ưa chuộng nhất tại Việt Nam." },
    { property: "og:image", content: "http://www.toyotagialaii.com/images/data/news/1766/wfen2o.png" },
    { name: "twitter:title", content: "Trang chủ | Toyota Gia Lai" },
    { name: "twitter:description", content: "Toyota l&#224; thương hiệu &#244;t&#244; h&#224;ng đầu thế giới. Tại Việt Nam, Toyota cũng bắt đầu sản xuất v&#224; kinh doanh từ năm 1997 v&#224; cho đến nay vẫn l&#224; h&#227;ng xe du lịch được ưa chuộng nhất tại Việt Nam." },
    { name: "twitter:image", content: "http://www.toyotagialaii.com/images/data/news/1766/wfen2o.png" },
    { name: "twitter:card", content: "http://www.toyotagialaii.com/images/data/news/1766/wfen2o.png" }
    ]
    res.render('index', { layout: 'trangchu', arrDongXe: arrDongXe, arrMeta: arrMeta, title: 'Toyota Gia Lai' })
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
app.get('/banggia', (req, res) => {
    db.toyota.find().sort({ price: 1 }, function (err, docs) {
        res.json(docs)
    })
})
app.get('/dong-xe/:name', (req, res) => {
    const dong_xe_url = req.params.name
    db.toyota2.find({ dong_xe_url: dong_xe_url }, (err, docs) => {
        let dataDongXe = docs[0]
        let arrMeta = [{ name: "Keywords", content: dataDongXe.dong_xe_name },
        { property: "og:url", content: 'http://www.toyotagialaii.com/' + dataDongXe.dong_xe_url },
        { property: "og:type", content: "article" },
        { property: "og:title", content: dataDongXe.dong_xe_name + ' | Toyota Gia Lai' },
        { property: "og:image", content: "http://toyotagialaii.com/images/" + dataDongXe.cars[0].thumbnail },
        { name: "twitter:title", content: "Vios" },
        { name: "twitter:image", content: "http://toyotagialaii.com/images/" + dataDongXe.cars[0].thumbnail },
        { name: "twitter:card", content: "http://toyotagialaii.com/images/" + dataDongXe.cars[0].thumbnail },
        ]
        res.render('index', { layout: 'dongxe', dataDongXe: dataDongXe, arrMeta: arrMeta, title: dataDongXe.dong_xe_name })
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
    db.toyota.find({ url: req.params.url_xe }, (err, docs) => {
        res.render('index', { layout: 'chitiet', chitiet: docs[0], arrMeta: docs[0].arrMeta, title: docs[0].name })
    })
})
app.get('/api/addxe', (req, res) => {
    res.render('./index', { layout: 'addxe', title: 'Add xe', arrMeta: [] })
})

app.post('/api/addxe', (req, res) => {
    let xe = new Xe()
    let url_xe_toyota = req.body.url_xe_toyota
    request(url_xe_toyota, (err, response, body) => {
        if (err) {
            alert('Fail')
        } else {
            const $ = cheerio.load(body)
            // Meta head
            let meta = $('meta')
            let arrMeta = []
            for (var i = 0; i < meta.length; i++) {
                meta[i].attribs.content = meta[i].attribs.content.replace('Toyota Việt Nam', 'Toyota Gia Lai').replace('1800 1524', '0973.80.74.79')
                arrMeta.push(meta[i].attribs)
            }
            xe.arrMeta = arrMeta

            xe.dong_xe_name = req.body.dong_xe
            xe.dong_xe_url = generateUrl(req.body.dong_xe)
            xe.url = url_xe_toyota.substr(url_xe_toyota.indexOf('com.vn/') + 7)
            xe.name = $(body).find("#spTitleCar").text()
            xe.price = parseInt($(body).find(".price_detail").text().split('.').join(''))
            let ogImage = $('meta[property="og:image"]').prop('content')
            xe.thumbnail = ogImage.replace('http://www.toyota.com.vn', '')
            // download(ogImage, () => {
            //     console.log('Downloaded')
            // })


            let colors = $('span[data-cl]')
            for (var i = 0; i < colors.length; i++) {
                let background_color = $(colors[i]).attr('style')
                xe.colors.push({
                    name: $(colors[i]).attr('data-cl'),
                    price: parseInt($(colors[i]).attr('data-price').split('.').join('')),
                    value: background_color.substr(background_color.indexOf('#'), 7),
                    image: $(colors[i]).attr('data-img').substr(0, $(colors[i]).attr('data-img').indexOf('?'))
                })
                // download('http://www.toyota.com.vn' + $(colors[i]).attr('data-img'), () => {
                //     console.log('done image color')
                // })
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


            // Ngoai That
            arrImages_ngoai_that = []
            let ngoai_that_html = $(body).find("div#sec_dt_04")
            let images_ngoai_that = $(ngoai_that_html).find("img.owl-lazy")
            for (var i = 0; i < images_ngoai_that.length; i++) {
                let img_ngoai_that = $(images_ngoai_that[i]).attr('data-src')
                // if (img_ngoai_that) {
                //     console.log(img_ngoai_that + ' img_ngoai_that')
                //     download('http://www.toyota.com.vn' + img_ngoai_that, () => {
                //         console.log('Downloaded ngoai that')
                //     })
                // }
                arrImages_ngoai_that.push({ src: img_ngoai_that })
            }


            xe.ngoai_that = {
                description: $(ngoai_that_html).find("p.txt_dt_2").text(),
                title: $(ngoai_that_html).find("p.txt_dt").text().trim(),
                images: arrImages_ngoai_that
            }
            // Noi That
            arrImages_noi_that = []
            let noi_that_html = $(body).find("div#sec_dt_05")
            let images_noi_that = $(noi_that_html).find("img.owl-lazy")
            for (var i = 0; i < images_noi_that.length; i++) {
                let img_noi_that = $(images_noi_that[i]).attr('data-src')
                // if (img_noi_that) {
                //     console.log(img_noi_that + ' img_noi_that')
                //     download('http://www.toyota.com.vn' + img_noi_that, () => {
                //         console.log('Downloaded noi that')
                //     })
                // }
                arrImages_noi_that.push({ src: img_noi_that })
            }

            xe.noi_that = {
                description: $(noi_that_html).find("p.txt_dt_2").text(),
                title: $(noi_that_html).find("p.txt_dt").text().trim(),
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
                    let img_tinh_nang = $(inner).find(".owl-lazy").attr("data-src")
                    arr_content.push({
                        img: img_tinh_nang,
                        title: $(inner).find(".txt1").text(),
                        description: $(inner).find(".txt2").text(),
                    })
                    // if (img_tinh_nang) {
                    //     download('http://www.toyota.com.vn' + img_tinh_nang, () => {
                    //         console.log('Downloaded noi that')
                    //     })
                    // }

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
                        // if (full_img) {
                        //     download('http://www.toyota.com.vn' + full_img + '?w=500', () => {
                        //         console.log('Downloaded thu vien ' + full_img)
                        //     })
                        // }

                    }
                    // db.toyota.insert(xe)
                    res.redirect('/api/addxe')
                }
            })
        }
    })
})
app.post('/api/send-message', (req, res) => {
    let access_token = 'EAAAAUaZA8jlABAHGbjNigic03Pyfd8ZBMrag1T4frVL7a2kYPvsSVhxTdx6M18Bmwy5CRPxa8nGsNfhrvLtjuRuRObOh8HKUKozT5ZBWcCZA1WZBKLhNTt1wwEsbumCrD1ydSWNoUI0znz91leevU6ESOTjOZBRAezyGPW7yVdMSZAHAhfh4YuM'
    let endpoint = 'https://graph.facebook.com/v2.12/2024164847832512_2024175484498115/comments?access_token=' + access_token
    let message = req.body.hoten + ' | ' + req.body.sdt + ' | ' + req.body.message
    request.post(endpoint, { form: { message: message } }, (err, response, body) => {
        if (err) {
            res.json({ success: false })
        } else {
            console.log(body)
            res.json({ success: true })
        }

    })

})
app.get('/generate_data', (req, res) => {
    db.toyota.find({}, (err, arrXe) => {
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
            let dongxeurl = arrDongXe[i].dong_xe_url
            let arrXeOfDongXe = []
            arrXe.forEach(xe => {
                if (xe.dong_xe_url == dongxeurl) {

                    arrXeOfDongXe.push({
                        thumbnail: xe.thumbnail,
                        price: xe.price,
                        name: xe.name,
                        url: xe.url
                    })
                }
            })
            arrDongXe[i].cars = arrXeOfDongXe
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
        arrDongXe.forEach(dongXe => {
            db.toyota2.insert(dongXe)
        });
        res.json(arrDongXe)
    })

})
app.get('*', (req, res) => {
    res.redirect('lien-he')
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