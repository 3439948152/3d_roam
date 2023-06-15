import {request} from "@/common/request";

/**
 * 测试
 * @returns {Promise<AxiosResponse<any>>}
 */
export const get_data=(data)=>{
    return request({
        url:'/get_data',
        method:'post',
        data
    })
}
export  const get_point=()=>{
    return request({
        url:'/map_point',
        method:'get',
    })
}
 export const map_point=(data)=>{
    return request({
        url:'/map_point',
        method:'post',
        data
    })
 }