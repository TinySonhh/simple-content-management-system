////////////////////////////////////////
//#region TOAST POPUPS
////////////////////////////////////////

class ToastPopup{

    static intervalClose = -1
    static _showInternal(message="", type="info", timeToLive=3000, stickToElement=null){
        let createDiv = ()=>{
            let div = `<style>
                .w-toast-auto {width: 80% !important}
                @media (min-width:576px) {
                    .w-toast-auto {width: 50% !important}
                }
            </style>` 
            +   `<div id="toastx_message" class="form-group d-flex align-content-center alert alert-${type} rounded p-2 my-1 text-left d-none w-toast-auto px-2 shadow" style="position: fixed;bottom: 10vh; left:50%; transform: translateX(-50%); z-index: 600005;" 
                onclick="clearInterval(this.intervalClose);showHideObject('#toastx_message', false);">`
            +   `   <span class="icon align-content-center fa fa-info-circle fa-2x px-1"></span>`
            +   `   <div class="text align-content-center"></div>`
            +   `   <span class="-close pointer px-1" style="position: absolute; right:0;top:0rem;">&times;</span>`            
            +   `</div>`
            
            let found = hasObject("#toastx_message")
            if(!found){
                $('body').append(div)
            }
        }

        createDiv()
    
        let foundObject  = $('#toastx_message').length > 0
        if (!foundObject) {
            console.log('#toastx_message not found.')
            return;
        }
    
        let icon = "info-circle"

        if(type=="waiting"){
            type = "info"
            icon = "spinner fa-spin"
        }

        showHideObject('#toastx_message')

        $('#toastx_message').removeClass('alert-dark alert-info alert-danger alert-primary alert-warning')
        $('#toastx_message').addClass(`alert-${type}`)

        $('#toastx_message .icon').removeClass('fa-info-circle fa-question-circle fa-exclamation-triangle fa-check-circle')
        
        if(type == "danger" || type == "warning"){
            icon = "exclamation-triangle"
        }
        else if(type == "success" || type == "primary"){
            icon = "check-circle"
        }

        $('#toastx_message .icon').addClass(`fa-${icon}`)
        $('#toastx_message .text').html(message)
        
        if(stickToElement){
            stickToElement = $(stickToElement)
            $('#toastx_message').css('top', stickToElement?.offset().top + stickToElement?.height() + 5)
            $('#toastx_message').css('bottom','auto')
        } else {
            $('#toastx_message').css('top','auto')
            $('#toastx_message').css('bottom','10vh')
        }

        let rect = toastx_message.getBoundingClientRect()
        if(rect.bottom>window.innerHeight){
            $('#toastx_message').css('top', stickToElement?.offset().top - $('#toastx_message').height() - 5)
        }
    
        clearInterval(this.intervalClose)
        this.intervalClose = setTimeout(() => {
            if(isObjectVisible('#toastx_message')){
                showHideObject('#toastx_message', false)
            }
        }, timeToLive);
    }

    static primary(message, timeToLive=3000, stickToElement=null){    
        ToastPopup._showInternal(message, 'primary', timeToLive, stickToElement)
    }
    static dark(message, timeToLive=3000, stickToElement=null){    
        ToastPopup._showInternal(message, 'dark', timeToLive, stickToElement)
    }
    static info(message, timeToLive=3000, stickToElement=null){    
        ToastPopup._showInternal(message, 'info', timeToLive, stickToElement)
    }
    static success(message, timeToLive=3000, stickToElement=null){    
        ToastPopup._showInternal(message, 'success', timeToLive, stickToElement)
    }
    static warning(message, timeToLive=3000, stickToElement=null){    
        ToastPopup._showInternal(message, 'warning', timeToLive, stickToElement)
    }
    static error(message, timeToLive=3000, stickToElement=null){    
        ToastPopup._showInternal(message, 'danger', timeToLive, stickToElement)
    }
    static waiting(text="Please wait..."){
        ToastPopup._showInternal(text, "waiting") 
    }
    
    static hide(){
        showHideObject('#toastx_message', false)
        $('#toastx_message .text').html('')
    }

}

class Toast extends ToastPopup {
    
}
////////////////////////////////////////
//#endregion TOAST POPUPS
////////////////////////////////////////

window.Toast = Toast;