<template>
  <div>
    <Title ref="AppTitle" :can-back="true" />
    <div class="main">
      <WorkSide/>
      <!-- <WorkSide @blockClick="onBlockCLick"/> -->
      <div class="workBoard">
        <!--   右侧弹出菜单     -->
        <el-drawer
            :visible.sync="drawer"
            :with-header="false" :size="drawerWidth"
            :before-close="onDrawClose" style="font-size: 14px;">
          <!--     普通参数     -->
          <div v-if="drawerType=='default'">
            <div style="margin: 30px">{{ blockItem ? blockItem.name : '' }}</div>
            <div style="margin: 30px">描述:{{ blockItem ? '&#8195;' + blockItem.describe : '' }}</div>
            <div v-if="blockItem && blockItem.pList && blockItem.pList.length>0">
              <div style="margin-left: 30px">参数设置</div>
              <div class="blockParams">
                <div class="blockParamItem" v-for="item in blockItem.pList" :key="item.id">
                  <div>{{ item.name }}</div>
                  <el-select v-model="item.value" size="small" style="margin-left: 30px;width: 200px"
                             v-if="item.values && item.values.length>0">
                    <el-option
                        v-for="selectItem in item.values"
                        :key="selectItem"
                        :label="selectItem"
                        :value="selectItem">
                    </el-option>
                  </el-select>
                  <el-input v-else v-model="item.value" size="small" style="margin-left: 30px;width: 200px"/>
                </div>
              </div>
            </div>
          </div>

          <!--     神经网络参数     -->
          <div v-if="drawerType=='shenjing'">
            <div style="margin: 30px">{{ blockItem ? blockItem.name : '' }}</div>
            <div style="display: flex;flex-direction: row;align-items: center;">
              <el-select v-model="shenJingSelectId" size="small" style="margin-left:30px;width: 200px">
                <el-option
                    v-for="item in shenJingSelect"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
              </el-select>
              <el-button type="primary" size="small" style="margin-left: 30px" @click="addShenJingChild(blockItem)">添加
              </el-button>
            </div>
            <div>
              <div class="blockChildParam" style="margin-top: 30px">
                <div class="blockChildParamItem" v-for="(blockChild,blockChildIndex) in blockItem.blockList" :key="blockChildIndex">
                  <el-button v-if="blockItem.blockList.length > 1" class="blockChildParamItemDelete"
                             icon="el-icon-delete"
                             circle size="small" @click="deleteShenJingChild(blockChildIndex)"/>
                  <div style="margin-top: 30px;margin-left: 20px">{{ blockChild.name }}</div>
                  <div class="blockChildParamList">
                    <div class="blockChildParamListItem" v-for="(item,itemIndex) in blockChild.pList" :key="itemIndex" :style="{
                      marginBottom:itemIndex == blockChild.pList.length-1?'30px':'0'
                    }">
                      <div>{{ item.name }}</div>
                      <el-select v-model="item.value" size="small" style="width: 80px;margin-left: 10px"
                                 v-if="item.values && item.values.length>0">
                        <el-option
                            v-for="selectItem in item.values"
                            :key="selectItem"
                            :label="selectItem"
                            :value="selectItem">
                        </el-option>
                      </el-select>
                      <el-input v-else v-model="item.value" size="small" style="width: 80px;margin-left: 10px"/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!--     运行结果     -->
          <div v-if="drawerType =='run_success'">
            <div style="margin: 30px">运行项目</div>
            <div class="runResult">
              <div>本次运行的结果为：{{ resultMessage }}</div>
            </div>
          </div>

          <div v-if="drawerType =='run_fail'">
            <div style="margin: 30px">运行项目</div>
            <div class="runResult">
              <div>错误信息：{{ resultMessage }}</div>
            </div>
          </div>

          <!--     训练结果     -->
          <div v-if="drawerType == 'train_success'">
            <div style="margin: 30px">训练项目</div>
            <div class="runResult">
              <template v-if="resultImage">
                <el-image :src="resultImage" />
              </template>
              <template v-if="resultMessage">
                <div>本次训练在验证集上的的准确率为: {{ resultMessage }}%</div>
              </template>
            </div>
          </div>

          <div v-if="drawerType == 'train_fail'">
            <div style="margin: 30px">训练项目</div>
            <div class="runResult">
              <template v-if="resultMessage">
                <div>错误信息：{{ resultMessage }}</div>
              </template>
            </div>
          </div>

          <!--     验证结果     -->
          <div v-if="drawerType =='val_success'">
            <div style="margin: 30px">验证项目</div>
            <div class="runResult">
              <div>本次验证的准确率为：{{ resultMessage }}%</div>
            </div>
          </div>

          <div v-if="drawerType =='val_fail'">
            <div style="margin: 30px">验证项目</div>
            <div class="runResult">
              <div>错误信息: {{ resultMessage }}</div>
            </div>
          </div>

          <div v-if="drawerType == 'share'">
            <div style="margin: 30px">项目分享</div>
            <div class="runResult">
              <div>当前项目分享码: {{ resultMessage }}</div>
            </div>
          </div>

        </el-drawer>
        <!--   工作台子     -->
        <div class="workConsole" :style="{
          width:`calc(100vw - ${(drawerWidth+150)}px)`
        }">
          <div class="workConsoleTitle">
            <div style="margin-left: 30px">{{ workName }}</div>
          </div>

          <div class="blockList" @dragover.prevent @drop="onDrop">
            <div class="blockDisplay">
              <draggable v-model="blockList" group="blocks">
                <div class="blockArr" v-for="(arr, arrIndex) in blockList" :key="arrIndex">
                  <div class="blockItem" v-for="(item, index) in arr" :key="index" :style="{ 
                    marginLeft: index === 0 ? '0' : '-10px' 
                    }" @click="onBlockItemCLick(item)">
                    <el-image :src="item.image" />
                    <div class="blockItemName">{{ item.name }}</div>
                    <el-button class="deleteBtn" size="mini" type="danger" icon="el-icon-delete" @click="deleteBlock(item)">删除</el-button>
                  </div>
                </div>
              </draggable>
            </div>
          </div>
          
          <div class="optionBtn">
            <!-- <el-button type="primary" size="small" @click="unDoWork">撤销</el-button> -->
            <el-button type="primary" size="small" :disabled="work.type==2||work.type==3" @click="trainWork">训练</el-button>
            <el-button type="primary" size="small" @click="runWork">运行</el-button>
            <el-button type="primary" size="small" @click="validate">验证</el-button>
            <el-button type="primary" size="small" @click="saveWork">保存</el-button>
            <el-button type="primary" size="small" @click="shareWork">分享</el-button>
          </div>
        </div>
      </div>
    </div>
    <RunDialog :show-dialog="showRunDialog" @cancel="showRunDialog=false" :type="work.type" @ok="onRunOk"/>
    <TrainDialog :show-dialog="showTrainDialog" @cancel="showTrainDialog=false" @ok="onTrainOk"/>
    <ValDialog :show-dialog="showValDialog" @cancel="showValDialog=false" @ok="onValOk"/>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import Title from "@/components/common/Title";
