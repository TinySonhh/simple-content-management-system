//https://www.w3schools.com/bootstrap4/bootstrap_ref_js_modal.asp
//$("#myModal").modal()
//.modal("show")
//.modal("hide")
//on: show.bs.modal, shown.bs.modal
//  hide.bs.modal,hidden.bs.modal


//The Modal Confirmation
class ModalConfirmation {
    static MODAL_ID = "#modalConfirmation";
    static MODAL_TEMPLATE = `
    <div class="my-modal modal fade" id="modalConfirmation" role="dialog" data-backdrop="static">
        <div class="modal-dialog modal-dialog-centered my-modal-style"  role="document">
            <div class="modal-content shadow">

                <!-- Modal Header -->
                <div class="modal-header p-2 bg-light">
                    <h5 class="modal-title text-dark px-2">Need to confirm</h5>
                    <button type="button" class="close d-none" data-dismiss="modal">×</button>
                </div>

                <!-- Modal body -->
                <div class="modal-body text-dark ">
                    <div class="text"></div>
                </div>

                <!-- Modal footer -->
                <div class="modal-footer p-2 bg-light">
                    <button type="button" class="btn-later btn btn-secondary" data-dismiss="modal">&nbsp;Later&nbsp;</button>
                    <button type="button" class="btn-confirm btn btn-success" data-dismiss="modal">&nbsp;Confirm&nbsp;</button>                
                </div>

            </div>
        </div>
    </div>
    `

    /**
     * Modal Popup confirm method to replace system confirm function.
     * @param {*} title Default empty.
     * @param {*} confirmationText Default empty.
     * @param {*} confirmText Optional.
     * @param {*} laterText Optional.
     * @returns Promise that will perform the action. Remember to handle its result using then() and catch()
     * * `then( (confirmed)=>{ } )` : Required. Used to handle the confirmation result (resolved with true/false)
     * * `catch( (error)=>{ } )` : Optional. Used to handle error...
     */
    static confirm(confirmationText="", title="", forWarning = false, forSuccess = false, confirmText="", laterText = "", allowCatching = false){
        return new Promise((resolve, reject) => {
            let modal = $(ModalConfirmation.MODAL_TEMPLATE).appendTo('body');
            let modalId = `${ModalConfirmation.MODAL_ID}-${Date.now()}`;
            modal.attr('id', modalId);

            if(title==null || title.trim()==""){
                modal.find('.modal-header').hide()
            } else {
                modal.find('.modal-header').show()
            }

            const modalTitle = modal.find('.modal-header .modal-title')
            modalTitle.toggleClass('text-danger', forWarning);
            modalTitle.toggleClass('text-success', forSuccess);
            modalTitle.text(title)
            modal.find('.modal-body .text').html(DOMPurify.sanitize(confirmationText))

            if(confirmText==null || confirmText.trim()==""){
                confirmText = "Confirm"
            }
            if(laterText==null || laterText.trim()==""){
                laterText = "Later"
            }

            const confirmButton = modal.find('.modal-footer .btn-confirm');
            confirmButton.toggleClass('btn-danger', forWarning);
            confirmButton.toggleClass('btn-success', forSuccess);
            confirmButton.toggleClass('btn-primary', !(forWarning && forSuccess));

            confirmButton.html(`&nbsp;${AntiHacking.jsEscape(confirmText)}&nbsp;`)
            confirmButton.off('click')
            confirmButton.on('click', (event)=>{
                resolve && resolve(true)
            })
            
            const confirmLater = modal.find('.modal-footer .btn-later');
            confirmLater.html(`&nbsp;${AntiHacking.jsEscape(laterText)}&nbsp;`)
            confirmLater.off('click')
            confirmLater.on('click', (event)=>{
                resolve && resolve(false)
                allowCatching && reject && reject("User didn't confirm.")
            })

            modal.find('.modal-header .close').off('click')
            modal.find('.modal-header .close').on('click', (event)=>{
                allowCatching && reject && reject("User rejected.")
            })

            modal.on('hidden.bs.modal', (event) => { modal.remove(); });

            modal.modal('show')            
        })
    }

