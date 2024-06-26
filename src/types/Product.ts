export type Product = {
    // 商品id
    id:number | null,
    // 商品分类id
    categoryId:number,
    /**
     * 分类名
     *
     * @type {string}
     */
    categoryName:string,
    // 商品详情
    detail:string,
    // 商品图片
    images:string,
    // 商品现价，保留两位小数
    currentPrice:string,
    // 物品出租时间计量单位
    timeUnit:"时"|"天"|"周"|"月"|"年"| "学期",
    // 商品原价
    originPrice:string,
    // 出售方式id
    sellModeId:number,
    // 发货方式id
    dispatchModeId:number,
    // 发布者id
    userId:number,

    /**
     * 发布者姓名
     *
     * @type {string}
     */
    publisher:string,
    // 商品要求id,以逗号分隔
    productRequireId:string,
    /**
     * 商品要求名，逗号分隔
     *
     * @type {string}
     */
    requireNames:string,
    // 商品状态，1表示在售，0表示售出，-1表示下架
    status:ProductStatus,
    // 商品所在学校定位
    location:string,
    // 运费
    freight?:string,
    // 完整
    address:string,
    // 创建时间
    createTime?:string,
    // 更新时间
    updateTime?:string,
    // 删除时间
    deleteTime?:string
    [key: string]: unknown
}
export type ProductStatus = 1|0|-1
export const timeUnit = ["时","天","周","月","年", "学期"]
export const StatusMap = ["售出","在售"]
