<template>
  <div id="app">
    <component :is="layout">
      <router-view/>
    </component>
  </div>
</template>

<script>
import MainLayout from '../views/layouts/MainLayout'
import EmptyLayout from '../views/layouts/EmptyLayout'

export default {
  computed: {
    layout () {
      return (this.$route.meta.layout || 'main') + '-layout'
    },
  },

  components: {
    MainLayout, EmptyLayout
  }
}
</script>

<style lang="scss">
html {
  line-height: 1.5;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
  font-weight: normal;
}

body {
  margin: 0;
}

%cstm-color-background-dark {
  background-color: #2c2e38;
}

%cstm-color-background-body {
  background-color: #3d3e48;
}

%cstm-color-text {
  color: #ffffff;
}

.cstm-blue {
  color: #0a93d1;
}
.cstm-yellow {
  color: #e6a23c;
}
.cstm-green {
  color: #67c23a;
}
.cstm-red {
  color: #f56c6c;
}
.cstm-grey {
  color: #909399;
}

.cstm-container {
  height: 100vh;
}

.cstm-main {
  @extend %cstm-color-background-dark;
  padding: 15px 25px;
}

.cstm-mrgn-top-20 {
  margin-top: 20px;
}

/* все инпуты в одном стиле */
.el-input__inner,
.el-scrollbar,
.el-textarea__inner {
  @extend %cstm-color-background-dark;
  @extend %cstm-color-text;
  border-radius: 0%;
  border: 1px #5f6068 solid;
  font-weight: 100;
  font-size: 16px;
}

/* заменить синюю рамку при фокусе */
.el-input__inner:focus,
textarea:focus {
  border-color: #ffffff !important;
}

.el-scrollbar,
.el-select-dropdown {
  border: none;
}

/* убрать стрелочки у input type number */
input[type='number'] {
    -moz-appearance:textfield;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

/* календарь  */
.el-date-editor {
  margin-top: 20px;
  position: relative;
}
.el-date-picker,
.el-picker-panel,
.el-picker-panel__body,
.el-picker-panel__sidebar {
  @extend %cstm-color-background-dark;
  @extend %cstm-color-text;
  border: none;
}


.el-month-table td.in-range div, 
.el-month-table td.in-range div:hover {
  background-color: #5f6068;
}

.el-month-table td .cell,
.el-picker-panel__shortcut,
.el-date-picker__header button,
.el-picker-panel__icon-btn,
.demonstration,
.el-date-editor .el-range-input {
  @extend %cstm-color-text;
}

.el-dialog {
  @extend %cstm-color-background-body;
}

/* боковое выезжающее модальное окно */
.el-drawer:focus,
.el-range-editor.is-active,
.el-range-editor.is-active:hover {
  outline: none;
  border: none;
}

.el-drawer__header {
  background-color: #5f6068;
  @extend %cstm-color-text;
  margin: 0;
  padding: 0;
}

.el-drawer__header span {
  text-transform: uppercase;
  font-size: 20px;
  display: flex;
  justify-content: center;
  outline: none;
  line-height: 60px;
}

.el-drawer__body,
.el-range-input {
  @extend %cstm-color-background-body;
}

.el-icon-right{
  @extend %cstm-color-text;
  font-size: 20px;
}

.el-message-box {
  background-color: #3d3e48;
}

.el-message-box__content {
  color: #ffffff
}

.el-button--small {
  border-radius: 0;
}



</style>
