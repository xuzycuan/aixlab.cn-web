import request from "@/http/request";


export   function getDocList(page){
    let data = {
        pageNo:page,
        pageSize:request.pageSize
    }
    return request.post("/doc/list",data,{
        headers:{
            "Content-Type":"application/json"
        }
    })
}

export   function createDoc(data){
    let jsonData = {
        name: data.name,
        file: data.file
    }
    return request.post("/doc/create",jsonData,{
        headers:{
            "Content-Type":"application/json"
        }
    })
}

export   function deleteDoc(id){
    return request.get("/doc/delete?id="+id)
}

export const  pageSize = request.pageSize