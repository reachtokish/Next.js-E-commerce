import { PageHeader } from "../../../_components/PageHeader";
import ProductForm from "../../_components/ProductForm";
import db from '@/db/db'

export default async function EditProductPage({ params: { id }}: {params: { id: string}}) {
  console.log(id)
  const product = await db.product.findUnique({ where: { id }})

  return (
    <>
      <PageHeader>Edit product</PageHeader>
      <ProductForm product={product} />
    </>
  )
}