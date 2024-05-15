var nameProduct, maProduct; // Tên sản phẩm trong trang này, 
// là biến toàn cục để có thể dùng ở bát cứ đâu trong trang
// không cần tính toán lấy tên từ url nhiều lần

window.onload = function () {
    khoiTao();
    phanTich_URL_chiTietSanPham();
    autocomplete(document.getElementById('search-box'), list_products);
}

function phanTich_URL_chiTietSanPham() {
    nameProduct = window.location.href.split('?')[1]; // lấy tên
    if (!nameProduct) return; // nếu không tìm thấy tên thì thoát hàm

    // tách theo dấu '-' vào gắn lại bằng dấu ' ', code này giúp bỏ hết dấu '-' thay vào bằng khoảng trắng.
    // code này làm ngược lại so với lúc tạo href cho sản phẩm trong file classes.js
    nameProduct = nameProduct.split('-').join(' ');

    for(var p of list_products) {
        if(nameProduct == p.name) {
            maProduct = p.masp;
            break;
        }
    }

    var sanPham = timKiemTheoTen(list_products, nameProduct)[0];
    var divChiTiet = document.getElementsByClassName('chitietSanpham')[0];

   

    // Cập nhật tên h1
    var h1 = divChiTiet.getElementsByTagName('h1')[0];
    h1.innerHTML += nameProduct;

    

    // Cập nhật giá + label khuyến mãi
    var price = divChiTiet.getElementsByClassName('area_price')[0];
    if (sanPham.promo.name != 'giareonline') {
        price.innerHTML = `<strong>` + sanPham.price + `₫</strong>`;
        price.innerHTML += new Promo(sanPham.promo.name, sanPham.promo.value).toWeb();
    } else {
        
        price.innerHTML = `<strong>` + sanPham.promo.value + `&#8363;</strong>
					        <span>` + sanPham.price + `&#8363;</span>`;
    }
    // Cập nhật thông số
    var info = document.getElementsByClassName('info')[0];
    var s = addThongSo('Màn hình', sanPham.detail.screen);
    s += addThongSo('Hệ điều hành', sanPham.detail.os);
    s += addThongSo('Camara sau', sanPham.detail.camara);
    s += addThongSo('Camara trước', sanPham.detail.camaraFront);
    s += addThongSo('CPU', sanPham.detail.cpu);
    s += addThongSo('RAM', sanPham.detail.ram);
    s += addThongSo('Bộ nhớ trong', sanPham.detail.rom);
    s += addThongSo('Thẻ nhớ', sanPham.detail.microUSB);
    s += addThongSo('Dung lượng pin', sanPham.detail.battery);
    info.innerHTML = s;
  

    // Cập nhật hình
    var hinh = divChiTiet.getElementsByClassName('picture')[0];
    hinh = hinh.getElementsByTagName('img')[0];
    hinh.src = sanPham.img;
    document.getElementById('bigimg').src = sanPham.img;

    

}

function addThongSo(ten, giatri) {
    return `<li>
                <p>` + ten + `</p>
                <div>` + giatri + `</div>
            </li>`;
}

// đóng mở xem hình
function opencertain() {
    document.getElementById("overlaycertainimg").style.transform = "scale(1)";
}

function closecertain() {
    document.getElementById("overlaycertainimg").style.transform = "scale(0)";
}
