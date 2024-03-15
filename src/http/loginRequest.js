import request from "@/http/request";


export   function loginOrRegister(login,data){
    let url = login?'/user/login':'/user/register'
    return request.post(url,data,{
        headers:{
            "Content-Type":"application/json"
        }
    })
}