import { Category } from '@/types/Category';
import { Product } from '@/types/Product';
import { ProductRequire } from '@/types/ProductRequire';
import { Response, ResponsePage } from '@/types/Response';
import { request } from '@umijs/max';



/**
 * 分页获取商品记录
 *
 * @param {number} current
 * @param {number} size
 * @param {string} startTime
 * @param {string} endTime
 * @param {string} detail
 */
const pageProducts = (current:number,size:number,startTime:string,endTime:string,detail:string) =>  request<ResponsePage<Product[]>>('/api/admin/products', {
  method: 'GET',
  params:{
    current,
    size,
    startTime,
    endTime,
    detail
  }
});


/**
 *分页获取商品要求记录
 *
 * @param {number} current
 * @param {number} size
 */
const pageProductRequire = (current:number,size:number) =>  request<ResponsePage<ProductRequire[]>>('/api/productRequires', {
  method: 'GET',
  params:{
    current,
    size
  }
});


/**
 *改动商品要求是否生效
 *
 * @param {string} id
 * @param {number} status
 */
const updateRequireStatus = (id:string,status:number) =>  request<Response<string>>('/api/productRequire/update', {
  method: 'GET',
  params:{
    id,
    status
  }
});



/**
 *新增商品要求
 *
 * @param {string} name
 */
const addRequireStatus = (name:string) =>  request<Response<string>>('/api/productRequire/add', {
  method: 'GET',
  params:{
    name
  }
});

/**
 *分页获取商品分类
 *
 * @param {number} current
 * @param {number} size
 */
 const pageCategoryRequire = (current:number,size:number) =>  request<ResponsePage<Category[]>>('/api/categories/page', {
  method: 'GET',
  params:{
    current,
    size
  }
});


/**
 *改动商品分类是否生效
 *
 * @param {string} id
 * @param {number} status
 */
const updateCategoryStatus = (id:string,status:number) =>  request<Response<string>>('/api/category/update', {
  method: 'GET',
  params:{
    id,
    status
  }
});



/**
 *新增商品分类
 *
 * @param {string} name
 */
const addCategoryStatus = (name:string) =>  request<Response<string>>('/api/category/add', {
  method: 'GET',
  params:{
    name
  }
});


export {
  pageProducts,
  updateRequireStatus,
  addRequireStatus,
  pageProductRequire,
  pageCategoryRequire,
  updateCategoryStatus,
  addCategoryStatus
}