import WorkSide from "@/components/work/WorkSide";
import {
  getBlockDetail,
  getProjectDetail,
  getTrainCheck,
  projectSave,
  projectTraining,
  getTrainResult,
  projectRun,
  projectVal,
  projectModel,
  getRunResult,
  getValResult,
  stopProject,
  checkConnect
} from "@/http/workRequest";

import alpha from "@/assets/AlphaBeta剪枝积木.png"
import face from "@/assets/人脸识别积木.png"
import qiPan from "@/assets/创建棋盘积木.png"
import tuXiang from "@/assets/图像预处理积木.png"
import study from "@/assets/学方法积木.png"
import shouShi from "@/assets/手势识别积木.png"
import shuJu from "@/assets/数据输入积木.png"
import shenJing from "@/assets/神经网络积木.png"
import pingGu from "@/assets/评估函数积木.png"
import jinHua from "@/assets/进化算法积木.png"
import shiYing from "@/assets/适应度计算积木.png"
import yinPin from "@/assets/音频转频谱图积木.png"
import yuyin from "@/assets/语音转文字积木.png"
import wenzi from "@/assets/文字转词向量积木.png"
import xiangsi from "@/assets/相似度计算积木.png"
import ssh from "@/assets/SSH连接积木.png"
import qinggan from "@/assets/情感设置积木.png"
import RunDialog from "@/components/work/RunDialog";
import TrainDialog from "@/components/work/TrainDialog";
import ValDialog from "@/components/work/ValDialog";

