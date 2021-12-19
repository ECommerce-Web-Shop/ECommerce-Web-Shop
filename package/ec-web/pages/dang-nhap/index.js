import React, { useState, useEffect, useRef } from "react";
import DismissingAlert from "../../components/DismissingAlert/DismissingAlert";
import { signIn } from "../../helpers/auth";
import withIronSession from "../../helpers/customWithIronSession";
import { useRouter } from "next/router";
import Link from "next/link";
import { userApi } from "../../apis";

export const getServerSideProps = withIronSession(async ({ req, res }) => {
    const user = req.session.get("user");
    if (user) {
        res.writeHead(302, {
            Location: "/",
        });
        return res.end();
    }

    return { props: {} };
});

export default function Login() {
    const [loginMessage, setLoginMessage] = useState();
    const [registerMessage, setRegisterMessage] = useState();
    const [forgetPwMessage, setForgetPwMessage] = useState();
    const [lgUsername, setLgUsername] = useState();
    const [lgPw, setLgPw] = useState();
    const [rgCustomerName, setRgCustomerName] = useState();
    const [rgCustomerNameIsValid, setRgCustomerNameIsValid] = useState(false);
    const [rgEmail, setRgEmail] = useState();
    const [rgEmailIsValid, setRgEmailIsValid] = useState(false);
    const [rgEmailTooltip, setRgEmailTooltip] = useState();
    const [rgPhone, setRgPhone] = useState();
    const [rgPhoneIsValid, setRgPhoneIsValid] = useState(false);
    const [rgPhoneTooltip, setRgPhoneTooltip] = useState();
    const [rgUsername, setRgUsername] = useState();
    const [rgUsernameIsValid, setRgUsernameIsValid] = useState(false);
    const [rgUsernameTooltip, setRgUsernameTooltip] = useState();
    const [rgPw, setRgPw] = useState();
    const [rgRepeatPw, setRgRepeatPw] = useState();
    const [fpEmail, setFpEmail] = useState();
    const [fpEmailIsValid, setFpEmailIsValid] = useState(false);
    const [fpEmailTooltip, setFpEmailTooltip] = useState();
    const [page, setPage] = useState("login");
    const backBtn = useRef();
    const registerForm = useRef();
    const router = useRouter();

    const handleLogin = async e => {
        e.preventDefault();

        const loginBtn = document.getElementById("login-btn");
        loginBtn.setAttribute("disabled", true);
        loginBtn.innerHTML = `
            <span class="spinner-border spinner-border-sm"></span>
            Đang đăng nhập... 
        `;

        const { success, error } = await signIn(lgUsername, lgPw);

        
        loginBtn.removeAttribute("disabled");
        loginBtn.innerHTML = `<i class="fas fa-sign-in-alt mr-1"></i> Đăng nhập`;

        if (success)
            return router.push({
                pathname: "/",
            });
       
        if(error === "Not confirmed")
            return setLoginMessage(
                displayMessage(
                    (<>Tài khoản của bạn chưa được xác nhận. <a href="#" onClick={handleResendConfirmedEmail}>Gửi lại email xác nhận?</a></>),
                    "warning"
                )
            );
        
        return setLoginMessage(
            displayMessage(
                "Tên tài khoản hoặc mật khẩu không chính xác",
                "danger"
            )
        );
    };

    const handleRegister = async e => {
        e.preventDefault();
        
        if(rgPw !== rgRepeatPw) 
            return setRegisterMessage(
                displayMessage(
                    "Mật khẩu bạn nhập không khớp nhau",
                    "warning"
                )
            );

        if(rgPw.length < 8) 
            return setRegisterMessage(
                displayMessage(
                    "Vui lòng chọn mật khẩu có độ dài tối thiểu 8 ký tự",
                    "warning"
                )
            );

        if(!rgCustomerNameIsValid)
            return setRegisterMessage(
                displayMessage(
                    "Họ tên bạn nhập quá ngắn",
                    "danger"
                )
            );

        if(!rgEmailIsValid)
            return setRegisterMessage(
                displayMessage(
                    rgEmailTooltip,
                    "danger"
                )
            );

        if(!rgPhoneIsValid)
            return setRegisterMessage(
                displayMessage(
                    rgPhoneTooltip,
                    "danger"
                )
            );

        if(!rgUsernameIsValid)
            return setRegisterMessage(
                displayMessage(
                    rgUsernameTooltip,
                    "danger"
                )
            );

        const registerBtn = document.getElementById("register-btn");
        registerBtn.setAttribute("disabled", true);
        registerBtn.innerHTML = `
            <span class="spinner-border spinner-border-sm"></span>
            Đang đăng ký... 
        `;
    
        const { register: success } = await userApi.register(rgCustomerName, rgEmail, rgPhone, rgUsername, rgPw);

        if (success) {
            setLoginMessage(
                displayMessage(
                    "Tạo tài khoản thành công, vui lòng xác nhận tài khoản trước khi đăng nhập",
                    "success"
                )
            );
            registerForm.current.reset();
            setRgCustomerNameIsValid();
            setRgEmailIsValid();
            setRgPhoneIsValid();
            setRgUsernameIsValid();
            backBtn.current.click();
        }
        else {
            setRegisterMessage(
                displayMessage(
                    "Có lỗi trong quá trình đăng ký tài khoản, vui lòng thử lại sau",
                    "danger"
                )
            );
        }
        registerBtn.removeAttribute("disabled");
        registerBtn.innerHTML = `<i class="fas fa-user-plus mr-2"></i> Đăng ký ngay`;
    };

    const handleForgetPassword = async e => {
        e.preventDefault();

        if(!fpEmailIsValid)
            return setForgetPwMessage(
                displayMessage(
                    fpEmailTooltip,
                    "danger"
                )
            );
        
        const forgetPwBtn = document.getElementById("forget-pw-btn");
        forgetPwBtn.setAttribute("disabled", true);
        forgetPwBtn.innerHTML = `
            <span class="spinner-border spinner-border-sm"></span>
            Đang yêu cầu... 
        `;
        const {forgotPassword: success} = await userApi.forgetPassword(fpEmail);

        forgetPwBtn.removeAttribute("disabled");
        forgetPwBtn.innerHTML = `Yêu cầu thay đổi mật khẩu`;

        console.log(success);

        if(success)
            return setForgetPwMessage(
                displayMessage(
                    "Thành công, vui lòng kiểm tra email của bạn",
                    "success"
                )
            );
              
        return setForgetPwMessage(
            displayMessage(
                "Có lỗi xảy ra với hệ thống, vui lòng thử lại sau ít phút",
                "danger"
            )
        );
    };

    const handleResendConfirmedEmail = async () => {
        if(await userApi.resendConfirmedEmail(fpEmail))
            return setLoginMessage(
                displayMessage(
                    "Thành công, vui lòng kiểm tra email của bạn",
                    "success"
                )
            );

        return setLoginMessage(
            displayMessage(
                (<>Có lỗi xảy ra trong quá trình gửi mail xác nhận, vui lòng <a href="#" onClick={handleResendConfirmedEmail}>thử lại</a></>),
                "danger"
            )
        );
    }

    const displayMessage = (message, type) => {
        return (
            <DismissingAlert type={type} showTime={5000}>
                {message}
            </DismissingAlert>
        );
    };

    const changeToResetPswdPage = e => {
        e.preventDefault();
        setPage("reset-password");
    };
    
    const changeToRegisterPage = e => {
        e.preventDefault();
        setPage("register");
    };
    
    const changeToLoginPage = e => {
        e.preventDefault();
        setPage("login");
    };

    let form;
    if(page === "login") 
        form = (
            <form className="form-signin" id="form-signin" onSubmit={handleLogin} onKeyPress={
                e => {
                    if (e.which === 13 && page === "login") 
                        return handleLogin(e);
                }
            }>
                <h1
                    className="h3 mb-3 font-weight-normal"
                    style={{ textAlign: "center" }}
                >
                    Đăng nhập
                </h1>
                { loginMessage }
                <div className="social-login">
                    <button
                        className="btn facebook-btn social-btn mr-1"
                        type="button"
                    >
                        <span>
                            <i className="fab fa-facebook-f mr-1" /> Đăng nhập
                            Facebook
                        </span>
                    </button>
                    <Link href="http://localhost:1337/connect/google">
                        <button className="btn google-btn social-btn" type="button">
                            <span>
                                <i className="fab fa-google-plus-g mr-1" /> Đăng nhập
                                Google+
                            </span>
                        </button>
                    </Link>
                </div>
                <p style={{ textAlign: "center" }}> Hoặc</p>
                <input
                    type="text"
                    id="inputUsername"
                    className="form-control mb-1"
                    placeholder="Tên tài khoản"
                    required
                    autoFocus
                    onChange= {e => setLgUsername(e.target.value)}
                    value={lgUsername}
                />
                <input
                    type="password"
                    id="inputPassword"
                    className="form-control mb-1"
                    placeholder="Mật khẩu"
                    required
                    onChange= {e => setLgPw(e.target.value)}
                    value={lgPw}
                />
                <span 
                    toggle="#inputPassword" 
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
                    id="login-btn" 
                    className="btn btn-success btn-block mb-1" 
                    type="button"
                    disabled={
                        !(lgUsername && lgPw)
                    }
                    onClick={handleLogin}
                >
                    <i className="fas fa-sign-in-alt mr-1" /> Đăng nhập
                </button>
                <hr />
                <button
                    className="btn btn-primary btn-block"
                    type="submit"
                    id="btn-signup"
                    onClick={changeToRegisterPage}
                >
                    <i className="fas fa-user-plus mr-1" /> Đăng ký tài khoản mới
                </button>
                <button
                    className="btn btn-info btn-block"
                    type="submit"
                    onClick={changeToResetPswdPage}
                >
                    <i className="fas fa-lock mr-1" /> Quên mật khẩu?
                </button>
                <Link href="/">
                    <a className="text-center">Quay về trang chủ</a>
                </Link>
            </form>
        );
        
    if(page === "reset-password") 
        form = (
            <form className="form-reset" onSubmit={handleForgetPassword} onKeyPress={
                e => {
                    if (e.which === 13 && page === "reset-password") 
                        return handleForgetPassword(e);
                }
            }>
                <h1 className="h3 mb-3 font-weight-normal text-center">
                    Quên mật khẩu
                </h1>
                {forgetPwMessage}      
                <input
                    type="email"
                    id="user-email"
                    className="form-control"
                    placeholder="Địa chỉ email"
                    required
                    data-toggle="tooltip" 
                    data-placement="top"
                    title={ fpEmailTooltip }
                    onChange={async e => {
                        const email = e.target.value;
                        setFpEmail(email);

                        if(!validateEmail(email)) {
                            setFpEmailIsValid(false);
                            setFpEmailTooltip("Email này không hợp lệ");
                            return;
                        }

                        const { data: {valid: isValid} } = await userApi.isValidEmail(email);
                        setFpEmailIsValid(isValid);

                        if(isValid)
                            setFpEmailTooltip();
                        else
                            setFpEmailTooltip("Email này không tồn tại trên hệ thống");
                    }}
                />
                {
                    fpEmail ? (
                        (fpEmailIsValid) ? 
                            <span className="fas fa-fw fa-check fa-sm text-success field-icon"></span> :
                            <span className="fas fa-fw fa-times fa-sm text-danger field-icon"></span>
                    ) : ""
                }
                <button 
                    id="forget-pw-btn" 
                    className="btn btn-primary btn-block" 
                    type="submit"
                    disabled={!(fpEmail && fpEmailIsValid)}
                >
                    Yêu cầu thay đổi mật khẩu
                </button>
                <a href="#" id="cancel_reset" onClick={changeToLoginPage}>
                    <i className="fas fa-angle-left" /> Quay lại
                </a>
            </form>
        );

    if(page === "register") 
        form = (
            <form className="form-signup" id="form-signup" onSubmit={handleRegister} ref={registerForm} onKeyPress={
                e => {
                    if (e.which === 13 && page === "register") 
                        return handleRegister(e);
                }
            }>
                <h1
                    className="h3 mb-3 font-weight-normal"
                    style={{ textAlign: "center" }}
                >
                    Đăng ký
                </h1>
                { registerMessage }
                <div className="social-login">
                    <Link href="http://localhost:1337/connect/google">
                        <button
                            className="btn facebook-btn social-btn mb-2"
                            type="button"
                        >
                            <span>
                                <i className="fab fa-facebook-f mr-2" /> Đăng nhập bằng
                                Facebook
                            </span>
                        </button>
                    </Link>
                </div>
                <div className="social-login">
                    <Link href="http://localhost:1337/connect/google">
                        <button className="btn google-btn social-btn mb-2" type="button">
                            <span>
                                <i className="fab fa-google-plus-g mr-2" /> Đăng nhập bằng
                                Google+
                            </span>{" "}
                        </button>
                    </Link>
                </div>
                <p style={{ textAlign: "center" }}>Hoặc</p>
                <input
                    type="text"
                    id="user-name"
                    className="form-control"
                    placeholder="Họ và tên"
                    required
                    autoFocus
                    onChange={e => {
                        const customerName = e.target.value;
                        setRgCustomerName(customerName);

                        if(customerName.length > 1)
                            return setRgCustomerNameIsValid(true);

                        return setRgCustomerNameIsValid(false);
                    }}
                />
                {
                    rgCustomerName ? (
                        (rgCustomerNameIsValid) ? 
                            <span className="fas fa-fw fa-check fa-sm text-success field-icon"></span> :
                            <span className="fas fa-fw fa-times fa-sm text-danger field-icon"></span>
                    ) : ""
                }
                <input
                    type="email"
                    id="user-email"
                    className="form-control"
                    placeholder="Email"
                    required
                    data-toggle="tooltip" 
                    data-placement="top"
                    title={ rgEmailTooltip }
                    onChange={async e => {
                        const email = e.target.value;
                        setRgEmail(email);

                        if(!validateEmail(email)) {
                            setRgEmailIsValid(false);
                            setRgEmailTooltip("Email này không hợp lệ");
                            return;
                        }

                        const { data: {valid: isValid} } = await userApi.isAvailableEmail(email);
                        setRgEmailIsValid(isValid);

                        if(isValid)
                            setRgEmailTooltip();
                        else
                            setRgEmailTooltip("Email này đã được đăng ký trước đó");
                    }}
                />
                {
                    rgEmail ? (
                        (rgEmailIsValid) ? 
                            <span className="fas fa-fw fa-check fa-sm text-success field-icon"></span> :
                            <span className="fas fa-fw fa-times fa-sm text-danger field-icon"></span>
                    ) : ""
                }
                <input
                    type="text"
                    id="user-phone"
                    className="form-control"
                    placeholder="Số điện thoại"
                    required
                    data-toggle="tooltip" 
                    data-placement="top"
                    title={ rgPhoneTooltip }
                    onChange={e => {
                        const phone = e.target.value;
                        const pattern = /^[0-9]$/;

                        if(pattern.test(phone[phone.length - 1]))
                            setRgPhone(phone);
                        else
                            e.target.value = phone.slice(0, phone.length - 1);

                        if(phone.length < 10) {
                            setRgPhoneTooltip("Số điện thoại này không hợp lệ");
                            return setRgPhoneIsValid(false);
                        }
                        
                        setRgPhoneTooltip();
                        return setRgPhoneIsValid(true);
                    }}
                />
                {
                    rgPhone ? (
                        (rgPhoneIsValid) ? 
                            <span className="fas fa-fw fa-check fa-sm text-success field-icon"></span> :
                            <span className="fas fa-fw fa-times fa-sm text-danger field-icon"></span>
                    ) : ""
                }
                <input
                    type="text"
                    id="user-username"
                    className="form-control"
                    placeholder="Tên tài khoản"
                    required
                    data-toggle="tooltip" 
                    data-placement="top"
                    title={ rgUsernameTooltip }
                    onChange={async e => {
                        const username = e.target.value;
                        setRgUsername(username);

                        const { data: {valid: isValid}} = await userApi.isAvailableUsername(username);
                        setRgUsernameIsValid(isValid);

                        if(isValid)
                            setRgUsernameTooltip();
                        else
                            setRgUsernameTooltip("Tên tài khoản này đã được đăng ký trước đó");
                    }}
                />
                {
                    rgUsername ? (
                        (rgUsernameIsValid) ? 
                            <span className="fas fa-fw fa-check fa-sm text-success field-icon"></span> :
                            <span className="fas fa-fw fa-times fa-sm text-danger field-icon"></span>
                    ) : ""
                }
                <input
                    type="password"
                    id="user-pass"
                    className="form-control"
                    placeholder="Mật khẩu"
                    required
                    onChange={e => setRgPw(e.target.value)} 
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
                    placeholder="Xác nhận mật khẩu"
                    required
                    onChange={e => setRgRepeatPw(e.target.value)} 
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
                <button id="register-btn" className="btn btn-primary btn-block" type="submit">
                    <i className="fas fa-user-plus mr-2" /> Đăng ký ngay
                </button>
                <a href="#" id="cancel_signup" ref={backBtn} onClick={changeToLoginPage}>
                    <i className="fas fa-angle-left mr-2" /> Quay lại
                </a>
            </form>
        );

    return (
        <div id="logreg-forms">
            { form }
        </div>
    )
}

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
