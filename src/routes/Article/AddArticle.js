import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Form, Card, Select, List, Tag, Icon, Avatar, Row, Col, Button, Input, Modal, Upload } from 'antd';
import { routerRedux, Link } from 'dva/router';

const { TextArea } = Input;

import PageHeaderLayout from '../../layouts/PageHeaderLayout';

// import StandardFormRow from '../../components/StandardFormRow';
// import TagSelect from '../../components/TagSelect';
// import aStyles from './AddArticle.less';
import styles from '../List/Articles.less'
import aStyles from './AddArticle.less'

const { Option } = Select;
const FormItem = Form.Item;

const pageSize = 5;

@Form.create()
@connect(({ list, loading }) => ({
    list,
    loading: loading.models.list,
}))
export default class SearchList extends Component {
    state = {
        addArticleModalVisible: false,
        title: '',
        content: '',
        fileData: "",
        fileType: "",
        articleId: 0,
        // uploading: false,
        fileList: [],
        previewVisible: false,
        previewImage: '',
    }
    componentDidMount() {
        this.fetchMore();
    }

    setOwner = () => {
        const { form } = this.props;
        form.setFieldsValue({
            owner: ['wzj'],
        });
    }

    fetchMore = () => {
        this.props.dispatch({
            type: 'list/appendFetch',
            payload: {
                count: pageSize,
            },
        });
    }

    handleFormSubmit = () => {

    }

    handleAddSubmit = () => {
        // console.log(this.state.title, this.state.content)
        this.props.dispatch({
            type: "list/addArticle",
            payload: {
                title: this.state.title,
                content: this.state.content,
                fileData: this.state.fileData,
                fileType: this.state.fileType
            }
        })
    }

