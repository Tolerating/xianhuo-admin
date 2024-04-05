import { Complain } from '@/types/Complain';
import { Product } from '@/types/Product';
import { RequireInfo } from '@/types/RequireInfo';
import { Response, ResponsePage } from '@/types/Response';
import { request } from '@umijs/max';


/**
 * 分页获取帖子投诉信息
 *
 * @param {number} current
 * @param {number} size
 */
const pagePostComplain = (current:number,size:number,startTime:string,endTime:string) =>  request<ResponsePage<Complain>>('/api/complain/waitfor/post', {
  method: 'GET',
  params:{
    current,
    size,
    startTime,
    endTime
  }
});
/**
 * 根据id获取投诉信息
 *
 * @param {number} id
 */
const complainById = (id:number) =>  request<Response<RequireInfo>>(`/api/complain/post//${id}`, {
  method: 'GET'
});


/**
 * 处理帖子投诉信息
 *
 * @param {string} id
 * @param {string} postId
 * @param {string} complaintId
 * @param {string} sellerId
 * @param {(0|1)} type 0:无效 1:下架
 */
const dealComplain = (id:string, postId:string, complainantId:string, sellerId:string, type:0|1) =>  request<Response<string>>(`/api/complain/post/deal`, {
  method: 'GET',
  params:{
    id,
    postId,
    complainantId,
    sellerId,
    type
  }
});

/**
 * 根据id获取商品投诉信息
 *
 * @param {number} id
 */
const complainProductById = (id:number) =>  request<Response<Product>>(`/api/complain/product//${id}`, {
  method: 'GET'
});

/**
 * 分页获取商品投诉信息
 *
 * @param {number} current
 * @param {number} size
 */
const pageProductComplain = (current:number,size:number,startTime:string,endTime:string) =>  request<ResponsePage<Complain>>('/api/complain/waitfor/product', {
  method: 'GET',
  params:{
    current,
    size,
    startTime,
    endTime
  }
});

/**
 * 分页获取帖子、商品投诉历史
 *
 * @param {number} current
 * @param {number} size
 */
const complainHistory = (current:number,size:number,startTime:string,endTime:string,type:number) =>  request<ResponsePage<Complain>>('/api/complain/history', {
  method: 'GET',
  params:{
    current,
    size,
    startTime,
    endTime,
    type
  }
});

/**
 * 处理商品投诉信息
 *
 * @param {string} id
 * @param {string} postId
 * @param {string} complaintId
 * @param {string} sellerId
 * @param {(0|1)} type 0:无效 1:下架
 */
const dealProductComplain = (id:string, productId:string, complainantId:string, sellerId:string, type:0|1) =>  request<Response<string>>(`/api/complain/product/deal`, {
  method: 'GET',
  params:{
    id,
    productId,
    complainantId,
    sellerId,
    type
  }
});
export {
  pagePostComplain,
  complainById,
  dealComplain,
  pageProductComplain,
  complainProductById,
  complainHistory,
  dealProductComplain
}
