import React, { useRef, useState } from 'react';
import TableRender, { ProColumnsType } from 'table-render';
import {
  Alert,
  Avatar,
  Drawer,
  Empty,
  Typography,
  List,
  Tag,
  Image
} from 'antd';
import {
  CreditCardOutlined,
  UserOutlined,
  EnvironmentOutlined,
  PayCircleOutlined,
  TagsOutlined,
  FieldTimeOutlined,
} from '@ant-design/icons';
import { complainProductById } from '@/api/complain';
import {
  pageAfterServiceToDealList,
  getOrderInfo,
  getChatMessages,
} from '@/api/afterService';
import { PageContainer } from '@ant-design/pro-components';
import { Product, StatusMap } from '@/types/Product';
import { APP_BASE_URL } from '@/config/common';
import { OrderInfo } from '@/types/OrderInfo';
import { AfterService } from '@/types/AfterService';
import { ChatMessage } from '@/types/ChatMessage';
const { Text } = Typography;
const initTable = async (params: any) => {
  const { current, pageSize, startTime, endTime } = params;
  let result = await pageAfterServiceToDealList(current, pageSize, startTime, endTime, 1);
  return {
    data: result.data.records,
    total: result.data.total,
  };
};

const schema = {
  type: 'object',
  labelWidth: 70,
  properties: {
    created_at: {
      bind: ['startTime', 'endTime'],
      title: '申请时间',
      type: 'range',
      format: 'date',
    },
  },
};

