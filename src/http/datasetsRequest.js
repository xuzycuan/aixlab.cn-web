import request from "@/http/request";


export   function getDatasetsListR(page, _type){
    let data = {
        pageNo:page,
        pageSize:request.pageSize,
        type:_type
    }
    return request.post("/datasets/list",data,{
        headers:{
            "Content-Type":"application/json"
        }
    })
}

export   function createDatasetsR(data){
    let jsonData = {
        type: data.typeValue,
        name: data.name,
        cover: data.cover
    }
    return request.post("/datasets/create", jsonData, {
        "Content-Type":"application/json"
    })
}

export   function deleteDatasetsR(id){
    return request.get("/datasets/delete?id="+id)
}

export const  pageSize = request.pageSize