<template>
  <div class="calendar-center">
    <div class="calendar-background" @click="$router.go(-1)">
    </div>
    <div class="calendar">
      <div class="calendar-title">
        {{info.title}}
        <span class="back" @click="$router.go(-1)">取消</span>
      </div>
      <div class="week">
        <div class="week-day weekend-day">日</div>
        <div class="week-day">一</div>
        <div class="week-day">二</div>
        <div class="week-day">三</div>
        <div class="week-day">四</div>
        <div class="week-day">五</div>
        <div class="week-day weekend-day">六</div>
      </div>
      <div class="calendar-content" ref="calendarWraper">
        <div style="">
          <div class="calendar-content-item" v-for="(month,index) in allMonthData" :key="index">
            <div class="calendar-content-title">{{month.year}}年{{month.month}}月</div>
            <ul class="calendar-content-day">
              <li class="day-item" @click="selectDate(month, day)" v-for="(day,i) in month.date" :key="i"
                  :class="{
                                holiday: day.isWeekend || (typeof day.showDate) !== 'number',
                                disable: day.isDisable,
                                CheckInDate: day.isCheckInDate,
                                themeBackground: day.isCheckInDate || day.isCheckOutDate,
                                CheckOutDate: day.isCheckOutDate,
                                section:day.isSection
                            }">
                <p class="day-item-num" git
                   v-if="day.isfestival===false">
                  {{day.showDate}}
                </p>
                <p class="day-item-num" v-else>
                  {{day.isfestival}}
                </p>
                <p class="check-block holiday" v-show="day.isCheckInDate">入住</p>
                <p class="check-block holiday" v-show="day.isCheckOutDate">离店</p>
                <p class="restDay" v-show="day.isRestDay && !day.isWeekend">休</p>
                <!--<p class="allDayNum" v-if="day.isCheckOutDate">-->
                <!--<span>共{{info.night}}晚<i class="el-icon-caret-bottom bottom"></i></span>-->
                <!--</p>-->
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll';

  export default {
    props: {
      info: {}
    },
    data (){
      return {
        allMonthData: [],
        checkInDate: {},
        checkOutDate: {},
        restDayList: {},
        festivalArr: [
          {
            name: '元旦',
            day: '2019-1-1'
          },
          {
            name: '清明节',
            day: '2019-4-5'
          },
          {
            name: '劳动节',
            day: '2019-5-1'
          },
          {
            name: '端午节',
            day: '2019-6-7'
          },
          {
            name: '中秋节',
            day: '2019-9-13'
          },
          {
            name: '圣诞节',
            day: '2019-12-25'
          },
          {
            name: '国庆节',
            day: '2019-10-1'
          },
          {
            name: '元旦',
            day: '2020-1-1'
          },
          {
            name: '除夕',
            day: '2020-1-24'
          },
          {
            name: '春节',
            day: '2020-1-25'
          },
        ]
      };
    },
    created (){
      this.getAllMonthData(3);
      let checkInMonth = Number(this.info.checkInDate.split('-')[1]);
      let checkInDate = Number(this.info.checkInDate.split('-')[2]);
      let checkOutMonth = Number(this.info.checkOutDate.split('-')[1]);
      let checkOutDate = Number(this.info.checkOutDate.split('-')[2]);
      // 循环判断入住和离店日期
      for (let month of this.allMonthData) {
        if (Number(month.month) === checkInMonth) {
          for (let date of month.date) {
            if (Number(date.showDate) === checkInDate) {
              date.isCheckInDate = true;
              this.checkInDate = {
                month: month,
                date: date
              };
              break;
            }
          }
        }
        if (Number(month.month) === checkOutMonth) {
          for (let date of month.date) {
            if (Number(date.showDate) === checkOutDate) {
              date.isCheckOutDate = true;
              this.checkOutDate = {
                month: month,
                date: date
              };
              break;
            }
          }
          break;
        }
      }
      // 判断最后期限
      if (this.info.max) {
        let maxYear = Number(this.info.max.split('-')[0]);
        let maxMonth = Number(this.info.max.split('-')[1]);
        let maxDate = Number(this.info.max.split('-')[2]);
        for (let month of this.allMonthData) {
          for (let date of month.date) {
            if (date.showDate !== '') {
              let itemDate = new Date(month.year, month.month - 1, date.showDate).getTime();
              let max = new Date(maxYear, maxMonth - 1, maxDate).getTime();
              if (itemDate > max) {
                date.isDisable = true;
              }
            }
          }
        }
      }

      if (this.info.min) {
        let minYear = Number(this.info.min.split('-')[0]);
        let minMonth = Number(this.info.min.split('-')[1]);
        let minDate = Number(this.info.min.split('-')[2]);
        for (let month of this.allMonthData) {
          for (let date of month.date) {
            if (date.showDate !== '') {
              let itemDate = new Date(month.year, month.month - 1, date.showDate).getTime();
              let min = new Date(minYear, minMonth - 1, minDate).getTime();
              if (itemDate < min) {
                date.isDisable = true;
              }
            }
          }
        }
      }
      this.$nextTick(function (){
        this._initScroll();
      });
    },
    methods: {
      getMonthData (year, month){
        const checkInDate = new Date(this.info.checkInDate.split('-')[0], this.info.checkInDate.split('-')[1] - 1, this.info.checkInDate.split('-')[2]).getTime();
        const checkOutDate = new Date(this.info.checkOutDate.split('-')[0], this.info.checkOutDate.split('-')[1] - 1, this.info.checkOutDate.split('-')[2]).getTime();
        let ret = [];
        if (!year || !month) {
          let today = new Date();
          year = today.getFullYear();
          month = today.getMonth() + 1;
        }
        let firstDay = new Date(year, month - 1, 1);
        let firstWeekDay = firstDay.getDay();
        let firstDayWeekDay = firstDay.getDay();
        let preMonthDayCount = firstDayWeekDay - 1;
        let lastDay = new Date(year, month, 0);
        let lastDate = lastDay.getDate();
        let isDisable = false;
        for (let i = 0; i < 38; i++) {
          let festival = false;
          let section = false;
          let date = i - preMonthDayCount;
          let showDate = date;
          if (date <= 0) {
            showDate = '';
          } else if (date > lastDate) {
            continue;
          }
          // 设置区间背景颜色
          let itemDate = new Date(year, month - 1, showDate).getTime();
          if (showDate !== '') {
            if (itemDate > checkInDate && itemDate < checkOutDate) {
              section = true;
            }
            isDisable = false;
            festival = this.isFestival(year + '-' + month + '-' + showDate);
          } else {
            isDisable = true;
          }
          let isWeekend = false;
          if ((showDate + firstWeekDay) % 7 === 0 || (showDate + firstWeekDay) % 7 === 1) {
            isWeekend = true;
          }
          let isRestDay = false;
          ret.push({
            showDate: showDate,
            isWeekend: isWeekend,
            isCheckInDate: false,
            isCheckOutDate: false,
            isRestDay: isRestDay,
            isSection: section,
            isDisable: isDisable,
            isfestival: festival
          });
        }
        return ret;
      },
      // 增加日期item
      getAllMonthData (num){
        let todayData = new Date();
        let thisYear = todayData.getFullYear();
        let thisMonth = todayData.getMonth() + 1;
        let temp = [];
        for (let i = 0; i < num; i++) {
          if (thisMonth > 12) {
            thisYear += 1;
            thisMonth = 1;
          }
          temp[i] = {
            year: thisYear,
            month: thisMonth,
            date: this.getMonthData(thisYear, thisMonth)
          };
          thisMonth += 1;
        }
        for (let i of temp[0].date) {
          // 第一个月今天之前的日期不可点击
          let today = new Date();
          if (i.showDate >= today.getDate()) {
            break;
          }
          i.isDisable = true;
        }
        let nowDay = 0;
        for (let i = 0; i < num; i++) {
          temp[i].date.forEach(v => {
            if (nowDay >= this.info.maxDay) {
              v.isDisable = true;
              return false;
            }
            if (v.isDisable !== true && v.showDate !== '') {
              nowDay++;
            }
          });
        }
        this.allMonthData = temp;
      },
      _initScroll (){
        this.itemScoll = new BScroll(this.$refs.calendarWraper, {
          click: true,
          probeType: 1
        });
      },
      selectDate (month, day){
        if (day.isDisable) {
          return;
        }
        this.allMonthData.forEach(v => {
          v.date.forEach(x => {
            x.isSection = false;
          });
        });
        if (this.checkInDate.date.isCheckInDate && this.checkOutDate.date.isCheckOutDate) {
          this.checkInDate.date.isCheckInDate = false;
          this.checkOutDate.date.isCheckOutDate = false;
          day.isCheckInDate = true;
          this.checkInDate = {
            date: day,
            month: month
          };
        } else if (this.checkInDate.date.isCheckInDate && !this.checkOutDate.date.isCheckOutDate) {
          // 判断点击是改变入住日期还是离店日期，年，年相等判断月，月相等判断日
          if (month.year > this.checkInDate.month.year || ((month.year === this.checkInDate.month.year) && (month.month > this.checkInDate.month.month)) || ((month.year === this.checkInDate.month.year) && (month.month === this.checkInDate.month.month) && day.showDate > this.checkInDate.date.showDate)) {
            day.isCheckOutDate = true;
            day.isCheckInDate = false;
            this.checkOutDate = {
              date: day,
              month: month
            };
          } else {
            this.checkInDate.date.isCheckInDate = false;
            day.isCheckInDate = true;
            this.checkInDate = {
              date: day,
              month: month
            };
          }
        }
        if (this.checkInDate.date.isCheckInDate && this.checkOutDate.date.isCheckOutDate) {
          this.info.checkInDate = this.checkInDate.month.year + '-' + this.checkInDate.month.month + '-' + this.checkInDate.date.showDate;
          this.info.checkOutDate = this.checkOutDate.month.year + '-' + this.checkOutDate.month.month + '-' + this.checkOutDate.date.showDate;
          this.$router.go(-1);
        }
      },
      isFestival (date){
        let val = false;
        this.festivalArr.forEach(v => {
          if (date === v.day) {
            val = v.name;
            return false;
          }
        });
        return val;
      }
    }
  }
  ;
