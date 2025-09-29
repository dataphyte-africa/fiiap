import { createClient } from '@/lib/supabase/client'

export interface ContactFormData {
  full_name: string
  email: string
  phone?: string
  subject: string
  message: string
}

export async function submitContactForm(data: ContactFormData): Promise<void> {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('contact_submissions')
    .insert([
      {
        full_name: data.full_name,
        email: data.email,
        phone: data.phone || null,
        subject: data.subject,
        message: data.message,
      }
    ])

  if (error) {
    console.error('Error submitting contact form:', error)
    throw new Error('Failed to submit contact form')
  }
}

// Admin function to get all contact submissions
export async function getContactSubmissions() {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching contact submissions:', error)
    throw new Error('Failed to fetch contact submissions')
  }

  return data
}
