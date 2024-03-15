import request from "@/http/request";


export   function getCusList(page){
    let data = {
        pageNo:page,
        pageSize:request.pageSize
    }
    return request.post("/course/list",data,{
        headers:{
            "Content-Type":"application/json"
        }
    })
}

export   function createCus(data){
    let jsonData = {
        name: data.name,
        cover: data.cover
    }
    return request.post("/course/create", jsonData, {
        "Content-Type":"application/json"
    })
}

export   function deleteCus(id){
    return request.get("/course/delete?id="+id)
}

export const  pageSize = request.pageSize