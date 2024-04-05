
import React, { useRef, useState } from 'react';
import TableRender, { ProColumnsType } from 'table-render';
import { Drawer, List, Modal, Tag } from 'antd';
import { CreditCardOutlined, UserOutlined, EnvironmentOutlined } from '@ant-design/icons';
import {complainProductById,complainHistory} from '@/api/complain'
import { PageContainer } from '@ant-design/pro-components';
import { Complain } from '@/types/Complain';
import { Product,StatusMap } from '@/types/Product';
import { APP_BASE_URL } from '@/config/common';

const initTable = async (params:any)=>{
  console.log(params);
  const {current,pageSize,startTime,endTime} = params
  let result = await complainHistory(current,pageSize,startTime,endTime,1);
  return {
    data:result.data.records,
    total:result.data.total
  }
}

const schema = {
  type: 'object',
  labelWidth: 70,
  properties: {
    created_at: {
      bind:["startTime","endTime"],
      title: '投诉时间',
      type: 'range',
      format: 'date'
    }
  }
};






const Post: React.FC = () => {
  // 右侧抽屉
  const [openRight, setOpenRight] = useState(false);
  const [openDialog,setOpenDialog] = useState(false)
  const [complainInfo,setComplainInfo] = useState<Product>({} as Product)
  const [currentRow,setCurrentRow] =useState<Complain>({} as Complain)
  const tableRef = useRef(null)
  /**
 * 打开投诉商品抽屉
 *
 */
  const openDrawer = (id:number,row:any)=>{
    setOpenRight(true)
    console.log(row);
    setCurrentRow(row)
    complainProductById(id).then(res=>{
      setComplainInfo(res.data)
    })
  }

const columns:ProColumnsType = [
  {
    title: '序号',
    dataIndex: 'id',
  },
  {
    title: '投诉人',
    dataIndex: 'complaintName'
  },
  {
    title:"投诉原因",
    dataIndex: 'complainantCause',
  },
  {
    title:"被投诉的商品",
    dataIndex: 'complainantSubject',
    render:(complainantSubject,row)=>(<Tag onClick={()=>{openDrawer(complainantSubject,row)}} style={{fontSize:18}} icon={<CreditCardOutlined />} color="#55acee">{complainantSubject}</Tag>)
  },
  {
    title:"发布者",
    dataIndex: 'sellerName',
  },
  {
    title:"投诉时间",
    dataIndex: 'createTime',
  },
  {
    title:"处理人",
    dataIndex:"dealUserName"
  },
  {
    title:"处理方式",
    dataIndex:"dealMethod"
  },
  {
    title:"处理时间",
    dataIndex:"dealTime"
  }
];


  const closeDrawer = ()=>{
    setOpenRight(false)
  }
  return (
    <PageContainer breadcrumbRender={false}>
       <TableRender
      search={{ schema }}
      request={initTable}
      columns={columns}
      ref={tableRef}
    />
    <Drawer title="商品详细内容" onClose={closeDrawer} open={openRight}>
    <List
    itemLayout="horizontal">
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
          description={"￥" + complainInfo.currentPrice}
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
          description={<Tag>{complainInfo.status===-1?"已下架":StatusMap[complainInfo.status]}</Tag>}
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
          description={complainInfo.images?.split(",").map((item,index)=>{
            return <img style={{width:"100%"}} src={APP_BASE_URL+item} key={index} alt="" />
          })}
        />
      </List.Item>
    </List>
      </Drawer>
      <Modal
        title="Modal 1000px width"
        centered
        open={openDialog}
        onOk={() => setOpenDialog(false)}
        onCancel={() => setOpenDialog(false)}
        width={1000}
      >

      </Modal>
    </PageContainer>
  );
};

export default Post;
