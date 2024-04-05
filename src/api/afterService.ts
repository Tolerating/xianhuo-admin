import { AfterService } from '@/types/AfterService';
import { ChatMessage } from '@/types/ChatMessage';
import { OrderInfo } from '@/types/OrderInfo';
import { Response, ResponsePage } from '@/types/Response';
import { request } from '@umijs/max';



/**
 * 分页获取待处理售后信息或历史记录
 *
 * @param {number} current
 * @param {number} size
 * @param {string} startTime
 * @param {string} endTime
 * @param {number} type 0表示待处理，1表示已完成
 */
const pageAfterServiceToDealList = (current:number,size:number,startTime:string,endTime:string,type:number) =>  request<ResponsePage<AfterService>>('/api/afterService/waitfor', {
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
 * 根据id获取订单信息
 *
 * @param {number} id
 */
const getOrderInfo = (id:number) =>  request<Response<OrderInfo>>('/api/orderInfo', {
  method: 'GET',
  params:{
    id
  }
});


/**
 * 获取聊天记录
 *
 * @param {number} toUser
 * @param {number} fromUser
 */
const getChatMessages = (toUser:string,fromUser:string) =>  request<Response<ChatMessage[]>>('/api/afterService/chatHistory', {
  method: 'GET',
  params:{
    toUser,
    fromUser
  }
});


/**
 * 处理商品售后
 *
 * @param {string} id 售后表主键
 * @param {string} buyerId 买家id
 * @param {string} sellerId 卖家id
 * @param {string} orderId 订单id
 * @param {string} productId 商品id
 * @param {string} result 决绝原因
 * @param {(0|1)} type 0:解决 1:同意
 */
const dealAfterService = (id:string, buyerId:string, sellerId:string,orderId:string,productId:string, result:string, type:0|1) =>  request<Response<string>>(`/api/afterService/deal`, {
  method: 'GET',
  params:{
    id,
    buyerId,
    sellerId,
    orderId,
    productId,
    result,
    type
  }
});


/**
 * 获取聊天记录
 *
 * @param {number} orderId
 */
const getOrderAfterHistory = (orderId:number) =>  request<Response<AfterService[]>>('/api/order/afterHistory', {
  method: 'GET',
  params:{
    orderId
  }
});

export {
  pageAfterServiceToDealList,
  getOrderInfo,
  getChatMessages,
  dealAfterService,
  getOrderAfterHistory
}
