<template>
  <div class="layout">
    <div class="header">
      <div class="logo">
       Danmu
      </div>
      <div class="nav">
        <mu-tabs :value="activeTab" @change="handleTabChange" class="tab">
          <mu-tab value="Danmu" title="Home"/>
          <mu-tab value="About" title="About"/>
        </mu-tabs>
      </div>
    </div>
    <div class="content">
      <div class="breadcrumb" style="height: 24px">
      </div>
      <div class="body" >
        <router-view></router-view>
      </div>
    </div>
    <div class="footer">
      ©2017 Created by zxc.science
    </div>

  </div>
</template>
<script>
  export default {
    data () {
      return {
        activeTab: 'Danmu'
      }
    },
    methods: {
      handleTabChange (val) {
        this.activeTab = val;
        this.$router.push({
          name: val
        })
      }
    }
  }
</script>

<style scoped>
  .layout{
    background-color: rgb(236, 236, 236);
  }

  .header{
    background-color: #7e57c2;
  }

  .logo{
    font-size: 24px;
    color: white;
    display: inline-block;
    padding: 10px 20px;
  }

  .nav{
    display: inline-block;
    width: calc(100% - 150px);
    margin: 0 auto;
  }

  .tab{
    margin: 0 auto;
    width: 400px;
    background-color: rgba(0, 0, 0, 0);
  }

  .content{
    width: 90%;
    margin: 0 auto;
    min-height:100vh;
  }

  .breadcrumb{
    margin: 10px 0;
  }

  .body{
    background-color: white;
    border-radius: 5px;
    min-height: 600px;
  }

  .footer{
    margin-top:10px;
    padding: 20px 0;
    text-align: center;
  }
</style>

