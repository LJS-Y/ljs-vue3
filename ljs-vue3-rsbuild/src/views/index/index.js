import * as EC from 'echarts';
import ec from '@/tools/echartsTool.min.js';
export default {
  name: "Index",
  data() {
    return {
      // 字典
      // carbon_source_income: [],
      win_h: 0,
      // top
      top: {
        // getPie1
        getPie1: {
          ecDom: null, // echartsDom
        },
        // getPie2
        getPie2: {
          ecDom: null, // echartsDom
        },
        // getPie3
        getPie3: {
          ecDom: null, // echartsDom
        },
        // getLine1
        getLine1: {
          ecDom: null, // echartsDom
        },
      },
      // top
      midd: {
        // getLine2
        getLine2: {
          ecDom: null, // echartsDom
        },
        // getLine3
        getLine3: {
          ecDom: null, // echartsDom
        },
        // getBar1
        getBar1: {
          ecDom: null, // echartsDom
        },
      },
      // bottom
      bottom: {
        // getBar2
        getBar2: {
          ecDom: null, // echartsDom
        },
        // getBar3
        getBar3: {
          ecDom: null, // echartsDom
        },
      },
    };
  },
  created() {
    this.init();
  },
  watch: {
    // 浏览器窗口宽度变化监听
    '$store.getters.screenWidth': {
			handler(n) {
        if (
          this.top.getPie1.ecDom !== null &&
          this.top.getPie2.ecDom !== null &&
          this.top.getPie3.ecDom !== null &&
          this.top.getLine1.ecDom !== null &&
          this.midd.getLine2.ecDom !== null &&
          this.midd.getLine3.ecDom !== null &&
          this.midd.getBar1.ecDom !== null &&
          this.bottom.getBar2.ecDom !== null &&
          this.bottom.getBar3.ecDom !== null
        ) {
          this.top.getPie1.ecDom.resize();
          this.top.getPie2.ecDom.resize();
          this.top.getPie3.ecDom.resize();
          this.top.getLine1.ecDom.resize();
          this.midd.getLine2.ecDom.resize();
          this.midd.getLine3.ecDom.resize();
          this.midd.getBar1.ecDom.resize();
          this.bottom.getBar2.ecDom.resize();
          this.bottom.getBar3.ecDom.resize();
        }
			},
			deep: true
    }
  },
  methods: {
    init() {
      this.win_h = document.body.offsetHeight - 114;
      this.initData();
    },
    // 初始化数据
    async initData() {
      // const res1 = await this.$dict.getDict('carbon_source_income');
      // if (res1) {
      //   this.carbon_source_income = res1;
      // }
      this.getTop();
      this.getMidd();
      this.getBottom();
    },
    getTop() {
      this.getPie1();
      this.getPie2();
      this.getPie3();
      this.getLine1();
    },
    // getPie1
    getPie1() {
      const pieData = [];
      for (let i = 0; i < 3; i++) {
        const num1 = Math.ceil(Math.random()*1000);
        const num2 = Math.ceil(Math.random()*100);
        const temp = {
          name: i === 0?'北京':i === 1?'上海':'成都',
          value: num1,
          proportion: num2 + '%',
        };
        pieData.push(temp)
      }
      this.$nextTick(() => {
        this.top.getPie1.ecDom = ec.getPie1({
          myChart: this.top.getPie1.ecDom,
          id: 'getPie1',
          data: pieData
        });
      });
    },
    // getPie2
    getPie2() {
      const pieData = [];
      for (let i = 0; i < 3; i++) {
        const num1 = Math.ceil(Math.random()*1000);
        const num2 = Math.ceil(Math.random()*100);
        const temp = {
          name: i === 0?'前端':i === 1?'后端':'产品',
          value: num1,
          proportion: num2 + '%',
        };
        pieData.push(temp)
      }
      this.$nextTick(() => {
        this.top.getPie2.ecDom = ec.getPie2({
          myChart: this.top.getPie2.ecDom,
          id: 'getPie2',
          data: pieData
        });
      });
    },
    // getPie3
    getPie3() {
      const pieData = [];
      const color = ['#4AC0FF', '#CA25FF', '#AFA3F5', '#00D488', '#3FEED4', '#3BAFFF'];
      for (let i = 0; i < 2; i++) {
        const num1 = Math.ceil(Math.random()*1000);
        const num2 = Math.ceil(Math.random()*100);
        const temp = {
          name: i === 0?'男':'女',
          value: num1,
          proportion: num2 + '%',
          itemStyle: {
            color: color[i],
          },
        };
        pieData.push(temp)
      }
      this.$nextTick(() => {
        this.top.getPie3.ecDom = ec.getPie3({
          myChart: this.top.getPie3.ecDom,
          id: 'getPie3',
          data: pieData
        });
      });
    },
    // getLine1
    getLine1() {
      const dataX = [];
      const data = [];
      for (let i = 0; i < 12; i++) {
        dataX.push((1 + i) + '月');
        const num = Math.ceil(Math.random()*10000);
        data.push(num);
      }
      this.$nextTick(() => {
        this.top.getLine1.ecDom = ec.getLine1({
          myChart: this.top.getLine1.ecDom,
          id: 'getLine1',
          dataX,
          data,
          dw: '次'
        });
      });
    },

    getMidd() {
      this.getLine2();
      this.getLine3();
      this.getBar1();
    },
    // getLine2
    getLine2() {
      let dataX = [];
      let data = [];
      const color = ['#C390F4', '#A5A8EE'];
      for (let j = 0; j < 2; j++) {
        const temp = {
          name: j === 0?'Vite版':'Rsbuild版',
          data: [],
          type: 'line',
          symbol: 'none',
          lineStyle: {
            width: 0
          },
          areaStyle: {
            color: color[j],
            opacity: 0.5
          },
        };
        for (let i = 0; i < 12; i++) {
          if (j === 0) {
            dataX.push((i + 1) + '月');
          }
          const num1 = Math.ceil(Math.random()*1000);
          temp.data.push(num1);
        }
        data.push(temp);
      }
      this.$nextTick(() => {
        this.midd.getLine2.ecDom = ec.getLine2({
          myChart: this.midd.getLine2.ecDom,
          id: 'getLine2',
          dataX,
          data,
          color,
          dw: '次'
        });
      });
    },
    // getLine3
    getLine3() {
      let dataX = [];
      let data = [];
      const color = ['#EF8D4B', '#69A3D8', '#ff7aab', '#e84b1e', '#552ce2', '#ffae21'];
      for (let j = 0; j < 6; j++) {
        const temp = {
          name: j === 0?'制造业':j === 1?'农业':j === 2?'金融':j === 3?'科技':j === 4?'交通运输':'其他',
          data: [],
          type: 'line',
          symbol: 'none',
          lineStyle: {
            width: 2,
            color: color[j]
          },
        };
        for (let i = 0; i < 12; i++) {
          if (j === 0) {
            dataX.push((i + 1) + '月');
          }
          const num1 = Math.ceil(Math.random()*1000);
          temp.data.push(num1);
        }
        data.push(temp);
      }
      this.$nextTick(() => {
        this.midd.getLine3.ecDom = ec.getLine2({
          myChart: this.midd.getLine3.ecDom,
          id: 'getLine3',
          dataX,
          data,
          color,
          dw: '次'
        });
      });
    },
    getBar1() {
      let dataX = [];
      let data = [];
      const color = ['#46DCC8', '#DB80F4'];
      for (let j = 0; j < 2; j++) {
        const temp = {
          name: j === 0?'本年':'去年',
          type: 'bar',
          barMaxWidth: 30,
          data: []
        };
        for (let i = 0; i < 12; i++) {
          if (j === 0) {
            dataX.push((i + 1) + '月');
          }
          const num1 = Math.ceil(Math.random()*30);
          temp.data.push(num1);
        }
        data.push(temp);
      }
      this.$nextTick(() => {
        this.midd.getBar1.ecDom = ec.getBar1({
          myChart: this.midd.getLine3.ecDom,
          id: 'getBar1',
          dataX,
          data,
          color,
          dw: '次'
        });
      });
    },

    getBottom() {
      this.getBar2();
      this.getBar3();
    },
    getBar2() {
      let dataX = [];
      let data = [];
      const color = ['#FE7A7A', '#FA9D25', '#F6FF00'];
      const legend = [
        {
          name: '红色预警',
          itemStyle: {
            color: color[0]
          },
        },
        {
          name: '橙色预警',
          itemStyle: {
            color: color[1]
          },
        },
        {
          name: '黄色预警',
          itemStyle: {
            color: color[2]
          },
        }
      ];
      const itemColor = [
        new EC.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 1,
            color: "#FE7A7A",
          },
          {
            offset: 0,
            color: "#172235",
          },
        ]),
        new EC.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 1,
            color: "#FA9D25",
          },
          {
            offset: 0,
            color: "#172235",
          },
        ]),
        new EC.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 1,
            color: "#F6FF00",
          },
          {
            offset: 0,
            color: "#172235",
          },
        ]),
      ];
      for (let j = 0; j < 3; j++) {
        const dataTemp = {
          name: legend[j].name,
          type: 'bar',
          stack: 'A' + j,
          barMaxWidth: 5,
          data: [],
          itemStyle: {
            color: itemColor[j],
          },
        };
        const stackTemp = {
          type: 'bar',
          stack: 'A' + j,
          barMaxWidth: 5,
          data: [],
          itemStyle: {
            color: color[j],
          },
        };
        for (let i = 0; i < 12; i++) {
          if (j === 0) {
            dataX.push((i + 1) + '月');
          }
          const num1 = Math.ceil(Math.random()*30);
          dataTemp.data.push(num1);
          stackTemp.data.push(1);
        }
        data.push(dataTemp);
        data.push(stackTemp);
      }
      this.$nextTick(() => {
        this.bottom.getBar2.ecDom = ec.getBar2({
          myChart: this.bottom.getBar2.ecDom,
          id: 'getBar2',
          dataX,
          data,
          legend,
          dw: '次'
        });
      });
    },
    getBar3() {
      let dataX = [];
      let data = [];
      const color = ['#FE7A7A', '#FA9D25', '#F6FF00'];
      const legend = [
        {
          name: '红色预警',
          itemStyle: {
            color: color[0]
          },
        },
        {
          name: '橙色预警',
          itemStyle: {
            color: color[1]
          },
        },
        {
          name: '黄色预警',
          itemStyle: {
            color: color[2]
          },
        }
      ];
      for (let j = 0; j < 3; j++) {
        // 修改柱状图的宽度 - 开始
        const barMaxWidth = 20;
        const barWidth = barMaxWidth * 26 / 48;
        const symbolSize = barWidth / 2;
        const py1 = 31.2 * barMaxWidth / 48; // 偏移值
        const shifting1 = j === 0 ? -1 * py1 : j === 1 ? 0 : py1; // 偏移
        const shifting2 = j === 0 ? -1 * py1 : j === 1 ? 0 : py1; // 偏移
        const shifting3 = j === 0 ? -1 * py1 - 2.5 : j === 1 ? -2.5 : py1 - 2.5; // 偏移
        const angle = 10.4 * barMaxWidth / 48; // 上层角度
        // 修改柱状图的宽度 - 结束
        const temp1 = {  // 下面
          data: [],
          color: color[j],
          type: 'pictorialBar',
          tooltip: {
            'show': false
          },
          barMaxWidth: barMaxWidth,
          symbol: 'diamond',
          symbolOffset: [
            shifting1,
            '50%'
          ],
          zlevel: 3,
          symbolSize: [
            barWidth,
            symbolSize
          ]
        };
        const temp2 = {   // 上面
          data: [],
          type: 'pictorialBar',
          tooltip: {
            show: false
          },
          barMaxWidth: barMaxWidth,
          color: color[j],
          symbolPosition: 'end',
          symbol: 'diamond',
          symbolOffset: [
            shifting2,
            '-50%'
          ],
          symbolSize: [
            barWidth,
            angle
          ],
          zlevel: 2
        };
        const temp3 = {  // 阴影 
          data: [],
          type: 'pictorialBar',
          tooltip: {
            show: false
          },
          barMaxWidth: barMaxWidth,
          color: {
            x: 0,
            y: 1,
            x2: 0,
            y2: 0,
            type: 'linear',
            global: false,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(0,0,0,0.2)'
              },
              {
                offset: 1,
                color: 'rgba(0,0,0,0.3)'
              }
            ]
          },
          symbolPosition: 'end',
          symbol: 'rect',
          symbolSize: [
            symbolSize,
            '100%'
          ],
          symbolOffset: [
            shifting3,
            0
          ],
          zlevel: 1
        };
        const temp4 = {
          data: [],
          type: 'bar',
          name: legend[j].name,
          barGap: '20%',
          barWidth: barWidth,
          barMaxWidth: barMaxWidth,
          label: {
            show: true,
            position: 'top',
            distance: 4.8,
            color: color[j],
            fontSize: 8
          },
          itemStyle: {
            color: {
              x: 0,
              y: 1,
              x2: 0,
              y2: 0,
              type: 'linear',
              global: false,
              colorStops: [
                {
                  offset: 0,
                  color: 'rgba(64,132,238,0.2)'
                },
                {
                  offset: 1,
                  color: color[j],
                }
              ]
            }
          }
        };
        for (let i = 0; i < 7; i++) {
          if (j === 0) {
            dataX.push((i + 1) + '月');
          }
          const num1 = Math.ceil(Math.random()*1000);
          temp1.data.push(1);
          temp2.data.push(num1);
          temp3.data.push(num1);
          temp4.data.push(num1);
        }
        data.push(temp1);
        data.push(temp2);
        data.push(temp3);
        data.push(temp4);
      }
      this.$nextTick(() => {
        this.bottom.getBar3.ecDom = ec.getBar3({
          myChart: this.bottom.getBar3.ecDom,
          id: 'getBar3',
          dataX,
          data,
          legend,
          dw: '次'
        });
      });
    },
  }
};