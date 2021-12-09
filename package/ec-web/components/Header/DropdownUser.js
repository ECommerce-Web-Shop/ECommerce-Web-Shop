/* This example requires Tailwind CSS v2.0+ */
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { userApi } from "../../apis";
import { signOut } from "../../helpers/auth";
import Link from "next/link";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function DropdownUser() {
    const [user, setUser] = useState();
    const router = useRouter();

    // Fetch user information
    useEffect(async () => {
        try {
            const { data } = await userApi.me();
            setUser(data.me);
        } catch {
            return false;
        }
    }, []);

    // Handle sign out 
    const handleSignOut = async () => {
        if(await signOut()) {
            // router.reload();
            localStorage.clear();
            router.push("/dang-nhap");
        }
    }

    if (user) {
        return (
            <Menu as="div" className="relative inline-block text-left">
                {({ open }) => (
                    <>
                        <Menu.Button className="d-inline-block justify-center rounded-md text-center btn btn--no-outline p-0">
                            <i
                                className=" mr-3 fa fa-user fa--sm"
                                aria-hidden="true"
                            ></i>
                            Xin chào, {user.username}
                        </Menu.Button>

                        <Transition
                            show={open}
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items
                                static
                                className="dropMenu bg-light font-weight-solid origin-top-right position-absolute top-20 mt-2 w-56 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none"
                                style={{ zIndex: 10000000 }}
                            >
                                <div className="py-2 ">
                                    <Menu.Item>
                                        {({ active }) => (
                                            <a
                                                href="/thong-tin-khach-hang"
                                                className={classNames(
                                                    active
                                                        ? "bg-dark-100 text-light"
                                                        : "text-dark",
                                                    "block px-3 py-2 text-sm text-dark"
                                                )}
                                            >
                                                <i
                                                    className="fa fa-edit pr-2 "
                                                    aria-hidden="true"
                                                />
                                                Tài khoản của tôi
                                            </a>
                                        )}
                                    </Menu.Item>
                                </div>
                                <div className="py-2">
                                    <Menu.Item>
                                        {({ active }) => (
                                            <a
                                                href="/yeu-thich"
                                                className={classNames(
                                                    active
                                                    ? "bg-dark-100 text-light"
                                                    : "text-dark",
                                                "block px-3 py-2 text-sm text-dark"
                                                )}
                                            >
                                                <i
                                                    className="fa fa-heart pr-2"
                                                    aria-hidden="true"
                                                />
                                                Sản phẩm yêu thích 
                                            </a>
                                        )}
                                    </Menu.Item>
                                </div>
                                <div className="py-2">
                                    <Menu.Item>
                                        {({ active }) => (
                                            <a
                                                href="#"
                                                className={classNames(
                                                    active
                                                        ? "bg-dark-100 text-light"
                                                        : "text-dark",
                                                    "block px-3 py-2 text-sm text-dark"
                                                )}
                                            >
                                                <i
                                                    className="fa fa-history pr-2"
                                                    aria-hidden="true"
                                                />
                                                Đơn hàng
                                            </a>
                                        )}
                                    </Menu.Item>
                                </div>
                                <div className="py-2">
                                    <Menu.Item>
                                        {({ active }) => (
                                            <a
                                                href="#"
                                                onClick={handleSignOut}
                                                className={classNames(
                                                    active
                                                        ? "bg-dark-100 text-light"
                                                        : "text-dark",
                                                    "block px-3 py-2 text-sm text-dark"
                                                )}
                                            >
                                                <i
                                                    className="fas fa-sign-out-alt pr-2 "
                                                    aria-hidden="true"
                                                />
                                                Đăng xuất
                                            </a>
                                        )}
                                    </Menu.Item>
                                </div>
                            </Menu.Items>
                        </Transition>
                    </>
                )}
            </Menu>
        );
    } else
        return (
            <Link href="/dang-nhap">
                <a className="text-dark">
                    Đăng nhập
                </a>
            </Link>
        );
}