const DealAfter: React.FC = () => {
  // 右侧商品抽屉
  const [openProduct, setOpenProduct] = useState(false);
  // 订单信息抽屉
  const [openOrderInfo, setOpenOrderInfo] = useState(false);
  // 聊天记录抽屉
  const [openChat, setOpenChat] = useState(false);
  // 投诉商品信息
  const [complainInfo, setComplainInfo] = useState<Product>({} as Product);
  // 订单信息
  const [orderInfo, setOrderInfo] = useState<OrderInfo>({} as OrderInfo);
  // 聊天记录
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  // 当前行
  const [currentRow, setCurrentRow] = useState<AfterService>({} as AfterService);
  const tableRef = useRef(null);
  /**
   * 打开投诉商品抽屉
   *
   */
  const openProductDrawer = (id: number, row: any) => {
    setOpenProduct(true);
    console.log(row);
    setCurrentRow(row);
    complainProductById(id).then((res) => {
      setComplainInfo(res.data);
    });
  };


  /**
   * 打开订单抽屉
   *
   * @param {number} id
   * @param {*} row
   */
  const openOrderDrawer = (id: number, row: any) => {
    setOpenOrderInfo(true);
    setCurrentRow(row);
    getOrderInfo(id).then((res) => {
      setOrderInfo(res.data);
    });
  };

  /**
   * 打开聊天记录抽屉
   *
   * @param {AfterService} row
   */
  const openChatDrawer = (row: AfterService) => {
    setOpenChat(true);
    setCurrentRow(row);
    getChatMessages(row.buyerId, row.sellerId).then((res) => {
      setChatMessages(res.data);
    });
  };

  const columns: ProColumnsType = [
    {
      title: '序号',
      dataIndex: 'id',
    },
    {
      title: '买家',
      dataIndex: 'buyerName',
    },
    {
      title: '售后原因',
      dataIndex: 'cause',
    },
    {
      title: '售后的商品',
      dataIndex: 'productId',
      render: (productId, row) => (
        <Tag
          onClick={() => {
            openProductDrawer(productId, row);
          }}
          style={{ fontSize: 18 }}
          icon={<CreditCardOutlined />}
          color="#55acee"
        >
          {productId}
        </Tag>
      ),
    },
    {
      title: '订单编号',
      dataIndex: 'orderId',
      render: (orderId, row) => (
        <Tag
          onClick={() => {
            openOrderDrawer(orderId, row);
          }}
          style={{ fontSize: 18 }}
          icon={<CreditCardOutlined />}
          color="#55acee"
        >
          {orderId}
        </Tag>
      ),
    },
    {
      title: '卖家',
      dataIndex: 'sellerName',
    },
    {
      title: '卖家拒绝原因',
      dataIndex: 'sellerRefuseCause',
    },
    {
      title: '卖家处理时间',
      dataIndex: 'sellerDealTime',
    },
    {
      title: '申请时间',
      dataIndex: 'createTime',
    },
    {
      title: '操作',
      render: (row: AfterService) => (
        <>
          <a style={{ marginLeft: 20 }} onClick={() => openChatDrawer(row)}>
            聊天记录
          </a>
        </>
      ),
    },
  ];

  const closeProductDrawer = () => {
    setOpenProduct(false);
  };
  return (
    <PageContainer breadcrumbRender={false}>
      <TableRender search={{ schema }} request={initTable} columns={columns} ref={tableRef} />
      <Drawer title="商品详细内容" onClose={closeProductDrawer} open={openProduct}>
        <List itemLayout="horizontal">
          <List.Item>
            <List.Item.Meta
              avatar={<UserOutlined />}
              title="发布者"
              description={currentRow.sellerName}
            />
          </List.Item>
          <List.Item>
            <List.Item.Meta
              avatar={<UserOutlined />}
              title="商品详情"
              description={complainInfo.detail}
            />
          </List.Item>
          <List.Item>
            <List.Item.Meta
              avatar={<UserOutlined />}
              title="商品价格"
              description={'￥' + complainInfo.currentPrice}
            />
          </List.Item>
          <List.Item>
            <List.Item.Meta
              avatar={<EnvironmentOutlined />}
              title="类别"
              description={<Tag>{complainInfo.categoryName}</Tag>}
            />
          </List.Item>
          <List.Item>
            <List.Item.Meta
              avatar={<EnvironmentOutlined />}
              title="商品要求"
              description={<Tag>{complainInfo.requireNames}</Tag>}
            />
          </List.Item>
          <List.Item>
            <List.Item.Meta
              avatar={<EnvironmentOutlined />}
              title="商品状态"
              description={
                <Tag>
                  {Number(complainInfo.status) === -1 ? '已下架' : StatusMap[complainInfo.status]}
                </Tag>
              }
            />
          </List.Item>
          <List.Item>
            <List.Item.Meta
              avatar={<EnvironmentOutlined />}
              title="地址"
              description={complainInfo.address}
            />
          </List.Item>
          <List.Item>
            <List.Item.Meta
              avatar={<EnvironmentOutlined />}
              title="图片"
              description={complainInfo.images?.split(',').map((item, index) => {
                return (
                  <img style={{ width: '100%' }} src={APP_BASE_URL + item} key={index} alt="" />
                );
              })}
            />
          </List.Item>
        </List>
      </Drawer>
      <Drawer title="订单详细内容" onClose={() => setOpenOrderInfo(false)} open={openOrderInfo}>
        <List itemLayout="horizontal">
          <List.Item>
            <List.Item.Meta
              avatar={<UserOutlined />}
              title="买家"
              description={currentRow.buyerName}
            />
          </List.Item>
          <List.Item>
            <List.Item.Meta
              avatar={<UserOutlined />}
              title="卖家"
              description={currentRow.sellerName}
            />
          </List.Item>
          <List.Item>
            <List.Item.Meta
              avatar={<PayCircleOutlined />}
              title="支付金额"
              description={'￥' + orderInfo.total}
            />
          </List.Item>
          <List.Item>
            <List.Item.Meta
              avatar={<TagsOutlined />}
              title="支付类型"
              description={<Tag>支付宝</Tag>}
            />
          </List.Item>
          <List.Item>
            <List.Item.Meta
              avatar={<TagsOutlined />}
              title="支付宝订单号"
              description={<Tag>{orderInfo.alipayId}</Tag>}
            />
          </List.Item>
          <List.Item>
            <List.Item.Meta
              avatar={<TagsOutlined />}
              title="支付宝用户账号"
              description={<Tag>{orderInfo.buyerSysAccount}</Tag>}
            />
          </List.Item>
          <List.Item>
            <List.Item.Meta
              avatar={<TagsOutlined />}
              title="收货状态"
              description={<Tag>{Number(orderInfo.buyerStatus) === 0 ? '未收货' : '已收货'}</Tag>}
            />
          </List.Item>
          <List.Item>
            <List.Item.Meta
              avatar={<TagsOutlined />}
              title="发货状态"
              description={<Tag>{Number(orderInfo.sellerStatus) === 0 ? '未发货' : '已发货'}</Tag>}
            />
          </List.Item>
          <List.Item>
            <List.Item.Meta
              avatar={<FieldTimeOutlined />}
              title="创建时间"
              description={orderInfo.createTime}
            />
          </List.Item>
          {orderInfo.payTime !== 'null' && (
            <List.Item>
              <List.Item.Meta
                avatar={<FieldTimeOutlined />}
                title="支付时间"
                description={orderInfo.payTime}
              />
            </List.Item>
          )}
        </List>
      </Drawer>
      <Drawer title="聊天内容" onClose={() => setOpenChat(false)} open={openChat}>
        {chatMessages.length === 0 && <Empty />}
        {chatMessages.length !== 0 &&
          chatMessages.map((item, index) => {
            if (item.fromUser === currentRow.buyerId) {
              return (
                <div
                  key={index}
                  style={{ display: 'flex', flexDirection: 'column', marginBottom: 20 }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar style={{ backgroundColor: '#87d068' }}>买家</Avatar>
                    {Number(item.type)===1 &&
                      <Image
                      width={150}
                      src={APP_BASE_URL + item.content}
                    />
                    }
                    {Number(item.type)===0 &&
                      <Alert message={item.content} type="success" />
                    }

                  </div>
                  <div>
                    <Text italic style={{ marginRight: 20 }}>
                      {currentRow.buyerName}
                    </Text>
                    <Text italic>{item.sendTime}</Text>
                  </div>
                </div>
              );
            } else {
              return (
                <div
                  key={index}
                  style={{ display: 'flex', flexDirection: 'column', marginBottom: 20 }}
                >
                  <div
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}
                  >
                     {Number(item.type)===1 &&
                      <Image
                      width={150}
                      src={APP_BASE_URL + item.content}
                    />
                    }
                    {Number(item.type)===0 &&
                      <Alert message={item.content} type="success" />
                    }
                    <Avatar style={{ backgroundColor: '#87d068' }}>卖家</Avatar>
                  </div>
                  <div
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}
                  >
                    <Text italic style={{ marginRight: 20 }}>
                      {item.sendTime}
                    </Text>
                    <Text italic>{currentRow.sellerName}</Text>
                  </div>
                </div>
              );
            }
          })}
      </Drawer>
    </PageContainer>
  );
};

export default DealAfter;
