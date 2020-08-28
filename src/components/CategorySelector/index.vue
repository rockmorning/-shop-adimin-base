<template>
  <el-form :inline="true" :model="form" class="demo-form-inline">
    <el-form-item label="一级分类">
      <!-- select：v-model收集的是 option的value -->
      <el-select
        v-model="form.category1Id"
        placeholder="请选择"
        @change="handlerCategory1"
      >
        <el-option
          :label="c1.name"
          :value="c1.id"
          v-for="(c1, index) in category1List"
          :key="c1.id"
        ></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="二级分类">
      <el-select
        v-model="form.category2Id"
        placeholder="请选择"
        @change="handlerCategory2"
      >
        <el-option
          :label="c2.name"
          :value="c2.id"
          v-for="(c2, index) in category2List"
          :key="c2.id"
        ></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="三级分类">
      <el-select
        v-model="form.category3Id"
        placeholder="请选择"
        @change="handlerCategory3"
      >
        <el-option
          :label="c3.name"
          :value="c3.id"
          v-for="(c3, index) in category3List"
          :key="c3.id"
        ></el-option>
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "CategorySelector",
  data() {
    return {
      form: {
        category1Id: "",
        category2Id: "",
        category3Id: ""
      },

      category1List: [],
      category2List: [],
      category3List: []
    };
  },

  mounted() {
    //获取一级分类列表
    this.getCategory1List();
  },
  methods: {
    async getCategory1List() {
      //发请求拿数据
      const result = await this.$API.category.getCategorys1();
      if (result.code === 200) {
        this.category1List = result.data;
      }
    },

    //选中1级分类列表当中的项  触发
    async handlerCategory1(category1Id) {

      //选中1级列表的时候情况2、3级的列表和id
      this.form.category2Id = "";
      this.form.category3Id = "";
      this.category2List = [];
      this.category3List = [];

      //通知父组件请求attr列表数据
      this.$emit("changeCategory", {categoryId:category1Id,level:1});

      const result = await this.$API.category.getCategorys2(category1Id);
      if (result.code === 200) {
        this.category2List = result.data;
      }
    },

    //选中2级分类列表当中的项  触发
    async handlerCategory2(category2Id) {

      //选中2级列表的时候情况3级的列表和id
      this.form.category3Id = "";
      this.category3List = [];

      //通知父组件请求attr列表数据
      this.$emit("changeCategory", {categoryId:category2Id,level:2});

      const result = await this.$API.category.getCategorys3(category2Id);
      if (result.code === 200) {
        this.category3List = result.data;
      }
    },

    //选中3级分类列表当中的项  触发
    async handlerCategory3(category3Id) {
      //通知父组件请求attr列表数据
      this.$emit("changeCategory", {categoryId:category3Id,level:3});
    }
  }
};
</script>

<style lang="less" scoped></style>
