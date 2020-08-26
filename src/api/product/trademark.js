import request from '@/utils/request';
export default {
  // DELETE /admin/product/baseTrademark/remove/{id}
  // 删除BaseTrademark
  //api对象写法
  delete(id){
    return request.delete(`/admin/product/baseTrademark/remove/${id}`)
  },

  // POST /admin/product/baseTrademark/save
  // 新增BaseTrademark
  // PUT /admin/product/baseTrademark/update
  // 修改BaseTrademark
  //添加和修改都需要传递一个请求体参数，这个参数有id代表修改，
  //没有id代表增加
  addOrUpdate(trademark){
    if(trademark.id){
      return request.put('/admin/product/baseTrademark/update',trademark)
    }else{
      return request.post('/admin/product/baseTrademark/save',trademark)
    }
  },

  // GET /admin/product/baseTrademark/{page}/{limit}
  getPageList(page,limit){
    return request.get(`/admin/product/baseTrademark/${page}/${limit}`)
  }
}
