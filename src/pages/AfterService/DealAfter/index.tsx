import React, { useRef, useState } from 'react';
import TableRender, { ProColumnsType } from 'table-render';
import {
  Alert,
  Avatar,
  Drawer,
  Empty,
  Typography,
  List,
  Popconfirm,
  Tag,
  message,
  Timeline,
  Form,
  Modal,
  Input,
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
  dealAfterService,
  getOrderAfterHistory,
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
  let result = await pageAfterServiceToDealList(current, pageSize, startTime, endTime, 0);
  return {
    data: result.data.records,
    total: result.data.total,
  };
};
type FieldType = {
  cause: string;
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
  const [openDialog, setOpenDialog] = useState(false);
  const [form] = Form.useForm();
  // 右侧商品抽屉
  const [openProduct, setOpenProduct] = useState(false);
  // 订单信息抽屉
  const [openOrderInfo, setOpenOrderInfo] = useState(false);
  // 聊天记录抽屉
  const [openChat, setOpenChat] = useState(false);
  // 售后历史抽屉
  const [openHistory, setOpenHistory] = useState(false);
  // 投诉商品信息
  const [complainInfo, setComplainInfo] = useState<Product>({} as Product);
  // 订单信息
  const [orderInfo, setOrderInfo] = useState<OrderInfo>({} as OrderInfo);
  // 聊天记录
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [afterHistoryList, setAfterHistoryList] = useState<AfterService[]>([]);
  // 当前行
  const [currentRow, setCurrentRow] = useState<AfterService>({} as AfterService);
  const [messageApi, contextHolder] = message.useMessage();
  const tableRef = useRef(null);
  const openRefuseDialog = (row:AfterService)=>{
    setOpenDialog(true)
    setCurrentRow(row)
  }
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
  const onCheck = async () => {
    try {
      const values = await form.validateFields();
      dealAfterService(
        currentRow.id as string,
        currentRow.buyerId,
        currentRow.sellerId,
        currentRow.orderId,
        currentRow.productId,
        values.cause,
        0,
      ).then((res) => {
        messageApi.open({
          type: 'success',
          content: res.message,
        });
        //@ts-ignore
        tableRef.current?.refresh({ stay: true });
        setOpenDialog(false)
      });
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  };

  /**
   * 打开售后历史抽屉
   *
   * @param {*} row
   */
  const openHistoryDrawer = (row: any) => {
    getOrderAfterHistory(row.orderId).then((res) => {
      setOpenHistory(true);
      setCurrentRow(row);
      setAfterHistoryList(res.data);
      console.log(res.data, afterHistoryList);
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
    // {
    //   title: '历史售后',
    //   render: (row) => (
    //     <Tag
    //       onClick={() => {
    //         openHistoryDrawer(row);
    //       }}
    //       style={{ fontSize: 18 }}
    //       color="#55acee"
    //     >
    //       点击查看
    //     </Tag>
    //   ),
    // },
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
      render: (row: AfterService, record) => (
        <>
          <Popconfirm
            title="提示"
            description="确定同意该售后申请？"
            onConfirm={() => {
              dealAfterService(
                row.id as string,
                row.buyerId,
                row.sellerId,
                row.orderId,
                row.productId,
                '',
                1,
              ).then((res) => {
                console.log(res);
                messageApi.open({
                  type: 'success',
                  content: res.message,
                });
                //@ts-ignore
                tableRef.current?.refresh({ stay: true });
              });
            }}
            okText="确定"
            cancelText="取消"
          >
            <a style={{ marginRight: 10 }} onClick={() => console.log(row.createTime, record)}>
              同意
            </a>
          </Popconfirm>
          <a onClick={() =>openRefuseDialog(row)}>拒绝</a>
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

      <Drawer title="历史售后" onClose={() => setOpenHistory(false)} open={openHistory}>
        {afterHistoryList.length === 0 && <Empty />}
        {chatMessages.length !== 0 && (
          <Timeline
            items={[
              ...afterHistoryList.map((item, index) => {
                return {
                  color: 'gray',
                  children: (
                    <>
                      <p>申请售后原因：{item.cause}</p>
                      {/* {item.sellerDealTime && (
                      <>
                        <p>
                          卖家处理状态{item.sellerDealTime}
                          <Tag style={{ fontSize: 18 }} color="#55acee">
                            {Number(item.sellerStatus) === 1 ? '已同意' : '未同意'}
                          </Tag>
                        </p>
                        {item.sellerStatus === 1 && <p>商家拒绝原因：{item.sellerRefuseCause}</p>}
                        <p>卖家处理时间：{item.sellerDealTime}</p>
                      </>
                    )} */}
                    </>
                  ),
                };
              }),
            ]}
          />
        )}
      </Drawer>
      <Modal
        title="拒绝原因"
        centered
        open={openDialog}
        onOk={onCheck}
        destroyOnClose
        onCancel={() => setOpenDialog(false)}
        afterClose={()=>form.resetFields()}
      >
        <Form
          name="basic"
          form={form}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: false }}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            label="拒绝原因"
            name="cause"
            initialValue="不符合售后条件"
            rules={[{ required: true, message: '请输入拒绝原因!' }]}
          >
            <Input allowClear/>
          </Form.Item>
        </Form>
      </Modal>

      {contextHolder}
    </PageContainer>
  );
};

export default DealAfter;
