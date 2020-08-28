<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" @click="showAddDialog"
      >添加</el-button
    >
    <!-- 自动遍历，给下面的每一个列自动显示对应数据 -->
    <el-table :data="trademarkList" border style="width: 100%;margin:20px 0">
      <el-table-column
        label="序号"
        type="index"
        width="80"
        align="center"
      ></el-table-column>
      <el-table-column prop="tmName" label="品牌名称"></el-table-column>
      <el-table-column prop="logoUrl" label="品牌LOGO">
        <template slot-scope="{ row, $index }">
          <img :src="row.logoUrl" alt="" style="width:100px;" />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{ row, $index }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="showUpdateDialog(row)"
            >修改</el-button
          >
          <el-button type="danger" icon="el-icon-delete" size="mini"
          @click="deleteTrademark(row)"
          >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      style="text-align:center"
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      layout=" prev, pager, next, jumper,->, sizes,total"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="getTrademarkList"
      background
    >
    </el-pagination>

    <!-- 添加品牌弹窗 -->
    <el-dialog :title="`${form.id? '修改':'添加'}品牌`" :visible.sync="isShowDialog">
      <el-form :model="form" style="width:80%">
        <el-form-item label="品牌名称" :label-width="'100px'">
          <el-input v-model="form.tmName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" :label-width="'100px'">
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="form.logoUrl" :src="form.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowDialog = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Trademark",
  data() {
    return {
      page: 1,
      limit: 3,
      total: 0,
      trademarkList: [],
      isShowDialog: false,
      imageUrl: "",
      form: {
        tmName: "",
        logoUrl: ""
      }
    };
  },
  mounted() {
    // this.$API.trademark.getPageList(1, 3);
    this.getTrademarkList();
  },

  methods: {
    async getTrademarkList(page = 1) {
      this.page = page;
      const result = await this.$API.trademark.getPageList(
        this.page,
        this.limit
      );
      if (result.code === 200) {
        this.trademarkList = result.data.records;
        this.total = result.data.total;
      }
    },

    handleSizeChange(size) {
      this.limit = size;
      this.getPageList();
    },

    showAddDialog() {
      this.isShowDialog = true;
      //为了解决添加后取消再次添加数据仍然存在
      this.form = {
        tmName: "",
        logoUrl: ""
      };
    },

    //上传成功后的处理
    handleAvatarSuccess(res, file) {
      //res是上传成功后图片所在服务器的路径，真实的线上路径
      //真正的收集上传成功的图片路径
      this.form.logoUrl = res.data;
    },
    //上传之前的处理
    beforeAvatarUpload(file) {
      const fileTypes = ["image/jpeg", "image/png"];
      const isJPGOrPNG = fileTypes.indexOf(file.type) !== -1;
      const isLt500K = file.size / 1024 < 500;

      if (!isJPGOrPNG) {
        this.$message.error("上传头像图片只能是 JPG或PNG 格式!");
      }
      if (!isLt500K) {
        this.$message.error("上传头像图片大小不能超过 500KB!");
      }
      //只有都为true才符合限制需求
      return isJPGOrPNG && isLt500K;
    },

    async save() {
      //1.获取请求所需的参数
      let trademark = this.form;
      //2.发请求
      try {
        const result = await this.$API.trademark.addOrUpdate(trademark);
        //3.成功回调
        if (result.code === 200) {
          //关闭dialog
          this.isShowDialog = false;
          //重新发请求拿数据
          this.getTrademarkList(trademark.id ? this.page : 1);
          //提示
          this.$message.success(`${trademark.id ? "修改" : "添加"}品牌成功~`);
        } else {
          //4.失败回调
          this.$message.error(`${trademark.id ? "修改" : "添加"}品牌失败`);
        }
      } catch (error) {
        //发送ajax请求失败
        this.$message.error(error.message);
      }
    },

    //点击修改的回调
    showUpdateDialog(row) {
      this.isShowDialog = true;
      this.form = { ...row }; //浅拷贝一个新的对象，和row不是同一个
    },

    //点击删除的回调
    deleteTrademark(row) {
      this.$confirm(`你确定要删除${row.tmName}吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          //点击确定按钮回调
          //发请求
          try {
            const result = await this.$API.trademark.delete(row.id);
            if (result.code === 200) {
              //提示
              this.$message.success("删除品牌成功~");
              //重新获取数据
              this.getTrademarkList(
                this.trademarkList.length > 1 ? this.page : this.page - 1
              );
            } else {
              //失败
              this.$message.error("删除品牌失败");
            }
          } catch (error) {
            this.$message.error("发送请求失败");
          }
        })
        .catch(() => {
          //点击取消按钮
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
