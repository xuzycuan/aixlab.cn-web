import request from "@/http/request";


export   function getDatasetAllR(dsetsId){
    return request.get("/dataset/list-all/" + dsetsId)
}

export   function getDatasetListR(page, dsetsId){
    let data = {
        pageNo: page,
        pageSize: request.pageSize,
        datasetsId: dsetsId
    }
    return request.post("/dataset/list",data,{
        headers:{
            "Content-Type":"application/json"
        }
    })
}

export   function createDatasetR(data){
    let jsonData = {
        datasetsId: data.datasetsId,
        folder: data.folder,
        name: data.name,
        file: data.file
    }
    return request.post("/dataset/create", jsonData, {
        "Content-Type":"application/json"
    })
}

export   function deleteDatasetR(id){
    return request.get("/dataset/delete?id="+id)
}

export   function deleteFolderR(id, name){
    return request.get("/dataset/delete-folder?id="+id+"&name="+name)
}

export const  pageSize = request.pageSize