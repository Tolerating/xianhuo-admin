import React, { useRef, useState } from 'react';
import TableRender, { ProColumnsType } from 'table-render';
import { Drawer, Modal, Tag } from 'antd';
import { CreditCardOutlined} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { pageProducts } from '@/api/product';
import { Product, StatusMap } from '@/types/Product';
import { APP_BASE_URL } from '@/config/common';
const initTable = async (params: any) => {
  console.log(params);
  const { current, pageSize, startTime, endTime, detail } = params;
  let result = await pageProducts(current, pageSize, startTime, endTime, detail);
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
      title: '投诉时间',
      type: 'range',
      format: 'date',
    },
    detail: {
      title: '商品详情',
      type: 'string',
      placeholder: '请输入想要搜索的商品',
      widget: 'input',
    },
  },
};

const Post: React.FC = () => {
  // 右侧抽屉
  const [openRight, setOpenRight] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentRow, setCurrentRow] = useState<Product>({} as Product);
  const tableRef = useRef(null);
  /**
   * 打开投诉商品抽屉
   *
   */
  const openDrawer = (id: number, row: any) => {
    setOpenRight(true);
    console.log(row);
    setCurrentRow(row);
  };

  const columns: ProColumnsType = [
    {
      title: '序号',
      dataIndex: 'id',
    },
    {
      title: '商品详情',
      dataIndex: 'detail',
    },
    {
      title: '商品图片',
      dataIndex: 'images',
      render: (images, row) => (
        <Tag
          onClick={() => {
            openDrawer(images, row);
          }}
          style={{ fontSize: 18 }}
          icon={<CreditCardOutlined />}
          color="#55acee"
        >
          查看图片
        </Tag>
      ),
    },
    {
      title: '商品价格（元）',
      dataIndex: 'currentPrice',
    },
    {
      title: '商品原价（元）',
      dataIndex: 'originPrice',
      render: (originPrice) => (
        <Tag>{Number(originPrice) === 0 ? '未提供' : originPrice}</Tag>
      ),
    },
    {
      title: '发布者',
      dataIndex: 'publisher',
    },
    {
      title: '商品要求',
      dataIndex: 'requireNames',
    },
    {
      title: '商品状态',
      dataIndex: 'status',
      render: (status) => (
        <Tag>{Number(status) === -1 ? '下架' : StatusMap[Number(status)]}</Tag>
      ),
    },
    {
      title: '商品地址',
      dataIndex: 'address',
    },
    {
      title: '发布时间',
      dataIndex: 'createTime',
    },
  ];

  const closeDrawer = () => {
    setOpenRight(false);
  };
  return (
    <PageContainer breadcrumbRender={false}>
      <TableRender search={{ schema }} request={initTable} columns={columns} ref={tableRef} />
      <Drawer title="图片" onClose={closeDrawer} open={openRight}>
        {currentRow.images?.split(',').map((item, index) => {
          return (
            <>
              <img style={{ width: '100%' }} src={APP_BASE_URL + ':' + item} key={index} alt="" />
            </>
          );
        })
        }
      </Drawer>
      <Modal
        title="Modal 1000px width"
        centered
        open={openDialog}
        onOk={() => setOpenDialog(false)}
        onCancel={() => setOpenDialog(false)}
        width={1000}
      ></Modal>
    </PageContainer>
  );
};

export default Post;
