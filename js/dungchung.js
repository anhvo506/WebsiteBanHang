function khoiTao() {
    
    list_products = getListProducts() || list_products;
  
    setupEventTaiKhoan();
    capNhat_ThongTin_CurrentUser();
    
}


function setListProducts(newList) {
    window.localStorage.setItem('ListProducts', JSON.stringify(newList));
}

function getListProducts() {
    return JSON.parse(window.localStorage.getItem('ListProducts'));
}

function timKiemTheoTen(list, ten) {
    var tempList = copyObject(list);
    var result = [];
    ten = ten.split(' ');

    for (var sp of tempList) {
        var correct = true;
        for (var t of ten) {
            if (sp.name.toUpperCase().indexOf(t.toUpperCase()) < 0) {
                correct = false;
                break;
            }
        }
        if (correct) {
            result.push(sp);
        }
    }

    return result;
}

function timKiemTheoMa(list, ma) {
    for (var l of list) {
        if (l.masp == ma) return l;
    }
}

function copyObject(o) {
    return JSON.parse(JSON.stringify(o));
}

function addAlertBox(text, bgcolor, textcolor, time) {
    var al = document.getElementById('alert');
    al.childNodes[0].nodeValue = text;
    al.style.backgroundColor = bgcolor;
    al.style.opacity = 1;
    al.style.zIndex = 200;

    if (textcolor) al.style.color = textcolor;
    if (time)
        setTimeout(function () {
            al.style.opacity = 0;
            al.style.zIndex = 0;
        }, time);
}


function animateCartNumber() {
    var cn = document.getElementsByClassName('cart-number')[0];
    cn.style.transform = 'scale(2)';
    cn.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
    cn.style.color = 'white';
    setTimeout(function () {
        cn.style.transform = 'scale(1)';
        cn.style.backgroundColor = 'transparent';
        cn.style.color = 'red';
    }, 1200);
}

function themVaoGioHang(masp, tensp) {
    var user = getCurrentUser();
    if (!user) {
        alert('Bạn cần đăng nhập để mua hàng !');
        showTaiKhoan(true);
        return;
    }
   
    var t = new Date();
    var daCoSanPham = false;;

    for (var i = 0; i < user.products.length; i++) { 
        if (user.products[i].ma == masp) {
            user.products[i].soluong++;
            daCoSanPham = true;
            break;
        }
    }

    if (!daCoSanPham) { 
        user.products.push({
            "ma": masp,
            "soluong": 1,
            "date": t
        });
    }

    animateCartNumber();
    addAlertBox('Đã thêm ' + tensp + ' vào giỏ.', '#17c671', '#fff', 3500);

    setCurrentUser(user); 
    updateListUser(user); 
    capNhat_ThongTin_CurrentUser(); 
}


function getCurrentUser() {
    return JSON.parse(window.localStorage.getItem('CurrentUser')); 
}

function setCurrentUser(u) {
    window.localStorage.setItem('CurrentUser', JSON.stringify(u));
}


function getListUser() {
    var data = JSON.parse(window.localStorage.getItem('ListUser')) || []
    var l = [];
    for (var d of data) {
        l.push(d);
    }
    return l;
}

function setListUser(l) {
    window.localStorage.setItem('ListUser', JSON.stringify(l));
}

function updateListUser(u, newData) {
    var list = getListUser();
    for (var i = 0; i < list.length; i++) {
        if (equalUser(u, list[i])) {
            list[i] = (newData ? newData : u);
        }
    }
    setListUser(list);
}

function logIn(form) {
   
    var name = form.username.value;
    var pass = form.pass.value;
    var newUser = new User(name, pass);

   
    var listUser = getListUser();

    
    for (var u of listUser) {
        if (equalUser(newUser, u)) {
            setCurrentUser(u);

          
            location.reload();
            return false;
        }
    }

  

    alert('Nhập sai tên hoặc mật khẩu !!!');
    form.username.focus();
    return false;
}

function signUp(form) {
    var ho = form.ho.value;
    var ten = form.ten.value;
    var sdt = form.sdt.value;
    var username = form.newUser.value;
    var pass = form.newPass.value;
    var newUser = new User(username, pass, ho, ten, sdt);

   
    var listUser = getListUser();

    

   
    for (var u of listUser) {
        if (newUser.username == u.username) {
            alert('Tên đăng nhập đã có người sử dụng !!');
            return false;
        }
    }

   
    listUser.push(newUser);
    window.localStorage.setItem('ListUser', JSON.stringify(listUser));

    
    window.localStorage.setItem('CurrentUser', JSON.stringify(newUser));
    alert('Đăng kí thành công, Bạn sẽ được tự động đăng nhập!');
    location.reload();

    return false;
}

function logOut() {
    window.localStorage.removeItem('CurrentUser');
    location.reload();
}


function showTaiKhoan(show) {
    var value = (show ? "scale(1)" : "scale(0)");
    var div = document.getElementsByClassName('containTaikhoan')[0];
    div.style.transform = value;
}


