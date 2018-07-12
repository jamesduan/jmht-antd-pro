import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Form, Card, Select, List, Tag, Icon, Avatar, Row, Col, Button, Input, Modal } from 'antd';
import { routerRedux } from 'dva/router';
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
@connect(({ list, addCompleteObj, loading }) => ({
    list,
    addCompleteObj,
    loading: loading.models.list
}))
export default class SearchList extends Component {
    state = {
        addArticleModalVisible: false,
        title: '',
        content: ''
    }
    componentDidMount() {
        // this.fetchMore();
        const { list: { list }, form, loading } = this.props;
        // console.log(list)
        const { setFieldsValue } = form;
        setFieldsValue({'title': list.Title})
        setFieldsValue({'content': list.Content})
        // console.log("component did mount")
        this.setState({
            title: list.Title,
            content: list.Content
        })
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
        // console.log(this.state.title, this.state.content)
        const { dispatch, form, list: { list } } = this.props;
        
        dispatch({
            type: 'list/saveArticle',
            payload: {
                title: this.state.title,
                content: this.state.content,
                id: list.ID
            }
        })

        dispatch(routerRedux.push('/article/add'));
    }

    setAddArticleModalVisible(addArticleModalVisible) {
        this.setState({ addArticleModalVisible })
    }

    render() {
        const { list: { list }, form, loading } = this.props;
        // console.log(list)
        const { getFieldDecorator } = form;
        // setFieldsValue({'title': list.Title})
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

        const ListContent = ({ data: { content, updatedAt, avatar, owner, href } }) => (
            <div className={styles.listContent}>
                <div className={styles.description}>{content}</div>
                <div className={styles.extra}>
                    <Avatar src={avatar} size="small" />发布于
                    <em>{moment(updatedAt).format('YYYY-MM-DD hh:mm')}</em>
                </div>
            </div>
        );

        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 16,
                    offset: 8,
                },
            },
        };

        // const loadMore = list.length > 0 ? (
        //     <div style={{ textAlign: 'center', marginTop: 16 }}>
        //         <Button onClick={this.fetchMore} style={{ paddingLeft: 48, paddingRight: 48 }}>
        //             {loading ? <span><Icon type="loading" /> 加载中...</span> : '加载更多'}
        //         </Button>
        //     </div>
        // ) : null;
        const formItemLayout = {
            labelCol: {
                xs: { span: 1 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };

        return (
            <PageHeaderLayout >
                <Card
                    style={{ marginTop: 24 }}
                    bordered={false}
                    bodyStyle={{ padding: '8px 32px 32px 32px' }}>
                    <Form onSubmit={this.handleFormSubmit} style={{ marginTop: 40 }}>
                        <FormItem
                            {...formItemLayout}
                            label="标题"
                        >
                            {getFieldDecorator('title', {
                                rules: [{
                                    required: true, message: '请输入标题',
                                }],
                            })(
                                <TextArea
                                    placeholder="请输入标题"
                                    onChange={(title) => {
                                        this.setState({ title: title.target.value })
                                    }}
                                    autosize />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="文章内容"
                        >
                            {getFieldDecorator('content', {
                                rules: [{ required: true, message: "请输入内容" }],
                            })(
                                <TextArea
                                    placeholder="请粘贴或输入文章内容"
                                    onChange={(content) => {
                                        this.setState({ content: content.target.value })
                                    }}
                                    autosize={{ minRows: 20, maxRows: 100 }}
                                />
                            )}
                        </FormItem>
                        <FormItem {...tailFormItemLayout}>
                            <Button type="primary" onClick={() => { this.handleFormSubmit()}}>
                                {loading ? <span><Icon type="loading" /> 保存中...</span> : '保存'}
                            </Button>
                        </FormItem>
                    </Form>
                </Card>
            </PageHeaderLayout>
        );
    }
}
