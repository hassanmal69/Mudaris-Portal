import { supabase } from '@/services/supabaseClient'
import React, { useEffect } from 'react'

const Market = () => {
  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('behive-fetch', {
        body: { name: 'Functions' },
      })
      if (error) {
        console.log(error)
      }
      console.log('data coming after we fetch the behive', data)

    } catch (error) {
      console.log('error coming in trycatch in behive fetch', error)
    }
  }
  useEffect(() => {
    fetchPosts()
  }, [])
  return (
    <div>Market

      <iframe src="https://enayatullahs-newsletter.beehiiv.com/p/test-post" frameborder="0"></iframe>
    </div>
  )
}

export default Market