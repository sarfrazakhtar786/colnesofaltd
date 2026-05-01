import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mjmwzphaefcvupivitqz.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qbXd6cGhhZWZjdnVwaXZpdHF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2MzU2NDYsImV4cCI6MjA5MzIxMTY0Nn0.dRvUZbtAEH0soY-6KqgihXpOubcCMIVJBOUDH-83P2Q'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkColumns() {
  const { data, error } = await supabase
    .from('sofas')
    .select('*')
    .limit(1)

  if (error) {
    console.error('Error fetching sofas:', error)
  } else if (data && data.length > 0) {
    console.log('Columns in sofas table:', Object.keys(data[0]))
  } else {
    console.log('No data in sofas table to check columns.')
  }
}

checkColumns()
