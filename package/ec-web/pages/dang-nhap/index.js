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
            ??ang ????ng nh???p... 
        `;

        const { success, error } = await signIn(lgUsername, lgPw);

        
        loginBtn.removeAttribute("disabled");
        loginBtn.innerHTML = `<i class="fas fa-sign-in-alt mr-1"></i> ????ng nh???p`;

        if (success)
            return router.push({
                pathname: "/",
            });
       
        if(error === "Not confirmed")
            return setLoginMessage(
                displayMessage(
                    (<>T??i kho???n c???a b???n ch??a ???????c x??c nh???n. <a href="#" onClick={handleResendConfirmedEmail}>G???i l???i email x??c nh???n?</a></>),
                    "warning"
                )
            );
        
        return setLoginMessage(
            displayMessage(
                "T??n t??i kho???n ho???c m???t kh???u kh??ng ch??nh x??c",
                "danger"
            )
        );
    };

    const handleRegister = async e => {
        e.preventDefault();
        
        if(rgPw !== rgRepeatPw) 
            return setRegisterMessage(
                displayMessage(
                    "M???t kh???u b???n nh???p kh??ng kh???p nhau",
                    "warning"
                )
            );

        if(rgPw.length < 8) 
            return setRegisterMessage(
                displayMessage(
                    "Vui l??ng ch???n m???t kh???u c?? ????? d??i t???i thi???u 8 k?? t???",
                    "warning"
                )
            );

        if(!rgCustomerNameIsValid)
            return setRegisterMessage(
                displayMessage(
                    "H??? t??n b???n nh???p qu?? ng???n",
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
            ??ang ????ng k??... 
        `;
    
        const { register: success } = await userApi.register(rgCustomerName, rgEmail, rgPhone, rgUsername, rgPw);

        if (success) {
            setLoginMessage(
                displayMessage(
                    "T???o t??i kho???n th??nh c??ng, vui l??ng x??c nh???n t??i kho???n tr?????c khi ????ng nh???p",
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
                    "C?? l???i trong qu?? tr??nh ????ng k?? t??i kho???n, vui l??ng th??? l???i sau",
                    "danger"
                )
            );
        }
        registerBtn.removeAttribute("disabled");
        registerBtn.innerHTML = `<i class="fas fa-user-plus mr-2"></i> ????ng k?? ngay`;
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
            ??ang y??u c???u... 
        `;
        const {forgotPassword: success} = await userApi.forgetPassword(fpEmail);

        forgetPwBtn.removeAttribute("disabled");
        forgetPwBtn.innerHTML = `Y??u c???u thay ?????i m???t kh???u`;

        console.log(success);

        if(success)
            return setForgetPwMessage(
                displayMessage(
                    "Th??nh c??ng, vui l??ng ki???m tra email c???a b???n",
                    "success"
                )
            );
              
        return setForgetPwMessage(
            displayMessage(
                "C?? l???i x???y ra v???i h??? th???ng, vui l??ng th??? l???i sau ??t ph??t",
                "danger"
            )
        );
    };

    const handleResendConfirmedEmail = async () => {
        if(await userApi.resendConfirmedEmail(fpEmail))
            return setLoginMessage(
                displayMessage(
                    "Th??nh c??ng, vui l??ng ki???m tra email c???a b???n",
                    "success"
                )
            );

        return setLoginMessage(
            displayMessage(
                (<>C?? l???i x???y ra trong qu?? tr??nh g???i mail x??c nh???n, vui l??ng <a href="#" onClick={handleResendConfirmedEmail}>th??? l???i</a></>),
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
                    ????ng nh???p
                </h1>
                { loginMessage }
                <div className="social-login">
                    <button
                        className="btn facebook-btn social-btn mr-1"
                        type="button"
                    >
                        <span>
                            <i className="fab fa-facebook-f mr-1" /> ????ng nh???p
                            Facebook
                        </span>
                    </button>
                    <Link href="http://localhost:1337/connect/google">
                        <button className="btn google-btn social-btn" type="button">
                            <span>
                                <i className="fab fa-google-plus-g mr-1" /> ????ng nh???p
                                Google+
                            </span>
                        </button>
                    </Link>
                </div>
                <p style={{ textAlign: "center" }}> Ho???c</p>
                <input
                    type="text"
                    id="inputUsername"
                    className="form-control mb-1"
                    placeholder="T??n t??i kho???n"
                    required
                    autoFocus
                    onChange= {e => setLgUsername(e.target.value)}
                    value={lgUsername}
                />
                <input
                    type="password"
                    id="inputPassword"
                    className="form-control mb-1"
                    placeholder="M???t kh???u"
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
                    <i className="fas fa-sign-in-alt mr-1" /> ????ng nh???p
                </button>
                <hr />
                <button
                    className="btn btn-primary btn-block"
                    type="submit"
                    id="btn-signup"
                    onClick={changeToRegisterPage}
                >
                    <i className="fas fa-user-plus mr-1" /> ????ng k?? t??i kho???n m???i
                </button>
                <button
                    className="btn btn-info btn-block"
                    type="submit"
                    onClick={changeToResetPswdPage}
                >
                    <i className="fas fa-lock mr-1" /> Qu??n m???t kh???u?
                </button>
                <Link href="/">
                    <a className="text-center">Quay v??? trang ch???</a>
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
                    Qu??n m???t kh???u
                </h1>
                {forgetPwMessage}      
                <input
                    type="email"
                    id="user-email"
                    className="form-control"
                    placeholder="?????a ch??? email"
                    required
                    data-toggle="tooltip" 
                    data-placement="top"
                    title={ fpEmailTooltip }
                    onChange={async e => {
                        const email = e.target.value;
                        setFpEmail(email);

                        if(!validateEmail(email)) {
                            setFpEmailIsValid(false);
                            setFpEmailTooltip("Email n??y kh??ng h???p l???");
                            return;
                        }

                        const { data: {valid: isValid} } = await userApi.isValidEmail(email);
                        setFpEmailIsValid(isValid);

                        if(isValid)
                            setFpEmailTooltip();
                        else
                            setFpEmailTooltip("Email n??y kh??ng t???n t???i tr??n h??? th???ng");
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
                    Y??u c???u thay ?????i m???t kh???u
                </button>
                <a href="#" id="cancel_reset" onClick={changeToLoginPage}>
                    <i className="fas fa-angle-left" /> Quay l???i
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
                    ????ng k??
                </h1>
                { registerMessage }
                <div className="social-login">
                    <Link href="http://localhost:1337/connect/google">
                        <button
                            className="btn facebook-btn social-btn mb-2"
                            type="button"
                        >
                            <span>
                                <i className="fab fa-facebook-f mr-2" /> ????ng nh???p b???ng
                                Facebook
                            </span>
                        </button>
                    </Link>
                </div>
                <div className="social-login">
                    <Link href="http://localhost:1337/connect/google">
                        <button className="btn google-btn social-btn mb-2" type="button">
                            <span>
                                <i className="fab fa-google-plus-g mr-2" /> ????ng nh???p b???ng
                                Google+
                            </span>{" "}
                        </button>
                    </Link>
                </div>
                <p style={{ textAlign: "center" }}>Ho???c</p>
                <input
                    type="text"
                    id="user-name"
                    className="form-control"
                    placeholder="H??? v?? t??n"
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
                            setRgEmailTooltip("Email n??y kh??ng h???p l???");
                            return;
                        }

                        const { data: {valid: isValid} } = await userApi.isAvailableEmail(email);
                        setRgEmailIsValid(isValid);

                        if(isValid)
                            setRgEmailTooltip();
                        else
                            setRgEmailTooltip("Email n??y ???? ???????c ????ng k?? tr?????c ????");
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
                    placeholder="S??? ??i???n tho???i"
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
                            setRgPhoneTooltip("S??? ??i???n tho???i n??y kh??ng h???p l???");
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
                    placeholder="T??n t??i kho???n"
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
                            setRgUsernameTooltip("T??n t??i kho???n n??y ???? ???????c ????ng k?? tr?????c ????");
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
                    placeholder="M???t kh???u"
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
                    placeholder="X??c nh???n m???t kh???u"
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
                    <i className="fas fa-user-plus mr-2" /> ????ng k?? ngay
                </button>
                <a href="#" id="cancel_signup" ref={backBtn} onClick={changeToLoginPage}>
                    <i className="fas fa-angle-left mr-2" /> Quay l???i
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
