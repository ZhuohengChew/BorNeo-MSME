"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import axios from "axios"
import { Plus, ShoppingCart, Package, TrendingUp } from "lucide-react"
import { useBusiness } from "@/lib/business-context"

interface Product {
  name: string
  category: string
  price: number
  cost: number
  stock: number
}

interface Sale {
  product: string
  quantity: number
  date: string
  revenue: number
}

export default function POS() {
  const [products, setProducts] = useState<Product[]>([])
  const [sales, setSales] = useState<Sale[]>([])
  const [loading, setLoading] = useState(false)
  const { activeBusiness, loading: bizLoading, refresh } = useBusiness()

  // Form states
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: "",
    cost: "",
    stock: ""
  })

  const [newSale, setNewSale] = useState({
    product: "",
    quantity: "",
    date: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    if (!bizLoading && activeBusiness) fetchData()
  }, [activeBusiness, bizLoading])

  const fetchData = async () => {
    try {
      const [productsRes, salesRes] = await Promise.all([
        axios.get("/api/products"),
        axios.get("/api/sales")
      ])
      setProducts(productsRes.data)
      setSales(salesRes.data)
    } catch (e) {
      console.error(e)
    }
  }

  const loadDemo = async () => {
    setLoading(true)
    try {
      const resp = await axios.post("/api/demo")
      setProducts(resp.data.products)
      setSales(resp.data.sales)
      await refresh()
    } catch (err) {
      console.error("failed to load demo", err)
    } finally {
      setLoading(false)
    }
  }

  const addProduct = async () => {
    if (!newProduct.name || !newProduct.category || !newProduct.price || !newProduct.cost || !newProduct.stock) {
      alert("Please fill all product fields")
      return
    }

    try {
      const productData = {
        name: newProduct.name,
        category: newProduct.category,
        price: parseFloat(newProduct.price),
        cost: parseFloat(newProduct.cost),
        stock: parseInt(newProduct.stock)
      }

      await axios.post("/api/products", productData)
      setProducts([...products, productData])
      setNewProduct({ name: "", category: "", price: "", cost: "", stock: "" })
    } catch (err) {
      console.error("Failed to add product", err)
    }
  }

  const recordSale = async () => {
    if (!newSale.product || !newSale.quantity || !newSale.date) {
      alert("Please fill all sale fields")
      return
    }

    const selectedProduct = products.find(p => p.name === newSale.product)
    if (!selectedProduct) {
      alert("Product not found")
      return
    }

    try {
      const quantity = parseInt(newSale.quantity)
      const revenue = selectedProduct.price * quantity

      const saleData = {
        product: newSale.product,
        quantity: quantity,
        date: newSale.date,
        revenue: revenue
      }

      await axios.post("/api/sales", saleData)
      setSales([...sales, saleData])

      // Update product stock
      const updatedProducts = products.map(p =>
        p.name === newSale.product
          ? { ...p, stock: p.stock - quantity }
          : p
      )
      setProducts(updatedProducts)

      setNewSale({ ...newSale, quantity: "" })
    } catch (err) {
      console.error("Failed to record sale", err)
    }
  }

  const updateProductStock = async (productName: string, newStock: number) => {
    try {
      // In a real app, you'd have an update endpoint
      // For now, we'll just update local state
      const updatedProducts = products.map(p =>
        p.name === productName ? { ...p, stock: newStock } : p
      )
      setProducts(updatedProducts)
    } catch (err) {
      console.error("Failed to update stock", err)
    }
  }

  const isProfileComplete = !!activeBusiness

  if (bizLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!isProfileComplete) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-yellow-800 mb-2">Business Registration Required</h2>
            <p className="text-yellow-700 mb-4">
              Please complete your business registration first to access the POS system.
            </p>
            <a
              href="/business"
              className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              Go to Business Registration
            </a>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Point of Sale System</h1>
          <p className="text-gray-600 mt-2">Manage your products, inventory, and record sales transactions.</p>
        </div>

        {/* Demo Button */}
        <div className="flex justify-center">
          <Button variant="secondary" onClick={loadDemo} disabled={loading}>
            🎬 Load Sample Products & Sales
          </Button>
        </div>

        {/* Add Product & Record Sale Forms */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Add Product */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add Product
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="product-name">Product Name</Label>
                  <Input
                    id="product-name"
                    placeholder="e.g., Biryani"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="product-category">Category</Label>
                  <Select value={newProduct.category} onValueChange={(value) => setNewProduct({...newProduct, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Main Course">Main Course</SelectItem>
                      <SelectItem value="Beverage">Beverage</SelectItem>
                      <SelectItem value="Dessert">Dessert</SelectItem>
                      <SelectItem value="Side">Side</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="product-price">Price (RM)</Label>
                  <Input
                    id="product-price"
                    type="number"
                    step="0.01"
                    placeholder="8.00"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="product-cost">Cost (RM)</Label>
                  <Input
                    id="product-cost"
                    type="number"
                    step="0.01"
                    placeholder="6.50"
                    value={newProduct.cost}
                    onChange={(e) => setNewProduct({...newProduct, cost: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="product-stock">Stock</Label>
                  <Input
                    id="product-stock"
                    type="number"
                    placeholder="12"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                  />
                </div>
              </div>
              <Button onClick={addProduct} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </CardContent>
          </Card>

          {/* Record Sale */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Record Sale
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="sale-product">Product</Label>
                <Select value={newSale.product} onValueChange={(value) => setNewSale({...newSale, product: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.name} value={product.name}>
                        {product.name} (Stock: {product.stock})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sale-quantity">Quantity</Label>
                  <Input
                    id="sale-quantity"
                    type="number"
                    placeholder="1"
                    value={newSale.quantity}
                    onChange={(e) => setNewSale({...newSale, quantity: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="sale-date">Date</Label>
                  <Input
                    id="sale-date"
                    type="date"
                    value={newSale.date}
                    onChange={(e) => setNewSale({...newSale, date: e.target.value})}
                  />
                </div>
              </div>
              <Button onClick={recordSale} className="w-full" disabled={!newSale.product || products.length === 0}>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Record Sale
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Inventory Management */}
        {products.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Inventory & Profitability
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Profit/Unit</TableHead>
                    <TableHead>Margin %</TableHead>
                    <TableHead>Stock</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product, index) => {
                    const profitPerUnit = product.price - product.cost
                    const marginPercent = product.price > 0 ? ((profitPerUnit / product.price) * 100).toFixed(1) : "0.0"
                    return (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>RM{product.price.toFixed(2)}</TableCell>
                        <TableCell>RM{product.cost.toFixed(2)}</TableCell>
                        <TableCell className={profitPerUnit >= 0 ? "text-green-600" : "text-red-600"}>
                          RM{profitPerUnit.toFixed(2)}
                        </TableCell>
                        <TableCell className={parseFloat(marginPercent) >= 20 ? "text-green-600" : "text-yellow-600"}>
                          {marginPercent}%
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={product.stock}
                            onChange={(e) => updateProductStock(product.name, parseInt(e.target.value) || 0)}
                            className="w-20"
                          />
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Recent Sales */}
        {sales.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Recent Sales History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sales.slice(-20).reverse().map((sale, index) => (
                    <TableRow key={index}>
                      <TableCell>{new Date(sale.date).toLocaleDateString()}</TableCell>
                      <TableCell>{sale.product}</TableCell>
                      <TableCell>{sale.quantity}</TableCell>
                      <TableCell>RM{sale.revenue.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}