function checkTaiKhoan() {
    if (!getCurrentUser()) {
        showTaiKhoan(true);
    }
}


function setupEventTaiKhoan() {
    var taikhoan = document.getElementsByClassName('taikhoan')[0];
    var list = taikhoan.getElementsByTagName('input');

    ['blur', 'focus'].forEach(function (evt) {
        for (var i = 0; i < list.length; i++) {
            list[i].addEventListener(evt, function (e) {
                var label = this.previousElementSibling; 
                if (e.type === 'blur') { 
                    if (this.value === '') { 
                        label.classList.remove('active');
                        label.classList.remove('highlight');
                    } else { 
                        label.classList.remove('highlight');
                    }
                } else if (e.type === 'focus') { 
                    label.classList.add('active');
                    label.classList.add('highlight');
                }
            });
        }
    })

   
    var tab = document.getElementsByClassName('tab');
    for (var i = 0; i < tab.length; i++) {
        var a = tab[i].getElementsByTagName('a')[0];
        a.addEventListener('click', function (e) {
            e.preventDefault(); 

           
            this.parentElement.classList.add('active');

            
            if (this.parentElement.nextElementSibling) {
                this.parentElement.nextElementSibling.classList.remove('active');
            }
        
            if (this.parentElement.previousElementSibling) {
                this.parentElement.previousElementSibling.classList.remove('active');
            }

          
            var target = this.href.split('#')[1];
            document.getElementById(target).style.display = 'block';

            var hide = (target == 'login' ? 'signup' : 'login');
            document.getElementById(hide).style.display = 'none';
        })
    }

    
}


function capNhat_ThongTin_CurrentUser() {
    var u = getCurrentUser();
    if (u) {
        
        document.getElementsByClassName('cart-number')[0].innerHTML = getTongSoLuongSanPhamTrongGioHang(u);
       
        document.getElementsByClassName('member')[0]
            .getElementsByTagName('a')[0].childNodes[2].nodeValue = ' ' + u.username;
       
        document.getElementsByClassName('menuMember')[0]
            .classList.remove('hide');
    }
}


function getTongSoLuongSanPhamTrongGioHang(u) {
    var soluong = 0;
    for (var p of u.products) {
        soluong += p.soluong;
    }
    return soluong;
}


function getSoLuongSanPhamTrongUser(tenSanPham, user) {
    for (var p of user.products) {
        if (p.name == tenSanPham)
            return p.soluong;
    }
    return 0;
}


function numToString(num, char) {
    return num.toLocaleString().split(',').join(char || '.');
}

function stringToNum(str, char) {
    return Number(str.split(char || '.').join(''));
}


function autocomplete(inp, arr) {
    var currentFocus;

    inp.addEventListener("keyup", function (e) {
        if (e.keyCode != 13 && e.keyCode != 40 && e.keyCode != 38) { 
            var a, b, i, val = this.value;

            closeAllLists();
            if (!val) {
                return false;
            }
            currentFocus = -1;

           
            a = document.createElement("DIV");
            a.setAttribute("id", this.id + "autocomplete-list");
            a.setAttribute("class", "autocomplete-items");

          
            this.parentNode.appendChild(a);

           
            for (i = 0; i < arr.length; i++) {
              
                if (arr[i].name.substr(0, val.length).toUpperCase() == val.toUpperCase()) {

                   
                    b = document.createElement("DIV");

                    
                    b.innerHTML = "<strong>" + arr[i].name.substr(0, val.length) + "</strong>";
                    b.innerHTML += arr[i].name.substr(val.length);

                    
                    b.innerHTML += "<input type='hidden' value='" + arr[i].name + "'>";

                   
                    b.addEventListener("click", function (e) {
                       
                        inp.value = this.getElementsByTagName("input")[0].value;
                        inp.focus();

                       
                        closeAllLists();
                    });
                    a.appendChild(b);
                }
            }
        }

    });
   
    inp.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            
            currentFocus++;
          
            addActive(x);
        } else if (e.keyCode == 38) {
           
            currentFocus--;
          
            addActive(x);
        } else if (e.keyCode == 13) {
           

            if (currentFocus > -1) {
                
                if (x) {
                    x[currentFocus].click();
                    e.preventDefault();
                }
            }
        }
    });

    function addActive(x) {
       
        if (!x) return false;
        
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
       
        x[currentFocus].classList.add("autocomplete-active");
    }

    function removeActive(x) {
      
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }

    function closeAllLists(elmnt) {
       
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
   
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}




