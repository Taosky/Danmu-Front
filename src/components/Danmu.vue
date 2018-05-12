<template>
  <div>
    <mu-linear-progress color="red" v-if="getDataLock"></mu-linear-progress>
    <mu-text-field @keyup.native.enter="search" @input="handleInput" icon="search" maxLength="20"
                   class="appbar-search-field"
                   hintText="AV号(可添加),或标题(仅搜索)"></mu-text-field>
    <mu-table :multiSelectable="false" :showCheckbox="false" @rowClick='handleRowClick'>
      <mu-thead slot="header">
        <mu-tr>
          <mu-th tooltip="Avid" style="width: 10%;">AV号</mu-th>
          <mu-th tooltip="Title" style="width: 40%;">
            标题&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp（点击条目可查看Parts）
          </mu-th>
          <mu-th tooltip="Status" style="width: 15%;text-align: center">视频状态</mu-th>
          <mu-th tooltip="UserCount" style="width: 15%;text-align: center">查询次数</mu-th>
          <mu-th tooltip="CreateDate" style="width: 20%">收录时间</mu-th>
        </mu-tr>
      </mu-thead>
      <mu-tbody>
        <mu-tr title="点击查看所有Part" v-for="item in danmu_data.data" :key="item.avid"
               :selected="item.selected">
          <mu-td style="width: 10%; white-space:normal">{{item.avid}}</mu-td>
          <mu-td style="width: 40%; white-space:normal">{{item.title}}</mu-td>
          <mu-td style="width: 15%; white-space:normal;text-align: center;">
            <mu-flat-button title="" style="vertical-align: middle" target="_blank"
                            :href="`https://www.bilibili.com/video/av${item.avid}/`"
                            v-if="!item.deleted" @click="" label="查看" class="demo-flat-button"
                            primary></mu-flat-button>
            <mu-flat-button title="" style="vertical-align: middle" v-if="item.deleted" label="下架"
                            class="demo-flat-button"
                            disabled></mu-flat-button>
          </mu-td>
          <mu-td style="width: 15%; white-space:normal;text-align: center">{{item.user_count}}</mu-td>
          <mu-td style="width: 20%; white-space:normal">{{item.create_date}}</mu-td>
        </mu-tr>
      </mu-tbody>
    </mu-table>
    <mu-pagination v-if="danmu_data.db_count > 10" :current="currentPage" :total="danmu_data.db_count"
                   :showSizeChanger="showSizeChanger"
                   :pageSizeOption="pageSizeOption"
                   @pageChange="handlePageChange"
                   @pageSizeChange="handlePageSizeChange">
    </mu-pagination>
    <mu-popup position="left" popupClass="popup-left" :open="danmuPopUp" @close="closePopup('left')">

      <mu-list>
        <mu-flat-button :data-clipboard-text="copyXmlText" label="复制全部" class="copy-btn" icon="content_copy"
                        primary></mu-flat-button>
        <mu-divider style="margin-top: 14px;margin-bottom: 14px;"></mu-divider>
        <p>（部分浏览器须另存为）</p>
        <mu-raised-button v-for="part,index in popup_data" :href="part.xml" :label="index+'、'+part.name" :key="index"
                          class="raised-button" :download="part.name + '.xml'"></mu-raised-button>
      </mu-list>

    </mu-popup>
    <mu-dialog style="height: auto;width: 100px!important;" :scrollable="true" :open="failDialog" title="复制失败">
      {{ copyXmlText }}
      <mu-flat-button label="确定" slot="actions" primary @click="closeDialog"></mu-flat-button>
    </mu-dialog>
    <mu-dialog style="height: auto;width: 100px!important;" :scrollable="false" :open="successDialog" title="复制成功">
      <span>粘贴到下载工具即可下载</span>
      <mu-flat-button label="确定" slot="actions" primary @click="closeDialog"></mu-flat-button>
    </mu-dialog>
    <mu-snackbar v-if="snackbar" :message="snackbarMessage" action="关闭" @actionClick="hideSnackbar"
                 @close="hideSnackbar"></mu-snackbar>
  </div>