    setAddArticleModalVisible(addArticleModalVisible) {
        this.setState({ addArticleModalVisible })
    }

    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
          });
    }

    gotoEdit = (item) => {
        // console.log(item)
        this.props.dispatch({
            type: "list/editArticle",
            payload: {
                data: item
            }
        })
        this.props.dispatch(routerRedux.push('/article/edit'));
    }

    render() {
        // console.log(this.state)
        const { form, list: { list }, loading } = this.props;
        const { getFieldDecorator } = form;

        const owners = [
            {
                id: 'wzj',
                name: '我自己',
            },
            {
                id: 'wjh',
                name: '吴家豪',
            },
            {
                id: 'zxx',
                name: '周星星',
            },
            {
                id: 'zly',
                name: '赵丽颖',
            },
            {
                id: 'ym',
                name: '姚明',
            },
        ];

        const IconText = ({ type, text }) => (
            <span>
                <Icon type={type} style={{ marginRight: 8 }} />
                {text}
            </span>
        );

        const ListContent = ({ data: { Content, CreatedAt, UserID, Image } }) => (
            <div className={styles.listContent}>
                <img src={"http://localhost:8001/" + Image.FileName } alt="" className={aStyles.image}/>
                <div className={styles.description}>{Content}</div>
                <div className={styles.extra}>
                    {UserID}发布于
                    <em>{moment(CreatedAt).format('YYYY-MM-DD hh:mm')}</em>
                </div>
            </div>
        );

        const formItemLayout = {
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 24 },
                md: { span: 12 },
            },
        };

        const loadMore = list.length > 0 ? (
            <div style={{ textAlign: 'center', marginTop: 16 }}>
                <Button onClick={this.fetchMore} style={{ paddingLeft: 48, paddingRight: 48 }}>
                    {loading ? <span><Icon type="loading" /> 加载中...</span> : '加载更多'}
                </Button>
            </div>
        ) : null;

        const uploadProps = {
            listType: "picture",
            className: 'upload-list-inline',
            // action: '//jsonplaceholder.typicode.com/posts/',
            onRemove: (file) => {
                this.setState(({ fileList }) => {
                    const index = fileList.indexOf(file);
                    const newFileList = fileList.slice();
                    newFileList.splice(index, 1);
                    return {
                        fileList: newFileList,
                        fileData: ""
                    };
                });
            },
            beforeUpload: (file) => {
                console.log(file)

                if (this.state.fileList.length == 0) {
                    this.setState(({ fileList }) => ({
                        fileList: [...fileList, file],
                    }));

                    var reader = new FileReader();
                    reader.readAsDataURL(file)
                    reader.onload = () => {
                        // console.log(reader.result)
                        this.setState({
                            fileData: reader.result,
                        })
                    }
                    reader.onerror = (error) => {
                        console.log("Error:", error)
                    }

                    let fileType = file.type.split("/")[1]
                    if (fileType == "png") {
                        this.setState({
                            fileType: fileType
                        })
                    } else if (fileType == "jpeg") {
                        this.setState({
                            fileType: "jpg"
                        })
                    }
                }
                return false;
            },
            fileList: this.state.fileList,
        }

        return (
            <PageHeaderLayout >
                <div>
                    {/* <Card>
                        <div style={{ textAlign: 'center' }}>
                            <Input.Search
                                placeholder="请输入"
                                enterButton="搜索"
                                size="large"
                                onSearch={this.handleFormSubmit}
                                style={{ width: 522 }}
                            />
                        </div>
                    </Card> */}
                    <Card
                        style={{ marginTop: 24 }}
                        bordered={false}
                        bodyStyle={{ padding: '8px 32px 32px 32px' }}
                    >
                        <Button onClick={() => {
                            this.setState({
                                title: '',
                                content: "",
                                fileData: "",
                                fileType: "",
                                fileList: []
                            })
                            this.setAddArticleModalVisible(true)
                        }}
                            style={{ paddingLeft: 48, paddingRight: 48, marginTop: 40, marginBottom: 40 }}
                            icon="plus"
                            type="primary">
                            新增文章
                    </Button>
                        <Modal
                            title="新增文章"
                            wrapClassName={aStyles.addArticleModal}
                            visible={this.state.addArticleModalVisible}
                            onOk={() => {
                                this.handleAddSubmit()
                                this.setAddArticleModalVisible(this.props.list.confirmLoading)
                            }}
                            onCancel={() => this.setAddArticleModalVisible(false)}
                            width={"50%"}
                            confirmLoading={this.props.list.confirmLoading}
                        >
                            <TextArea
                                placeholder="请输入标题"
                                value={this.state.title}
                                onChange={(title) => {
                                    this.setState({ title: title.target.value })
                                }}
                                autosize />
                            <TextArea
                                placeholder="请粘贴或输入文章内容"
                                autosize={{ minRows: 20, maxRows: 100 }}
                                value={this.state.content}
                                style={{ marginTop: 40 }}
                                onChange={(content) => {
                                    this.setState({ content: content.target.value })
                                }} />

                            <Upload {...uploadProps} type="picture">
                                <Button>
                                    <Icon type="upload" />上传
                                </Button>
                            </Upload>
                        </Modal>
                        <List
                            size="large"
                            loading={list.length === 0 ? loading : false}
                            rowKey="id"
                            itemLayout="vertical"
                            loadMore={loadMore}
                            dataSource={list}
                            renderItem={item => (
                                <List.Item
                                    key={item.ID}
                                    actions={[
                                        // <IconText type="star-o" text={item.star} />,
                                        <a className={styles.listItemMetaTitle} ><IconText type="like-o" text={item.Like} /></a>,
                                        <a className={styles.listItemMetaTitle} ><IconText type="message" text={item.Comment} /></a>,
                                        <a className={styles.listItemMetaTitle} onClick={() => { this.gotoEdit(item) }}><IconText type="edit" text={"编辑"} /></a>,
                                    ]}
                                    extra={<div className={styles.listItemExtra} />}
                                >
                                    <List.Item.Meta
                                        title={(
                                            <a className={styles.listItemMetaTitle} >{item.Title}</a>
                                        )}
                                    // description={
                                    //     <span>
                                    //         <Tag>Ant Design</Tag>
                                    //         <Tag>设计语言</Tag>
                                    //         <Tag>蚂蚁金服</Tag>
                                    //     </span>
                                    // }
                                    />
                                    <ListContent data={item} />
                                </List.Item>
                            )}
                        />
                    </Card>
                </div>
            </PageHeaderLayout>
        );
    }
}