const studyId = 1011;
const shenJingId = 1008;
const drawerWidthValue = 500;
let trainLoading = null;
let trainInterVal = null;
let runLoading = null;
let runInterVal = null;
let valLoading = null;
let valInterVal = null;

export default {
  name: "Work",
  components: {TrainDialog, RunDialog, ValDialog ,WorkSide, Title, draggable},
  data() {
    return {
      id: '',
      isDragging: false,
      drawer: false,
      drawerWidth: 0,
      drawerType: 'default',
      work: '',
      blockList: [],
      blockItem: null,
      shenJingSelect: [],
      shenJingSelectId: '',
      showRunDialog: false,
      showTrainDialog: false,
      showValDialog: false,
      resultMessage: '',
      resultImage: ''
    }
  },

  computed: {
    workName() {
      return this.work ? this.work.name : ''
    }
  },


  mounted() {
    this.id = this.$route.query.id;
    this.$refs.AppTitle.switchTitle('项目管理');
    this.getDetail();
  },

  destroyed() {
    this.cancelTrainInterval();
    this.cancelRunInterval();
    this.cancelValInterval();
  },

  methods: {

    /**
     * 项目详情
     */
    getDetail() {
      getProjectDetail(this.id).then(data => {
        if (data.state === 100) {
          this.work = data.data;
          let flag = this.work.flag;
          switch (flag) {
            case 1:
              this.openDrawer('train_success');
              this.resultImage = this.work.filePath;
              this.resultMessage = "";
              break;
            case 2:
              this.$message.success("请开始训练")
              break;
            case 3:
              this.getTrainResult();
              break;
          }
          this.blockList = [];
          let algorithmList = this.work.algorithmList;
          if (algorithmList && algorithmList.length > 0) {
            //组装展示数组
            let study = this.getStudy(algorithmList);
            if (study.index >= 0) {
              algorithmList.splice(study.index, 1)
            }

            for (let index = 0; index < algorithmList.length; index++) {
              let arr = []
              let o = this.getBlock(algorithmList[index]);
              if (o) {
                arr.push(o)
                this.blockList.push(arr)
                this.initParam(o)
              }
            }

            if (study.index >= 0) {
              let shenJingIndex = this.getShenJingIndex();
              if (shenJingIndex >= 0) {
                let arr = this.blockList[shenJingIndex];
                let o = this.getBlock(study.block)
                if (o) {
                  arr.push(o)
                  this.initParam(o)
                }
              }
            }
          }
        }
      }).catch(reason => {
      })
    },

    /**
     * 保存项目
     */
    saveWork() {
      let algorithmList = [];
      for (let index = 0; index < this.blockList.length; index++) {
        let arr = this.blockList[index];
        for (let arrIndex = 0; arrIndex < arr.length; arrIndex++) {
          algorithmList.push(arr[arrIndex])
        }
      }
      let data = {
        projectId: this.id,
        algorithmList: algorithmList
      }
      projectSave(data).then(data => {
        if (data.state === 100) {
          this.$message.success("保存成功")
        } else {
          this.$message.error("保存失败")
        }
      }).catch(reason => {

      })
    },

    shareWork() {
      projectModel(this.id).then(data => {
        if (data.state === 100) {
          this.openDrawer('share');
          this.resultMessage = data.data;
        } else {
          this.$message.error("当前项目还没有训练模型")
        }
      }).catch(reason => {

      })
    },

    /**
     * 训练项目
     */
    trainWork() {
      getTrainCheck().then(data => {
        if (data.state === 100) {
          if (!data.data) {
            // this.showTrainDialog = true;
          } else {
            this.$message.error("当前有项目正在训练，请等待")
          }
        }
      }).catch(reason => {
      })
      this.saveWork();
      let username = this.$store.getters.username;
      let load = this.$loading({
        lock: true,
        text: "尝试连接客户端...",
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.5)',
        customClass: 'check-loading'
      });
      Promise.race([
        checkConnect(username),
        new Promise((resolve, reject) => {
          setTimeout(() => {
            reject();
          }, 1000);
        })
      ])
        .then(() => {
          this.showTrainDialog = true;
          load.close();
          load = null;
        })
        .catch(() => {
          if(this.showTrainDialog == false){
            this.$message.error('连接超时，请检测客户端运行状态！')};
          load.close();
          load = null;
        });
    },
    
    onTrainOk(e) {
      this.showTrainDialog = false;
      let data = {
        username: this.$store.getters.username,
        projectId: this.id,
        path: e.path,
        datasetsId: e.datasetsId
      };

      projectTraining(data).then(data => {
        if (data.state === 100) {
          this.getTrainResult()
        }
      }).catch(reason => {
      })
    },

    /**
     * 获取训练结果
     */
    getTrainResult() {
      if (trainInterVal) {
        this.cancelTrainInterval();
      }
      this.getTrainLoading();
      trainInterVal = setInterval(() => {
        getTrainResult(this.id).then(data => {
          if (data.state === 100) {
            let result = data.data;
            let flag = result.flag;
            switch (flag) {
              case 1:
                this.openDrawer('train_success');
                this.resultImage = result.path;
                this.resultMessage = result.result;
                break;
              case 2:
                this.openDrawer('train_fail');
                this.resultImage = "";
                this.resultMessage = result.result;
                this.$message.error("训练失败，请重新训练")
                break;
            }
            if (flag !== 3) {
              this.cancelTrainInterval();
            }
          }else {
            this.cancelTrainInterval();
          }
        }).catch(reason => {
          this.cancelTrainInterval()
        })
      }, 1000 * 5);
    },

    getTrainLoading() {
      // 添加取消按钮
      const cancelBtn = document.createElement('el-button');
      cancelBtn.innerText = '取 消';
      cancelBtn.className = 'el-button el-button--warning el-button--small';
      cancelBtn.style = 'margin-top: 8px; font-size: 14px !important;';
      cancelBtn.addEventListener('click', this.stopTrainInterval);
  
      trainLoading = this.$loading({
        lock: true,
        text: "训练中",
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
        customClass: 'custom-loading'
      });
      // 找到加载状态元素
      const loadingEl = document.querySelector('.custom-loading .el-loading-spinner');
      loadingEl.appendChild(cancelBtn);
    },

    cancelTrainInterval() {
      if (trainInterVal) {
        clearInterval(trainInterVal);
        trainInterVal = null;
      }
      if (trainLoading) {
        trainLoading.close();
        trainLoading = null;
      }
    },

    stopTrainInterval(){
      let data = {
        username: this.$store.getters.username,
        projectId: this.id
      };
      stopProject(data).then(data => {
        if (data.state === 100) {
          // this.getTrainResult()
        }
      }).catch(reason => {
      })

      if (trainInterVal) {
        clearInterval(trainInterVal);
        trainInterVal = null;
      }
      if (trainLoading) {
        trainLoading.close();
        trainLoading = null;
      }
    },

    /**
     * 运行项目
     */
    runWork() {
      if (this.work.type == 1 || this.work.type==3) {
        // this.showRunDialog = true;
      } else {
        this.onRunOk()
      }
      this.saveWork();
      let username = this.$store.getters.username;
      let load = this.$loading({
        lock: true,
        text: "尝试连接客户端...",
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.5)',
        customClass: 'check-loading'
      });
      Promise.race([
        checkConnect(username),
        new Promise((resolve, reject) => {
          setTimeout(() => {
            reject();
          }, 1000);
        })
      ])
        .then(() => {
          this.showRunDialog = true;
          load.close();
          load = null;
        })
        .catch(() => {
          if(this.showRunDialog == false){
            this.$message.error('连接超时，请检测客户端运行状态！')};
          load.close();
          load = null;
        });
    },

    onRunOk(e) {
      this.showRunDialog = false;
      let data = {
        username: this.$store.getters.username,
        projectId: this.id,
        filename: e ? e.file : '',
        datasetsId: e ? e.datasetsId : '0'
      };

      projectRun(data).then(data => {
        if (data.state === 100) {
          this.getRunResult()
        }
      }).catch(reason => {
      })
    },

    /**
     * 获取运行结果
     */
    getRunResult() {
      if (runInterVal) {
        this.cancelRunInterval();
      }
      this.getRunLoading();
      runInterVal = setInterval(() => {
        getRunResult(this.id).then(data => {
          if (data.state === 100) {
            let result = data.data;
            let flag = result.flag;
            switch (flag) {
              case 1:
                this.openDrawer('run_success');
                this.resultMessage = result.result;
                break;
              case 2:
                this.$message.error("运行失败，请重新运行")
                this.openDrawer('run_fail');
                this.resultMessage = result.result;
                break;
            }
            if (flag !== 3) {
              this.cancelRunInterval();
            }
          }else {
            this.cancelRunInterval();
          }
        }).catch(reason => {
          this.cancelRunInterval()
        })
      }, 1000 * 5);
    },

    getRunLoading() {
      runLoading = this.$loading({
        lock: true,
        text: '运行中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
    },

    cancelRunInterval() {
      if (runInterVal) {
        clearInterval(runInterVal);
        runInterVal = null;
      }
      if (runLoading) {
        runLoading.close();
        runLoading = null;
      }
    },

    /**
     * 验证模型
     */
    validate() {
      if (this.work.type == 1 || this.work.type==3) {
        // this.showValDialog = true;
      } else {
        this.onValOk()
      }
      this.saveWork();
      let username = this.$store.getters.username;
      let load = this.$loading({
        lock: true,
        text: "尝试连接客户端...",
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.5)',
        customClass: 'check-loading'
      });
      Promise.race([
        checkConnect(username),
        new Promise((resolve, reject) => {
          setTimeout(() => {
            reject();
          }, 1000);
        })
      ])
        .then(() => {
          this.showValDialog = true;
          load.close();
          load = null;
        })
        .catch(() => {
          if(this.showValDialog == false){
            this.$message.error('连接超时，请检测客户端运行状态！')};
          load.close();
          load = null;
        });
    },
    
    onValOk(e) {
      this.showValDialog = false;
      let data = {
        username: this.$store.getters.username,
        projectId: this.id,
        path: e.path,
        datasetsId: e ? e.datasetsId : '0'
      };

      projectVal(data).then(data => {
        if (data.state === 100) {
          this.getValResult()
        }
      }).catch(reason => {
      })
    },

    /**
     * 获取验证结果
     */
     getValResult() {
      if (valInterVal) {
        this.cancelValInterval();
      }
      this.getValLoading();
      valInterVal = setInterval(() => {
        getValResult(this.id).then(data => {
          if (data.state === 100) {
            let result = data.data;
            let flag = result.flag;
            switch (flag) {
              case 1:
                this.openDrawer('val_success');
                this.resultMessage = result.result;
                break;
              case 2:
                this.openDrawer('val_fail');
                this.$message.error("验证失败，请重新验证")
                this.resultMessage = result.result;
                break;
            }
            if (flag !== 3) {
              this.cancelValInterval();
            }
          }else {
            this.cancelValInterval();
          }
        }).catch(reason => {
          this.cancelValInterval()
        })
      }, 1000 * 5);
    },

    getValLoading() {
      valLoading = this.$loading({
        lock: true,
        text: '验证中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
    },

    cancelValInterval() {
      if (valInterVal) {
        clearInterval(valInterVal);
        valInterVal = null;
      }
      if (valLoading) {
        valLoading.close();
        valLoading = null;
      }
    },

    /**
     * 添加积木
     */
     addBlock(data, targetArrIndex) {
      
      let o = this.getBlock(data)
      if (o) {
        if (o.id == studyId) {
          let shenJingIndex = this.getShenJingIndex();
          if (shenJingIndex >= 0) {
            let arr = this.blockList[shenJingIndex];
            arr.push(o)
            this.initParam(o)
          }
        } else {
          let arr = [];
          arr.push(o);
          // this.blockList.push(arr)
          this.blockList.splice(targetArrIndex, 0, arr);
          this.initParam(o)
        }
      }
    },

    onDrop(event) {

      event.preventDefault();
      const data = event.dataTransfer.getData('data');
      const block = data ? JSON.parse(data) : null;
      if(block){
        let targetArrIndex;
        if(this.blockList.length>0){
          let targetArr = event.target.closest('.blockArr');
          if (!targetArr) {
            const allBlockArrs = Array.from(document.querySelectorAll('.blockArr'));
            const distances = allBlockArrs.map((arr) => {
              const rect = arr.getBoundingClientRect();
              return {
                arr,
                distance: Math.abs(event.clientY - rect.top)
              };
            });
            distances.sort((a, b) => a.distance - b.distance);
            targetArr = distances[0].arr;
            targetArrIndex = allBlockArrs.indexOf(targetArr);
            if (targetArrIndex === this.blockList.length-1) {
              targetArrIndex++; 
            };
          } 
          else {
            targetArrIndex = Array.from(targetArr.parentNode.children).indexOf(targetArr);
          }
      }
      else{
        targetArrIndex = 0;
      }  
      this.addBlock(block, targetArrIndex);
      }
    },

    /**
     * 删除积木
     */
    deleteBlock(item) {
      for (let i = 0; i < this.blockList.length; i++) {
        let index = this.blockList[i].indexOf(item)
        if (index !== -1) {
          this.blockList[i].splice(index, 1)
          break;
        }
      }
    },

    /**
     * 点击积木添加参数
     */

    onBlockItemCLick(item) {
      this.openDrawer('default');
      this.blockItem = item;
      if (item.id == shenJingId) {
        this.drawerType = 'shenjing';
      }
    },

    /**
     * 组装参数
     */

    initParam(o) {
      getBlockDetail(o.id).then(data => {
        if (data.state === 100) {
          this.initItem(o, data.data);
        }
      }).catch(reason => {
      })
    },


    onDrawClose() {
      this.drawerWidth = 0;
      this.drawer = false;
    },

    openDrawer(drawerType) {
      this.drawerWidth = drawerWidthValue;
      this.drawer = true;
      this.drawerType = drawerType;
    },

    getStudy(arr) {
      for (let index = 0; index < arr.length; index++) {
        if (arr[index].id == studyId) {
          return {
            block: arr[index],
            index: index
          };
        }
      }
      return {
        block: null,
        index: -1
      };
    },


    getShenJingIndex() {
      for (let index = 0; index < this.blockList.length; index++) {
        let arr = this.blockList[index];
        for (let itemIndex = 0; itemIndex < arr.length; itemIndex++) {
          if (arr[itemIndex].id == shenJingId) {
            return index;
          }
        }
      }
      return -1;
    },

    getBlock(o) {
      if (this.containsBlock(o)) {
        this.$message.error("已存在相同积木")
        return null;
      }
      if (o.id == studyId) {
        if (!this.containsBlock({id: shenJingId})) {
          this.$message.error("请添加神经网络积木")
          return null;
        }
      }
      switch (parseInt(o.id)) {
        case 1001:
          o.image = pingGu;
          break;
        case 1002:
          o.image = alpha;
          break;
        case 1003:
          o.image = shuJu;
          break;
        case 1004:
          o.image = yinPin;
          break;
        case 1005:
          o.image = shouShi;
          break;
        case 1006:
          o.image = face;
          break;
        case 1007:
          o.image = tuXiang;
          break;
        case 1008:
          o.image = shenJing;
          break;
        case 1011:
          o.image = study;
          break;
        case 1012:
          o.image = qiPan;
          break;
        case 1013:
          o.image = jinHua;
          break;
        case 1014:
          o.image = shiYing;
          break;
        case 1015:
          o.image = ssh;
          break;
        case 1016:
          o.image = yuyin;
          break;
        case 1017:
          o.image = wenzi;
          break;
        case 1018:
          o.image = xiangsi;
          break;
        case 1019:
          o.image = qinggan;
          break;
      }
      return o;
    },

    initItem(item, detail) {
      item.childList = detail.childList;
      item.describe = detail.describe;
      this.$set(item,"name",detail.name);
      if (item.id == shenJingId) {
        let childList = detail.childList;
        if (childList) {
          this.shenJingSelect = [];
          for (let index = 0; index < childList.length; index++) {
            let child = childList[index];
            this.shenJingSelect.push({
              id: child.id,
              name: child.name
            })
          }
          if (this.shenJingSelect.length > 0) {
            this.shenJingSelectId = this.shenJingSelect[0].id
          }
          if (item.blockList && item.blockList.length > 0) {
            for (let blockIndex = 0; blockIndex < item.blockList.length; blockIndex++) {
              let block = item.blockList[blockIndex];
              this.initBlock(block, childList)
            }
          } else {
            this.$set(item, 'blockList', []);
            this.addShenJingChild(item)
          }
        }
      } else {
        if (!item.pList) {
          this.$set(item, "pList", [])
        }
        this.initPList(item.pList, detail.pList)
      }
    },

    initBlock(block, childList) {
      if (childList) {
        for (let childIndex = 0; childIndex < childList.length; childIndex++) {
          let child = childList[childIndex];
          if (block.blockId == child.id) {
            block.name = child.name;
            if (!block.pList) {
              block.pList = []
            }
            this.initPList(block.pList, child.pList);
          }
        }
      }
    },

    initPList(p1, p2) {
      if (p1.length === 0) {
        for (let index = 0; index < p2.length; index++) {
          let param = p2[index];
          let values = ''
          if (param.values) {
            values = param.values.split("/")
          }
          p1.push({
            name: param.name,
            param: param.param,
            values: values,
            value: param.defaults
          });
        }
      } else {
        for (let p1Index = 0; p1Index < p1.length; p1Index++) {
          let param1 = p1[p1Index];
          for (let p2Index = 0; p2Index < p2.length; p2Index++) {
            let param2 = p2[p2Index];
            if (param1.param == param2.param) {
              param1.name = param2.name;
              if (!param1.value) {
                this.$set(param1, 'value', param2.defaults)
              }
              if (param2.values) {
                this.$set(param1, 'values', param2.values.split("/"))
              }
            }
          }
        }
      }

    },

    deleteShenJingChild(index) {
      this.blockItem.blockList.splice(index, 1);
    },

    addShenJingChild(blockItem) {
      if (blockItem) {
        if (blockItem.blockList.length >= 5) {
          this.$message.error("最多添加5个子积木")
          return
        }
        let childList = blockItem.childList;
        for (let index = 0; index < childList.length; index++) {
          let child = childList[index];
          if (child.id == this.shenJingSelectId) {
            let blockParam = {
              blockId: child.id,
            };
            this.initBlock(blockParam, childList)
            blockItem.blockList.push(blockParam);
          }
        }
      }
    },


    containsBlock(o) {
      for (let index = 0; index < this.blockList.length; index++) {
        let arr = this.blockList[index];
        for (let arrIndex = 0; arrIndex < arr.length; arrIndex++) {
          if (arr[arrIndex].id == o.id) {
            return true;
          }
        }
      }
      return false;
    },


  },
}
</script>

<style scoped>

.main {
  width: 100%;
  height: calc(100vh - 50px);
  display: flex;
  flex-direction: row;
}

.workConsole {
  position: relative;
  display: flex;
  flex-direction: column;
}

.optionBtn {
  position: absolute;
  right: 50px;
  bottom: 50px;
  display: flex;
  flex-direction: row;
}

.workConsoleTitle {
  width: 100%;
  height: 40px;
  background: #EFF3FF;
  display: flex;
  align-items: center;
  font-size: 13px;
}


.blockList {
  width: 100%;
  height: calc(100vh - 90px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: scroll;
}

.blockList::-webkit-scrollbar {
  display: none;
}

.blockDisplay {
  display: flex;
  flex-direction: column;
}

.blockArr {
  display: flex;
  flex-direction: row;
}

.blockItem {
  position: relative;
  width: 250px;
  height: 44px;
}
.deleteBtn {
  position: absolute;
  right: 0;
  top: 0;
  width: 30px;
  height: 30px;
  background-color: #f00;
  color: #fff;
  font-size: 12px;
  text-align: center;
  line-height: 30px;
  cursor: pointer;
}
.blockItemName {
  position: absolute;
  left: 30px;
  top: 15px;
  color: white;
  font-size: 15px;
}

.blockParams {
  display: flex;
  flex-direction: column;
}

.blockParamItem {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 30px;
  margin-top: 10px;
}

.blockChildParam {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  max-height: calc(100vh - 160px);
  overflow: scroll;
}

.blockChildParam::-webkit-scrollbar {
  display: none;
}

.blockChildParamItem {
  position: relative;
  width: 40%;
  border: 1px solid #888;
  border-radius: 15px;
  margin-left: 30px;
  margin-bottom: 30px;

}

.blockChildParamItemDelete {
  position: absolute;
  right: 5px;
  top: 5px;
}

.blockChildParamList {
  display: flex;
  flex-direction: column;
}

.blockChildParamListItem {
  display: flex;
  flex-direction: row;
  margin-left: 20px;
  align-items: center;
  margin-top: 10px;
}

.runResult {
  width: 100%;
  height: calc(100vh - 160px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.custom-loading .el-loading-spinner {
  position: relative;
}
.custom-loading .el-button {
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%);
}
.deleteBtn {
  position: absolute;
  top: 0;
  right: -25px; 
  background-color: rgba(222, 21, 21, 0.781);
  color: white;
}
</style>