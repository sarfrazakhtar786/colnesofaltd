import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Loader2, Save } from 'lucide-react'

export const Route = createFileRoute('/admin/content/')({
  component: AdminContent,
})

function AdminContent() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [content, setContent] = useState({
    hero_title: 'Sofas built the slow way, to be lived in for decades.',
    hero_subtitle: 'Each piece is hand-cut, hand-stitched and made to your dimensions in our Parisian workshop.',
    hero_image: '',
    about_text: '',
    collection_title: 'Six silhouettes, infinite combinations.',
    collection_description: 'Every model is available in over 80 fabrics and leathers, with custom dimensions on request. Pieces ship in 8–16 weeks.',
  })

  useEffect(() => {
    fetchContent()
  }, [])

  async function fetchContent() {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('key', 'site_content')
      .single()
    
    if (data) {
      setContent(data.value)
    }
    setLoading(false)
  }

  async function handleSave() {
    setSaving(true)
    const { error } = await supabase
      .from('site_settings')
      .upsert({ key: 'site_content', value: content })
    
    if (error) {
      alert('Error saving content: ' + error.message)
    } else {
      alert('Content updated successfully!')
    }
    setSaving(false)
  }

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>

  return (
    <div className="space-y-6 max-w-4xl pb-20">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-display">Manage Site Content</h1>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          Save Changes
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Home Page - Hero Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label>Main Title</Label>
              <Textarea 
                value={content.hero_title} 
                onChange={e => setContent({...content, hero_title: e.target.value})}
                rows={2}
              />
            </div>
            <div className="grid gap-2">
              <Label>Subtitle / Description</Label>
              <Textarea 
                value={content.hero_subtitle} 
                onChange={e => setContent({...content, hero_subtitle: e.target.value})}
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label>Hero Background Image URL</Label>
              <Input 
                value={content.hero_image} 
                onChange={e => setContent({...content, hero_image: e.target.value})}
                placeholder="https://..."
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Collection Page - Header</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label>Collection Title</Label>
              <Input 
                value={content.collection_title} 
                onChange={e => setContent({...content, collection_title: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label>Collection Description</Label>
              <Textarea 
                value={content.collection_description} 
                onChange={e => setContent({...content, collection_description: e.target.value})}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>About Us Page</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-2">
              <Label>About Hero Title</Label>
              <Textarea 
                value={content.about_hero_title} 
                onChange={e => setContent({...content, about_hero_title: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label>About Hero Subtitle</Label>
              <Textarea 
                value={content.about_hero_subtitle} 
                onChange={e => setContent({...content, about_hero_subtitle: e.target.value})}
                rows={4}
              />
            </div>
            <div className="grid gap-2">
              <Label>Main Image URL</Label>
              <Input 
                value={content.about_image} 
                onChange={e => setContent({...content, about_image: e.target.value})}
                placeholder="https://..."
              />
            </div>
            
            <div className="pt-4 border-t space-y-4">
              <h3 className="font-medium">Company Values</h3>
              {content.values.map((v, i) => (
                <div key={i} className="space-y-2 p-3 border rounded-md">
                  <Label>Value {i+1} Title</Label>
                  <Input 
                    value={v.t} 
                    onChange={e => {
                      const newValues = [...content.values];
                      newValues[i].t = e.target.value;
                      setContent({...content, values: newValues});
                    }}
                  />
                  <Label>Value {i+1} Description</Label>
                  <Textarea 
                    value={v.d} 
                    onChange={e => {
                      const newValues = [...content.values];
                      newValues[i].d = e.target.value;
                      setContent({...content, values: newValues});
                    }}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Home Page - About Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label>Quick Summary (Used on Home Page)</Label>
              <Textarea 
                value={content.about_text} 
                onChange={e => setContent({...content, about_text: e.target.value})}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
