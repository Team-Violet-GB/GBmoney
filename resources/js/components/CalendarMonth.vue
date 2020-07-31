<template>
    <div class="options">
        <span class="demonstration">Месяц&nbsp;&nbsp;</span>
        <el-date-picker
            v-model="value2"
            type="monthrange"
            align="right"
            unlink-panels
            range-separator="To"
            start-placeholder="Первый"
            end-placeholder="Последний"
            :picker-options="pickerOptions"
            format="MMMM yyyy"
            value-format="yyyy-MM-dd">
        </el-date-picker>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                pickerOptions: {
                    shortcuts: [{
                        text: 'За месяц',
                        onClick(picker) {
                            picker.$emit('pick', [new Date(), new Date()]);
                        }
                    },
                        {
                            text: 'За полгода',
                            onClick(picker) {
                                const end = new Date();
                                const start = new Date();
                                start.setMonth(start.getMonth() - 6);
                                picker.$emit('pick', [start, end]);
                            }
                        },
                        {
                            text: 'За год',
                            onClick(picker) {
                                const end = new Date();
                                const start = new Date(new Date().getFullYear(), 0);
                                picker.$emit('pick', [start, end]);
                            }
                        }]
                },
                value2: ''
            };
        }
    };
</script>