    static confirmSuccess(confirmationText="", title="", confirmText="", laterText = "", allowCatching = false){
        return ModalConfirmation.confirm(confirmationText, title, false, true, confirmText, laterText, allowCatching)
    }
    static confirmDangerous(confirmationText="", title="", confirmText="", laterText = "", allowCatching = false){
        return ModalConfirmation.confirm(confirmationText, title, true, false, confirmText, laterText, allowCatching)
    }
}


//The Modal Prompt
class ModalPrompt {
    static MODAL_ID = "#modalPrompt";
    static MODAL_TEMPLATE = `
        <div class="my-modal modal fade" id="modalPrompt" role="dialog" data-backdrop="static">
        <div class="modal-dialog modal-dialog-centered my-modal-style">
            <div class="modal-content shadow">

                <div class="modal-header p-2 bg-light">
                    <h5 class="modal-title text-dark px-2">Enter name</h5>
                    <button type="button" class="close d-none" data-dismiss="modal" aria-label="Close">
                        <span>&times;</span>
                    </button>
                </div>
                
                <div class="modal-body text-dark ">
                    <p class="text"></p>                    
                    <select id="prompt_select_value" class="prompt_select_value mb-2 form-control d-none"></select>
                    <div class="or-more-text d-none">More detail if possible:</div>
                    <input type="text" class="prompt-value form-control" id="prompt_value" placeholder="Enter your message">
                </div>
                
                <div class="modal-footer p-2 bg-light">
                    <button type="button" class="btn-later btn btn-secondary" data-dismiss="modal">&nbsp;Later&nbsp;</button>
                    <button type="button" class="btn-confirm btn btn-primary" id="confirm-prompt" data-dismiss="modal">&nbsp;Confirm&nbsp;</button>
                </div>

            </div>
        </div>
    </div>
    `

    /**
     * Modal Popup prompt method to replace system prompt function.
     * @param {*} messageText Message explaining
     * @param {*} defaultValue Suggestion value to user input. Optional.
     * @param {*} title Optional.
     * @param {*} confirmText Optional.
     * @param {*} laterText Optional.
     * @returns Promise that will perform the action. Remember to handle its result using then() and catch()
     * * `then( (promptValue)=>{ } )` : Required. Used to handle the prompt value.
     * * `catch( (error)=>{ } )` : Optional. Used to handle when user rejects, cancel, error...
     */
    static prompt(messageText="", defaultValue="", title="", confirmText="", laterText = "", allowCatching = false, forWarning = false){
        return new Promise((resolve, reject) => {
            let modal = $(ModalPrompt.MODAL_TEMPLATE).appendTo('body');
            let modalId = `${ModalPrompt.MODAL_ID}-${Date.now()}`;
            modal.attr('id', modalId);

            if(title==null || title.trim()==""){
                modal.find('.modal-header').hide()
            } else {
                modal.find('.modal-header').show()
            }

            if(confirmText==null || confirmText.trim()==""){
                confirmText = "Confirm"
            }
            if(laterText==null || laterText.trim()==""){
                laterText = "Later"
            }

            modal.find('.modal-header .modal-title').toggleClass('text-danger', forWarning)
            modal.find('.modal-header .modal-title').toggleClass('text-dark', !forWarning)

            modal.find('.modal-header .modal-title').text(title)
            modal.find('.modal-body .text').html(DOMPurify.sanitize(messageText))
            modal.find('.modal-body .prompt-value').val(defaultValue)
            modal.find('.modal-body .prompt-value').toggleClass('d-none', false)            
            modal.find('.modal-body .or-more-text').toggleClass('d-none', true)
            modal.find('.modal-body .prompt_select_value').toggleClass('d-none', true)
            modal.find('.modal-body .prompt_select_value').html("")

            const confirmButton = modal.find('.modal-footer .btn-confirm');
            confirmButton.toggleClass('btn-danger', forWarning)
            confirmButton.toggleClass('btn-primary', !forWarning)
            confirmButton.html(`&nbsp;${AntiHacking.jsEscape(confirmText)}&nbsp;`)
            confirmButton.off('click')
            confirmButton.on('click', (event)=>{
                let promptValue = modal.find('.modal-body .prompt-value').val()
                resolve && resolve(promptValue)
            })
            
            const confirmLater = modal.find('.modal-footer .btn-later');
            confirmLater.html(`&nbsp;${AntiHacking.jsEscape(laterText)}&nbsp;`)
            confirmLater.off('click')
            confirmLater.on('click', (event)=>{    
                allowCatching && reject && reject("User rejected.")            
            })

            modal.find('.modal-header .close').off('click')
            modal.find('.modal-header .close').on('click', (event)=>{
                allowCatching && reject && reject("User rejected.")          
            })

            modal.on('hidden.bs.modal', (event) => { modal.remove(); });

            modal.modal('show')
        })
    }
    static promptDangerous(messageText="", defaultValue="", title="", confirmText="", laterText = ""){
        return this.prompt(messageText, defaultValue, title, confirmText, laterText, false, true)
    }

