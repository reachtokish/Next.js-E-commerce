import { Button } from "@/components/ui/button";
import { PageHeader } from "../_components/PageHeader";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import db from '../../../db/db';
import { CheckCircle2, MoreVertical, XCircle } from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/formatter";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ActiveToggleDropdownItem, DeleteDropdownItem } from "./_components/ProductActions";

export default function AdminProductsPage() {
  return (
    <>
      <div className="flex justify-between items-center gap-4">
        <PageHeader>Products</PageHeader>
        <Button asChild>
          <Link href="/admin/products/new">Add product</Link>
        </Button>
      </div>
      <ProductsTable />
    </>
  )
}

async function ProductsTable() {
  const products = await db.product.findMany({
    select: {
      id: true,
      name: true,
      priceInCents: true,
      isAvailableForPurchase: true,
      _count: { select: { order: true } }
    },
    orderBy: { name: "asc" }
  })

  if (products.length === 0) return <p>No products found</p>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-0">
            <span className="sr-only">Available for purchase</span>
          </TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Orders</TableHead>
          <TableHead className="w-0">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map(product => (
          <TableRow key={product.id}>
            <TableCell>
              {product.isAvailableForPurchase ? (
                <>
                  <span className="sr-only">Available</span>
                  <CheckCircle2 />
                </>
              ) : (
                <>
                  <span className="sr-only">Not available</span>
                  <XCircle />
                </>
              )}
            </TableCell>
            <TableCell>{product.name}</TableCell>
            <TableCell>{formatCurrency(product.priceInCents / 100)}</TableCell>
            <TableCell>{formatNumber(product._count.order)}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <MoreVertical />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <a download href={`/admin/products/${product.id}/download`}>Download</a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/admin/products/${product.id}/edit`}>Edit</Link>
                  </DropdownMenuItem>
                  <ActiveToggleDropdownItem id={product.id} isAvailableForPurchase={product.isAvailableForPurchase} />
                  <DropdownMenuSeparator />
                  <DeleteDropdownItem id={product.id} disabled={product._count.order > 0} />
                </DropdownMenuContent>
              </DropdownMenu>
              <span className="sr-only">Actions</span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}