<template>
  <div v-show="visible" class="bb-modal-container" :class="[customClass, popup ? 'bb-modal-bottom' : '']">
    <div class="mask" v-show="mask" @click="maskAction"></div>
    <div class="modal-document">
      <div class="modal-header" v-show="title != ''">
        {{title}}
      </div>
      <div class="modal-body" v-show="message != '' || inputs.length">
        <div class="modal-message" v-show="message != '' && !useHtml">
          {{message}}
        </div>
        <div class="modal-message-html" v-show="message != '' && useHtml" v-html="message"></div>
        <ul class="modal-inputs" v-show="inputs.length">
          <li v-for="(item, index) in inputs" :class="item.legal">
            <label>
              <input :type="item.$type" :placeholder="item.placeholder" :value="item.$val" @input="item.$val=$event.target.value" />
            </label>
          </li>
        </ul>
      </div>
      <div class="modal-footer" v-show="btns.length">
        <!--<span v-for="btn in btns" v-tap="btn.$action">{{btn.text}}</span>-->
        <span v-for="(btn, index) in btns" @click="btnAction(index, $event)">{{btn.text}}</span>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue';
  export default {
    name: 'bb-modal',

    props: {
      mask: {
        type: Boolean,
        default: true
      },
      maskClose: {
        type: Boolean,
        default: true
      },
      customClass: {
        type: String,
        default: ''
      },
      popup: {
        type: Boolean,
        default: false
      },
      close: {
        type: Function
      },
      customClass: {
        type: String,
        default: ''
      },
      title: {
        type: String,
        default: ''
      },
      message: {
        type: String,
        default: ''
      },
      inputs: {
        type: Array,
        default: () => {
          return []
        }
      },
      btns: {
        type: Array,
        default: () => {
          return []
        }
      },
      lockScroll: {
        type: Boolean,
        default: true
      }
    },

    data() {
      return {
        uid: 1,
        bodyOverflow: '',
        visible: false
      };
    },

    watch: {
      visible(newVal) {
        if (newVal) {
          this.uid++;
        }
      }
    },

    mounted() {
      if (this.lockScroll) {
        this.bodyOverflow = document.querySelector('body').style.overflow;
        document.querySelector('body').style = 'hidden';
      }
      window.addEventListener('hashchange', this.doclose);
    },

    beforeDestroy() {
      window.removeEventListener('hashchange', this.doclose);
    },

    methods: {
      maskAction() {
        if ( this.maskClose ) this.doclose(true);
      },

      btnAction(idx) {
        if ( this.btns[idx].checkInputs ) {
          for ( let i=0, len=this.inputs.length; i<len; i++ ) {
            if ( this.inputs[i].pattern && !this.inputs[i].pattern.test(this.inputs[i].$val) ) {
              this.inputs[i].legal = 'error';
            } else {
              this.inputs[i].legal = '';
            }
          }
        }

        for ( let i=0, len=this.inputs.length; i<len; i++ ) {
          if ( this.inputs[i].legal == 'error' ) {
            return;
          }
        }

        this.btns[idx].$action(this);
      },

      doclose(execute) {
        if (!this.visible) return;
        this.visible = false;
        if (execute && this.close && typeof this.close == 'function') {
          Vue.nextTick(() => {
            this.close();
          });
        }
        if (this.lockScroll) {
          Vue.nextTick(() => {
            document.querySelector('body').style.overflow = this.bodyOverflow;
          });
        }
      }
    }
  }
</script>
<style lang='less' scoped>
  .bb-modal-container {
    display: flex;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 99;
    width: 100%;
    height: 100%;
    line-height: 1.4;
    box-sizing: border-box;

    * {
      box-sizing: inherit;
      line-height: inherit;
    }

    .mask {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, .3);
    }

    .modal-document {
      position: relative;
      margin: auto;
      width: 60%;
      min-width: 190px;
      padding: 30px 30px 0;
      background-color: #fff;
      border-radius: 6px;
    }

    .modal-header {
      margin-bottom: 15px;
      text-align: center;
      font-size: 34px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      word-break: break-all;
    }

    .modal-body {
      max-height: 6rem;
      max-height: 40vh;
      margin: 15px 0 0;
      font-size: 24px;
      word-break: break-all;
      overflow: scroll;
    }

    .modal-message, .modal-message-html, .modal-inputs {
      padding-bottom: 15px;
    }

    .modal-inputs {

      li {

        &:first-of-type label {
          border-top-right-radius: 6px;
          border-top-left-radius: 6px;
        }

        &:last-of-type label {
          border-bottom: 1px solid rgba(0, 0, 0, .2);
          border-bottom-right-radius: 6px;
          border-bottom-left-radius: 6px;
        }

        &.error {
          label {
            border-color: red!important;
          }

          & + li {
            label {
              border-top-color: red!important;
            }
          }
        }
      }

      label {
        display: block;
        padding: 10px;
        border-left: 1px solid rgba(0, 0, 0, .2);
        border-right: 1px solid rgba(0, 0, 0, .2);
        border-top: 1px solid rgba(0, 0, 0, .2);
        border-width: .5px;
      }

      input {
        width: 100%;
        color: rgba(0, 0, 0, .8);
        background-color: transparent;
        border: none;
      }
    }

    .modal-footer {
      display: flex;
      flex-wrap: wrap;
      margin: 15px -30px 0;

      span {
        flex: 1 1 100%;
        padding: 0 20px;
        text-align: center;
        font-size: 30px;
        line-height: 2.7;
        color: rgb(16, 142, 233);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        word-break: break-all;
        border-top: 1px solid rgba(0, 0, 0, .2);
        border-width: .5px;

        //两个button
        &:first-of-type:nth-last-child(2), &:last-of-type:nth-last-child(1) {
          flex: 1 1 50%;
        }

        &:first-of-type:nth-last-child(2) {
          color: #000;
          border-right: 1px solid rgba(0, 0, 0, .2);
          border-right-width: .5px;
        }
      }
    }

    &.bb-modal-bottom {
      .modal-document {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100%;
        padding: 30px 30px 0;
        background-color: #fff;
        border-bottom-right-radius: 0;
        border-bottom-left-radius: 0;
      }

      .modal-inputs label {
        padding: 20px;
      }
    }
  }
</style>