import Taro, { Component } from '@tarojs/taro';
import { ComponentClass } from 'react';
import { View, Image, Text } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import { AtList, AtListItem, AtTag, AtButton } from 'taro-ui';
import Login from '../../components/login/loginComponent';
import './index.scss';
import { tip } from '../../utils/tool';

type PageState = {};
interface PageDvaProps {
  dispatch: Function;
}

interface PageOwnProps {
  //父组件要传
}
interface PageStateProps {
  // 自己要用的
  userInfo: any;
}
type IProps = PageStateProps & PageDvaProps & PageOwnProps;

@connect(({ ucenter, common }) => ({
  ...common,
  ...ucenter,
}))
class Ucenter extends Component<IProps, {}> {
  config = {
    navigationBarTitleText: '个人中心',
  };

  async componentDidShow() {
    if (Taro.getStorageSync('gotoOrder')) {
      Taro.setStorageSync('gotoOrder', '');
      this.nextPage('/pages/order/index');
    }
  }

  componentDidMount() {}

  nextPage = url => {
    if (!this.props.userInfo) {
      tip('请先授权登录');
      return;
    }
    Taro.navigateTo({ url });
  };
  loginBtn = () => {
    Taro.eventCenter.trigger('login', true);
  };
  loginSuccess = () => {
    // this.onPullDownRefresh();
  };

  render() {
    const { userInfo } = this.props;
    return (
      <View className="ucenter-page">
        <Login show={false} onChange={this.loginSuccess} />

        {!userInfo ? (
          <View className="center">
            <AtButton size="small" type="secondary" onClick={this.loginBtn}>
              登录
            </AtButton>
          </View>
        ) : (
          <View className="me-wrap">
            <View className="info">
              <View className="h3">
                {userInfo.nickName}
                {userInfo.isColonel && (
                  <AtTag active={true} size="small" circle>
                    小区长
                  </AtTag>
                )}
              </View>
              <View className="p">{userInfo.mobile}</View>
            </View>
            <View className="ava-wrap">
              <Image className="image" mode="scaleToFill" src={userInfo.avatarUrl} />
            </View>
          </View>
        )}
        <View className="divsion" />
        <View className="operate-wrap">
          <View className="li" onClick={this.nextPage.bind(this, '/pages/order/index')}>
            <Text className="erduufont ed-peihuodan red" />
            全部订单
          </View>
          <View className="li" onClick={this.nextPage.bind(this, '/pages/order/index?tab=0')}>
            <Text className="erduufont ed-tixian" />
            待付款
          </View>
          <View className="li" onClick={this.nextPage.bind(this, '/pages/order/index?tab=201')}>
            <Text className="erduufont ed-quhuo" />
            待收货
          </View>
          <View className="li" onClick={this.nextPage.bind(this, '/pages/order/index?tab=301')}>
            <Text className="erduufont ed-comment" />
            待评价
          </View>
          {/* <View className="li" onClick={this.nextPage.bind(this, '/pages/order/index?tab=400')}>
            <Text className="erduufont ed-dingdan" />
            退换/售后
          </View> */}
        </View>
        <View className="divsion" />
        <View className="ul">
          <AtList>
            <AtListItem
              arrow="right"
              title="我的红包"
              onClick={this.nextPage.bind(this, '/pages/ucenter/coupon')}
            />
            <AtListItem
              arrow="right"
              title="我的积分"
              onClick={this.nextPage.bind(this, '/pages/ucenter/score')}
            />
          </AtList>
        </View>
        <View className="divsion" />
        <View className="ul">
          <AtList>
            <AtListItem arrow="right" title="小区长申请" />
            <AtListItem arrow="right" title="供应商联系" />
          </AtList>
        </View>
      </View>
    );
  }
}
export default Ucenter as ComponentClass<PageOwnProps, PageState>;