    static promptSelect(messageText="", options=[], title="", confirmText="", laterText = "", allowCatching = false, forWarning = false){
        return new Promise((resolve, reject) => {
            let modal = $(ModalPrompt.MODAL_TEMPLATE).appendTo('body');
            let modalId = `${ModalPrompt.MODAL_ID}-${Date.now()}`;
            modal.attr('id', modalId);

            if(title==null || title.trim()==""){
                modal.find('.modal-header').hide()
            } else {
                modal.find('.modal-header').show()
            }

            if(confirmText==null || confirmText.trim()==""){
                confirmText = "Confirm"
            }
            if(laterText==null || laterText.trim()==""){
                laterText = "Later"
            }

            modal.find('.modal-header .modal-title').toggleClass('text-danger', forWarning)
            modal.find('.modal-header .modal-title').toggleClass('text-dark', !forWarning)

            modal.find('.modal-header .modal-title').text(title)
            modal.find('.modal-body .text').html(DOMPurify.sanitize(messageText))
            modal.find('.modal-body .prompt-value').toggleClass('d-none', false)
            modal.find('.modal-body .or-more-text').toggleClass('d-none', false)
            modal.find('.modal-body .prompt_select_value').toggleClass('d-none', false)
            modal.find('.modal-body .prompt_select_value').val(DOMPurify.sanitize(options[0]))
            let theSelect = modal.find('.modal-body .prompt_select_value');
            theSelect.html("")
            options.forEach((item, index)=>{
                theSelect.append(`<option value="${DOMPurify.sanitize(item)}">${item}</option>`)
            })

            const confirmButton = modal.find('.modal-footer .btn-confirm');
            confirmButton.toggleClass('btn-danger', forWarning)
            confirmButton.toggleClass('btn-primary', !forWarning)
            confirmButton.html(`&nbsp;${AntiHacking.jsEscape(confirmText)}&nbsp;`)
            confirmButton.off('click')
            confirmButton.on('click', (event)=>{
                let promptValue = theSelect.val() + ": " + modal.find('.modal-body .prompt-value').val()
                resolve && resolve(promptValue)
            })
            
            const confirmLater = modal.find('.modal-footer .btn-later');
            confirmLater.html(`&nbsp;${AntiHacking.jsEscape(laterText)}&nbsp;`)
            confirmLater.off('click')
            confirmLater.on('click', (event)=>{    
                allowCatching && reject && reject("User rejected.")            
            })

            modal.find('.modal-header .close').off('click')
            modal.find('.modal-header .close').on('click', (event)=>{
                allowCatching && reject && reject("User rejected.")          
            })

            modal.on('hidden.bs.modal', (event) => { modal.remove(); });

            modal.modal('show')
        })
    }
    static promptSelectDangerous(messageText="", options=[], title="", confirmText="", laterText = ""){
        return this.promptSelect(messageText, options, title, confirmText, laterText, false, true)
    }
}


