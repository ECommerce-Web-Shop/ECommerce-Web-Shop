import React, { useContext, createContext } from "react";

const ModalContext = createContext();

export default function Modal({
    title,
    body,
    id,
    confirmStyle,
    cancelStyle,
    callback,
    onlyConfirm,
}) {
    const displayBody = () => {
        if (body)
            return (
                <div className="modal-body">
                    <p>{body}</p>
                </div>
            );

        return;
    };
    return (
        <div className="modal" id={`${id}`} tabIndex={-1} role="dialog">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h6 className="modal-title">{title}</h6>
                        <button
                            type="button"
                            className="close"
                            data-dismiss="modal"
                            aria-label="Close"
                        >
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    {displayBody()}
                    <div className="modal-footer">
                        <button
                            id="yesBtn"
                            type="button"
                            className={`btn btn-${confirmStyle || "success"}`}
                            onClick={async e => {
                                if(typeof callback === 'function')
                                    await callback(e);
                                    
                                $(`#${id}`).modal("hide");
                                $('body').removeClass('modal-open');
                                $('.modal-backdrop').remove();
                            }}
                        >
                            Đồng ý
                        </button>
                        {(onlyConfirm === true) ? ("") :(
                            <button
                                type="button"
                                className={`btn btn-${cancelStyle || "danger"}`}
                                data-dismiss="modal"
                            >
                                Hủy bỏ
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
