$(document).ready(function () {
    $('#send').click(function () {
        let ho_ten = $('input[id=ho_ten]').val()
        let sdt = $('input[id=dien_thoai]').val()
        let message = $('input[id=noi_dung]').val()
        if (sdt) {
            let msg = {
                hoten: ho_ten,
                sdt: sdt,
                message: message
            }
            $.post('/api/send-message',msg, (msg) => {
                console.log(msg)
            })
            swal("Cảm ơn " + ho_ten, "Chúng tôi sẽ liên hệ bạn trong 24h", "success");
        } else {
            swal("Chào bạn " + ho_ten, "Vui lòng nhập SĐT để chúng tôi liên hệ lại với bạn", "error");
        }

    })


    let arrPrice = $('.price')
    for (var i = 0; i < arrPrice.length; i++) {
        let formatMoney = parseInt($(arrPrice[i]).text()).formatMoney(0, '.', '.')
        $(arrPrice[i]).text(formatMoney + ' VND')
    }
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