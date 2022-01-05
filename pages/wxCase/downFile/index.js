// pages/wxCase/downFile/index.js
import {
  writePhotosAlbum
} from '../../../utils/util'
Page({
  data: {
    img_list: [{
        icon: 'https://i.postimg.cc/mgsKJGLw/susu1.jpg'
      },
      {
        icon: 'https://i.postimg.cc/qRRLS16Q/susu0.jpg'
      },
      {
        icon: 'https://i.postimg.cc/pXDp6RXq/susu3.jpg'
      },
      {
        icon: 'https://i.postimg.cc/XJmpTvCD/susu2.jpg'
      },
      {
        icon: 'https://i.postimg.cc/mgsKJGLw/susu1.jpg'
      },
      {
        icon: 'https://i.postimg.cc/qRRLS16Q/susu0.jpg'
      },
      {
        icon: 'https://i.postimg.cc/pXDp6RXq/susu3.jpg'
      },
      {
        icon: 'https://i.postimg.cc/XJmpTvCD/susu2.jpg'
      },
      {
        icon: 'https://i.postimg.cc/mgsKJGLw/susu1.jpg'
      },
      {
        icon: 'https://i.postimg.cc/qRRLS16Q/susu0.jpg'
      },
    ],
    checkd_list: [],

  },

  choseOne(e) {
    let {
      index
    } = e.currentTarget.dataset, {
      img_list,
    } = this.data;
    img_list[index].checked = !img_list[index].checked;
    let checkd_list = img_list.filter((item) => {
      return item.checked && item
    })
    this.setData({
      img_list,
      checkd_list
    })
  },
  saveTo() {
    this.clicked = false;
    if (!this.clicked) {
      console.log(11111)
      if (this.data.checkd_list.length === 0) {
        this.clicked = true
        return wx.showToast({
          title: '请选择需要保存的图片',
          icon: 'none'
        })
      }
      if (this.data.checkd_list.length > 9) {
        this.clicked = true
        return wx.showToast({
          title: '同时最多只能保存9张图片',
          icon: 'none'
        })
      }
      var that = this;
      writePhotosAlbum(
        function success() {
          that.downForque(that.data.checkd_list).then(res => {
            wx.hideLoading()
            wx.showToast({
              title: '下载完成'
            })
            that.data.img_list.forEach(item => {
              item.checked = false;
            })
            that.setData({
              img_list: that.data.img_list
            })
            that.data.checkd_list = []
            that.clicked = true
          }).catch(err => {
            that.data.img_list.forEach(item => {
              item.checked = false;
            })
            that.setData({
              img_list: that.data.img_list
            })
            that.data.checkd_list = []
            that.clicked = true
            wx.hideLoading()
          })
        },
        function fail() {
          wx.showToast({
            title: '您拒绝了保存到相册',
            icon: 'none'
          })
          that.clicked = true
        }
      )
    }
  },
  // 队列
  downForque(urls) {
    let promise = Promise.resolve()
    urls.forEach((url, index) => {
      promise = promise.then(() => {
        return this.download(url.icon, index)
      })
    })
    return promise;
  },
  download(url, index) {
    let length = this.data.checkd_list.length
    return new Promise((resolve, reject) => {
      wx.downloadFile({
        url: url,
        success: function (res) {
          var temp = res.tempFilePath
          wx.saveImageToPhotosAlbum({
            filePath: temp,
            success: function (res) {
              wx.showLoading({
                title: '下载中(' + (index + 1) + '/' + length + ')'
              })
              resolve(res)
            },
            fail: function (err) {
              reject(res)
            }
          })
        },
        fail: function (err) {
          reject(err)
        }
      })
    })
  },
})