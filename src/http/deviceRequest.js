import request from "@/http/request";


export   function getDevList(page){
    let data = {
        pageNo:page,
        pageSize:request.pageSize
    }
    return request.post("/device/list",data,{
        headers:{
            "Content-Type":"application/json"
        }
    })
}

export   function createDev(data){
    let formData = new FormData();
    formData.append("name",data.name)
    formData.append("sn",data.sn)
    return request.post("/device/create",formData,{
        'Content-Type': 'multipart/form-data',
    })
}

export   function deleteDev(id){
    return request.get("/device/delete?id="+id)
}

export const  pageSize = request.pageSize