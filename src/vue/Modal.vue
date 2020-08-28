<template>
  <div id="app">
    <div id="volume-panel-1" style="width: 270px; position: fixed; left: 20px; bottom: 20px; z-index: 9999; display: none;">
      <div class="card">
        <div class="alert alert-primary" role="alert" style="margin-bottom: 0;">
          <i class="fa fa-info-circle"></i>
          <h5>选择施工区域</h5>
        </div>
        <div class="card-body">
          <p class="card-text">
            <span>撤销：Ctrl + Z 或鼠标右键</span>
            <br />
            <span>清空：Ctrl + D</span>
            <br />
            <span>空格：</span><span id="area_switch">继续选择</span>
            <!-- <span>空格：</span><span id="area_switch"><%= pause ? '继续选择' : '暂停选择' %></span> -->
            <br />
            <span>回车：进入下一步</span>
          </p>
          <div class="card-text" style="text-align:right;">
            <button disabled id="volume-panel-1-btn-next" type="button" class="btn btn-success" style="position: right" onclick="$(`#volume-panel-1, #volume-panel-2`).toggle()">下一步</button>
          </div>
        </div>
      </div>
    </div>

    <!-- <div id="volume-panel-2" style="width: 260px; position: fixed; left: 20px; bottom: 20px; z-index: 9999; display: none;"> -->
    <div id="volume-panel-2" style="width: 290px; position: fixed; left: 20px; bottom: 20px; z-index: 9999;">
      <div class="card">
        <div class="alert alert-primary" role="alert" style="margin-bottom: 0;">
          <h5>输入高程</h5>
        </div>

        <div class="card-body">
            <div class="input-group flex-nowrap">
              <div class="input-group-prepend">
                <span class="input-group-text" id="addon-wrapping">高程值</span>
              </div>
              <input type="text" class="form-control" placeholder="" aria-label="" aria-describedby="addon-wrapping">
            </div>

            <div class="card-text" style="text-align:right; margin-top: 20px;">
              <button type="button" class="btn btn-info" style="">视觉反馈</button>
              <button type="button" class="btn btn-info" style="">压平</button>
            </div>

            <div class="text-danger">精确度影响计算时间和准确度</div>
            <!-- <span>精度：</span><input type="range" min="1" id="volume-panel-2-precision" oninput="$(`#volume-panel-2-precision-text`).text(event.target.value)" value=10>&nbsp;<span id="volume-panel-2-precision-text">10</span> -->

            <div class="input-group flex-nowrap">
              <div class="input-group-prepend">
                <span class="input-group-text" id="addon-wrapping">精确度</span>
                <input type="text" readonly="readonly" id="volume-panel-2-precision-text" value="10" class="form-control" placeholder="" aria-label="" aria-describedby="addon-wrapping">
              </div>
            </div>

            <div style="margin-top: 4px;" class="text-info">
              <span>&nbsp;精度调节</span>
              <input style="width: 175px" type="range" min="1" id="volume-panel-2-precision" oninput="$(`#volume-panel-2-precision-text`).attr('value', event.target.value)" value=10>
            </div>

          <div class="card-text" style="text-align:right; margin-top: 20px;">
            <button type="button" class="btn btn-dark" style="" onclick="$(`#volume-panel-1, #volume-panel-2`).toggle()">上一步</button>
            <button type="button" class="btn btn-success" style="">开始计算</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { ipcRenderer, } from 'electron';
export default {
  data() {
    return {
    };
  },
  methods: {
    modal() {
      $(`<div class="modal fade" id="staticBackdrop" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-labelledby="staticBackdropLabel" aria-hidden="true">
              <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="staticBackdropLabel">正在处理</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div class="modal-body">
                    <div class="progress">
                        <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style="width: 75%"></div>
                    </div>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>
                  </div>
                </div>
              </div>
            </div>`)
        .appendTo("body")
        .modal();
    },
    test() {
      console.log('test');
    }
  }, // methods
  mounted() {
  }
};
</script>

<style scoped>
#app {
  min-height: 100vh;
  background: #880088;
  /* color: green; */
}
</style>