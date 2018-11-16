<template>
    <el-row :gutter="10">
      <el-col :xs="8" :sm="8" :md="4" v-for="(field, index) in cardFields" :key="index" :style="{margin:'5px 0'}">
          <router-link :to="field.url" tag="div">
            <el-card :body-style="{ padding: '0px' }">
              <img v-if="field.src" :src="field.src" class="image">
              <div style="padding: 14px;">
                <p class="cardTitle">{{field.title}}</p>
                <div class="bottom clearfix">
                  <span class="cardSubTitlte">{{field.subTitle}}</span>
                </div>
              </div>
            </el-card>
          </router-link>
      </el-col>
    </el-row>
</template>

<script>
    import Util from '../../libs/util.js';

    import Vue from 'vue';
    import {
            Row,
            Col,
            Card
    } from 'element-ui'
    Vue.use(Row);
    Vue.use(Col);
    Vue.use(Card);

    export default {
        name: 'bb-card',
        props: {
            fields:{
                type:Array,
            },
            ds:{
                type:Object,
                default:function(){
                    return null
                }
            },
            srcField:{
                type:String,
                default:'src'
            },
            titleField:{
                type:String,
                default:'title'
            },
            subTitleField:{
                type:String,
                default:'subTitle'
            },
            urlField:{
                type:String,
                default:'url'
            },
        },
        data() {
            return {
                cardFields:this.fields
            }
        },
        created: function () {
            this.getData();
        },
        mounted:function(){
        },
        methods: {
            getData: function () {
                  var t = this;
                  if (this.ds) {
                      Util.getDSData(t.ds, _TY_Tool.buildTplParams(t), function (map) {
                          var newArr = [];
                          t.ds.type = t.ds.type?t.ds.type:"dynamic";
                          if(t.ds.type == "dynamic"){
                              map.forEach(function (item) {
                                  var list = item['value']['list'];
                                  for (var i in list) {
                                      var ele = list[i];
                                      let card = {
                                        url:ele[t.urlField],
                                        src:ele[t.srcField],
                                        title:ele[t.titleField],
                                        subTitle:ele[t.subTitleField]
                                      }
                                      newArr.push(card);
                                  }
                              });
                          }else{
                              newArr = map;
                          }
                          t.cardFields = newArr;
                      }, function (code, msg) {
                      });
                  }
              },
        }
    }
</script>
<style scoped>
    .cardTitle{
        text-align: center;
    }
    .cardSubTitlte {
        font-size: 13px;
        color: #999;
    }

    .bottom {
        margin-top: 13px;
        line-height: 12px;
    }

    .button {
        padding: 0;
        float: right;
    }

    .image {
        width: 100%;
        display: block;
    }

    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }

    .clearfix:after {
        clear: both
    }
</style>