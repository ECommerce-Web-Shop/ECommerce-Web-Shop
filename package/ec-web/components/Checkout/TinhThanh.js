

const TinhThanh = () =>
{

    fetch("https://provinces.open-api.vn/api/p/")
    .then(function(resp){
        return resp.json();
    })
    .then(function(data){
        var main = document.getElementById("TinhThanh");    
        var code=  document.getElementById("Code");    
        while(main.options.length>0)
                {
                    main.options.remove(0);
                }
        var htmls= data.map(function(data){
            let option = new Option(data.name,data.name);
            main.appendChild(option);
            let option2=new Option(data.code);
            code.appendChild(option2);
        });
    })
    .catch(function(err){
    });

    fetch("https://provinces.open-api.vn/api/d/")
    .then(function(resp){
        return resp.json();
    })
    .then(function(data){
        var subs = document.getElementById("QuanHuyen");    
        while(subs.options.length>0)
                {
                    subs.options.remove(0);
                }
        var htmls= data.map(function(data){
            if (data.province_code == 1)
            {
                let option = new Option(data.name,data.name);
                subs.appendChild(option);
            }
        });
    })
    .catch(function(err){
    });



    return(
        <div>
            <div className="formItem py-3">
                <label for="">Tỉnh/ Thành Phố</label>
                <select class="form-control" aria-label="Default select example" name="calc_shipping_provinces" id="TinhThanh" required="">
                </select>
            </div>
            <select name="calc_shipping_provinces" id="Code" hidden required="">
            </select>
            <div className="formItem py-3">
                <label for="">Quận/ Huyện</label>
                <select class="form-control" aria-label="Default select example" name="calc_shipping_district" id="QuanHuyen" required="">
                </select>
            </div>
        </div>
        
  
    )
}

export default TinhThanh;