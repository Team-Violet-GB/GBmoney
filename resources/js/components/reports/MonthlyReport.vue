<template>
    <div>
        <el-row>
            <el-col :span="12">
            </el-col>
            <el-col :span="12">
                <feed
                    :editable="false"
                    page="1"
                    dateFrom="2020-07-06"
                    dateTo="2020-07-18"></feed>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import feed from "../feed/Feed";

    export default {
        name: "monthlyReport",
        components: {
            feed
        }
    }
</script>

<style scoped>

</style>
