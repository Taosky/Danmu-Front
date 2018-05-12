<template>
  <div class="comments">
    <mu-sub-header>说明</mu-sub-header>
    <mu-content-block>
      个人的Vue小练习，用于快速下载B站弹幕，输入avid可以查找对应视频并添加到列表。
    </mu-content-block>
    <mu-content-block>
      自行下载视频使用<a href="https://github.com/AncientLysine/BiliLocal">BiliLocal</a>播放器即可播放弹幕
    </mu-content-block>
    <mu-content-block>
      后台在heroku，所以比较慢，且30分钟不使用会关闭，下次请求要花几秒重启。
    </mu-content-block>
    <vue-disqus style="margin: 14px" shortname="zxc-danmu" url="https://t.zxc.science/danmu/#about"></vue-disqus>
  </div>
</template>

<script>
  import VueDisqus from 'vue-disqus/VueDisqus.vue'
  export default {
    components: {
      VueDisqus
    }
  }
</script>