</template>

<script>
  import axios from 'axios'
  import Clipboard from 'clipboard'

  export default {
    data: function () {
      return {
        getDataLock: false,
        showSizeChanger: true,
        pageSizeOption: [10, 20, 30, 40],
        currentPage: 1,
        limit: 10,
        popup_data: [],
        danmu_data: {},
        searchWord: '',
        copyXmlText: '',
        danmuPopUp: false,
        successDialog: false,
        failDialog: false,
        snackbar: false,
        snackbarMessage: '提交请求过快'
      }
    },
    methods: {
      getData: function (avid = '', title = '') {
        if (!this.getDataLock) {
          this.getDataLock = true;
          let vm = this; //alias this before axios
          let url = `https://zxc-flask.herokuapp.com/api/danmu/get_data?avid=${avid}&title=${title}&limit=${this.limit}&page=${this.currentPage}`;
//          let url = `/api/danmu/get_data?avid=${avid}&title=${title}&limit=${this.limit}&page=${this.currentPage}`;
          axios.get(url).then(function (response) {
              console.log('getData success');
              console.log(response.data);
              vm.danmu_data = response.data;
              setTimeout(function () {
              vm.getDataLock = false;
            }, 500);
            }
          ).catch(function (error) {
            vm.snackbarMessage = '数据加载失败！';
            vm.showSnackbar(false);
            console.log('getData error: ' + error)
            setTimeout(function () {
              vm.getDataLock = false;
            }, 1500);
          });
        }
        else {
          console.log('waiting for request finish')
        }
      },
      search: function () {
        if (this.getDataLock) {
          this.snackbarMessage = '提交请求过快!';
          this.showSnackbar()
        }
        this.limit = 10;
        this.currentPage = 1;
        console.log('search');
        if (/^\d{4,12}$/.test(this.searchWord)) {
          this.getData(this.searchWord, '')
        } else {
          this.getData('', this.searchWord)
        }
      },
      handlePageChange: function (newPage) {
        this.currentPage = newPage;
        this.getData();
      },
      handlePageSizeChange: function (newLimit) {
        this.limit = newLimit;
        this.getData()
      },
      handleInput: function (value) {
        this.searchWord = value
      },
      closePopup: function () {
        this.danmuPopUp = false
      },
      handleRowClick: function (index) {
        console.log('tr selected:' + index);
        this.popup_data = this.danmu_data.data[index].parts;
        this.danmuPopUp = true;
        this.copyXmlText = '';
        for (let part of this.danmu_data.data[index].parts) {
          this.copyXmlText += part['xml'] + '\n';
        }
      },
      closeDialog: function () {
        this.successDialog = false;
        this.failDialog = false
      },
      showSnackbar(timeout = true) {
        this.snackbar = true;
        if (this.snackTimer) clearTimeout(this.snackTimer);
        if (timeout) {
          this.snackTimer = setTimeout(() => {
            this.snackbar = false
          }, 2000)
        }

      },
      hideSnackbar: function () {
        this.snackbar = false;
        if (this.snackTimer) clearTimeout(this.snackTimer)
      }
    },
    created: function () {
      this.getData();
      let vm = this;
      let clipboard = new Clipboard('.copy-btn');
      clipboard.on('success', function (e) {
        vm.successDialog = true;
      });

      clipboard.on('error', function (e) {
        vm.failDialog = true;
      });
    }
  };


</script>

<style>
  .popup-left {
    display: flex;
    width: 85%;
    max-width: 375px;
    height: 100%;
    padding: 24px;
  }

  .raised-button {
    margin: 12px !important;
    width: auto !important;
    max-width: 260px !important;
    height: auto !important;
    max-height: 80px !important;
    font-size: 14px !important;
    line-height: 150% !important;
  }
</style>
