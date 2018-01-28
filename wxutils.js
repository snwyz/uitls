import wx from 'weixin-js-sdk';
import {getWxSignature} from '../service/api'
import {showAlert} from '../common/msgUtils'


var localUrl = window.location.href.split("#")[0];//当前页面路径
var appId = "";
var timestamp = "";
var nonceStr = "";
var signature = "";
var wxInitflag = false; // 是否已经对页面进行了授权,防止重复授权

//初始 wx对象
export const wxInit = () => {
  if (!wxInitflag) {
    getWxSignature({'url': localUrl}).then(function (data) {
      if (data != undefined) {
        appId = data.appId;
        timestamp = data.timestamp;
        nonceStr = data.nonceStr;
        signature = data.signature;
        wx.config({
          debug: false,  // 开启调试模式,
          appId: appId, // 必填，公众号的唯一标识
          timestamp: timestamp, // 必填，生成签名的时间戳
          nonceStr: nonceStr, // 必填，生成签名的随机串
          signature: signature,// 必填，签名，见附录1
          jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline', 'getLocation'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });
        wx.error(function (res) {
          console.error(res.errMsg);
        });

        wxInitflag = true;
      }
    });
  }
}

//分享给朋友
export const wxFriendShare = (shareData) => {
  if (shareData != undefined) {
    var wxdata = {};
    wxdata.imgUrl = shareData.imgUrl;
    wxdata.link = shareData.link;
    var content = shareData.content;
    if (content.length > 100) {
      wxdata.desc = content.substring(0, 100);
    } else {
      wxdata.desc = content;
    }
    //console.info("分享标题:"+shareData.title);
    wxdata.title = shareData.title;
    wx.ready(function () {
      wx.onMenuShareAppMessage({
        title: wxdata.title, // 分享标题
        desc: wxdata.desc, // 分享描述
        link: wxdata.link, // 分享链接
        imgUrl: wxdata.imgUrl, // 分享图标
        type: 'link', // 分享类型,music、video或link，不填默认为link
        success: function () {
          alert("分享成功！");
        },
        cancel: function () {
          alert("分享失败！");
        }
      });
    });
  }
}


//分享到朋友圈
export const wxOnMenuShareTimeline = (shareData) => {
  if (shareData != undefined) {
    var wxdata = {};
    wxdata.imgUrl = shareData.imgUrl;
    wxdata.link = shareData.link;
    wxdata.title = shareData.title;
    wx.ready(function () {
      wx.onMenuShareTimeline({
        title: wxdata.title, // 分享标题
        link: wxdata.link, // 分享链接
        imgUrl: wxdata.imgUrl, // 分享图标
        success: function () {
          alert("分享成功！");
        },
        cancel: function () {
          alert("分享失败！");// 用户取消分享后执行的回调函数
        }
      });
    });
  }
}
/**
 * 获取定位信息
 * @param callback 获取到定位后的回调方法
 */
export const wxGetLocation = (config) => {
  if (config != undefined) {
    wx.ready(function () {
      wx.getLocation({
        type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
        success: function (res) {
          var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
          var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
          var speed = res.speed; // 速度，以米/每秒计
          var accuracy = res.accuracy; // 位置精度
          var location = {};
          location.latitude = latitude;
          location.longitude = longitude;
          location.speed = speed;
          location.accuracy = accuracy;
          config.callback(location);
        }
      });
    });
  }
}