//The Modal Alert
class ModalAlert {
    static MODAL_ID = "#modalAlert";
    static MODAL_TEMPLATE = `
    <div class="my-modal modal fade" id="modalAlert" role="dialog" data-backdrop="static">
        <div class="modal-dialog modal-dialog-centered my-modal-style" role="document">        
            <div class="modal-content shadow">

                <div class="modal-header p-2 bg-light">
                    <h5 class="modal-title px-2 text-dark">Alert Title</h5>
                    <button type="button" class="close d-none" data-dismiss="modal" aria-label="Close">
                        <span >&times;</span>
                    </button>
                </div>
                
                <div class="modal-body text-dark ">
                    <div class="text" id="alert_message"></div>
                </div>
                
                <div class="modal-footer p-2 bg-light">                
                    <button type="button" class="btn-confirm btn btn-primary" id="confirm-prompt" data-dismiss="modal">&nbsp;Ok&nbsp;</button>
                </div>

            </div>
        </div>
    </div>`

    static alert( messageText="", title="", confirmText="", forWarning = false, forSuccess = false){
        return new Promise((resolve) => {
            let modal = $(ModalAlert.MODAL_TEMPLATE).appendTo('body');
            let modalId = `${ModalAlert.MODAL_ID}-${Date.now()}`;
            modal.attr('id', modalId);

            if(title==null || title.trim()==""){
                modal.find('.modal-header').hide()
            } else {
                modal.find('.modal-header').show()
            }

            const modalTitle = modal.find('.modal-header .modal-title')
            modalTitle.toggleClass('text-dark', !forWarning);
            modalTitle.toggleClass('text-danger', forWarning);
            modalTitle.toggleClass('text-success', forSuccess);
            modalTitle.text(title)
            modal.find('.modal-body .text').html(DOMPurify.sanitize(messageText))
            
            if(confirmText==null || confirmText.trim()==""){
                confirmText = "Ok"
            }

            const confirmButton = modal.find('.modal-footer .btn-confirm');
            confirmButton.toggleClass('btn-danger', forWarning);
            confirmButton.toggleClass('btn-primary', !(forWarning && forSuccess));
            confirmButton.toggleClass('btn-success', forSuccess);

            confirmButton.html(`&nbsp;${AntiHacking.jsEscape(confirmText)}&nbsp;`)
            confirmButton.off('click')
            confirmButton.on('click', (event)=>{
                resolve && resolve()
            })
            modal.find('.modal-header .close').off('click')
            modal.find('.modal-header .close').on('click', (event)=>{
                resolve && resolve()
            })
            
            modal.on('hidden.bs.modal', (event) => { modal.remove(); });

            modal.modal('show')
        })
    }

    static alertSuccess( messageText="", title="", confirmText=""){
        return ModalAlert.alert(messageText, title, confirmText, false, true)
    }
    static alertDangerous( messageText="", title="", confirmText=""){
        return ModalAlert.alert(messageText, title, confirmText, true)
    }
}

class ModalPopup {
    static confirm = ModalConfirmation.confirm
    static confirmSuccess = ModalConfirmation.confirmSuccess
    static confirmDangerous = ModalConfirmation.confirmDangerous
    static prompt = ModalPrompt.prompt    
    static promptDangerous = ModalPrompt.promptDangerous    
    static promptSelect = ModalPrompt.promptSelect
    static promptSelectDangerous = ModalPrompt.promptSelectDangerous
    static alert = ModalAlert.alert
    static alertSuccess = ModalAlert.alertSuccess
    static alertDangerous = ModalAlert.alertDangerous
}
