import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Loader2, ArrowLeft } from 'lucide-react'

export const Route = createFileRoute('/admin/products/new')({
  component: AddProduct,
})

function AddProduct() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    price: '',
    description: '',
    image_url: '',
    category: 'Sofa',
    width: '',
    depth: '',
    height: '',
    materials: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Auto-generate slug from name
    if (name === 'name') {
      setFormData(prev => ({ ...prev, slug: value.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase
      .from('sofas')
      .insert([formData])

    if (error) {
      alert('Error adding product: ' + error.message)
    } else {
      alert('Product added successfully!')
      navigate({ to: '/admin/products' })
    }
    setLoading(false)
  }

  return (
    <div className="space-y-6 max-w-2xl pb-20">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-display">Add New Product</h1>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Product Name</Label>
                <Input id="name" name="name" required value={formData.name} onChange={handleChange} placeholder="e.g. Luna Curve" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Price</Label>
                <Input id="price" name="price" required value={formData.price} onChange={handleChange} placeholder="e.g. $2,400" />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="slug">Slug (URL identifier)</Label>
              <Input id="slug" name="slug" required value={formData.slug} onChange={handleChange} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="image_url">Image URL</Label>
              <Input 
                id="image_url" 
                name="image_url" 
                required 
                value={formData.image_url} 
                onChange={handleChange} 
                placeholder="e.g. /sofa-chesterfield-7mql-6zd.png or https://..."
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" rows={3} value={formData.description} onChange={handleChange} />
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium mb-4">Dimensions</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="width">Width</Label>
                  <Input id="width" name="width" value={formData.width} onChange={handleChange} placeholder="e.g. 220 cm" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="depth">Depth</Label>
                  <Input id="depth" name="depth" value={formData.depth} onChange={handleChange} placeholder="e.g. 95 cm" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="height">Height</Label>
                  <Input id="height" name="height" value={formData.height} onChange={handleChange} placeholder="e.g. 78 cm" />
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="materials">Materials (Comma separated)</Label>
              <Input id="materials" name="materials" value={formData.materials} onChange={handleChange} placeholder="e.g. Solid beech frame, Italian leather" />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Save Product
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
