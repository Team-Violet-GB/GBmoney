<template>
  <div class="options">
    <span class="demonstration">Месяц&nbsp;&nbsp;</span>
    <el-date-picker
      v-model="dateSelect"
      @change="$emit('changeDate', dateSelect)"
      type="monthrange"
      format="MMMM yyyy"
      value-format="yyyy-MM-dd"
      align="right"
      unlink-panels
      range-separator="To"
      start-placeholder="Первый"
      end-placeholder="Последний"
      :picker-options="pickerOptions">
    </el-date-picker>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        dateSelect: [new Date(), new Date()],
        pickerOptions: {
          shortcuts: [{
            text: 'Этот месяц',
            onClick(picker) {
              picker.$emit('pick', [new Date(), new Date()]);
            }
          }, {
            text: 'Этот год',
            onClick(picker) {
              const end = new Date();
              const start = new Date(new Date().getFullYear(), 0);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: 'Последние 6 месяцев',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setMonth(start.getMonth() - 6);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
      };
    }
  };
</script>
