<script>
//import ProductItem from "Productitem.vue"
import CourseCard from "@/components/CourseCard.vue";
import Productitem from "@/components/Productitem.vue";
export default{
  components:{
    Productitem,
  },
  //props:{courses:{type : Array, required : true}}
  data(){return {products:[/*{id:1,name:'Milk',price:12},{id:2,name:'Bread',price:10},{id:3,name:'Kefir',price:14}*/] }},

 async mounted(){
    let token = localStorage.getItem("token");
    let headers={}
   if(token){
     headers = {Authorization: 'Bearer '+token};
   }
    let res = await fetch('http://localhost:3000/getAllproducts',{headers:headers});
   if(res.status === 401){this.$router.push("/login");
   localStorage.setItem("previousPage",'/');
   }
    this.products = await res.json();

  }

}


</script>

<template>
<table>
  <Productitem
      v-for="product in products"
      :key = product.id
      :product = product

  />

</table>
</template>

<style scoped>

</style>