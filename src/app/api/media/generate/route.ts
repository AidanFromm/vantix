import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://obprrtqyzpaudfeyftyd.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'missing-key'
const supabase = createClient(supabaseUrl, supabaseKey)

const REPLICATE_TOKEN = process.env.REPLICATE_API_TOKEN || process.env.REPLICATE_TOKEN || ''

export async function POST(req: NextRequest) {
  try {
    const { prompt, aspect_ratio, project_id } = await req.json()

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    // Create prediction
    const createRes = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${REPLICATE_TOKEN}`,
        'Content-Type': 'application/json',
        'Prefer': 'wait',
      },
      body: JSON.stringify({
        version: '4c8f3a02044276bc04a4596ddc7e6a4b89fba30f5abe23108e36e09e0eb8103f',
        input: {
          prompt,
          aspect_ratio: aspect_ratio || '1:1',
          output_format: 'png',
          output_quality: 90,
          safety_tolerance: 2,
          prompt_upsampling: true,
        },
      }),
    })

    if (!createRes.ok) {
      const err = await createRes.text()
      console.error('Replicate create error:', err)
      return NextResponse.json({ error: 'Failed to start generation' }, { status: 500 })
    }

    let prediction = await createRes.json()

    // If not using Prefer: wait, poll for completion
    if (prediction.status !== 'succeeded') {
      const maxAttempts = 60
      for (let i = 0; i < maxAttempts; i++) {
        await new Promise(r => setTimeout(r, 2000))
        const pollRes = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
          headers: { 'Authorization': `Bearer ${REPLICATE_TOKEN}` },
        })
        prediction = await pollRes.json()
        if (prediction.status === 'succeeded' || prediction.status === 'failed' || prediction.status === 'canceled') break
      }
    }

    if (prediction.status !== 'succeeded' || !prediction.output) {
      return NextResponse.json({ error: 'Generation failed', details: prediction.error }, { status: 500 })
    }

    // Download the generated image
    const imageUrl = Array.isArray(prediction.output) ? prediction.output[0] : prediction.output
    const imageRes = await fetch(imageUrl)
    const imageBuffer = await imageRes.arrayBuffer()

    // Upload to Supabase Storage
    const filename = `ai-generated-${Date.now()}.png`
    const storagePath = `media/${filename}`

    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(storagePath, Buffer.from(imageBuffer), {
        contentType: 'image/png',
        upsert: false,
      })

    let publicUrl = imageUrl // fallback to replicate URL
    if (!uploadError) {
      const { data: urlData } = supabase.storage.from('media').getPublicUrl(storagePath)
      publicUrl = urlData.publicUrl
    }

    // Create media record in database
    const mediaRecord = {
      id: crypto.randomUUID(),
      name: filename,
      type: 'image',
      size: `${(imageBuffer.byteLength / 1024).toFixed(0)} KB`,
      url: publicUrl,
      thumbnail: publicUrl,
      project: project_id || 'Uncategorized',
      tags: ['ai-generated'],
      created_at: new Date().toISOString(),
    }

    // Try to insert into Supabase media table
    await supabase.from('media').insert({
      name: mediaRecord.name,
      type: mediaRecord.type,
      size: mediaRecord.size,
      url: mediaRecord.url,
      thumbnail: mediaRecord.thumbnail,
      project: mediaRecord.project,
      tags: mediaRecord.tags,
    }).select().single()

    return NextResponse.json(mediaRecord)
  } catch (err: unknown) {
    console.error('Generate error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
