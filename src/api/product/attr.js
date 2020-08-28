import request from '@/utils/request';
export default {
  // GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
  // attrInfoList
  getList(category1Id,category2Id,category3Id){
    return request.get(`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`)
  },

  // DELETE /admin/product/deleteAttr/{attrId}
  // deleteAttr
  delete(attrId){
    return request.delete(`/admin/product/deleteAttr/${attrId}`)
  },

  // POST /admin/product/saveAttrInfo
  addOrUpdate(attr){
    return request.post('/admin/product/saveAttrInfo',attr)
  }

  //根据某一个属性的id获取属性值列表，暂时用不到
  // GET /admin/product/getAttrValueList/{attrId}
  // getAttrValueList


}
