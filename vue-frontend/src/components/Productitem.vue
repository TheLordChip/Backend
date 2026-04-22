<script>
export default {
  props: {product: {type:Object}}
}
</script>

<template>
<tr>
  <td>{{product.id}}</td>
  <td>{{product.name}}</td>
  <td>{{product.price}}</td>
</tr>
</template>

<style scoped>

</style>