function addHeader() {
    document.write(`        
	<div class="header group">
        <div class="logo">
            <a href="index.html">
                <img src="img/logo.png" title="Trang chủ PhoneStore">
            </a>
        </div> <!-- End Logo -->
        
        <div class="content">
            <div class="search-header">
                <form class="input-search" method="get" action="index.html">
                    <div class="autocomplete">
                        <input id="search-box" name="search" autocomplete="off" type="text" placeholder="Nhập từ khóa tìm kiếm...">
                        <button type="submit">
                            <i class="fa fa-search"></i>
                            Tìm kiếm
                        </button>
                    </div>
                </form> <!-- End Form search -->
               
            </div> <!-- End Search header -->

            <div class="tools-member">
                <div class="member">
                    <a onclick="checkTaiKhoan()">
                        <i class="fa fa-user"></i>
                        Tài khoản
                    </a>
                    <div class="menuMember hide">
                        <a href="nguoidung.html">Trang người dùng</a>
                        <a onclick="if(window.confirm('Xác nhận đăng xuất ?')) logOut();">Đăng xuất</a>
                    </div>

                </div> <!-- End Member -->

                <div class="cart">
                    <a href="giohang.html">
                        <i class="fa fa-shopping-cart"></i>
                        <span>Giỏ hàng</span>
                        <span class="cart-number"></span>
                    </a>
                </div> <!-- End Cart -->

                <!--<div class="check-order">
                    <a>
                        <i class="fa fa-truck"></i>
                        <span>Đơn hàng</span>
                    </a>
                </div> -->
            </div><!-- End Tools Member -->
        </div> <!-- End Content -->
    </div> <!-- End Header -->`)
}

function addFooter() {
    document.write(`

    <!-- ============== Alert Box ============= -->
    <div id="alert">
        <span id="closebtn">&otimes;</span>
    </div>

    <div class="footer">
    

    <div class="footer-item">
        <div class="copy-right">
        
            <p><a href="index.html">PhoneStore</p></a>
    
        </div>
        <div class="item-header">
            Liên hệ:
            <div class="item-line"></div>
        </div>
        <div class="item-body">
            
            <div class="item-icon">
                <i class="fas fa-phone-alt"></i>
                072.3456.789
            </div>
            <div class="item-icon">
                <i class="fas fa-envelope"></i>
                
                <span class="item-gmail">vomaianhthpt@gmail.com</span>
            
            </div>
        </div>
    </div>
</div>
`);
}


function addContainTaiKhoan() {
    document.write(`
	<div class="containTaikhoan">
        <span class="close" onclick="showTaiKhoan(false);">&times;</span>
        <div class="taikhoan">

            <ul class="tab-group">
                <li class="tab active"><a href="#login">Đăng nhập</a></li>
                <li class="tab"><a href="#signup">Đăng kí</a></li>
            </ul> <!-- /tab group -->

            <div class="tab-content">
                <div id="login">
                   

                    <form onsubmit="return logIn(this);">

                        <div class="field-wrap">
                            <label>
                                Tên đăng nhập<span class="req">*</span>
                            </label>
                            <input name='username' type="text" required autocomplete="off" />
                        </div> <!-- /user name -->

                        <div class="field-wrap">
                            <label>
                                Mật khẩu<span class="req">*</span>
                            </label>
                            <input name="pass" type="password" required autocomplete="off" />
                        </div> <!-- pass -->

                      

                        <button type="submit" class="button button-block" />Login</button>

                    </form> <!-- /form -->

                </div> <!-- /log in -->

                <div id="signup">
                    

                    <form onsubmit="return signUp(this);">

                        <div class="top-row">
                            <div class="field-wrap">
                                <label>
                                    Họ<span class="req">*</span>
                                </label>
                                <input name="ho" type="text" required autocomplete="off" />
                            </div>

                            <div class="field-wrap">
                                <label>
                                    Tên<span class="req">*</span>
                                </label>
                                <input name="ten" type="text" required autocomplete="off" />
                            </div>
                        </div> <!-- / ho ten -->

                        <div class="field-wrap">
                            <label>
                                Số điện thoại<span class="req">*</span>
                            </label>
                            <input type="text" id="phone" name="sdt" value="" required autocomplete="off"/>
                            
                        </div> <!-- /sdt -->

                        <div class="field-wrap">
                            <label>
                                Tên đăng nhập<span class="req">*</span>
                            </label>
                            <input id="username" name="newUser" type="text" required autocomplete="off" />
                        </div> <!-- /user name -->

                        <div class="field-wrap">
                            <label>
                                Mật khẩu<span class="req">*</span>
                            </label>
                            <input name="newPass" type="password" required autocomplete="off" />
                        </div> <!-- /pass -->

                        <button type="submit" onclick="return validate();" class="button button-block" />Tạo tài khoản</button>

                    </form> <!-- /form -->

                </div> <!-- /sign up -->
            </div><!-- tab-content -->

        </div> <!-- /taikhoan -->
    </div>`);
}
function getValue(id){
    return document.getElementById(id).value.trim();
}
function validate() {
    var flag = true;
    var phone = getValue('phone');
    if (phone != '' &&  !/^[0-9]{10}$/.test(phone)){
        flag = false;
        alert('Vui lòng kiểm tra lại số điện thoại');
    }
    return flag;
}


function gotoTop() {     
        document.documentElement.scrollTop = 0; 
    
}