</script>

<style lang="less" scoped>
  .calendar-center {
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 110;
    .calendar-title {
      line-height: 0.9rem;
      text-align: center;
      font-size: 15px;
      color: #2b2b2c;
      .back {
        position: absolute;
        top: 0;
        left: 0.3rem;
        color: #a2a2a2;
        font-size: 13px;
      }
    }
    .calendar-background {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      background: #000000;
      opacity: 0.5;
    }
    .calendar {
      position: absolute;
      background: #ffffff;
      height: 10.9rem;
      width: 100%;
      bottom: 0;
      left: 0;
      right: 0;
      .calendar-header {
        border-bottom: solid 1px #EEEEEE;
        background-color: #F28300;
        padding-top: 0.48rem;
        height: 0.8rem;
        line-height: 0.8rem;
        font-size: 0.36rem;
        font-family: PingFang-SC-Bold;
        color: #FFFFFF;
        .back {
          position: absolute;
          padding-left: 0.27rem;
          width: 1rem;
          font-size: 0.32rem;
          .back-icon {
            font-family: iconfont;
          }
        }
        .title {
          text-align: center;
        }
      }
      .week {
        display: flex;
        background-color: #f7f7f7;
        height: 0.54rem;
        line-height: 0.54rem;
        .week-day {
          flex: 1;
          color: #111111;
          font-size: 0.24rem;
          text-align: center;
        }
        .weekend-day {
          color: #F28300;
        }
      }
      .blank {
        margin-top: 1.28rem;
      }
      .calendar-content {
        position: absolute;
        top: 1.45rem;
        bottom: 0;
        width: 100%;
        overflow: hidden;
        font-size: 0.29rem;
        .calendar-content-item {
          .calendar-content-title {
            width: 100%;
            text-align: center;
            padding-top: 0.12rem;
            background: #ffffff;
            color: #a2a2a2;
          }
          .calendar-content-day {
            background: #ffffff;
            overflow: hidden;
            padding-top: 0.5rem;
            .holiday {
              color: #F28300;
            }
            .section {
              background: #EDF5FB;
            }
            .CheckInDate, .CheckOutDate {
              color: #ffffff;
              background-color: #4a90e2;
            }
            .Between {
              background: #fff4b9;
            }
            .day-item {
              position: relative;
              float: left;
              width: 14.2%;
              height: 1.1rem;
              text-align: center;
              .allDayNum {
                position: absolute;
                top: -0.5rem;
                left: 0;
                width: 100%;
                height: 20px;
                line-height: 20px;
                span {
                  position: relative;
                  display: block;
                  height: 20px;
                  width: 48px;
                  line-height: 20px;
                  background: #333333;
                  margin: 0 auto;
                  font-size: 12px;
                  border-radius: 3px;
                  .bottom {
                    display: block;
                    position: absolute;
                    top: 15px;
                    left: 50%;
                    color: #333333;
                    font-size: 0.12rem;
                    margin-left: -6px;
                  }
                }
              }
              .day-item-num {
                margin: 0.1rem auto 0;
                height: 0.46rem;
                /*width: 0.58rem;*/
                line-height: 0.58rem;
              }
              .check-block {
                display: block;
                height: 0.27rem;
                line-height: 0.27rem;
                font-size: 0.2rem;
                color: #ffffff;
              }
              .restDay {
                position: absolute;
                top: 0.2rem;
                right: 0;
                font-size: 0.18rem;
                color: #F28300;
              }
            }
            .disable {
              color: #a2a2a2;
            }
          }
        }
      }
    }
  }
</style>
