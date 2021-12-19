import React, { useState, useEffect } from 'react'
import DismissingAlert from "../../components/DismissingAlert/DismissingAlert";
import withIronSession from "../../helpers/customWithIronSession";
import { useRouter } from "next/router";
import Link from "next/link";
import { userApi } from "../../apis";

export const getServerSideProps = withIronSession(async ({ req, res, query }) => {
    const user = req.session.get("user");
    const { code } = query;
    if (user || !code) {
        res.writeHead(302, {
            Location: "/",
        });
        return res.end();
    }

    return { props: { code } };
});

export default function ResetPassword({ code }) {
    const [message, setMessage] = useState();
    const [password, setPassword] = useState();
    const [repeatPwd, setRepeatPwd] = useState();
    const [changePwdSuccess, setchangePwdSuccess] = useState(false);

    const displayMessage = (message, type) => {
        return (
            <DismissingAlert type={type} showTime={5000}>
                {message}
            </DismissingAlert>
        );
    };

    const handleChangePassword = async e => {
        e.preventDefault();
        
        if(password !== repeatPwd) 
            return setMessage(
                displayMessage(
                    "Mật khẩu bạn nhập không khớp nhau",
                    "warning"
                )
            );

        if(password.length < 8) 
            return setMessage(
                displayMessage(
                    "Vui lòng chọn mật khẩu có độ dài tối thiểu 8 ký tự",
                    "warning"
                )
            );

        const changePwdBtn = document.getElementById("change-pwd-btn");
        changePwdBtn.setAttribute("disabled", true);
        changePwdBtn.innerHTML = `
            <span class="spinner-border spinner-border-sm"></span>
            Đang đổi mật khẩu... 
        `;
    
        const { resetPassword: success } = await userApi.resetPassword(password, repeatPwd, code);

        if (success) 
            setchangePwdSuccess(true);
        else {
            setMessage(
                displayMessage(
                    "Có lỗi trong quá trình đăng ký tài khoản, vui lòng thử lại sau",
                    "danger"
                )
            );
        }
        changePwdBtn.removeAttribute("disabled");
        changePwdBtn.innerHTML = `Thay đổi mật khẩu`;
    };

    if(changePwdSuccess)
        return (
            <div id="logreg-forms">
                <form className="form-reset">
                    <h4 className="text-center"><h4 className="far fa-check-circle text-success mr-2"></h4> Thay đổi mật khẩu thành công</h4>
                    <Link href="/dang-nhap">
                        <button 
                            id="change-pw-btn" 
                            className="btn btn-success btn-block" 
                            type="submit"
                        >
                            Đăng nhập ngay
                        </button>
                    </Link>
                </form>
            </div>
        )

    return (
        <div id="logreg-forms">
            <form className="form-reset" onSubmit={handleChangePassword}>
                <h1 className="h3 mb-3 font-weight-normal text-center">
                    Nhập mật khẩu mới
                </h1>      
                { message }
                <input
                    type="password"
                    id="user-pass"
                    className="form-control mb-1"
                    placeholder="Mật khẩu mới"
                    required
                    onChange={e => setPassword(e.target.value)} 
                />
                <span 
                    toggle="#user-pass" 
                    className="fas fa-fw fa-eye fa-sm text-secondary field-icon toggle-password"
                    onClick={e => {
                        $(e.target).toggleClass("fa-eye fa-eye-slash");
                        var input = $($(e.target).attr("toggle"));
                        if (input.attr("type") == "password") {
                        input.attr("type", "text");
                        } else {
                        input.attr("type", "password");
                        }
                    }}
                ></span>
                <input
                    type="password"
                    id="user-repeatpass"
                    className="form-control"
                    placeholder="Xác nhận mật khẩu mới"
                    required
                    onChange={e => setRepeatPwd(e.target.value)} 
                />
                <span 
                    toggle="#user-repeatpass" 
                    className="fas fa-fw fa-eye fa-sm text-secondary field-icon toggle-password"
                    onClick={e => {
                        $(e.target).toggleClass("fa-eye fa-eye-slash");
                        var input = $($(e.target).attr("toggle"));
                        if (input.attr("type") == "password") {
                        input.attr("type", "text");
                        } else {
                        input.attr("type", "password");
                        }
                    }}
                ></span>
                <button 
                    id="change-pwd-btn" 
                    className="btn btn-primary btn-block" 
                    type="submit"
                    disabled={!(password && repeatPwd)}
                >
                Thay đổi mật khẩu
                </button>
            </form>
        </div>
    );
}
