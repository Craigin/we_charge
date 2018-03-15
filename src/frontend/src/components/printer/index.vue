<template>

  <div>1：若只打印《表单一》,看一下<div  @click="prn1_preview">预览</div>,可<div  @click="prn1_print">直接打印</div>也可
    <div  @click="prn1_printA">选择打印机</div>打印。</div>
</template>

<script>
  import {getLodop} from './LodopFuncs.js';
export default {
  name: 'printer',
  components: {
  },
  data () {
     return {
         content:'<table border="1" width="300" id="tb01" bgcolor="#CCFFCC" style="border:solid 1px black;border-collapse:collapse"><tr><td width="133" id="mtb001">'
                 +'<tr><td width="66" height="16" style="border:solid 1px black">A<sub>01</sub></td><td width="80" height="12" style="border:solid 1px black">中-001</td><td width="51" height="12" style="border:solid 1px black">C1<sup>x</sup></td></tr>'
                 +'</table>'
     }
  },
  created () {
  },
  methods: {
    CreateOneFormPage:function(){
      LODOP=getLodop();
      LODOP.PRINT_INIT("打印控件功能演示_Lodop功能_表单一");
      LODOP.SET_PRINT_STYLE("FontSize",18);
      LODOP.SET_PRINT_STYLE("Bold",1);
      LODOP.ADD_PRINT_TEXT(50,231,260,39,"打印页面部分内容");
      LODOP.ADD_PRINT_HTM(88,200,350,600,this.content);
    },
    prn1_preview:function () {
      this.CreateOneFormPage();
      LODOP.PREVIEW();
    },
    prn1_print:function() {
      this.CreateOneFormPage();
      LODOP.PRINT();
    },
    prn1_printA:function() {
      this.CreateOneFormPage();
      LODOP.PRINTA();
    },
  }
}
</script>

<style scoped>

</style>
