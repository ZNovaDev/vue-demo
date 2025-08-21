import { http } from "@/utils/request";


export const getTest = (params: any) => {
  return http({
    url: '/test',
    method: 'get',
    // 使用params传递参数，会拼接到url后
    params
  })
}

export const postTest = (data: any) => {
  return http({
    url: '/test',
    method: 'post',
    // 使用data传递参数，会封装到json中
    data
  })
}

