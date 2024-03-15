import request from "@/http/request";


export   function getUserList(page){
    let data = {
        pageNo:page,
        pageSize:request.pageSize
    }
    return request.post("/user/list",data,{
        headers:{
            "Content-Type":"application/json"
        }
    })
}

export   function batchCreateUser(param){
    let data = {
        userType: param.userType,
        prefix: param.prefix,
        startNo: param.startNo,
        count: param.count
    }
    return request.post("/user/create/batch",data,{
        headers:{
            "Content-Type":"application/json"
        }
    })
}

export   function deleteUser(id){
    return request.get("/user/delete?id="+id)
}

export const  pageSize = request.pageSize