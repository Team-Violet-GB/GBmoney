<template>
  <el-select v-model="selectedID" placeholder="Select">
    <el-option
      v-for="item in points"
      :key="item.id"
      :label="item.name"
      :value="item.id">
    </el-option>
  </el-select>
</template>

<script>
  export default {
    props: ['points', 'id'],
    computed: {
      selectedID() {
        return Number(this.id)
      }
    },
  }
</script>