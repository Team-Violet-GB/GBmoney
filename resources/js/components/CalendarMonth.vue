<template>
  <div class="params">
    <span class="demonstration">Месяц&nbsp;&nbsp;</span>
    <el-date-picker
      v-model="dateSelect"
      @change="$emit('changeDate', date)"
      type="monthrange"
      format="MMMM yyyy"
      value-format="yyyy-MM-dd"
      align="right"
      unlink-panels
      start-placeholder="Первый"
      end-placeholder="Последний"
      :picker-options="pickerOptions"
      :clearable="false">
    </el-date-picker>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        date: null,
        dateSelect: [new Date(this.defaultValue ? this.defaultValue : new Date()), new Date()],
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
    },
    props: ['defaultValue'],
    watch: {
      dateSelect(newDate) {
        var dateTo = new Date(newDate[1].split('-'))
        dateTo.setMonth(dateTo.getMonth() + 1)
        dateTo.setDate(dateTo.getDate() - 1)
        dateTo = dateTo.getFullYear() + '-' + (dateTo.getMonth() + 1) + '-' + dateTo.getDate()
        this.date = {from: newDate[0], to: dateTo}
      }
    }
  }
</script>
