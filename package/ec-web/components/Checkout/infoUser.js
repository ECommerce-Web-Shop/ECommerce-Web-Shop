import { gql } from '@apollo/client'
import Header from '../Header/Header'
import { Fragment, useEffect, useState } from "react";
import Link from 'next/link';
import axios from 'axios';
import TinhThanh from './TinhThanh';

const infoUser = () => {
    useEffect(()=>
    {

        var main = document.getElementById("TinhThanh");    
        var code = document.getElementById("Code")
        var subs= document.getElementById("QuanHuyen");
        main.addEventListener('change',()=>
        {    

            fetch("https://provinces.open-api.vn/api/d/")
            .then(function(resp){
                return resp.json();
            })
            .then(function(data){
                while(subs.options.length>0)
                {
                    subs.options.remove(0);
                }
                var htmls= data.map(function(data){
                    
                    if (data.province_code==code.options[main.selectedIndex].text)
                    {
                        let option = new Option(data.name,data.name);
                        subs.appendChild(option);
                    }
                });
            })
            .catch(function(err){
            });
        })
    })

    const [user, setUser] = useState();
    useEffect(async () => {
        try {
            // Declare query & its variables
            const query = `
                    query {
                        me: customMe {
                            id,
                            username,
                            name,
                            phone,
                            email
                        }
                    }
				`;

            const { data: responseData } = await axios({
                method: "POST",
                url: "/api/graphql",
                headers: {
                    "Content-Type": "application/json",
                },
                data: {
                    type: "query",
                    query,
                },
            });
            console.log("This is user information");
            const { data } = responseData;
            console.log(data);

            setUser(data.me);
        } catch {
            return false;
        }
    }, []);
    if (user) {
        return (
            <div>
                <div class="formItem py-3">
                    <label htmlFor="">Họ và tên</label>
                    <input type="text" class="form-control" id="name" defaultValue={user.name} name="name" required></input>
                </div>
                <div class="formItem py-3">
                    <label htmlFor="">Số điện thoại</label>
                    <input type="text" class="form-control" id="phone" name="phone" defaultValue={user.phone} required  ></input>
                </div>

                <div class="formItem py-3">
                    <label htmlFor="">Email</label>
                    <input type="text" class="form-control" id="mail" name="mail" placeholder=""  defaultValue={user.email} required></input>
                </div>
                <TinhThanh></TinhThanh>
                <div className="formItem py-3">
                    <label htmlFor="">Địa chỉ chi tiết</label>
                    <input type="text" className="form-control" name="address3" id="address3" required defaultValue="" />
                </div>
            </div>
        )
    }
    else {
        return (
            <div>
                <div className="formItem py-3">
                    <label htmlFor="">Họ và tên</label>
                    <input type="text" className="form-control" name="name" id="name" required defaultValue="" />
                </div>
                <div className="formItem py-3">
                    <label htmlFor="">Số điện thoại</label>
                    <input type="text" className="form-control" name="phone" id="phone" required defaultValue="" />
                </div>
                <div className="formItem py-3">
                    <label htmlFor="">Email</label>
                    <input type="text" className="form-control" name="mail" id="mail" required defaultValue="" />
                </div>
                <TinhThanh>
                </TinhThanh>
                <div className="formItem py-3">
                    <label htmlFor="">Địa chỉ chi tiết</label>
                    <input type="text" className="form-control" name="address3" id="address3" required defaultValue="" />
                </div>
            </div>
        )
    }
}

export default infoUser;