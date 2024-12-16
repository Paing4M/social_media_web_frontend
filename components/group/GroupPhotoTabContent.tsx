'use client'

import React, {useState} from 'react'
import Loading from "@/components/Loading";
import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import PhotoAttachments from "@/components/profile/PhotoAttachments";
import PhotoPreviewModal from "@/components/modal/PhotoPreviewModal";
import {useGroup} from "@/hooks/useGroup";

const GroupPhotoTabContent = ({slug}:{slug:string}) => {
  const [preview, setPreview] = useState<PostAttachmentInterface | null>(null)
  const [openPreview, setOpenPreview] = useState(false)

  const {useGetGpPhotos} = useGroup();
  const {data:photoData ,isLoading, isFetchingNextPage , hasNextPage , fetchNextPage} = useGetGpPhotos(slug)

  const gpPhotos:PostAttachmentInterface[] = photoData?.pages.flatMap(page=>page.data) || [] as PostAttachmentInterface[]


  function handlePreview(idx: number) {
    setPreview(gpPhotos[idx])
    setOpenPreview(true)
  }

  function closePreview() {
    setPreview(null)
    setOpenPreview(false)
  }

  return (
    <div className='mt-5'>
      {isLoading && <Loading/>}
      {!isLoading && gpPhotos.length === 0 && (
        <p className='text-sm text-center'>No photos.</p>
      )}
      <InfiniteScrollContainer
        isOnBottom={() => {
          hasNextPage && !isFetchingNextPage && fetchNextPage()
        }}
      >
        <PhotoAttachments handlePreview={handlePreview} attachments={gpPhotos}/>
        {isFetchingNextPage && <Loading/>}
      </InfiniteScrollContainer>

      {/* preview modal */}
      {preview && (
        <PhotoPreviewModal
          photo={preview}
          open={openPreview}
          closeModal={closePreview}
          key={preview.id}
        />
      )}
    </div>
  )
}
export default GroupPhotoTabContent
