import { supabase } from '@/services/supabaseClient';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';

const EditProfile = () => {
  const { session } = useSelector((state) => state.auth);
  const [file, setFile] = useState(null)
  console.log("session is", session)
  useEffect(() => {
    const check = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      console.log("trying to get session in useffect ", session)
    }
    check();
  }, [])
  const [name, setName] = useState(session.user?.user_metadata?.fullName)
  const [displayName, setDisplayName] = useState(session.user?.user_metadata.displayName)

  const handleSave = async () => {
    const { data, error } = await supabase.auth.updateUser({
      data: { fullName: name, displayName: displayName }
    })
    if (error) {
      console.error("error is comig in updating the user INFO")
    }
    alert("UPDATED")
    console.log(data)
  }
  const handleEditPic = async () => {
    if (!file) {
      alert("Please choose a file first");
      return;
    }

    const userId = session.user.id;
    const fileExt = file.name.split('.').pop();
    const filePath = `pictures/avatar/${userId}.${fileExt}`;

    // Upload to bucket
    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      console.error("Error uploading file:", uploadError);
      return;
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('media')
      .getPublicUrl(filePath);

    const publicUrl = publicUrlData.publicUrl;

    // Update user's profile picture URL in metadata
    const { error: updateError } = await supabase.auth.updateUser({
      data: { avatar_url: publicUrl }
    });

    if (updateError) {
      console.error("Error updating avatar URL:", updateError);
    } else {
      alert("Profile picture updated!");
    }
  };
  return (
    <div className='absolute flex items-center pointer-events-auto justify-center text-black'>
      <h2>Edit your Information</h2>
      <input type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className='text-black border-4 border-black pointer-events-auto relative z-[99999]' />
      <input type="text" name="name"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        className='text-black border-4 border-black pointer-events-auto relative z-[99999]' />
      <img
        src={session?.user.user_metadata?.avatar_url}
        alt="profilePicture" />
      <button onClick={handleEditPic}>
        change pic
        <input type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])} />
      </button>
      <button onClick={handleSave}>click</button>
    </div>
  )
}

export default EditProfile