window.onload = function () {
	khoiTao();

	autocomplete(document.getElementById('search-box'), list_products);

	var company = ["Apple.png", "Samsung.png", "Oppo.jpg", "Nokia.jpg", "Xiaomi.png",
    "Realme.png", "Vivo.jpg", "Philips.jpg", "Mobell.jpg", "Mobiistar.jpg", "Itel.jpg",
    "Coolpad.png", "HTC.jpg", "Motorola.jpg"];
	for (var c of company) addCompany("img/company/" + c, c.slice(0, c.length - 4));

	
	var sanPhamPhanTich
	var sanPhamPhanTrang;

	var filters = getFilterFromURL();
	if (filters.length) { 
		sanPhamPhanTich = phanTich_URL(filters, true);
		sanPhamPhanTrang = tinhToanPhanTrang(sanPhamPhanTich, filtersFromUrl.page || 1);
		if (!sanPhamPhanTrang.length) alertNotHaveProduct(false);
		else addProductsFrom(sanPhamPhanTrang);

		document.getElementsByClassName('contain-products')[0].style.display = '';

	} else { 	
		
		
		var blue_gray = ['#3A70A6', '#F2F9FF'];
		

		addKhungSanPham('MỘT SỐ SẢN PHẨM NỔI BẬT', blue_gray, ['star=3'], 8);
	
	}
	
	addPricesRange(0, 2000000);
	addPricesRange(2000000, 4000000);
	addPricesRange(4000000, 7000000);
	addPricesRange(7000000, 13000000);
	addPricesRange(13000000, 0);
	

	addAllChoosedFilter();
};

var soLuongSanPhamMaxTrongMotTrang = 4;


var filtersFromUrl = { 
	company: '',
	search: '',
	price: '',
	promo: '',
	star: '',
	page: '',
	sort: {
		by: '',
		type: 'ascending'
	}
}

function getFilterFromURL() { 
	var fullLocation = window.location.href;
	fullLocation = decodeURIComponent(fullLocation);
	var dauHoi = fullLocation.split('?'); 

	if (dauHoi[1]) {
		var dauVa = dauHoi[1].split('&');
		return dauVa;
	}

	return [];
}

function phanTich_URL(filters, saveFilter) {
	
	var result = copyObject(list_products);

	for (var i = 0; i < filters.length; i++) {
		var dauBang = filters[i].split('=');

		switch (dauBang[0]) {
			case 'search':
				dauBang[1] = dauBang[1].split('+').join(' ');
				result = timKiemTheoTen(result, dauBang[1]);
				if (saveFilter) filtersFromUrl.search = dauBang[1];
				break;

			case 'price':
				if (saveFilter) filtersFromUrl.price = dauBang[1];

				var prices = dauBang[1].split('-');
				prices[1] = Number(prices[1]) || 1E10;
				result = timKiemTheoGiaTien(result, prices[0], prices[1]);
				break;

			case 'company':
				result = timKiemTheoCongTySanXuat(result, dauBang[1]);
				if (saveFilter) filtersFromUrl.company = dauBang[1];
				break;

			case 'page': 
				if (saveFilter) filtersFromUrl.page = dauBang[1];
				break;

		
		}
	}

	return result;
}


function addProduct(p, ele, returnString) {
	promo = new Promo(p.promo.name, p.promo.value); 
	product = new Product(p.masp, p.name, p.img, p.price, p.star, p.rateCount, promo); 

	return addToWeb(product, ele, returnString);
}


function addProductsFrom(list, vitri, soluong) {
	var start = vitri || 0;
	var end = (soluong ? start + soluong : list.length);
	for (var i = start; i < end; i++) {
		addProduct(list[i]);
	}
}

function clearAllProducts() {
	document.getElementById('products').innerHTML = "";
}


function addKhungSanPham(tenKhung, color, filter, len) {
	
	var gradient = `background-image: linear-gradient(120deg, ` + color[0] + ` 0%, ` + color[1] + ` 50%, ` + color[0] + ` 100%);`
	var borderColor = `border-color: ` + color[0];
	var borderA = `	border-left: 2px solid ` + color[0] + `;
					border-right: 2px solid ` + color[0] + `;`;


	var s = `<div class="khungSanPham" style="` + borderColor + `">
				<h3 class="tenKhung" style="` + gradient + `">* ` + tenKhung + ` *</h3>
				<div class="listSpTrongKhung flexContain">`;

	
	var spResult = phanTich_URL(filter, false);
	if (spResult.length < len) len = spResult.length;

	for (var i = 0; i < len; i++) {
		s += addProduct(spResult[i], null, true);
		
	}

	
	s += `	</div>
			<a class="xemTatCa" href="index.html?` + filter.join('&') + `" style="` + borderA + `">
				Xem tất cả ` + spResult.length + ` sản phẩm
			</a>
		</div> <hr>`;

	
	document.getElementsByClassName('contain-khungSanPham')[0].innerHTML += s;
}


function themNutPhanTrang(soTrang, trangHienTai) {
	var divPhanTrang = document.getElementsByClassName('pagination')[0];

	var k = createLinkFilter('remove', 'page'); 
	if (k.indexOf('?') > 0) k += '&';
	else k += '?'; 

	if (trangHienTai > 1) 
		divPhanTrang.innerHTML = `<a href="` + k + `page=` + (trangHienTai - 1) + `"><i class="fa fa-angle-left"></i></a>`;

	if (soTrang > 1) 
		for (var i = 1; i <= soTrang; i++) {
			if (i == trangHienTai) {
				divPhanTrang.innerHTML += `<a href="javascript:;" class="current">` + i + `</a>`

			} else {
				divPhanTrang.innerHTML += `<a href="` + k + `page=` + (i) + `">` + i + `</a>`
			}
		}

	if (trangHienTai < soTrang) { 
		divPhanTrang.innerHTML += `<a href="` + k + `page=` + (trangHienTai + 1) + `"><i class="fa fa-angle-right"></i></a>`
	}
}


