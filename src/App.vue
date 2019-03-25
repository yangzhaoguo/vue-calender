<template>
  <div id="app">
    <div class="time-box flex">
      <div class="left">
        <router-link class="input-box-item-content" to="/Calendarpage" tag="div" type="text">
          <div class="title">入店</div>
          <div>
            <span class="name">{{info.checkInDate}}</span>
          </div>
        </router-link>
      </div>
      <div class="right">
        <router-link class="input-box-item-content" to="/Calendarpage" tag="div" type="text">
          <div class="title">离店</div>
          <div>
            <span class="name">{{info.checkOutDate}}</span>
          </div>
        </router-link>
      </div>
    </div>
    <router-view :info="info"></router-view>
  </div>
</template>

<script>

  export default {
    name: 'App',
    data (){
      return {
        info: {
          title: '选择入住离店日期',
          checkInDate: '', // 入住日期
          checkOutDate: '', // 离店日期
          min: '', // 开始时间默认未'' , 如果有格式为'yyyy-mm-dd'
          max: '', // 结束时间默认未'' , 如果有格式为'yyyy-mm-dd'
          maxDay: 60, // 显示最大天数
        },
      }
    },
    methods: {
      initInfo (){
        this.info.checkInDate = new Date().Format('yyyy-MM-dd')
        this.info.checkOutDate = new Date().Format('yyyy-MM-dd')
      }
    },
    created (){
      this.initInfo()
    }
  }
</script>

<style>
  * {
    margin: 0;
    padding: 0;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }

  ui, li {
    list-style: none;
  }
</style>
