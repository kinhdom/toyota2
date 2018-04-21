$(document).ready(function () {
    $('#send').click(function () {
        var ho_ten = $('input[id=ho_ten]').val();
        var sdt = $('input[id=dien_thoai]').val()
        var message = $('input[id=noi_dung]').val()
        if (sdt) {
            var msg = {
                hoten: ho_ten,
                sdt: sdt,
                message: message
            }
            $.post('/api/send-message', msg, function (msg) {
                console.log(msg)
            })
            swal("Cảm ơn " + ho_ten, "Chúng tôi sẽ liên hệ bạn trong 24h", "success");
        } else {
            swal("Chào bạn " + ho_ten, "Vui lòng nhập SĐT để chúng tôi liên hệ lại với bạn", "error");
        }

    })


    var arrPrice = $('.price')
    for (var i = 0; i < arrPrice.length; i++) {
        var formatMoney = parseInt($(arrPrice[i]).text()).formatMoney(0, '.', '.')
        $(arrPrice[i]).text(formatMoney + ' VND')
    }

    setInterval(function () {
        if ($('.icon_callnow').hasClass('lighten-2')) {
            $('.icon_callnow').removeClass('lighten-2')
        } else {
            $('.icon_callnow').addClass('lighten-2')
        }
    }, 300)
    $('select').formSelect();
    $(".dropdown-trigger").dropdown();
    $('.sidenav').sidenav();
    $('.modal').modal({
        preventScrolling: false,
        onOpenStart: function () {
            $('table').hide()
            $.get('/api/banggia', function (data) {
                var arrCar = []
                data.forEach(function (car) {
                    var price = car.price.formatMoney(0, '.', '.')
                    var newCar = $(` 
                <tr>
                    <td>
                            <a href="/xe/${car.url}"> ${car.name}        </a>
           
                      </td>
                    <td class="price">${price} VND</td>
                    <td>${car.description.so_cho_ngoi}</td>
                </tr>
            `)
                    arrCar.push(newCar)
                    $('table').show()
                    $('.progress').removeClass('progress')
                });
                $('.tbodycar').html(arrCar)
            })
        },

    });

    Number.prototype.formatMoney = function (c, d, t) {
        var n = this,
            c = isNaN(c = Math.abs(c)) ? 2 : c,
            d = d == undefined ? "." : d,
            t = t == undefined ? "," : t,
            s = n < 0 ? "-" : "",
            i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
            j = (j = i.length) > 3 ? j % 3 : 0;
        return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
    };
})



Number.prototype.formatMoney = function (c, d, t) {
    var n = this,
        c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "." : d,
        t = t == undefined ? "," : t,
        s = n < 0 ? "-" : "",
        i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
        j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};