<template>
  <div class="block">
    <span class="demonstration">Месяц</span>
    <el-date-picker
      v-model="dateSelect"
      @change="$emit('changeDate', dateSelect)"
      type="monthrange"
      format="MMMM yyyy"
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
              picker.$emit('changeDate', [new Date(), new Date()]);
            }
          }, {
            text: 'Этот год',
            onClick(picker) {
              const end = new Date();
              const start = new Date(new Date().getFullYear(), 0);
              picker.$emit('changeDate', [start, end]);
            }
          }, {
            text: 'Последние 6 месяцев',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setMonth(start.getMonth() - 6);
              picker.$emit('changeDate', [start, end]);
            }
          }]
        },
      };
    }
  };
</script>
