import request from "@/http/request";
import tunnel from "@/http/tunnel";



export function setTunnelToUser(username, successCallback, errorCallback){
    return tunnel.get("/client/user_login/" + username)
      .then(() => {
        successCallback();
      })
      .catch(() => {
        errorCallback();
      })
}

export   function getFilterList(){
    return request.get("/project/getFilterList")
}

export   function getProjectList(page,type,model){
    let data = {
        pageNo:page,
        pageSize:request.pageSize,
        algorithmId:type,
        blockId:model
    }
    return request.post("/project/list",data,{
        headers:{
            "Content-Type":"application/json"
        }
    })
}

export   function projectCreate(data){
    let jsonData = {
        type: data.type,
        name: data.name,
        logo: data.logo
    }
    return request.post("/project/create", jsonData, {
        "Content-Type":"application/json"
    })
}

export   function projectDelete(id){
    return request.get("/project/delete?id="+id)
}

export const  pageSize = request.pageSize
