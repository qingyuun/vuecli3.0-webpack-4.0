<template>
  <el-pagination
    background
    @current-change="handleCurrentChange"
    @size-change="handleSizeChange"
    :current-page.sync="page.index"
    :page-sizes="[5, 10, 15, 20, 25, 50, 100]"
    :page-size="page.size"
    layout="total, sizes, prev, pager, next, jumper"
    :total="totalCount">
  </el-pagination>
</template>
<script>
export default {
  props: {
    pageIndex: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 15
    },
    total: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      totalCount: 0,
      page: {
        size: this.pageSize,
        index: this.pageIndex
      }
    }
  },
  watch: {
    pageSize: {
      handler (newValue, oldValue) {
        this.page.size = newValue
      },
      deep: true
    },
    pageIndex: {
      handler (newValue, oldValue) {
        this.page.index = newValue
      },
      deep: true
    },
    total: {
      handler (newValue, oldValue) {
        this.totalCount = newValue
      },
      deep: true
    }
  },
  methods: {
    handleCurrentChange (val) {
      this.page.index = val
      this.$emit('listenToChildEvent', this.page)
    },
    handleSizeChange (val) {
      this.page.size = val
      this.$emit('listenToChildEvent', this.page)
    }
  }
}
</script>