function tinhToanPhanTrang(list, vitriTrang) {
	var sanPhamDu = list.length % soLuongSanPhamMaxTrongMotTrang;
	var soTrang = parseInt(list.length / soLuongSanPhamMaxTrongMotTrang) + (sanPhamDu ? 1 : 0);
	var trangHienTai = parseInt(vitriTrang < soTrang ? vitriTrang : soTrang);

	themNutPhanTrang(soTrang, trangHienTai);
	var start = soLuongSanPhamMaxTrongMotTrang * (trangHienTai - 1);

	var temp = copyObject(list);

	return temp.splice(start, soLuongSanPhamMaxTrongMotTrang);
}



function timKiemTheoCongTySanXuat(list, tenCongTy, soluong) {
	var count, result = [];
	if (soluong < list.length) count = soluong;
	else count = list.length;

	for (var i = 0; i < list.length; i++) {
		if (list[i].company.toUpperCase().indexOf(tenCongTy.toUpperCase()) >= 0) {
			result.push(list[i]);
			count--;
			if (count <= 0) break;
		}
	}

	return result;
}


function timKiemTheoGiaTien(list, giaMin, giaMax, soluong) {
	var count, result = [];
	if (soluong < list.length) count = soluong;
	else count = list.length;

	for (var i = 0; i < list.length; i++) {
		var gia = parseInt(list[i].price.split('.').join(''));
		if (gia >= giaMin && gia <= giaMax) {
			result.push(list[i]);
			count--;
			if (count <= 0) break;
		}
	}

	return result;
}

function addChoosedFilter(type, textInside) {
	var link = createLinkFilter('remove', type);
	var tag_a = `<a href="` + link + `"><h3>` + textInside + ` <i class="fas fa-times"></i> </h3></a>`;

	var divChoosedFilter = document.getElementsByClassName('choosedFilter')[0];
	divChoosedFilter.innerHTML += tag_a;

	var deleteAll = document.getElementById('deleteAllFilter');
	deleteAll.style.display = "block";
	deleteAll.href = window.location.href.split('?')[0];
}

function addAllChoosedFilter() {


	if (filtersFromUrl.company != '')
		addChoosedFilter('company', filtersFromUrl.company);

	if (filtersFromUrl.search != '')
		addChoosedFilter('search', '"' + filtersFromUrl.search + '"');

	if (filtersFromUrl.price != '') {
		var prices = filtersFromUrl.price.split('-');
		addChoosedFilter('price', priceToString(prices[0], prices[1]));
	}

	if (filtersFromUrl.promo != '')
		addChoosedFilter('promo', promoToString(filtersFromUrl.promo));

	if (filtersFromUrl.star != '')
		addChoosedFilter('star', starToString(filtersFromUrl.star));
}


function createLinkFilter(type, nameFilter, valueAdd) {
	var o = copyObject(filtersFromUrl);
	o.page = ''; 
	if (nameFilter == 'sort') {
		if (type == 'add') {
			o.sort.by = valueAdd.by;
			o.sort.type = valueAdd.type;

		} else if (type == 'remove') {
			o.sort.by = '';
		}

	} else {
		if (type == 'add') o[nameFilter] = valueAdd;
		else if (type == 'remove') o[nameFilter] = '';
	}

	var link = 'index.html'; 
	var h = false; 

	
	for (var i in o) {
		if (i != 'sort' && o[i]) {
			link += (h ? '&' : '?') + i + '=' + o[i];
			h = true;
		}
	}

	
	if (o.sort.by != '')
		link += (h ? '&' : '?') + 'sort=' + o.sort.by + '-' + o.sort.type;

	return link;
}


function alertNotHaveProduct(coSanPham) {
	var thongbao = document.getElementById('khongCoSanPham');
	if (!coSanPham) {
		thongbao.style.width = "auto";
		thongbao.style.opacity = "1";
		thongbao.style.margin = "auto"; // Căn giữa
		thongbao.style.transitionDuration = "1s"; // hiện ra từ từ

	} else {
		thongbao.style.width = "0";
		thongbao.style.opacity = "0";
		thongbao.style.margin = "0";
		thongbao.style.transitionDuration = "0s"; // Ngay lâp tức biến mất
	}
}





function addCompany(img, nameCompany) {
	var link = createLinkFilter('add', 'company', nameCompany);
	var new_tag = `<a href=` + link + `><img src=` + img + `></a>`;

	var khung_hangSanXuat = document.getElementsByClassName('companyMenu')[0];
	khung_hangSanXuat.innerHTML += new_tag;
}


function addPricesRange(min, max) {
	var text = priceToString(min, max);
	var link = createLinkFilter('add', 'price', min + '-' + max);

	var mucgia = `<a href="` + link + `">` + text + `</a>`;
	document.getElementsByClassName('pricesRangeFilter')[0]
		.getElementsByClassName('dropdown-content')[0].innerHTML += mucgia;
}


function priceToString(min, max) {
	if (min == 0) return 'Dưới ' + max / 1E6 + ' triệu';
	if (max == 0) return 'Trên ' + min / 1E6 + ' triệu';
	return 'Từ ' + min / 1E6 + ' - ' + max / 1E6 + ' triệu';
}

